import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { z } from 'zod';
import { isAbsolute } from 'node:path';
const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const schema = z
  .object({
    active: id,
    keys: z.record(id, z.string().regex(/^[A-Za-z0-9+/]{43}=$/)),
  })
  .strict();
export function versionedKeyring(input: unknown) {
  const config = schema.parse(input);
  const keys = new Map(
    Object.entries(config.keys).map(([name, value]) => [
      name,
      Buffer.from(value, 'base64'),
    ]),
  );
  if (
    !keys.has(config.active) ||
    [...keys.values()].some((k) => k.length !== 32)
  )
    throw new Error('Invalid identity keyring.');
  return {
    encrypt(value: string) {
      const iv = randomBytes(12),
        cipher = createCipheriv('aes-256-gcm', keys.get(config.active)!, iv);
      cipher.setAAD(Buffer.from('mcclinic-identity:v1:' + config.active));
      const data = Buffer.concat([
        cipher.update(value, 'utf8'),
        cipher.final(),
      ]);
      return [
        'v1',
        config.active,
        iv.toString('base64'),
        cipher.getAuthTag().toString('base64'),
        data.toString('base64'),
      ].join('.');
    },
    decrypt(value: string) {
      const parts = value.split('.');
      if (parts.length !== 5 || parts[0] !== 'v1')
        throw new Error('Unsupported identity ciphertext.');
      const key = keys.get(parts[1]!);
      if (!key) throw new Error('Required identity key version unavailable.');
      const decoder = createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(parts[2]!, 'base64'),
      );
      decoder.setAAD(Buffer.from('mcclinic-identity:v1:' + parts[1]));
      decoder.setAuthTag(Buffer.from(parts[3]!, 'base64'));
      return Buffer.concat([
        decoder.update(Buffer.from(parts[4]!, 'base64')),
        decoder.final(),
      ]).toString('utf8');
    },
  };
}
let preparedRing: ReturnType<typeof versionedKeyring> | null = null;
export function installPreparedKeyring(
  ring: ReturnType<typeof versionedKeyring>,
) {
  if (preparedRing) throw new Error('Identity keyring already initialized.');
  preparedRing = ring;
}
export function configuredKeyring() {
  if (preparedRing) return preparedRing;
  const path = process.env.IDENTITY_KEYRING_FILE;
  if (!path) return null;
  if (!isAbsolute(path))
    throw new Error('Identity keyring path must be absolute.');
  const info = statSync(path);
  if (!info.isFile() || (info.mode & 0o077) !== 0)
    throw new Error('Identity keyring requires a private regular file (0600).');
  return versionedKeyring(JSON.parse(readFileSync(path, 'utf8')));
}
