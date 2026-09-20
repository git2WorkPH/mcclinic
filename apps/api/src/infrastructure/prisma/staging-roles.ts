import type { Client } from 'pg';

const immutable = [
  'AuditEvent',
  'NoteRevision',
  'DocumentRevision',
  'AppointmentChange',
  'CommandReceipt',
  'TemplateRevision',
];
const mutable = [
  'User',
  'Session',
  'Patient',
  'Consultation',
  'ClinicalDocument',
  'Appointment',
  'Practice',
  'Membership',
  'PracticeSubscription',
  'DocumentTemplate',
  'AccountToken',
  'SecurityFactor',
  'AccountRate',
  'IdentityOutbox',
];
const roles = ['mcclinic_migrator', 'mcclinic_runtime'] as const;

// Called only by a separately credentialed, explicitly selected bootstrap job.
// Existing roles are verified, never replaced, re-passworded or silently stripped of grants.
export async function prepareStagingRoles(
  admin: Client,
  passwords: Record<(typeof roles)[number], string>,
) {
  for (const role of roles) {
    if (passwords[role].length < 24)
      throw new Error('Strong role credentials required.');
  }
  await admin.query('BEGIN');
  try {
    await admin.query('SELECT pg_advisory_xact_lock(280029)');
    if (
      (await admin.query('SELECT current_database() AS name')).rows[0].name !==
      'mcclinic'
    )
      throw new Error('Bootstrap only supports mcclinic.');
    for (const role of roles) {
      const found = await admin.query(
        'SELECT * FROM pg_roles WHERE rolname=$1',
        [role],
      );
      if (!found.rowCount) {
        const command = await admin.query(
          "SELECT format('CREATE ROLE %I LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS PASSWORD %L', $1::text, $2::text) AS sql",
          [role, passwords[role]],
        );
        await admin.query(command.rows[0].sql);
      } else {
        const row = found.rows[0];
        const membership = await admin.query(
          'SELECT 1 FROM pg_auth_members WHERE member=$1',
          [row.oid],
        );
        if (
          !row.rolcanlogin ||
          row.rolsuper ||
          row.rolcreatedb ||
          row.rolcreaterole ||
          row.rolinherit ||
          row.rolreplication ||
          row.rolbypassrls ||
          membership.rowCount
        )
          throw new Error(
            'Existing staging role has unexpected privileges; operator review required.',
          );
      }
    }
    if (
      (
        await admin.query(
          "SELECT has_schema_privilege('mcclinic_runtime','public','CREATE') AS allowed",
        )
      ).rows[0].allowed
    )
      throw new Error(
        'Runtime can create schema objects; operator review required.',
      );
    await admin.query('CREATE EXTENSION IF NOT EXISTS btree_gist');
    await admin.query(
      'GRANT CONNECT ON DATABASE mcclinic TO mcclinic_migrator, mcclinic_runtime',
    );
    await admin.query('GRANT CREATE ON DATABASE mcclinic TO mcclinic_migrator');
    await admin.query(
      'GRANT USAGE, CREATE ON SCHEMA public TO mcclinic_migrator',
    );
    await admin.query('GRANT USAGE ON SCHEMA public TO mcclinic_runtime');
    await admin.query('COMMIT');
  } catch (error) {
    await admin.query('ROLLBACK');
    throw error;
  }
}

export async function grantStagingRuntime(migrator: Client) {
  await migrator.query('BEGIN');
  try {
    const tables = (
      await migrator.query(
        "SELECT tablename, tableowner FROM pg_tables WHERE schemaname='public'",
      )
    ).rows;
    const known = new Set([...immutable, ...mutable, '_prisma_migrations']);
    for (const { tablename, tableowner } of tables) {
      if (!known.has(tablename) || tableowner !== 'mcclinic_migrator')
        throw new Error('Unreviewed table or owner; runtime grants withheld.');
      const privileges = await migrator.query(
        "SELECT has_table_privilege('mcclinic_runtime',$1,'DELETE,TRUNCATE,REFERENCES,TRIGGER') AS excessive",
        [`public."${tablename}"`],
      );
      if (privileges.rows[0].excessive)
        throw new Error('Unexpected destructive runtime grants.');
      if (
        immutable.includes(tablename) &&
        (
          await migrator.query(
            "SELECT has_table_privilege('mcclinic_runtime',$1,'UPDATE') AS excessive",
            [`public."${tablename}"`],
          )
        ).rows[0].excessive
      )
        throw new Error('Unexpected history update grant.');
    }
    for (const table of [...immutable, ...mutable]) {
      if (!tables.some((row) => row.tablename === table))
        throw new Error('Required migration missing.');
      const privileges = immutable.includes(table)
        ? 'SELECT, INSERT'
        : 'SELECT, INSERT, UPDATE';
      await migrator.query(
        `GRANT ${privileges} ON TABLE "${table}" TO mcclinic_runtime`,
      );
    }
    await migrator.query('COMMIT');
  } catch (error) {
    await migrator.query('ROLLBACK');
    throw error;
  }
}
