import { it, expect } from 'vitest';
import { chromium, expect as webExpect } from '@playwright/test';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApp } from '../apps/api/src/app';
import { packagedWeb } from '../apps/api/src/runtime/packaged-web';
import { installMvpGraphql } from '../apps/api/src/adapters/mvp-graphql';
import { createDatabase } from '../apps/api/src/infrastructure/prisma/database';
import { seedDemo } from '../apps/api/src/infrastructure/prisma/seed';
it('retains patient input and retries one committed write after a delayed response is lost', async () => {
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
    const password = 'Synthetic-network-browser-2026';
    await seedDemo(container.getConnectionUri(), password);
    const app = createApp();
    installMvpGraphql(app, db);
    api = await new Promise<Server>((r) => {
      const s = app.listen(0, '127.0.0.1', () => r(s));
    });
    const front = packagedWeb(
      resolve('apps/clinical-app/dist'),
      `http://127.0.0.1:${(api.address() as AddressInfo).port}`,
    );
    web = await new Promise<Server>((r) => {
      const s = front.listen(0, '127.0.0.1', () => r(s));
    });
    const origin = `http://127.0.0.1:${(web.address() as AddressInfo).port}`;
    const page = await browser.newPage();
    let dropped = false;
    const keys: string[] = [];
    await page.route('**/mvp/graphql', async (route) => {
      const body = route.request().postDataJSON() as {
        query: string;
        variables: { key?: string };
      };
      await new Promise((r) => setTimeout(r, 250));
      if (body.query.includes('registerPatient(')) {
        keys.push(body.variables.key!);
        if (!dropped) {
          const response = await route.fetch();
          const payload = await response.json();
          expect(payload.errors).toBeUndefined();
          dropped = true;
          await route.abort('failed');
          return;
        }
      }
      await route.continue();
    });
    await page.goto(origin + '/clinic');
    await page.getByLabel('Username', { exact: true }).fill('reception');
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await webExpect(
      page.getByRole('button', { name: 'Sign out', exact: true }),
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Register patient', exact: true })
      .click();
    await page.getByLabel('Given name', { exact: true }).fill('Network');
    await page.getByLabel('Family name', { exact: true }).fill('Synthetic');
    await page
      .getByLabel('Birth date (YYYY-MM-DD)', { exact: true })
      .fill('1991-02-03');
    await page.getByLabel('Phone', { exact: true }).fill('0400111222');
    await page
      .getByRole('button', { name: 'Save patient', exact: true })
      .click();
    await webExpect(
      page.getByText(/Failed to fetch|Connection unavailable|NetworkError/),
    ).toBeVisible();
    await webExpect(page.getByLabel('Given name', { exact: true })).toHaveValue(
      'Network',
    );
    await webExpect(page.getByLabel('Phone', { exact: true })).toHaveValue(
      '0400111222',
    );
    await page
      .getByRole('button', { name: 'Save patient', exact: true })
      .click();
    await webExpect(
      page.getByRole('heading', { name: 'Network Synthetic', exact: true }),
    ).toBeVisible();
    expect(dropped).toBe(true);
    expect(keys).toHaveLength(2);
    expect(keys[0]).toBeTruthy();
    expect(keys[1]).toBe(keys[0]);
    const patients = await db.patient.findMany({
      where: { givenName: 'Network', familyName: 'Synthetic' },
    });
    expect(patients).toHaveLength(1);
    expect(
      await db.auditEvent.count({
        where: { action: 'patient.create', subjectId: patients[0]!.id },
      }),
    ).toBe(1);
  } finally {
    await browser.close();
    if (web) await new Promise<void>((r) => web!.close(() => r()));
    if (api) await new Promise<void>((r) => api!.close(() => r()));
    await db.$disconnect();
    await container.stop();
  }
}, 60000);
