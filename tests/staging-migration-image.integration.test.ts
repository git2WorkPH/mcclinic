import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { it, expect } from 'vitest';
import { rootCertificates } from 'node:tls';
import { stagingPrismaUrl } from '../apps/api/src/runtime/staging-prisma.js';

it('runs real bootstrap and repeatable Prisma migrations in the isolated hardened image over verified database TLS', async () => {
  const image =
    process.env.MIGRATION_TEST_IMAGE ?? 'mcclinic-migration:focused-task028';
  const network = 'migration-test-' + randomUUID();
  const databaseName = 'postgres-' + randomUUID();
  const state = mkdtempSync(join(tmpdir(), 'migration-image-'));
  const cert = join(state, 'server.crt'),
    key = join(state, 'server.key');
  execFileSync(
    'openssl',
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-days',
      '1',
      '-subj',
      `/CN=${databaseName}`,
      '-addext',
      `subjectAltName=DNS:${databaseName},DNS:localhost,IP:127.0.0.1`,
      '-addext',
      'basicConstraints=critical,CA:TRUE',
      '-keyout',
      key,
      '-out',
      cert,
    ],
    { stdio: 'ignore' },
  );
  execFileSync('docker', ['network', 'create', network], {
    stdio: 'ignore',
  });
  const ownerPassword = 'synthetic-owner-' + randomUUID();
  const runtimePassword = 'synthetic-runtime-' + randomUUID();
  const migratorPassword = 'synthetic-migrator-:@/?#%&-' + randomUUID();
  const container = await new PostgreSqlContainer('postgres:17.6-alpine')
    .withDatabase('mcclinic')
    .withUsername('mcclinic_owner')
    .withPassword(ownerPassword)
    .withName(databaseName)
    .withNetworkMode(network)
    .withNetworkAliases(databaseName, 'wrong-certificate-name')
    .withCopyFilesToContainer([
      { source: key, target: '/certs/server.key' },
      { source: cert, target: '/certs/server.crt' },
    ])
    .withEntrypoint(['/bin/sh', '-c'])
    .withCommand([
      'chown postgres:postgres /certs/server.key /certs/server.crt && chmod 600 /certs/server.key && exec docker-entrypoint.sh postgres -c ssl=on -c ssl_cert_file=/certs/server.crt -c ssl_key_file=/certs/server.key',
    ])
    .start();
  const ca = readFileSync(cert, 'utf8');
  const env = {
    APP_ENV: 'synthetic-staging',
    MVP_SYNTHETIC_ONLY: 'true',
    STAGING_OPERATOR_JOB: 'explicit-synthetic-job',
    WEB_ORIGIN: 'https://clinic.example.test',
    DB_HOST: databaseName,
    DB_CA_PEM: ca,
    EHR_LOCAL_STATE_DIR: '/tmp/state',
    IDENTITY_SYNTHETIC_DOMAINS: 'example.test',
    STAGING_ORIGIN_SECRET: 'job-only-' + 'a'.repeat(43),
    DB_RUNTIME_SECRET: JSON.stringify({
      username: 'mcclinic_runtime',
      password: runtimePassword,
    }),
    DB_MIGRATOR_SECRET: JSON.stringify({
      username: 'mcclinic_migrator',
      password: migratorPassword,
    }),
  };
  const run = (command: 'bootstrap' | 'migrate') => {
    const settings: Record<string, string> = {
      ...env,
      ...(command === 'bootstrap'
        ? {
            DB_ADMIN_SECRET: JSON.stringify({
              username: 'mcclinic_owner',
              password: ownerPassword,
            }),
          }
        : {}),
    };
    return execFileSync(
      'docker',
      [
        'run',
        '--rm',
        '--network',
        network,
        '--read-only',
        '--tmpfs',
        '/tmp:rw,noexec,nosuid,size=67108864',
        ...Object.keys(settings).flatMap((name) => ['--env', name]),
        image,
        '/usr/local/bin/node',
        'apps/api/dist/apps/api/src/staging-command.js',
        command,
      ],
      {
        env: { ...process.env, ...settings },
        encoding: 'utf8',
        timeout: 60000,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
  };
  const nativeStatus = (host = databaseName, certificate = ca) => {
    const settings = {
      DATABASE_URL: stagingPrismaUrl(
        host,
        'mcclinic_migrator',
        migratorPassword,
        '/tmp/ca.pem',
      ),
      DB_CA_PEM: certificate,
    };
    return spawnSync(
      'docker',
      [
        'run',
        '--rm',
        '--network',
        network,
        '--read-only',
        '--tmpfs',
        '/tmp:rw,noexec,nosuid,size=67108864',
        ...Object.keys(settings).flatMap((name) => ['--env', name]),
        image,
        '/usr/local/bin/node',
        '-e',
        `require('node:fs').writeFileSync('/tmp/ca.pem',process.env.DB_CA_PEM,{mode:0o600});
      const r=require('node:child_process').spawnSync(process.execPath,['node_modules/prisma/build/index.js','migrate','status'],{encoding:'utf8',env:{PATH:process.env.PATH,NODE_ENV:'production',CHECKPOINT_DISABLE:'1',PRISMA_HIDE_UPDATE_MESSAGE:'true',PRISMA_SCHEMA_ENGINE_BINARY:'/workspace/schema-engine',DATABASE_URL:process.env.DATABASE_URL}});
      process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');process.exit(r.status??1);`,
      ],
      {
        env: { ...process.env, ...settings },
        encoding: 'utf8',
        timeout: 60000,
      },
    );
  };
  const admin = new Client({
    host: container.getHost(),
    port: container.getPort(),
    database: 'mcclinic',
    user: 'mcclinic_owner',
    password: ownerPassword,
    ssl: { ca, rejectUnauthorized: true },
  });
  let runtime: Client | undefined;
  try {
    expect(run('bootstrap')).toContain('job completed');
    const diagnostic = nativeStatus();
    expect(diagnostic.stderr).not.toMatch(/error/i);
    expect(run('migrate')).toContain('job completed');
    await admin.connect();
    const migrations = await admin.query(
      'SELECT migration_name,checksum,finished_at FROM "_prisma_migrations" ORDER BY migration_name',
    );
    const directories = readdirSync('apps/api/prisma/migrations')
      .filter((n) => /^\d/.test(n))
      .sort();
    expect(migrations.rows.map((row) => row.migration_name)).toEqual(
      directories,
    );
    for (const row of migrations.rows) {
      expect(row.finished_at).not.toBeNull();
      expect(row.checksum).toBe(
        createHash('sha256')
          .update(
            readFileSync(
              `apps/api/prisma/migrations/${row.migration_name}/migration.sql`,
            ),
          )
          .digest('hex'),
      );
    }
    expect(run('migrate')).toContain('job completed');
    expect(
      (
        await admin.query(
          'SELECT migration_name,checksum,finished_at FROM "_prisma_migrations" ORDER BY migration_name',
        )
      ).rows,
    ).toEqual(migrations.rows);
    expect(nativeStatus().status).toBe(0);
    for (const result of [
      nativeStatus(databaseName, rootCertificates[0]),
      nativeStatus('wrong-certificate-name'),
    ]) {
      expect(result.status).not.toBe(0);
      expect(result.stderr).toMatch(/TLS|certificate/i);
    }
    runtime = new Client({
      host: container.getHost(),
      port: container.getPort(),
      database: 'mcclinic',
      user: 'mcclinic_runtime',
      password: runtimePassword,
      ssl: { ca, rejectUnauthorized: true },
    });
    await runtime.connect();
    await runtime.query('BEGIN');
    expect(
      (
        await runtime.query(
          `UPDATE "Practice" SET name='Synthetic hardened migration probe' WHERE id='00000000-0000-4000-8000-000000000001'`,
        )
      ).rowCount,
    ).toBe(1);
    await runtime.query(
      `INSERT INTO "AuditEvent" (id,action,"subjectId",outcome,"correlationId") VALUES ($1,'migration.probe','synthetic','success','local-test')`,
      [randomUUID()],
    );
    await runtime.query('COMMIT');
    await expect(runtime.query('DELETE FROM "Patient"')).rejects.toThrow();
    await expect(
      runtime.query('UPDATE "AuditEvent" SET outcome=\'tampered\''),
    ).rejects.toThrow();
    await expect(
      runtime.query('CREATE TABLE public.forbidden(id integer)'),
    ).rejects.toThrow();
    const inspection = JSON.parse(
      execFileSync('docker', ['image', 'inspect', image], { encoding: 'utf8' }),
    )[0];
    expect(inspection.Config.User).toBe('1000:1000');
    const absent = execFileSync(
      'docker',
      [
        'run',
        '--rm',
        '--network',
        'none',
        image,
        '/usr/local/bin/node',
        '-e',
        "const f=require('node:fs');for(const p of ['/bin/sh','/usr/local/bin/npm','/usr/local/bin/pnpm','/usr/bin/perl'])if(f.existsSync(p))process.exit(1);console.log('isolated')",
      ],
      { encoding: 'utf8' },
    );
    expect(absent.trim()).toBe('isolated');
  } finally {
    await runtime?.end();
    await admin.end();
    await container.stop();
  }
}, 120000);
