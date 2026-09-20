import {
  createCipheriv,
  createPublicKey,
  constants,
  publicEncrypt,
  randomBytes,
} from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, isAbsolute } from 'node:path';
import { z } from 'zod';

// Retrieval job emits ciphertext only. The operator retains the private key locally.
export function sealedSyntheticMessage(
  state: string,
  id: string,
  publicKeyPem: string,
) {
  if (!isAbsolute(state)) throw new Error('Absolute state required.');
  z.string().uuid().parse(id);
  const recipient = createPublicKey(publicKeyPem);
  if (
    recipient.asymmetricKeyType !== 'rsa' ||
    (recipient.asymmetricKeyDetails?.modulusLength ?? 0) < 3072
  )
    throw new Error('RSA recipient key of at least 3072 bits required.');
  const bytes = readFileSync(join(state, 'mailbox', `${id}.json`));
  if (bytes.length > 16384) throw new Error('Unexpected message size.');
  const key = randomBytes(32),
    iv = randomBytes(12);
  try {
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    cipher.setAAD(Buffer.from(`mcclinic-synthetic-mailbox:v1:${id}`));
    const ciphertext = Buffer.concat([cipher.update(bytes), cipher.final()]);
    return {
      version: 1,
      id,
      wrappedKey: publicEncrypt(
        {
          key: recipient,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        key,
      ).toString('base64'),
      iv: iv.toString('base64'),
      tag: cipher.getAuthTag().toString('base64'),
      ciphertext: ciphertext.toString('base64'),
    };
  } finally {
    key.fill(0);
    bytes.fill(0);
  }
}
