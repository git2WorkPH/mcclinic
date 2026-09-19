import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import type { Database } from '../../../infrastructure/prisma/database.js';
import type { OnboardingStore } from '../application/onboarding.js';
import { AppError, type Actor } from '../../../application/context.js';
import {
  hashPassword,
  localIdentity,
} from '../../identity/infrastructure/local-identity.js';
import {
  verifyMembership,
  DEFAULT_PRACTICE,
  type Tx,
} from '../../practice/infrastructure/scope.js';
import {
  plans,
  simulatedSubscription,
} from '../../subscription/application/policy.js';
import { base32, digest, encrypt, decrypt, matchedStep } from './crypto.js';
import { type Delivery, localDelivery, type LocalMessage } from './mailbox.js';
import { audit, denied, factor, lock, rate, revoke } from './security.js';
const emailValue = z.string().trim().toLowerCase().email().max(100);
const passwordValue = z.string().min(12).max(128);
const tokenValue = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
export function onboardingStore(
  db: Database,
  deliver: Delivery = localDelivery,
): OnboardingStore {
  const identity = localIdentity(db);
  async function token(
    tx: Tx,
    kind: string,
    email: string,
    userId: string | null,
    extra: {
      practiceId?: string;
      invitedBy?: string;
      role?: string;
      practiceName?: string;
    } = {},
  ) {
    const value = randomBytes(32).toString('base64url');
    const credentialVersion = userId
      ? (await tx.user.findUniqueOrThrow({ where: { id: userId } }))
          .credentialVersion
      : null;
    await tx.accountToken.create({
      data: {
        kind,
        email,
        userId,
        credentialVersion,
        tokenHash: digest(value),
        expiresAt: new Date(
          Date.now() +
            (kind === 'RESET'
              ? 1800000
              : kind === 'VERIFY'
                ? 86400000
                : 604800000),
        ),
        ...extra,
      },
    });
    const message = { to: email, kind, token: value };
    await deliver.enqueue?.(tx, message);
    return message;
  }
  async function consume<T>(
    raw: string,
    kind: string,
    fn: (
      tx: Tx,
      t: Awaited<ReturnType<Database['accountToken']['findUniqueOrThrow']>>,
    ) => Promise<T>,
  ) {
    tokenValue.parse(raw);
    await rate(db, 'token:' + digest(raw));
    return db.$transaction(
      async (tx) => {
        await lock(tx, 'token:' + digest(raw));
        const t = await tx.accountToken.findUnique({
          where: { tokenHash: digest(raw) },
        });
        if (!t || t.kind !== kind || t.consumedAt || t.expiresAt <= new Date())
          throw denied();
        const result = await fn(tx, t);
        await tx.accountToken.update({
          where: { id: t.id },
          data: { consumedAt: new Date() },
        });
        return result;
      },
      { timeout: 15000 },
    );
  }
  async function userPassword(tx: Tx, id: string, password: string) {
    await lock(tx, 'onboarding-user:' + id);
    const u = await tx.user.findUnique({ where: { id } });
    if (!u?.active || !(await identity.verify(password, u.passwordHash)))
      throw denied();
    return u;
  }
  async function actorPassword(tx: Tx, a: Actor, p: string) {
    const u = await userPassword(tx, a.id, p);
    if (
      a.credentialVersion !== undefined &&
      a.credentialVersion !== u.credentialVersion
    )
      throw denied();
    return u;
  }
  async function send(message: LocalMessage | null) {
    if (message) await deliver(message);
  }
  return {
    async register(input) {
      const value = z
        .object({
          email: emailValue,
          name: z.string().trim().min(1).max(100),
          password: passwordValue,
          practiceName: z.string().trim().max(100),
        })
        .strict()
        .parse(input);
      await rate(db, 'register:' + value.email);
      const hash = await hashPassword(value.password);
      await send(
        await db.$transaction(async (tx) => {
          await lock(tx, 'email:' + value.email);
          if (await tx.user.findUnique({ where: { username: value.email } }))
            return null;
          const u = await tx.user.create({
            data: {
              username: value.email,
              email: value.email,
              name: value.name,
              passwordHash: hash,
              role: 'CLINICIAN',
            },
          });
          await audit(tx, 'account.register', u.id);
          return token(tx, 'VERIFY', value.email, u.id, {
            practiceName: value.practiceName,
          });
        }),
      );
    },
    async resend(input) {
      const email = emailValue.parse(input);
      await rate(db, 'resend:' + email);
      await send(
        await db.$transaction(async (tx) => {
          const u = await tx.user.findUnique({ where: { email } });
          if (!u || u.verifiedAt || !u.active) return null;
          const prior = await tx.accountToken.findFirst({
            where: { userId: u.id, kind: 'VERIFY' },
            orderBy: { createdAt: 'desc' },
          });
          await audit(tx, 'account.verify.request', u.id);
          return token(tx, 'VERIFY', email, u.id, {
            practiceName: prior?.practiceName ?? '',
          });
        }),
      );
    },
    async verify(raw) {
      await consume(raw, 'VERIFY', async (tx, t) => {
        if (!t.userId) throw denied();
        await lock(tx, 'onboarding-user:' + t.userId);
        const u = await tx.user.findUnique({ where: { id: t.userId } });
        if (!u?.active || u.email !== t.email || u.verifiedAt) throw denied();
        await tx.user.update({
          where: { id: u.id },
          data: { verifiedAt: new Date() },
        });
        if (t.practiceName) {
          const p = await tx.practice.create({
            data: { name: t.practiceName },
          });
          await tx.membership.create({
            data: {
              practiceId: p.id,
              userId: u.id,
              role: 'CLINICIAN',
              canManage: true,
            },
          });
          await tx.practiceSubscription.create({
            data: {
              practiceId: p.id,
              ...simulatedSubscription('SOLO', 'TRIAL'),
            },
          });
          await audit(tx, 'practice.onboard', u.id, p.id);
        }
        await audit(tx, 'account.verify', u.id);
      });
    },
    async resetRequest(input) {
      const email = emailValue.parse(input);
      await rate(db, 'reset-request:' + email);
      await send(
        await db.$transaction(async (tx) => {
          const u = await tx.user.findUnique({ where: { email } });
          if (!u?.active || !u.verifiedAt) return null;
          await audit(tx, 'account.reset.request', u.id);
          return token(tx, 'RESET', email, u.id);
        }),
      );
    },
    async reset(raw, password, code) {
      passwordValue.parse(password);
      const hash = await hashPassword(password);
      await consume(raw, 'RESET', async (tx, t) => {
        if (!t.userId) throw denied();
        await lock(tx, 'onboarding-user:' + t.userId);
        const u = await tx.user.findUnique({ where: { id: t.userId } });
        if (
          !u?.active ||
          u.email !== t.email ||
          !u.verifiedAt ||
          u.credentialVersion !== t.credentialVersion
        )
          throw denied();
        await factor(tx, u.id, code);
        await tx.user.update({
          where: { id: u.id },
          data: { passwordHash: hash },
        });
        await revoke(tx, u.id);
        await audit(tx, 'account.password.reset', u.id);
      });
    },
    async invite(actor, input, role) {
      const email = emailValue.parse(input);
      z.enum(['CLINICIAN', 'RECEPTION', 'ADMINISTRATOR']).parse(role);
      await rate(db, 'invite:' + actor.id);
      await send(
        await db.$transaction(async (tx) => {
          const pid = actor.practiceId ?? DEFAULT_PRACTICE;
          await lock(tx, pid);
          await verifyMembership(tx, actor);
          if (actor.role !== 'ADMINISTRATOR' && !actor.canManage)
            throw new AppError('FORBIDDEN', 'Practice management required.');
          await audit(tx, 'membership.invite', actor.id, pid);
          return token(tx, 'INVITE', email, null, {
            practiceId: pid,
            invitedBy: actor.id,
            role,
          });
        }),
      );
    },
    async accept(raw, password, code) {
      z.string().max(256).parse(password);
      await consume(raw, 'INVITE', async (tx, t) => {
        const found = await tx.user.findUnique({ where: { email: t.email } });
        if (!found?.verifiedAt || !t.practiceId || !t.invitedBy || !t.role)
          throw denied();
        const u = await userPassword(tx, found.id, password);
        await factor(tx, u.id, code);
        await lock(tx, t.practiceId);
        const inviter = await tx.membership.findFirst({
          where: {
            practiceId: t.practiceId,
            userId: t.invitedBy,
            active: true,
            user: { active: true },
          },
        });
        if (
          !inviter ||
          (!inviter.canManage && inviter.role !== 'ADMINISTRATOR')
        )
          throw new AppError(
            'FORBIDDEN',
            'Invitation authority is no longer active.',
          );
        const previous = await tx.membership.findUnique({
          where: {
            practiceId_userId: { practiceId: t.practiceId, userId: u.id },
          },
        });
        if (previous?.active)
          throw new AppError('CONFLICT', 'Already a member of this practice.');
        if (t.role === 'CLINICIAN') {
          const sub = await tx.practiceSubscription.findUniqueOrThrow({
            where: { practiceId: t.practiceId },
          });
          const count = await tx.membership.count({
            where: {
              practiceId: t.practiceId,
              role: 'CLINICIAN',
              active: true,
            },
          });
          if (count >= (plans[sub.plan as keyof typeof plans] ?? 0))
            throw new AppError('CONFLICT', 'Clinician seat limit reached.');
        }
        await tx.membership.upsert({
          where: {
            practiceId_userId: { practiceId: t.practiceId, userId: u.id },
          },
          create: { practiceId: t.practiceId, userId: u.id, role: t.role },
          update: {
            role: t.role,
            active: true,
            canManage: false,
            version: { increment: 1 },
          },
        });
        await audit(tx, 'membership.accept', u.id, t.practiceId);
      });
    },
    async startMfa(actor, password) {
      await rate(db, 'mfa:' + actor.id);
      return db.$transaction(async (tx) => {
        const u = await actorPassword(tx, actor, password);
        const f = await tx.securityFactor.findUnique({
          where: { userId: u.id },
        });
        if (f?.enabled)
          throw new AppError('CONFLICT', 'MFA is already enabled.');
        const secret = base32(randomBytes(20));
        const data = {
          pendingCipher: encrypt(secret),
          pendingExpires: new Date(Date.now() + 600000),
        };
        await tx.securityFactor.upsert({
          where: { userId: u.id },
          create: { userId: u.id, ...data },
          update: data,
        });
        await audit(tx, 'account.mfa.enroll', u.id);
        return {
          secret,
          uri: `otpauth://totp/${encodeURIComponent('MCClinic DEMO:' + u.username)}?secret=${secret}&issuer=MCClinic%20DEMO&algorithm=SHA1&digits=6&period=30`,
        };
      });
    },
    async confirmMfa(actor, code) {
      await rate(db, 'mfa:' + actor.id);
      return db.$transaction(async (tx) => {
        await lock(tx, 'onboarding-user:' + actor.id);
        const u = await tx.user.findUniqueOrThrow({ where: { id: actor.id } });
        if (
          !u.active ||
          (actor.credentialVersion !== undefined &&
            actor.credentialVersion !== u.credentialVersion)
        )
          throw denied();
        const f = await tx.securityFactor.findUnique({
          where: { userId: actor.id },
        });
        if (
          f?.enabled ||
          !f?.pendingCipher ||
          !f.pendingExpires ||
          f.pendingExpires <= new Date()
        )
          throw denied();
        const step = matchedStep(decrypt(f.pendingCipher), code, -1);
        if (step === null) throw denied();
        const codes = Array.from({ length: 8 }, () =>
          randomBytes(10).toString('hex'),
        );
        await tx.securityFactor.update({
          where: { userId: actor.id },
          data: {
            secretCipher: f.pendingCipher,
            enabled: true,
            lastStep: step,
            recoveryHashes: codes.map(digest),
            pendingExpires: new Date(0),
          },
        });
        await revoke(tx, actor.id);
        await audit(tx, 'account.mfa.enabled', actor.id);
        return codes;
      });
    },
    async disableMfa(actor, password, code) {
      await rate(db, 'mfa:' + actor.id);
      await db.$transaction(async (tx) => {
        await actorPassword(tx, actor, password);
        const f = await tx.securityFactor.findUnique({
          where: { userId: actor.id },
        });
        if (!f?.enabled) throw denied();
        await factor(tx, actor.id, code);
        await tx.securityFactor.update({
          where: { userId: actor.id },
          data: { enabled: false },
        });
        await revoke(tx, actor.id);
        await audit(tx, 'account.mfa.disabled', actor.id);
      });
    },
    async status(actor) {
      const u = await db.user.findUnique({ where: { id: actor.id } });
      if (!u?.active) throw denied();
      return Boolean(
        (await db.securityFactor.findUnique({ where: { userId: actor.id } }))
          ?.enabled,
      );
    },
  };
}
