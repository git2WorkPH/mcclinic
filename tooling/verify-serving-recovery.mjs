import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createDecipheriv } from 'node:crypto';

const source = process.env.RECOVERY_SOURCE_PROJECT;
const sourceState = resolve(process.env.RECOVERY_SOURCE_STATE ?? '');
if (
  !/^mcclinic-package-test-\d+$/.test(source ?? '') ||
  !sourceState.startsWith(resolve('.local/packaged/browser-state-'))
)
  throw new Error(
    'Select a retained synthetic packaged-test project/state explicitly.',
  );
const backup = resolve(mkdtempSync('.local/packaged/recovery-'));
const restoredState = resolve(backup, 'state');
cpSync(sourceState, restoredState, { recursive: true });
const project = 'mcclinic-recovery-test-' + Date.now();
const env = {
  ...process.env,
  SOURCE_REVISION: process.env.SOURCE_REVISION ?? 'recovery-test',
  IMAGE_TAG: process.env.IMAGE_TAG ?? 'task035',
  WEB_PORT: '8086',
  LOCAL_UID: String(process.getuid()),
  LOCAL_GID: String(process.getgid()),
  TEST_STATE: restoredState,
};
const args = [
  'compose',
  '-p',
  project,
  '-f',
  'infrastructure/docker/compose.packaged.yaml',
];
const testOverride = ['-f', 'infrastructure/docker/compose.packaged-test.yaml'];
function compose(command, split = true) {
  execFileSync(
    'docker',
    [
      ...args,
      ...(split ? ['-f', 'infrastructure/docker/compose.serving.yaml'] : []),
      ...testOverride,
      ...command,
    ],
    {
      env: split
        ? env
        : { ...env, IMAGE_TAG: process.env.ROLLBACK_IMAGE_TAG ?? 'task033' },
      stdio: 'inherit',
    },
  );
}
function sql(container, query) {
  return execFileSync(
    'docker',
    [
      'exec',
      container,
      'psql',
      '-U',
      'mcclinic',
      '-d',
      'mcclinic',
      '-Atc',
      query,
    ],
    { encoding: 'utf8' },
  ).trim();
}
function fingerprint(container) {
  const tables = sql(
    container,
    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename",
  ).split('\n');
  return Object.fromEntries(
    tables.map((table) => [
      table,
      sql(
        container,
        `SELECT count(*),md5(coalesce(string_agg(t::text,'' ORDER BY t::text),'')) FROM (SELECT row_to_json(x) FROM "${table.replaceAll('"', '""')}" x) t`,
      ),
    ]),
  );
}
const sourceDb = source + '-postgres-1',
  restoredDb = project + '-postgres-1';
try {
  execFileSync('docker', ['start', sourceDb], { stdio: 'inherit' });
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (
      spawnSync('docker', ['exec', sourceDb, 'pg_isready', '-U', 'mcclinic'], {
        stdio: 'ignore',
      }).status === 0
    ) {
      ready = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Source database did not become ready.');
  const before = fingerprint(sourceDb);
  const dump = execFileSync(
    'docker',
    ['exec', sourceDb, 'pg_dump', '-U', 'mcclinic', '-d', 'mcclinic', '-Fc'],
    { maxBuffer: 64 * 1024 * 1024 },
  );
  writeFileSync(resolve(backup, 'database.dump'), dump, { mode: 0o600 });
  compose(['up', '-d', '--wait', 'postgres']);
  execFileSync(
    'docker',
    [
      'exec',
      '-i',
      restoredDb,
      'pg_restore',
      '-U',
      'mcclinic',
      '-d',
      'mcclinic',
      '--exit-on-error',
    ],
    { input: dump },
  );
  if (JSON.stringify(fingerprint(restoredDb)) !== JSON.stringify(before))
    throw new Error(
      'Restored database differs from complete source table fingerprints.',
    );
  const ciphers = sql(
    restoredDb,
    'SELECT "secretCipher" FROM "SecurityFactor" WHERE enabled=true AND "secretCipher" IS NOT NULL',
  )
    .split('\n')
    .filter(Boolean);
  if (!ciphers.length)
    throw new Error('Source must include an enrolled synthetic MFA account.');
  for (const cipher of ciphers) {
    const [iv, tag, data] = cipher.split('.');
    const decoder = createDecipheriv(
      'aes-256-gcm',
      readFileSync(resolve(restoredState, 'onboarding-key')),
      Buffer.from(iv, 'base64'),
    );
    decoder.setAuthTag(Buffer.from(tag, 'base64'));
    const secret = Buffer.concat([
      decoder.update(Buffer.from(data, 'base64')),
      decoder.final(),
    ]).toString('utf8');
    if (!/^[A-Z2-7]+$/.test(secret))
      throw new Error('Restored MFA key failed validation.');
  }
  compose(['up', '-d', '--wait', 'api', 'web']);
  compose(['up', '-d', '--wait', 'api', 'web'], false);
  compose(['up', '-d', '--wait', 'api', 'web']);
  if (JSON.stringify(fingerprint(restoredDb)) !== JSON.stringify(before))
    throw new Error('Image rollback/roll-forward changed stored records.');
  writeFileSync(
    resolve(backup, 'evidence.json'),
    JSON.stringify(
      {
        project,
        source,
        tables: before,
        mfaAccounts: ciphers.length,
        restore: true,
        rollback: true,
        rollForward: true,
      },
      null,
      2,
    ),
  );
  console.info(
    'Full database, MFA key restore and old/new image rollback passed. Evidence: ' +
      resolve(backup, 'evidence.json'),
  );
} finally {
  compose(['stop']);
  execFileSync('docker', ['stop', sourceDb], { stdio: 'inherit' });
  console.info(
    'Synthetic containers stopped; backups, state and volumes retained.',
  );
}
