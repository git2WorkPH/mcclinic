import { beforeAll, afterAll, it, expect } from 'vitest';
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Client } from 'pg';
import { readFileSync, readdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { randomUUID } from 'node:crypto';
import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import * as G from '../packages/graphql-contract/src/operations.generated';
import {
  createDatabase,
  type Database,
} from '../apps/api/src/infrastructure/prisma/database';
import { seedDemo } from '../apps/api/src/infrastructure/prisma/seed';
import { createApp } from '../apps/api/src/app';
import { installMvpGraphql } from '../apps/api/src/adapters/mvp-graphql';
import { onboardingStore } from '../apps/api/src/modules/onboarding/infrastructure/store';
import {
  digest,
  totp,
} from '../apps/api/src/modules/onboarding/infrastructure/crypto';
import type { LocalMessage } from '../apps/api/src/modules/onboarding/infrastructure/mailbox';
import { localIdentity } from '../apps/api/src/modules/identity/infrastructure/local-identity';
import { composeMvp } from '../apps/api/src/mvp-composition';
import type { Actor } from '../apps/api/src/application/context';
import { renameDatabase } from '../tooling/rename-database';
let container: StartedPostgreSqlContainer,
  db: Database,
  server: Server,
  url: string;
const mail: LocalMessage[] = [];
const password = 'Synthetic-onboarding-2026';
const delivery = async (m: LocalMessage) => {
  mail.push(m);
};
function latest(email: string, kind: string) {
  return mail.filter((m) => m.to === email && m.kind === kind).at(-1)!.token;
}
async function request<T, V>(
  document: TypedDocumentNode<T, V>,
  variables: V,
  token = '',
  practiceId?: string,
) {
  return (await (
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { authorization: 'Bearer ' + token } : {}),
        ...(practiceId ? { 'x-practice-id': practiceId } : {}),
      },
      body: JSON.stringify({ query: print(document), variables }),
    })
  ).json()) as {
    data?: T;
    errors?: { message: string; extensions: { code: string } }[];
  };
}
async function ok<T, V>(
  document: TypedDocumentNode<T, V>,
  variables: V,
  token = '',
  practiceId?: string,
) {
  const result = await request(document, variables, token, practiceId);
  expect(result.errors).toBeUndefined();
  return result.data!;
}
async function registered(practiceName = 'Synthetic practice') {
  const email = randomUUID() + '@example.test';
  await ok(G.RegisterAccountDocument, {
    input: { email, name: 'Synthetic Doctor', password, practiceName },
  });
  await ok(G.VerifyAccountDocument, { token: latest(email, 'VERIFY') });
  const u = await db.user.findUniqueOrThrow({ where: { email } });
  const member = await db.membership.findFirst({ where: { userId: u.id } });
  const actor: Actor = {
    id: u.id,
    name: u.name,
    role: 'CLINICIAN',
    credentialVersion: u.credentialVersion,
    ...(member
      ? { practiceId: member.practiceId, canManage: member.canManage }
      : {}),
  };
  return {
    email,
    u,
    actor,
    token: (await ok(G.SignInDocument, { username: email, password })).login
      .token,
  };
}
beforeAll(async () => {
  process.env.EHR_LOCAL_STATE_DIR = mkdtempSync(
    join(tmpdir(), 'mcclinic-onboarding-'),
  );
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
  const app = createApp();
  installMvpGraphql(app, db, delivery);
  server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/mvp/graphql`;
});
afterAll(async () => {
  if (server) await new Promise<void>((r) => server.close(() => r()));
  if (db) await db.$disconnect();
  if (container) await container.stop();
});
it('verifies normalized accounts once, creates one isolated trial practice, preserves demo sign-in and blocks unverified login', async () => {
  const email = 'doctor-' + randomUUID() + '@example.test';
  const input = {
    email: ' ' + email.toUpperCase() + ' ',
    name: 'Synthetic Doctor',
    password,
    practiceName: 'New practice',
  };
  await ok(G.RegisterAccountDocument, { input });
  expect(
    (await request(G.SignInDocument, { username: email, password })).errors?.[0]
      ?.extensions.code,
  ).toBe('UNAUTHENTICATED');
  const t = latest(email, 'VERIFY');
  expect(
    await db.accountToken.findUnique({ where: { tokenHash: t } }),
  ).toBeNull();
  expect(
    await db.accountToken.findUnique({ where: { tokenHash: digest(t) } }),
  ).not.toBeNull();
  const outcomes = await Promise.all([
    request(G.VerifyAccountDocument, { token: t }),
    request(G.VerifyAccountDocument, { token: t }),
  ]);
  expect(outcomes.filter((r) => !r.errors)).toHaveLength(1);
  const u = await db.user.findUniqueOrThrow({ where: { email } });
  expect(await db.membership.count({ where: { userId: u.id } })).toBe(1);
  const auth = await ok(G.SignInDocument, { username: email, password });
  const viewer = await ok(G.ViewerDocument, {}, auth.login.token);
  expect(viewer.me?.canManage).toBe(true);
  expect(
    (
      await ok(
        G.PatientSearchDocument,
        { query: '', offset: 0, limit: 20 },
        auth.login.token,
      )
    ).patients.items,
  ).toHaveLength(0);
  expect(
    (
      await request(
        G.PatientSearchDocument,
        { query: '', offset: 0, limit: 20 },
        auth.login.token,
        '00000000-0000-4000-8000-000000000001',
      )
    ).errors,
  ).toBeDefined();
  const before = mail.length;
  await ok(G.RegisterAccountDocument, { input });
  expect(mail.length).toBe(before);
  await ok(G.SignInDocument, { username: 'clinician', password });
  await seedDemo(container.getConnectionUri(), password);
  expect(await db.membership.count({ where: { userId: u.id } })).toBe(1);
});
it('handles expiry, generic reset requests and persistent request limits', async () => {
  const email = randomUUID() + '@example.test';
  await ok(G.RegisterAccountDocument, {
    input: { email, name: 'Synthetic', password, practiceName: '' },
  });
  const t = latest(email, 'VERIFY');
  await db.accountToken.update({
    where: { tokenHash: digest(t) },
    data: { expiresAt: new Date(0) },
  });
  expect(
    (await request(G.VerifyAccountDocument, { token: t })).errors,
  ).toBeDefined();
  await ok(G.ResendVerificationDocument, { email });
  await ok(G.VerifyAccountDocument, { token: latest(email, 'VERIFY') });
  const before = mail.length;
  await ok(G.RequestPasswordResetDocument, { email: 'absent@example.test' });
  expect(mail.length).toBe(before);
  for (let i = 0; i < 10; i++)
    await onboardingStore(db, delivery).resend('limit@example.test');
  await expect(
    onboardingStore(db, delivery).resend('limit@example.test'),
  ).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
});
it('enforces matching verified invitation identity, inviter authority, seat limits and one-time acceptance', async () => {
  const owner = await registered(),
    staff = await registered('');
  await ok(
    G.InvitePracticeMemberDocument,
    { email: staff.email, role: 'RECEPTION' },
    owner.token,
  );
  const invite = latest(staff.email, 'INVITE');
  expect(
    (
      await request(G.AcceptPracticeInvitationDocument, {
        token: invite,
        password: 'wrong',
      })
    ).errors,
  ).toBeDefined();
  const outcomes = await Promise.all([
    request(G.AcceptPracticeInvitationDocument, { token: invite, password }),
    request(G.AcceptPracticeInvitationDocument, { token: invite, password }),
  ]);
  expect(outcomes.filter((r) => !r.errors)).toHaveLength(1);
  expect(
    (await ok(G.ViewerDocument, {}, staff.token, owner.actor.practiceId)).me
      ?.role,
  ).toBe('RECEPTION');
  expect(
    (
      await request(
        G.InvitePracticeMemberDocument,
        { email: 'no@example.test', role: 'ADMINISTRATOR' },
        staff.token,
        owner.actor.practiceId,
      )
    ).errors?.[0]?.extensions.code,
  ).toBe('FORBIDDEN');
  expect(
    (
      await request(
        G.SetPracticeMemberDocument,
        {
          input: JSON.stringify({
            username: owner.email,
            role: 'ADMINISTRATOR',
            active: true,
            expected: 1,
          }),
        },
        staff.token,
        owner.actor.practiceId,
      )
    ).errors?.[0]?.extensions.code,
  ).toBe('FORBIDDEN');
  const doctor = await registered('');
  await ok(
    G.InvitePracticeMemberDocument,
    { email: doctor.email, role: 'CLINICIAN' },
    owner.token,
  );
  expect(
    (
      await request(G.AcceptPracticeInvitationDocument, {
        token: latest(doctor.email, 'INVITE'),
        password,
      })
    ).errors?.[0]?.extensions.code,
  ).toBe('CONFLICT');
  await ok(
    G.InvitePracticeMemberDocument,
    { email: doctor.email, role: 'RECEPTION' },
    owner.token,
  );
  const next = latest(doctor.email, 'INVITE');
  await db.membership.updateMany({
    where: { userId: owner.u.id },
    data: { canManage: false },
  });
  expect(
    (
      await request(G.AcceptPracticeInvitationDocument, {
        token: next,
        password,
      })
    ).errors?.[0]?.extensions.code,
  ).toBe('FORBIDDEN');
});
it('resets passwords once and revokes sessions without changing clinical or membership records', async () => {
  const a = await registered();
  await ok(G.RequestPasswordResetDocument, { email: a.email });
  const t = latest(a.email, 'RESET'),
    next = password + '-changed';
  const results = await Promise.all([
    request(G.ResetAccountPasswordDocument, { token: t, password: next }),
    request(G.ResetAccountPasswordDocument, { token: t, password: next }),
  ]);
  expect(results.filter((r) => !r.errors)).toHaveLength(1);
  expect((await ok(G.ViewerDocument, {}, a.token)).me).toBeNull();
  expect(
    (await request(G.SignInDocument, { username: a.email, password })).errors,
  ).toBeDefined();
  await ok(G.SignInDocument, { username: a.email, password: next });
  expect(await db.membership.count({ where: { userId: a.u.id } })).toBe(1);
});
it('requires MFA at the use-case boundary, rejects replay, consumes recovery codes once and protects reset/disable', async () => {
  const a = await registered();
  const setup = JSON.parse(
    (await ok(G.StartAccountMfaDocument, { password }, a.token))
      .startAccountMfa,
  ) as { secret: string };
  const step = Math.floor(Date.now() / 30000),
    code = totp(setup.secret, step);
  const codes = JSON.parse(
    (await ok(G.ConfirmAccountMfaDocument, { code }, a.token))
      .confirmAccountMfa,
  ) as string[];
  expect(codes).toHaveLength(8);
  const stored = await db.securityFactor.findUniqueOrThrow({
    where: { userId: a.u.id },
  });
  expect(stored.secretCipher).not.toContain(setup.secret);
  expect(stored.recoveryHashes).not.toContain(codes[0]);
  expect((await ok(G.ViewerDocument, {}, a.token)).me).toBeNull();
  await expect(
    composeMvp(db).identity.login(a.email, password),
  ).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  await expect(
    composeMvp(db).identity.login(a.email, password, code),
  ).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  const auth = await ok(G.SignInDocument, {
    username: a.email,
    password,
    code: codes[0]!,
  });
  expect(
    (
      await request(G.SignInDocument, {
        username: a.email,
        password,
        code: codes[0]!,
      })
    ).errors,
  ).toBeDefined();
  await ok(G.RequestPasswordResetDocument, { email: a.email });
  const reset = latest(a.email, 'RESET');
  expect(
    (
      await request(G.ResetAccountPasswordDocument, {
        token: reset,
        password: password + 'new',
      })
    ).errors,
  ).toBeDefined();
  await ok(G.ResetAccountPasswordDocument, {
    token: reset,
    password: password + 'new',
    code: codes[1]!,
  });
  expect((await ok(G.ViewerDocument, {}, auth.login.token)).me).toBeNull();
  const login = await ok(G.SignInDocument, {
    username: a.email,
    password: password + 'new',
    code: codes[2]!,
  });
  expect(
    (
      await request(
        G.DisableAccountMfaDocument,
        { password: 'incorrect', code: codes[3]! },
        login.login.token,
      )
    ).errors,
  ).toBeDefined();
  await ok(
    G.DisableAccountMfaDocument,
    { password: password + 'new', code: codes[3]! },
    login.login.token,
  );
  expect((await ok(G.ViewerDocument, {}, login.login.token)).me).toBeNull();
  await ok(G.SignInDocument, { username: a.email, password: password + 'new' });
});
it('rolls back account verification and practice creation if its audit cannot commit', async () => {
  const email = randomUUID() + '@example.test';
  await ok(G.RegisterAccountDocument, {
    input: {
      email,
      name: 'Audit synthetic',
      password,
      practiceName: 'Rollback practice',
    },
  });
  const sql = new Client({ connectionString: container.getConnectionUri() });
  await sql.connect();
  try {
    await sql.query(
      `CREATE FUNCTION reject_onboarding_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.action = 'account.verify' THEN RAISE EXCEPTION 'synthetic audit failure'; END IF; RETURN NEW; END $$; CREATE TRIGGER onboarding_audit_failure BEFORE INSERT ON "AuditEvent" FOR EACH ROW EXECUTE FUNCTION reject_onboarding_audit();`,
    );
    const t = latest(email, 'VERIFY');
    expect(
      (await request(G.VerifyAccountDocument, { token: t })).errors,
    ).toBeDefined();
    const u = await db.user.findUniqueOrThrow({ where: { email } });
    expect(u.verifiedAt).toBeNull();
    expect(await db.membership.count({ where: { userId: u.id } })).toBe(0);
    expect(
      (
        await db.accountToken.findUniqueOrThrow({
          where: { tokenHash: digest(t) },
        })
      ).consumedAt,
    ).toBeNull();
  } finally {
    await sql.query(
      'ALTER TABLE "AuditEvent" DISABLE TRIGGER onboarding_audit_failure',
    );
    await sql.end();
  }
  await ok(G.VerifyAccountDocument, { token: latest(email, 'VERIFY') });
});
it('renames a local database without changing its OID or data and refuses an existing target', async () => {
  const maintenance = new URL(container.getConnectionUri());
  maintenance.pathname = '/postgres';
  const sql = new Client({ connectionString: maintenance.toString() });
  await sql.connect();
  try {
    await sql.query('CREATE DATABASE ehr_mvp');
    const source = new URL(container.getConnectionUri());
    source.pathname = '/ehr_mvp';
    await expect(renameDatabase(source.toString())).rejects.toThrow(
      'already exists',
    );
    const other = await new PostgreSqlContainer('postgres:17.6-alpine')
      .withDatabase('ehr_mvp')
      .start();
    try {
      const old = new Client({ connectionString: other.getConnectionUri() });
      await old.connect();
      const oid = (
        await old.query(
          'SELECT oid FROM pg_database WHERE datname=current_database()',
        )
      ).rows[0].oid;
      await old.query(
        "CREATE TABLE preserved (value text); INSERT INTO preserved VALUES ('synthetic history')",
      );
      await old.end();
      await renameDatabase(other.getConnectionUri());
      const renamed = new URL(other.getConnectionUri());
      renamed.pathname = '/mcclinic';
      const current = new Client({ connectionString: renamed.toString() });
      await current.connect();
      try {
        expect(
          (
            await current.query(
              'SELECT oid FROM pg_database WHERE datname=current_database()',
            )
          ).rows[0].oid,
        ).toBe(oid);
        expect(
          (await current.query('SELECT value FROM preserved')).rows[0].value,
        ).toBe('synthetic history');
      } finally {
        await current.end();
      }
    } finally {
      await other.stop();
    }
  } finally {
    await sql.end();
  }
});

it('invalidates outstanding reset links and rejects login racing a credential rotation', async () => {
  const a = await registered();
  await ok(G.RequestPasswordResetDocument, { email: a.email });
  const first = latest(a.email, 'RESET');
  await ok(G.RequestPasswordResetDocument, { email: a.email });
  const second = latest(a.email, 'RESET');
  await ok(G.ResetAccountPasswordDocument, {
    token: first,
    password: password + 'rotated',
  });
  expect(
    (
      await request(G.ResetAccountPasswordDocument, {
        token: second,
        password: password + 'stale',
      })
    ).errors,
  ).toBeDefined();
  await expect(localIdentity(db).openSession(a.actor)).rejects.toMatchObject({
    code: 'UNAUTHENTICATED',
  });
  await ok(G.SignInDocument, {
    username: a.email,
    password: password + 'rotated',
  });
});
