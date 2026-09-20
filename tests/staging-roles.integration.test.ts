import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { readFileSync, readdirSync } from 'node:fs';
import { expect, it } from 'vitest';
import {
  prepareStagingRoles,
  grantStagingRuntime,
} from '../apps/api/src/infrastructure/prisma/staging-roles';

it('migrates as a separate owner and permits atomic runtime writes without history mutation, deletion or schema DDL', async () => {
  const container = await new PostgreSqlContainer('postgres:17.6-alpine')
    .withDatabase('mcclinic')
    .start();
  const admin = new Client({ connectionString: container.getConnectionUri() });
  const credentials = {
    mcclinic_migrator: 'synthetic-migration-password',
    mcclinic_runtime: 'synthetic-runtime-password',
  };
  const connect = async (user: keyof typeof credentials) => {
    const client = new Client({
      host: container.getHost(),
      port: container.getPort(),
      database: 'mcclinic',
      user,
      password: credentials[user],
    });
    await client.connect();
    return client;
  };
  let migrator: Client | undefined, runtime: Client | undefined;
  try {
    await admin.connect();
    await prepareStagingRoles(admin, credentials);
    await prepareStagingRoles(admin, credentials);
    migrator = await connect('mcclinic_migrator');
    for (const dir of readdirSync('apps/api/prisma/migrations')
      .filter((n) => /^\d/.test(n))
      .sort())
      await migrator.query(
        readFileSync(`apps/api/prisma/migrations/${dir}/migration.sql`, 'utf8'),
      );
    await grantStagingRuntime(migrator);
    await grantStagingRuntime(migrator);
    runtime = await connect('mcclinic_runtime');
    await runtime.query('BEGIN');
    await runtime.query(
      `INSERT INTO "Practice" (id,name) VALUES ('10000000-0000-4000-8000-000000000001','Synthetic staging')`,
    );
    await runtime.query(
      `INSERT INTO "AuditEvent" (id,action, "subjectId", outcome, "correlationId", "practiceId") VALUES ('10000000-0000-4000-8000-000000000002','staging.probe','10000000-0000-4000-8000-000000000001','success','staging-test','10000000-0000-4000-8000-000000000001')`,
    );
    await runtime.query('COMMIT');
    expect(
      (await runtime.query('SELECT count(*)::int AS count FROM "AuditEvent"'))
        .rows[0].count,
    ).toBe(1);
    for (const sql of [
      'CREATE TABLE public.forbidden (id int)',
      'ALTER TABLE "Patient" ADD COLUMN forbidden text',
      'DELETE FROM "Patient"',
      'TRUNCATE "Patient"',
      'UPDATE "AuditEvent" SET action=\'tampered\'',
      'UPDATE "TemplateRevision" SET version=version',
      'SET ROLE mcclinic_migrator',
    ])
      await expect(runtime.query(sql)).rejects.toThrow();
    await runtime.query('BEGIN');
    await runtime.query(
      `UPDATE "Practice" SET name='must roll back' WHERE id='10000000-0000-4000-8000-000000000001'`,
    );
    await expect(
      runtime.query(
        `INSERT INTO "AuditEvent" (id,action,"subjectId",outcome,"correlationId") VALUES ('10000000-0000-4000-8000-000000000002','duplicate','probe','success','staging-test')`,
      ),
    ).rejects.toThrow();
    await runtime.query('ROLLBACK');
    expect(
      (
        await runtime.query(
          `SELECT name FROM "Practice" WHERE id='10000000-0000-4000-8000-000000000001'`,
        )
      ).rows[0].name,
    ).toBe('Synthetic staging');
    await migrator.query('CREATE TABLE public.unreviewed (id integer)');
    await expect(grantStagingRuntime(migrator)).rejects.toThrow('Unreviewed');
    await expect(
      runtime.query('SELECT * FROM public.unreviewed'),
    ).rejects.toThrow();
    await admin.query('ALTER ROLE mcclinic_runtime CREATEDB');
    await expect(prepareStagingRoles(admin, credentials)).rejects.toThrow(
      'unexpected privileges',
    );
  } finally {
    await runtime?.end();
    await migrator?.end();
    await admin.end();
    await container.stop();
  }
});
