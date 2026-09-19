import { beforeAll, afterAll, it, expect } from 'vitest';
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Client } from 'pg';
import { readFileSync, readdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  createDatabase,
  type Database,
} from '../apps/api/src/infrastructure/prisma/database';
import { seedDemo } from '../apps/api/src/infrastructure/prisma/seed';
import { onboardingStore } from '../apps/api/src/modules/onboarding/infrastructure/store';
import {
  outboxDelivery,
  deliverOutboxOnce,
  syntheticFileSink,
} from '../apps/api/src/modules/onboarding/infrastructure/outbox';
let container: StartedPostgreSqlContainer, db: Database, state: string;
const password = 'Synthetic-outbox-2026';
beforeAll(async () => {
  state = mkdtempSync(join(tmpdir(), 'mcclinic-outbox-'));
  process.env.EHR_LOCAL_STATE_DIR = state;
  container = await new PostgreSqlContainer('postgres:17.6-alpine')
    .withDatabase('mcclinic')
    .start();
  const sql = new Client({ connectionString: container.getConnectionUri() });
  await sql.connect();
  try {
    for (const dir of readdirSync('apps/api/prisma/migrations')
      .filter((n) => /^\d/.test(n))
      .sort())
      await sql.query(
        readFileSync(`apps/api/prisma/migrations/${dir}/migration.sql`, 'utf8'),
      );
  } finally {
    await sql.end();
  }
  await seedDemo(container.getConnectionUri(), password);
  db = createDatabase(container.getConnectionUri());
});
afterAll(async () => {
  if (db) await db.$disconnect();
  if (container) await container.stop();
});
it('atomically queues encrypted tokens, survives failed delivery, and lets competing workers deliver once', async () => {
  const email = randomUUID() + '@example.test';
  const store = onboardingStore(db, outboxDelivery(['example.test']));
  await store.register({
    email,
    name: 'Synthetic',
    password,
    practiceName: '',
  });
  const row = await db.identityOutbox.findFirstOrThrow();
  expect(row.payloadCipher).not.toContain(email);
  let calls = 0;
  const failure = async () => {
    calls++;
    throw new Error('provider token must not enter audit');
  };
  expect(await deliverOutboxOnce(db, failure)).toBe(true);
  expect(
    (await db.identityOutbox.findUniqueOrThrow({ where: { id: row.id } }))
      .deliveredAt,
  ).toBeNull();
  const sink = syntheticFileSink(state, 'http://127.0.0.1:5173', [
    'example.test',
  ]);
  const outcomes = await Promise.all([
    deliverOutboxOnce(
      db,
      async (id, m) => {
        calls++;
        await sink(id, m);
      },
      new Date(Date.now() + 10000),
    ),
    deliverOutboxOnce(db, sink, new Date(Date.now() + 10000)),
  ]);
  expect(outcomes.filter(Boolean)).toHaveLength(1);
  expect(calls).toBeLessThanOrEqual(2);
  const message = JSON.parse(
    readFileSync(join(state, 'mailbox', row.id + '.json'), 'utf8'),
  );
  await sink(row.id, {
    to: message.to,
    kind: message.kind,
    token: message.token,
  });
  await store.verify(message.token);
  expect(
    (await db.user.findUniqueOrThrow({ where: { email } })).verifiedAt,
  ).not.toBeNull();
  expect(
    await db.auditEvent.count({ where: { action: 'identity.delivery.sent' } }),
  ).toBe(1);
  expect(
    JSON.stringify(
      await db.auditEvent.findMany({
        where: { action: { startsWith: 'identity.delivery.' } },
      }),
    ),
  ).not.toContain(message.token);
});
it('denies nonallowlisted recipients before committing accounts, tokens or queue intents', async () => {
  const email = randomUUID() + '@example.com',
    before = await db.identityOutbox.count();
  await expect(
    onboardingStore(db, outboxDelivery(['example.test'])).register({
      email,
      name: 'Synthetic',
      password,
      practiceName: '',
    }),
  ).rejects.toThrow('allowlisted');
  expect(await db.user.findUnique({ where: { email } })).toBeNull();
  expect(await db.accountToken.count({ where: { email } })).toBe(0);
  expect(await db.identityOutbox.count()).toBe(before);
  expect(() => outboxDelivery(['example.com'])).toThrow('.test');
});
it('rolls back enqueue when required audit fails', async () => {
  const sql = new Client({ connectionString: container.getConnectionUri() });
  await sql.connect();
  const email = randomUUID() + '@example.test';
  const before = await db.identityOutbox.count();
  try {
    await sql.query(
      `CREATE FUNCTION reject_queue_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.action = 'identity.delivery.queued' THEN RAISE EXCEPTION 'synthetic'; END IF; RETURN NEW; END $$; CREATE TRIGGER queue_audit_failure BEFORE INSERT ON "AuditEvent" FOR EACH ROW EXECUTE FUNCTION reject_queue_audit();`,
    );
    await expect(
      onboardingStore(db, outboxDelivery(['example.test'])).register({
        email,
        name: 'Synthetic',
        password,
        practiceName: '',
      }),
    ).rejects.toThrow();
    expect(await db.user.findUnique({ where: { email } })).toBeNull();
    expect(await db.identityOutbox.count()).toBe(before);
  } finally {
    await sql.query(
      'ALTER TABLE "AuditEvent" DISABLE TRIGGER queue_audit_failure',
    );
    await sql.end();
  }
});

it('keeps cookie session secrets out of GraphQL aliases, enforces Origin and ignores bearer fallback', async () => {
  const { createApp } = await import('../apps/api/src/app');
  const { installMvpGraphql } =
    await import('../apps/api/src/adapters/mvp-graphql');
  const app = createApp();
  installMvpGraphql(app, db, undefined, undefined, {
    cookieOrigin: 'https://synthetic.example.test',
  });
  const server = await new Promise<import('node:http').Server>((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const url = `http://127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}/mvp/graphql`;
  const headers = {
    'Content-Type': 'application/json',
    Origin: 'https://synthetic.example.test',
  };
  const query =
    'mutation($p:String!){ a:login(username:"clinician",password:$p){ b:token actor{id} } }';
  try {
    const denied = await fetch(url, {
      method: 'POST',
      headers: { ...headers, Origin: 'https://evil.example.test' },
      body: JSON.stringify({ query, variables: { p: password } }),
    });
    expect(denied.status).toBe(403);
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables: { p: password } }),
    });
    const cookie = result.headers.get('set-cookie')!;
    expect(cookie).toContain('HttpOnly; Secure; SameSite=Strict');
    const body = await result.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.a.b).toBe('cookie-session');
    const token = cookie.split(';')[0]!.split('=')[1]!;
    expect(JSON.stringify(body)).not.toContain(token);
    const request = async (
      extra: Record<string, string>,
      q = 'query { me { id } }',
    ) =>
      await (
        await fetch(url, {
          method: 'POST',
          headers: { ...headers, ...extra },
          body: JSON.stringify({ query: q }),
        })
      ).json();
    expect(
      (await request({ Authorization: 'Bearer ' + token })).data.me,
    ).toBeNull();
    expect((await request({ Cookie: cookie.split(';')[0]! })).data.me.id).toBe(
      body.data.a.actor.id,
    );
    expect(
      (
        await request(
          {
            Cookie: cookie.split(';')[0]!,
            'x-practice-id': randomUUID(),
          },
          'query { patients(query:"",offset:0,limit:20) { total } }',
        )
      ).errors,
    ).toBeDefined();
    const logout = await fetch(url, {
      method: 'POST',
      headers: { ...headers, Cookie: cookie.split(';')[0]! },
      body: JSON.stringify({ query: 'mutation { logout }' }),
    });
    expect((await logout.json()).data.logout).toBe(true);
    expect(logout.headers.get('set-cookie')).toContain('Max-Age=0');
    expect(
      (await request({ Cookie: cookie.split(';')[0]! })).data.me,
    ).toBeNull();
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

it('retries acknowledgement audit failure idempotently and retains exhausted messages', async () => {
  const store = onboardingStore(db, outboxDelivery(['example.test']));
  const email = randomUUID() + '@example.test';
  await store.register({
    email,
    name: 'Synthetic audit delivery',
    password,
    practiceName: '',
  });
  const row = await db.identityOutbox.findFirstOrThrow({
    where: { deliveredAt: null, exhaustedAt: null },
  });
  const sink = syntheticFileSink(state, 'http://127.0.0.1:5173', [
    'example.test',
  ]);
  const sql = new Client({ connectionString: container.getConnectionUri() });
  await sql.connect();
  try {
    await sql.query(
      `CREATE FUNCTION reject_sent_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.action = 'identity.delivery.sent' THEN RAISE EXCEPTION 'synthetic'; END IF; RETURN NEW; END $$; CREATE TRIGGER sent_audit_failure BEFORE INSERT ON "AuditEvent" FOR EACH ROW EXECUTE FUNCTION reject_sent_audit();`,
    );
    await deliverOutboxOnce(db, sink);
    expect(
      (await db.identityOutbox.findUniqueOrThrow({ where: { id: row.id } }))
        .deliveredAt,
    ).toBeNull();
  } finally {
    await sql.query(
      'ALTER TABLE "AuditEvent" DISABLE TRIGGER sent_audit_failure',
    );
    await sql.end();
  }
  const before = readFileSync(join(state, 'mailbox', row.id + '.json'), 'utf8');
  await deliverOutboxOnce(db, sink, new Date(Date.now() + 10000));
  expect(readFileSync(join(state, 'mailbox', row.id + '.json'), 'utf8')).toBe(
    before,
  );
  expect(
    (await db.identityOutbox.findUniqueOrThrow({ where: { id: row.id } }))
      .deliveredAt,
  ).not.toBeNull();
  await store.register({
    email: randomUUID() + '@example.test',
    name: 'Synthetic exhausted delivery',
    password,
    practiceName: '',
  });
  const pending = await db.identityOutbox.findFirstOrThrow({
    where: { deliveredAt: null, exhaustedAt: null },
  });
  for (let attempt = 0; attempt < 8; attempt++)
    await deliverOutboxOnce(
      db,
      async () => {
        throw new Error('synthetic failure');
      },
      new Date(Date.now() + attempt * 3600001),
    );
  const exhausted = await db.identityOutbox.findUniqueOrThrow({
    where: { id: pending.id },
  });
  expect(exhausted.exhaustedAt).not.toBeNull();
  expect(exhausted.attempts).toBe(8);
  expect(exhausted.payloadCipher).toBe(pending.payloadCipher);
  expect(
    await deliverOutboxOnce(db, sink, new Date(Date.now() + 24 * 3600000)),
  ).toBe(false);
});

it('preserves enrolled-account MFA across active key rotation and a restored key file', async () => {
  const { writeFileSync } = await import('node:fs');
  const { randomBytes } = await import('node:crypto');
  const { totp } =
    await import('../apps/api/src/modules/onboarding/infrastructure/crypto');
  const { composeMvp } = await import('../apps/api/src/mvp-composition');
  const keyFile = join(state, 'versioned-keys.json'),
    backup = join(state, 'restored-keys.json');
  const first = randomBytes(32).toString('base64'),
    second = randomBytes(32).toString('base64');
  writeFileSync(keyFile, JSON.stringify({ active: 'first', keys: { first } }), {
    mode: 0o600,
  });
  const saved = process.env.IDENTITY_KEYRING_FILE;
  process.env.IDENTITY_KEYRING_FILE = keyFile;
  try {
    const demo = await db.user.findUniqueOrThrow({
      where: { username: 'clinician' },
    });
    const username = randomUUID() + '@example.test';
    const u = await db.user.create({
      data: {
        username,
        email: username,
        verifiedAt: new Date(),
        name: 'Synthetic rotation',
        role: 'CLINICIAN',
        passwordHash: demo.passwordHash,
      },
    });
    const actor = {
      id: u.id,
      name: u.name,
      role: 'CLINICIAN' as const,
      credentialVersion: u.credentialVersion,
    };
    const store = onboardingStore(db);
    const setup = await store.startMfa(actor, password);
    const original = await db.securityFactor.findUniqueOrThrow({
      where: { userId: u.id },
    });
    expect(original.pendingCipher).toMatch(/^v1.first\./);
    const ring = JSON.stringify({ active: 'second', keys: { first, second } });
    writeFileSync(keyFile, ring, { mode: 0o600 });
    writeFileSync(backup, ring, { mode: 0o600 });
    await store.confirmMfa(
      actor,
      totp(setup.secret, Math.floor(Date.now() / 30000)),
    );
    process.env.IDENTITY_KEYRING_FILE = backup;
    const login = await composeMvp(db).identity.login(
      username,
      password,
      totp(setup.secret, Math.floor(Date.now() / 30000) + 1),
    );
    expect(login.actor.id).toBe(u.id);
    expect(
      (await db.securityFactor.findUniqueOrThrow({ where: { userId: u.id } }))
        .secretCipher,
    ).toBe(original.pendingCipher);
  } finally {
    if (saved === undefined) delete process.env.IDENTITY_KEYRING_FILE;
    else process.env.IDENTITY_KEYRING_FILE = saved;
  }
});
