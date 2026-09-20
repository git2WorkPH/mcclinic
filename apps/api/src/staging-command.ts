import { Client } from 'pg';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { stagingPrismaUrl } from './runtime/staging-prisma.js';
import { stagingConfig } from './runtime/staging-config.js';
import {
  prepareStagingRoles,
  grantStagingRuntime,
} from './infrastructure/prisma/staging-roles.js';

async function run() {
  if (process.env.STAGING_OPERATOR_JOB !== 'explicit-synthetic-job')
    throw new Error();
  const config = stagingConfig(process.env);
  const migrationSecret = JSON.parse(process.env.DB_MIGRATOR_SECRET ?? '');
  if (
    migrationSecret.username !== 'mcclinic_migrator' ||
    typeof migrationSecret.password !== 'string' ||
    migrationSecret.password.length < 24
  )
    throw new Error();
  const command = process.argv[2];
  if (command === 'bootstrap') {
    const owner = JSON.parse(process.env.DB_ADMIN_SECRET ?? '');
    if (
      owner.username !== 'mcclinic_owner' ||
      typeof owner.password !== 'string' ||
      owner.password.length < 16
    )
      throw new Error();
    const admin = new Client({
      ...config.database,
      user: owner.username,
      password: owner.password,
    });
    try {
      await admin.connect();
      await prepareStagingRoles(admin, {
        mcclinic_migrator: migrationSecret.password,
        mcclinic_runtime: config.database.password,
      });
    } finally {
      await admin.end();
    }
  } else if (command === 'migrate') {
    if (process.env.DB_ADMIN_SECRET)
      throw new Error('Owner secret must not be injected into migration jobs.');
    const migrator = new Client({
      ...config.database,
      user: migrationSecret.username,
      password: migrationSecret.password,
    });
    try {
      await migrator.connect();
      // Hold a session lock across Prisma's separate migration connection and explicit grants.
      await migrator.query('SELECT pg_advisory_lock(280029)');
      const caPath = join(
        mkdtempSync(join(tmpdir(), 'mcclinic-db-ca-')),
        'ca.pem',
      );
      writeFileSync(caPath, config.database.ssl.ca, { mode: 0o600 });
      const databaseUrl = stagingPrismaUrl(
        config.database.host,
        migrationSecret.username,
        migrationSecret.password,
        caPath,
      );
      await new Promise<void>((resolve, reject) => {
        const direct = process.env.STAGING_PRISMA_DIRECT === 'true';
        const child = spawn(
          direct ? process.execPath : 'pnpm',
          direct
            ? ['node_modules/prisma/build/index.js', 'migrate', 'deploy']
            : ['db:migrate'],
          {
            stdio: 'ignore',
            env: {
              PATH: process.env.PATH,
              NODE_ENV: 'production',
              CHECKPOINT_DISABLE: '1',
              ...(direct
                ? { PRISMA_SCHEMA_ENGINE_BINARY: '/workspace/schema-engine' }
                : {}),
              PRISMA_HIDE_UPDATE_MESSAGE: 'true',
              DATABASE_URL: databaseUrl,
            },
          },
        );
        child.once('error', reject);
        child.once('exit', (code) =>
          code === 0 ? resolve() : reject(new Error('Migration failed.')),
        );
      });
      await grantStagingRuntime(migrator);
    } finally {
      await migrator.end();
    }
  } else throw new Error('Choose bootstrap or migrate.');
  console.info('Synthetic staging database job completed.');
}
run().catch(() => {
  console.error(
    'Synthetic staging database job failed; credentials and raw database errors withheld.',
  );
  process.exitCode = 1;
});
