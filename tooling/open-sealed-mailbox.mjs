import { constants, createDecipheriv, privateDecrypt } from 'node:crypto';
import { readFileSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
try {
  const [envelopePath, keyPath] = process.argv.slice(2);
  if (!envelopePath || !keyPath || statSync(keyPath).mode & 0o077)
    throw new Error();
  const sealed = JSON.parse(readFileSync(envelopePath, 'utf8'));
  if (
    sealed.version !== 1 ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      sealed.id,
    )
  )
    throw new Error();
  for (const name of ['wrappedKey', 'iv', 'tag', 'ciphertext'])
    if (
      typeof sealed[name] !== 'string' ||
      sealed[name].length > 24000 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(sealed[name])
    )
      throw new Error();
  const key = privateDecrypt(
    {
      key: readFileSync(keyPath),
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(sealed.wrappedKey, 'base64'),
  );
  let plaintext;
  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(sealed.iv, 'base64'),
    );
    decipher.setAAD(Buffer.from(`mcclinic-synthetic-mailbox:v1:${sealed.id}`));
    decipher.setAuthTag(Buffer.from(sealed.tag, 'base64'));
    plaintext = Buffer.concat([
      decipher.update(Buffer.from(sealed.ciphertext, 'base64')),
      decipher.final(),
    ]);
    JSON.parse(plaintext.toString());
    const directory = resolve('.local/staging-mailbox');
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    writeFileSync(resolve(directory, `${sealed.id}.json`), plaintext, {
      flag: 'wx',
      mode: 0o600,
    });
    console.info(
      'Recovered synthetic message in .local/staging-mailbox; no token printed.',
    );
  } finally {
    key.fill(0);
    plaintext?.fill(0);
  }
} catch {
  console.error(
    'Synthetic mailbox decryption failed; private key, message and existing files preserved.',
  );
  process.exitCode = 1;
}
