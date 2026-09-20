import {
  mkdirSync,
  openSync,
  writeFileSync,
  readFileSync,
  fsyncSync,
  closeSync,
} from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { sessionCookiePolicy } from '../adapters/session-cookie.js';
import {
  syntheticRecipientPolicy,
  type IdentitySink,
} from '../modules/onboarding/infrastructure/outbox.js';

// Private EFS access point only; never mount this directory in the web assets bucket.
export function stagingSyntheticSink(
  state: string,
  origin: string,
  domains: readonly string[],
): IdentitySink {
  sessionCookiePolicy(origin);
  const validate = syntheticRecipientPolicy(domains);
  const directory = join(state, 'mailbox');
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  return async (id, input) => {
    z.string().uuid().parse(id);
    const message = validate(input);
    const contents = JSON.stringify({
      ...message,
      link: `${origin}/clinic#${message.kind.toLowerCase()}=${message.token}`,
    });
    const path = join(directory, `${id}.json`);
    let fd: number;
    try {
      fd = openSync(path, 'wx', 0o600);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      if (readFileSync(path, 'utf8') !== contents)
        throw new Error('Synthetic sink conflict.');
      return;
    }
    try {
      writeFileSync(fd, contents);
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    const directoryFd = openSync(directory, 'r');
    try {
      fsyncSync(directoryFd);
    } finally {
      closeSync(directoryFd);
    }
  };
}
