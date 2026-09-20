import { it, expect } from 'vitest';
import { rootCertificates } from 'node:tls';
import { mkdtempSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import { stagingConfig } from '../apps/api/src/runtime/staging-config';
import { stagingSyntheticSink } from '../apps/api/src/runtime/staging-sink';
import { stagingApp } from '../apps/api/src/runtime/staging-app';
import { createDatabase } from '../apps/api/src/infrastructure/prisma/database';

const env = {
  APP_ENV: 'synthetic-staging',
  MVP_SYNTHETIC_ONLY: 'true',
  WEB_ORIGIN: 'https://clinic.example.test',
  DB_HOST: 'database.example.test',
  DB_CA_PEM: rootCertificates[0],
  DB_RUNTIME_SECRET: JSON.stringify({
    username: 'mcclinic_runtime',
    password: 'synthetic-development-password',
  }),
  STAGING_ORIGIN_SECRET: 'a'.repeat(43),
  EHR_LOCAL_STATE_DIR: '/synthetic/state',
  IDENTITY_SYNTHETIC_DOMAINS: 'example.test',
};
it('fails closed on local/production/unsafe TLS, credentials, origins and recipient settings', () => {
  expect(stagingConfig(env).database.ssl.rejectUnauthorized).toBe(true);
  for (const override of [
    { APP_ENV: 'production' },
    { MVP_SYNTHETIC_ONLY: 'false' },
    { DATABASE_URL: 'postgres://override' },
    { DB_CA_PEM: '' },
    {
      DB_RUNTIME_SECRET: JSON.stringify({
        username: 'mcclinic_owner',
        password: 'a'.repeat(30),
      }),
    },
    { WEB_ORIGIN: 'http://localhost' },
    { WEB_ORIGIN: 'https://clinic.example.test/path' },
    { STAGING_ORIGIN_SECRET: 'short' },
    { IDENTITY_SYNTHETIC_DOMAINS: 'example.com' },
    { EHR_LOCAL_STATE_DIR: 'relative' },
    { IDENTITY_KEYRING_FILE: '/local/key' },
  ])
    expect(() => stagingConfig({ ...env, ...override })).toThrow();
});
it('writes private synthetic links durably and rejects replay conflicts and real recipients', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'staging-sink-'));
  const sink = stagingSyntheticSink(dir, env.WEB_ORIGIN, ['example.test']);
  const id = randomUUID(),
    message = {
      to: 'synthetic@example.test',
      kind: 'VERIFY' as const,
      token: 'a'.repeat(43),
    };
  await sink(id, message);
  await sink(id, message);
  const file = join(dir, 'mailbox', `${id}.json`);
  expect(statSync(file).mode & 0o777).toBe(0o600);
  expect(JSON.parse(readFileSync(file, 'utf8')).link).toBe(
    `${env.WEB_ORIGIN}/clinic#verify=${message.token}`,
  );
  await expect(sink(id, { ...message, token: 'b'.repeat(43) })).rejects.toThrow(
    'conflict',
  );
  await expect(
    sink(randomUUID(), { ...message, to: 'real@example.com' }),
  ).rejects.toThrow();
});
it('guards every API entry point, keeps denials uncached, checks cookie origin and fails readiness without DB', async () => {
  const db = createDatabase(
    'postgresql://synthetic:synthetic@127.0.0.1:1/mcclinic?connect_timeout=1',
  );
  let draining = false;
  const server = stagingApp(db, stagingConfig(env), () => draining).listen(
    0,
    '127.0.0.1',
  );
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    for (const path of [
      '/graphql',
      '/mvp/graphql',
      '/mailbox',
      '/health/live/extra',
    ]) {
      const response = await fetch(url + path);
      expect(response.status).toBe(403);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
    expect((await fetch(url + '/health/live')).status).toBe(200);
    expect((await fetch(url + '/health/ready')).status).toBe(503);
    expect(
      (
        await fetch(url + '/mvp/graphql', {
          method: 'POST',
          headers: {
            'x-mcclinic-origin': env.STAGING_ORIGIN_SECRET,
            origin: 'https://attacker.test',
            'content-type': 'application/json',
          },
          body: '{}',
        })
      ).status,
    ).toBe(403);
    draining = true;
    expect((await fetch(url + '/health/live')).status).toBe(503);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await db.$disconnect();
  }
});
