import { mkdirSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
mkdirSync('.local/packaged', { recursive: true, mode: 0o700 });
for (const name of ['db-password', 'demo-password']) {
  try {
    writeFileSync(
      '.local/packaged/' + name,
      randomBytes(24).toString('base64url'),
      { flag: 'wx', mode: 0o600 },
    );
    console.info('Created ' + name);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    console.info('Preserved existing ' + name);
  }
}
