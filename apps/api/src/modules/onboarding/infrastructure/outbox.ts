import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import type { Database } from '../../../infrastructure/prisma/database.js';
import type { Delivery, LocalMessage } from './mailbox.js';
import { encrypt, decrypt } from './crypto.js';
import { audit } from './security.js';

const messageSchema = z
  .object({
    to: z.string().email().max(100),
    kind: z.enum(['VERIFY', 'RESET', 'INVITE']),
    token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  })
  .strict();
export type IdentitySink = (id: string, message: LocalMessage) => Promise<void>;
export function syntheticRecipientPolicy(domains: readonly string[]) {
  if (
    !domains.length ||
    domains.some((d) => !/^([a-z0-9]+(?:-[a-z0-9]+)*\.)+test$/.test(d))
  )
    throw new Error('Explicit synthetic .test domains required.');
  return (input: LocalMessage) => {
    const message = messageSchema.parse(input);
    if (!domains.includes(message.to.split('@')[1]!))
      throw new Error('Synthetic recipient domain is not allowlisted.');
    return message;
  };
}
export function outboxDelivery(domains: readonly string[]): Delivery {
  const validate = syntheticRecipientPolicy(domains);
  const delivery: Delivery = async () => {}; // Intent is committed by enqueue; worker owns delivery.
  delivery.enqueue = async (tx, message) => {
    await tx.identityOutbox.create({
      data: { payloadCipher: encrypt(JSON.stringify(validate(message))) },
    });
    await audit(tx, 'identity.delivery.queued', null);
  };
  return delivery;
}
export function syntheticFileSink(
  state: string,
  origin: string,
  domains: readonly string[],
): IdentitySink {
  const validate = syntheticRecipientPolicy(domains);
  const url = new URL(origin);
  if (
    url.protocol !== 'http:' ||
    !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) ||
    url.origin !== origin
  )
    throw new Error('Local synthetic sink requires a loopback origin.');
  const dir = join(state, 'mailbox');
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  return async (id, input) => {
    z.string().uuid().parse(id);
    const message = validate(input);
    const data = JSON.stringify(
      {
        ...message,
        link: `${origin}/clinic#${message.kind.toLowerCase()}=${message.token}`,
      },
      null,
      2,
    );
    const path = join(dir, id + '.json');
    try {
      writeFileSync(path, data, { flag: 'wx', mode: 0o600 });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      if (readFileSync(path, 'utf8') !== data)
        throw new Error('Sink idempotency conflict.');
    }
  };
}
export async function deliverOutboxOnce(
  db: Database,
  sink: IdentitySink,
  now = new Date(),
): Promise<boolean> {
  const leaseId = randomUUID();
  const rows = await db.$queryRaw<
    { id: string; payloadCipher: string; attempts: number }[]
  >`
    UPDATE "IdentityOutbox" SET "leaseId"=${leaseId}::uuid,"leaseUntil"=${new Date(now.getTime() + 60000)},"attempts"="attempts"+1
    WHERE id=(SELECT id FROM "IdentityOutbox" WHERE "deliveredAt" IS NULL AND "exhaustedAt" IS NULL AND "availableAt"<=${now}
      AND ("leaseUntil" IS NULL OR "leaseUntil"<=${now}) ORDER BY "createdAt",id FOR UPDATE SKIP LOCKED LIMIT 1)
    RETURNING id,"payloadCipher",attempts`;
  const row = rows[0];
  if (!row) return false;
  try {
    await sink(
      row.id,
      messageSchema.parse(JSON.parse(decrypt(row.payloadCipher))),
    );
    await db.$transaction(async (tx) => {
      const updated = await tx.identityOutbox.updateMany({
        where: { id: row.id, leaseId, deliveredAt: null },
        data: { deliveredAt: now, leaseUntil: null, leaseId: null },
      });
      if (updated.count) await audit(tx, 'identity.delivery.sent', null);
    });
  } catch {
    // Never persist raw provider errors: they can contain email addresses or tokens.
    await db.$transaction(async (tx) => {
      const updated = await tx.identityOutbox.updateMany({
        where: { id: row.id, leaseId, deliveredAt: null },
        data: {
          leaseId: null,
          leaseUntil: null,
          availableAt: new Date(
            now.getTime() +
              Math.min(3600000, 1000 * 2 ** Math.min(row.attempts, 12)),
          ),
          ...(row.attempts >= 8 ? { exhaustedAt: now } : {}),
        },
      });
      if (updated.count)
        await audit(
          tx,
          row.attempts >= 8
            ? 'identity.delivery.exhausted'
            : 'identity.delivery.retry',
          null,
        );
    });
  }
  return true;
}
