import { it, expect } from 'vitest';
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  symlinkSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

it('starts the built local API from a different cwd using only its workspace .env and keeps values private', async () => {
  const root = mkdtempSync(join(tmpdir(), 'mcclinic-built-env-'));
  mkdirSync(join(root, 'apps/api'), { recursive: true });
  cpSync('apps/api/dist', join(root, 'apps/api/dist'), { recursive: true });
  symlinkSync(
    resolve('apps/api/node_modules'),
    join(root, 'apps/api/node_modules'),
    'dir',
  );
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: 'clinic-ehr', type: 'module' }),
  );
  symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const address = reservation.address();
  if (!address || typeof address === 'string')
    throw new Error('Missing test port.');
  await new Promise<void>((done) => reservation.close(() => done()));
  writeFileSync(
    join(root, '.env'),
    `HOST=127.0.0.1\nPORT=${address.port}\nPRIVATE_TEST_VALUE=synthetic-should-not-be-logged\n`,
  );
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: 'development' };
  for (const name of ['APP_ENV', 'CI', 'PORT', 'HOST'] as const)
    delete env[name];
  const child = spawn(
    process.execPath,
    [join(root, 'apps/api/dist/apps/api/src/main.js')],
    { cwd: tmpdir(), env, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let output = '';
  child.stdout.on('data', (data) => {
    output += data;
  });
  child.stderr.on('data', (data) => {
    output += data;
  });
  const exited = once(child, 'exit');
  try {
    await expect
      .poll(
        async () => {
          try {
            return (await fetch(`http://127.0.0.1:${address.port}/health/live`))
              .status;
          } catch {
            return 0;
          }
        },
        { timeout: 10000 },
      )
      .toBe(200);
    expect(output).not.toContain('synthetic-should-not-be-logged');
  } finally {
    child.kill('SIGTERM');
    await exited;
  }
}, 20000);
