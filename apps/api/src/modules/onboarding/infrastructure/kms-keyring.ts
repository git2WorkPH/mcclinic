import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';
import { z } from 'zod';
import { versionedKeyring } from './keyring.js';
const keyId = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const envelopeSchema = z
  .object({
    active: keyId,
    environment: z.literal('synthetic-staging'),
    kmsKeyArn: z
      .string()
      .regex(/^arn:aws:kms:ap-southeast-1:\d{12}:key\/[a-f0-9-]{36}$/),
    keys: z.record(
      keyId,
      z
        .string()
        .min(1)
        .max(16384)
        .regex(/^[A-Za-z0-9+/]+={0,2}$/),
    ),
  })
  .strict();
export interface KeyUnwrapper {
  unwrap(
    cipher: Uint8Array,
    keyArn: string,
    context: Record<string, string>,
  ): Promise<Uint8Array>;
}
// Constructing this adapter is explicit. No SDK default credential lookup/network occurs in local modes.
export function awsKeyUnwrapper(allowNetwork: boolean): KeyUnwrapper {
  if (!allowNetwork)
    throw new Error('AWS identity custody activation is not authorized.');
  const client = new KMSClient({ region: 'ap-southeast-1', maxAttempts: 3 });
  return {
    async unwrap(cipher, keyArn, context) {
      const result = await client.send(
        new DecryptCommand({
          CiphertextBlob: cipher,
          KeyId: keyArn,
          EncryptionContext: context,
        }),
      );
      if (
        result.KeyId !== keyArn ||
        !result.Plaintext ||
        result.Plaintext.length !== 32
      )
        throw new Error('KMS identity key validation failed.');
      return result.Plaintext;
    },
  };
}
export async function loadKmsKeyring(input: unknown, provider: KeyUnwrapper) {
  const envelope = envelopeSchema.parse(input);
  if (!Object.hasOwn(envelope.keys, envelope.active))
    throw new Error('Active wrapped identity key missing.');
  const keys: Record<string, string> = {};
  for (const [version, cipher] of Object.entries(envelope.keys)) {
    const plaintext = await provider.unwrap(
      Buffer.from(cipher, 'base64'),
      envelope.kmsKeyArn,
      {
        application: 'mcclinic-identity',
        environment: envelope.environment,
        version: version,
      },
    );
    try {
      if (plaintext.length !== 32)
        throw new Error('Invalid unwrapped identity key.');
      keys[version] = Buffer.from(plaintext).toString('base64');
    } finally {
      plaintext.fill(0);
    }
  }
  return versionedKeyring({ active: envelope.active, keys });
}
