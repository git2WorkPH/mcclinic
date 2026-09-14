import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const state = resolve(mkdtempSync('.local/packaged/browser-state-'));
try {
  writeFileSync('.local/packaged/browser-password', 'Synthetic-browser-2026', {
    flag: 'wx',
    mode: 0o600,
  });
} catch (e) {
  if (e.code !== 'EEXIST') throw e;
}
const env = {
  ...process.env,
  SOURCE_REVISION:
    process.env.SOURCE_REVISION ??
    execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  IMAGE_TAG: process.env.IMAGE_TAG ?? 'local',
  WEB_PORT: process.env.WEB_PORT ?? '8085',
  LOCAL_UID: String(process.getuid()),
  LOCAL_GID: String(process.getgid()),
  TEST_STATE: state,
  EHR_LOCAL_STATE_DIR: state,
};
if (env.LOCAL_UID === '0')
  throw new Error('Run verification as a non-root host user.');
const args = [
  'compose',
  '-p',
  'mcclinic-package-test-' + Date.now(),
  '-f',
  'infrastructure/docker/compose.packaged.yaml',
  ...(process.env.SERVING_IMAGES === 'true'
    ? ['-f', 'infrastructure/docker/compose.serving.yaml']
    : []),
  '-f',
  'infrastructure/docker/compose.packaged-test.yaml',
];
function compose(...command) {
  execFileSync('docker', [...args, ...command], { env, stdio: 'inherit' });
}
try {
  compose('up', '-d', 'postgres');
  compose('run', '--rm', 'migrate');
  compose('run', '--rm', 'migrate');
  compose('run', '--rm', 'seed');
  compose('up', '-d', '--wait', 'api', 'web');
  const clockStart = Date.now();
  const containerNow = Number(
    execFileSync(
      'docker',
      [...args, 'exec', '-T', 'api', 'node', '-e', 'console.log(Date.now())'],
      { env, encoding: 'utf8' },
    ).trim(),
  );
  const clockEnd = Date.now();
  if (
    !Number.isFinite(containerNow) ||
    containerNow < clockStart - 1000 ||
    containerNow > clockEnd + 1000
  )
    throw new Error(
      'Host/container clocks differ by more than one second. Synchronize Docker Desktop and host clocks before rerunning; MFA and clinical timestamps require accurate time.',
    );
  console.info('Host/container clock preflight passed.');
  const before = execFileSync(
    'docker',
    [
      ...args,
      'exec',
      '-T',
      'postgres',
      'psql',
      '-U',
      'mcclinic',
      '-d',
      'mcclinic',
      '-tAc',
      'SELECT count(*) FROM "User"',
    ],
    { env, encoding: 'utf8' },
  ).trim();
  const result = spawnSync(
    'pnpm',
    ['exec', 'playwright', 'test', '--config', 'playwright.packaged.config.ts'],
    {
      env: { ...env, PACKAGED_BASE_URL: `http://127.0.0.1:${env.WEB_PORT}` },
      stdio: 'inherit',
    },
  );
  if (result.status !== 0) throw new Error('Packaged browser suite failed.');
  compose('restart', 'api');
  compose('up', '-d', '--wait', 'api', 'web');
  const after = execFileSync(
    'docker',
    [
      ...args,
      'exec',
      '-T',
      'postgres',
      'psql',
      '-U',
      'mcclinic',
      '-d',
      'mcclinic',
      '-tAc',
      'SELECT count(*) FROM "User"',
    ],
    { env, encoding: 'utf8' },
  ).trim();
  if (Number(after) < Number(before)) throw new Error('Restart lost users.');
  console.info(
    'Packaged browser workflows and persistent restart passed. State retained at ' +
      state,
  );
} finally {
  compose('stop');
  console.info(
    'Stopped test services; volumes and synthetic state retained. Project: ' +
      args[2],
  );
}
