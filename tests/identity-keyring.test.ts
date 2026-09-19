import { it, expect } from 'vitest';
import { randomBytes } from 'node:crypto';
import { versionedKeyring } from '../apps/api/src/modules/onboarding/infrastructure/keyring';
it('preserves prior ciphertext across rotation and independent restored keyring while authenticating its version', () => {
  const first = randomBytes(32).toString('base64'),
    second = randomBytes(32).toString('base64');
  const old = versionedKeyring({ active: 'first', keys: { first } });
  const encrypted = old.encrypt('SYNTHETIC-MFA-SECRET');
  const backup = JSON.stringify({ active: 'second', keys: { first, second } });
  const rotated = versionedKeyring(JSON.parse(backup)),
    restored = versionedKeyring(JSON.parse(backup));
  expect(rotated.decrypt(encrypted)).toBe('SYNTHETIC-MFA-SECRET');
  const next = rotated.encrypt(rotated.decrypt(encrypted));
  expect(next.startsWith('v1.second.')).toBe(true);
  expect(restored.decrypt(next)).toBe('SYNTHETIC-MFA-SECRET');
  expect(restored.decrypt(encrypted)).toBe('SYNTHETIC-MFA-SECRET');
  expect(() =>
    rotated.decrypt(next.replace('v1.second.', 'v1.first.')),
  ).toThrow();
  expect(() =>
    versionedKeyring({ active: 'second', keys: { second } }).decrypt(encrypted),
  ).toThrow('unavailable');
  expect(() =>
    versionedKeyring({ active: 'absent', keys: { first } }),
  ).toThrow();
});

it('prepares KMS unwrap with bound environment/version context and refuses network by default', async () => {
  const { loadKmsKeyring, awsKeyUnwrapper } =
    await import('../apps/api/src/modules/onboarding/infrastructure/kms-keyring');
  expect(() => awsKeyUnwrapper(false)).toThrow('not authorized');
  const key = randomBytes(32),
    arn =
      'arn:aws:kms:ap-southeast-1:111111111111:key/12345678-1234-1234-1234-123456789012';
  const envelope = {
    active: 'v2',
    environment: 'synthetic-staging',
    kmsKeyArn: arn,
    keys: {
      v1: Buffer.from('synthetic-envelope-1').toString('base64'),
      v2: Buffer.from('synthetic-envelope-2').toString('base64'),
    },
  };
  const contexts: Record<string, string>[] = [];
  const provider = {
    async unwrap(
      _cipher: Uint8Array,
      keyArn: string,
      context: Record<string, string>,
    ) {
      expect(keyArn).toBe(arn);
      contexts.push(context);
      return Buffer.from(key);
    },
  };
  const ring = await loadKmsKeyring(envelope, provider);
  const restored = await loadKmsKeyring(
    JSON.parse(JSON.stringify(envelope)),
    provider,
  );
  expect(restored.decrypt(ring.encrypt('SYNTHETIC-MFA'))).toBe('SYNTHETIC-MFA');
  expect(contexts[0]).toEqual({
    application: 'mcclinic-identity',
    environment: 'synthetic-staging',
    version: 'v1',
  });
  await expect(
    loadKmsKeyring({ ...envelope, environment: 'production' }, provider),
  ).rejects.toThrow();
  await expect(
    loadKmsKeyring(envelope, {
      async unwrap() {
        throw new Error('synthetic KMS denial');
      },
    }),
  ).rejects.toThrow('denial');
});
