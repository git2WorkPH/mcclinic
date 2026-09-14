import { it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { packagedConfig } from '../apps/api/src/runtime/packaged-config';
import { packagedWeb } from '../apps/api/src/runtime/packaged-web';
import { drainServer } from '../apps/api/src/runtime/drain';

const dir = mkdtempSync(join(tmpdir(), 'mcclinic-package-'));
const secret = join(dir, 'secret');
writeFileSync(secret, 'Synthetic-only-secret-1234');
const valid = {
  APP_ENV: 'local-container',
  MVP_SYNTHETIC_ONLY: 'true',
  EHR_LOCAL_STATE_DIR: dir,
  POSTGRES_PASSWORD_FILE: secret,
};
it('requires explicit synthetic local configuration and an available secret', () => {
  expect(packagedConfig(valid).databaseUrl).toContain(
    '@postgres:5432/mcclinic',
  );
  for (const APP_ENV of [
    undefined,
    'production',
    'staging',
    'synthetic-staging',
  ])
    expect(() => packagedConfig({ ...valid, APP_ENV })).toThrow();
  expect(() =>
    packagedConfig({ ...valid, MVP_SYNTHETIC_ONLY: 'false' }),
  ).toThrow();
  expect(() =>
    packagedConfig({ ...valid, POSTGRES_PASSWORD_FILE: '/missing' }),
  ).toThrow('unavailable');
  expect(() =>
    packagedConfig({ ...valid, EHR_LOCAL_STATE_DIR: 'relative' }),
  ).toThrow();
  expect(() => packagedConfig({ ...valid, PORT: '0' })).toThrow();
});
async function listen(server: Server) {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}
async function close(server: Server) {
  await drainServer(server, async () => {});
}
it('serves SPA without caching and immutable hashed assets, proxying credentials without shared API caching', async () => {
  mkdirSync(join(dir, 'assets'));
  writeFileSync(join(dir, 'index.html'), '<html>synthetic shell</html>');
  writeFileSync(
    join(dir, 'assets', 'index-Abc12345.js'),
    'console.log("synthetic")',
  );
  const upstream = createServer((req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=9999');
    res.setHeader('Content-Type', 'application/json');
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () =>
      res.end(
        JSON.stringify({
          url: req.url,
          authorization: req.headers.authorization,
          practice: req.headers['x-practice-id'],
          forwarded: req.headers['x-forwarded-for'],
          body: Buffer.concat(chunks).toString(),
        }),
      ),
    );
  });
  const origin = await listen(upstream),
    web = createServer(packagedWeb(dir, origin)),
    url = await listen(web);
  try {
    const shell = await fetch(url + '/clinic');
    expect(shell.headers.get('cache-control')).toBe('no-store');
    expect(shell.headers.get('referrer-policy')).toBe('no-referrer');
    expect(shell.headers.get('content-security-policy')).toContain(
      "frame-ancestors 'self'",
    );
    const asset = await fetch(url + '/assets/index-Abc12345.js');
    expect(asset.headers.get('cache-control')).toContain('immutable');
    const response = await fetch(url + '/mvp/graphql?operationName=Demo', {
      method: 'POST',
      headers: {
        authorization: 'Bearer synthetic',
        'x-practice-id': 'practice-demo',
        'x-forwarded-for': 'attacker',
      },
      body: '{"query":"demo"}',
    });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({
      url: '/mvp/graphql?operationName=Demo',
      authorization: 'Bearer synthetic',
      practice: 'practice-demo',
      body: '{"query":"demo"}',
    });
    const missing = await fetch(url + '/documents/secret');
    expect(missing.status).toBe(404);
    expect(missing.headers.get('cache-control')).toBe('no-store');
  } finally {
    await close(web);
    await close(upstream);
  }
});
it('waits for an in-flight response before disconnecting dependencies', async () => {
  let entered!: () => void, finish!: () => void;
  const started = new Promise<void>((r) => (entered = r));
  let disconnected = false;
  const server = createServer((_req, res) => {
    finish = () => res.end('saved');
    entered();
  });
  const url = await listen(server),
    response = fetch(url);
  await started;
  const drained = drainServer(server, async () => {
    disconnected = true;
  });
  expect(disconnected).toBe(false);
  finish();
  expect(await (await response).text()).toBe('saved');
  await drained;
  expect(disconnected).toBe(true);
});
