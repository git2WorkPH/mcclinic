import { it, expect } from 'vitest';
import { chromium, expect as webExpect } from '@playwright/test';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { createServer as createHttpsServer } from 'node:https';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createApp } from '../apps/api/src/app';
import { packagedWeb } from '../apps/api/src/runtime/packaged-web';
import { installMvpGraphql } from '../apps/api/src/adapters/mvp-graphql';
import { createDatabase } from '../apps/api/src/infrastructure/prisma/database';
import { seedDemo } from '../apps/api/src/infrastructure/prisma/seed';
it('uses the real built web app over local TLS without exposing the cookie session secret to JavaScript', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'mcclinic-cookie-web-'));
  execFileSync(
    'openssl',
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-keyout',
      join(dir, 'key.pem'),
      '-out',
      join(dir, 'cert.pem'),
      '-days',
      '1',
      '-subj',
      '/CN=localhost',
    ],
    { stdio: 'ignore' },
  );
  const container = await new PostgreSqlContainer('postgres:17.6-alpine')
    .withDatabase('mcclinic')
    .start();
  const db = createDatabase(container.getConnectionUri());
  let api: Server | undefined, web: Server | undefined;
  const browser = await chromium.launch({ headless: true });
  try {
    const sql = new Client({ connectionString: container.getConnectionUri() });
    await sql.connect();
    try {
      for (const entry of readdirSync('apps/api/prisma/migrations')
        .filter((n) => /^\d/.test(n))
        .sort())
        await sql.query(
          readFileSync(
            `apps/api/prisma/migrations/${entry}/migration.sql`,
            'utf8',
          ),
        );
    } finally {
      await sql.end();
    }
    const password = 'Synthetic-cookie-browser-2026';
    await seedDemo(container.getConnectionUri(), password);
    const app = createApp();
    api = await new Promise<Server>((r) => {
      const s = app.listen(0, '127.0.0.1', () => r(s));
    });
    const front = packagedWeb(
      resolve('apps/clinical-app/dist'),
      `http://127.0.0.1:${(api.address() as AddressInfo).port}`,
    );
    web = await new Promise<Server>((r) => {
      const s = createHttpsServer(
        {
          key: readFileSync(join(dir, 'key.pem')),
          cert: readFileSync(join(dir, 'cert.pem')),
        },
        front,
      ).listen(0, '127.0.0.1', () => r(s));
    });
    const origin = `https://127.0.0.1:${(web.address() as AddressInfo).port}`;
    installMvpGraphql(app, db, undefined, undefined, { cookieOrigin: origin });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto(origin + '/clinic');
    await page.getByLabel('Username', { exact: true }).fill('clinician');
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await webExpect(
      page.getByRole('button', { name: 'Sign out', exact: true }),
    ).toBeVisible();
    const cookie = (await context.cookies()).find(
      (c) => c.name === '__Host-mcclinic-session',
    )!;
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.secure).toBe(true);
    expect(cookie.sameSite).toBe('Strict');
    expect(
      await page.evaluate(() => sessionStorage.getItem('ehr-mvp-session')),
    ).toBe('cookie-session');
    expect(await page.evaluate(() => document.cookie)).not.toContain(
      cookie.value,
    );
    await page.reload();
    await webExpect(
      page.getByRole('button', { name: 'Sign out', exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await webExpect(
      page.getByRole('button', { name: 'Sign in', exact: true }),
    ).toBeVisible();
    expect(
      (await context.cookies()).some(
        (c) => c.name === '__Host-mcclinic-session',
      ),
    ).toBe(false);
  } finally {
    await browser.close();
    if (web) await new Promise<void>((r) => web!.close(() => r()));
    if (api) await new Promise<void>((r) => api!.close(() => r()));
    await db.$disconnect();
    await container.stop();
  }
}, 60000);
