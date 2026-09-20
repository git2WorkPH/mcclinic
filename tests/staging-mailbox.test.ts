import { expect, it } from 'vitest';
import {
  createDecipheriv,
  constants,
  generateKeyPairSync,
  privateDecrypt,
  randomUUID,
} from 'node:crypto';
import { mkdtempSync, writeFileSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sealedSyntheticMessage } from '../apps/api/src/runtime/staging-mailbox';
import { stagingSyntheticSink } from '../apps/api/src/runtime/staging-sink';
it('lets only the private-key holder recover a synthetic message without emitting plaintext or modifying the sink', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'sealed-mailbox-'));
  const id = randomUUID(),
    message = {
      to: 'synthetic@example.test',
      kind: 'VERIFY' as const,
      token: 's'.repeat(43),
    };
  const sink = stagingSyntheticSink(dir, 'https://clinic.example.test', [
    'example.test',
  ]);
  await sink(id, message);
  const keys = generateKeyPairSync('rsa', { modulusLength: 3072 });
  const pem = keys.publicKey.export({ type: 'spki', format: 'pem' }).toString();
  const envelope = sealedSyntheticMessage(dir, id, pem);
  expect(JSON.stringify(envelope)).not.toContain(message.token);
  expect(JSON.stringify(envelope)).not.toContain(message.to);
  const key = privateDecrypt(
    {
      key: keys.privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(envelope.wrappedKey, 'base64'),
  );
  const decryptor = createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(envelope.iv, 'base64'),
  );
  decryptor.setAAD(Buffer.from(`mcclinic-synthetic-mailbox:v1:${id}`));
  decryptor.setAuthTag(Buffer.from(envelope.tag, 'base64'));
  const recovered = JSON.parse(
    Buffer.concat([
      decryptor.update(Buffer.from(envelope.ciphertext, 'base64')),
      decryptor.final(),
    ]).toString(),
  );
  expect(recovered).toMatchObject(message);
  const privatePath = join(dir, 'operator.pem'),
    envelopePath = join(dir, 'sealed.json');
  writeFileSync(
    privatePath,
    keys.privateKey.export({ type: 'pkcs8', format: 'pem' }),
    { mode: 0o600 },
  );
  writeFileSync(envelopePath, JSON.stringify(envelope), { mode: 0o600 });
  const output = execFileSync(
    process.execPath,
    ['tooling/open-sealed-mailbox.mjs', envelopePath, privatePath],
    { encoding: 'utf8' },
  );
  expect(output).not.toContain(message.token);
  const recoveredPath = join('.local/staging-mailbox', `${id}.json`);
  expect(statSync(recoveredPath).mode & 0o777).toBe(0o600);
  expect(JSON.parse(readFileSync(recoveredPath, 'utf8'))).toMatchObject(
    message,
  );
  expect(() =>
    execFileSync(
      process.execPath,
      ['tooling/open-sealed-mailbox.mjs', envelopePath, privatePath],
      { stdio: 'ignore' },
    ),
  ).toThrow();
  expect(JSON.parse(readFileSync(recoveredPath, 'utf8'))).toMatchObject(
    message,
  );

  await sink(id, message); // Retrieval preserves the original idempotent record.
  expect(() => sealedSyntheticMessage(dir, '../escape', pem)).toThrow();
  const other = generateKeyPairSync('rsa', { modulusLength: 3072 });
  expect(() =>
    privateDecrypt(
      {
        key: other.privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(envelope.wrappedKey, 'base64'),
    ),
  ).toThrow();
});
