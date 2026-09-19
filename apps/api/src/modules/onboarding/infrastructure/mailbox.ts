import type { Tx } from '../../practice/infrastructure/scope.js';
import { localStateDirectory } from './local-state.js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
export interface LocalMessage {
  to: string;
  kind: string;
  token: string;
}
export type Delivery = ((message: LocalMessage) => Promise<void>) & {
  enqueue?: (tx: Tx, message: LocalMessage) => Promise<void>;
};
export const localDelivery: Delivery = async (message) => {
  const dir = resolve(localStateDirectory(), 'mailbox');
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  writeFileSync(
    resolve(dir, randomUUID() + '.json'),
    JSON.stringify(
      {
        ...message,
        link: `http://127.0.0.1:5173/clinic#${message.kind.toLowerCase()}=${message.token}`,
      },
      null,
      2,
    ),
    { mode: 0o600, flag: 'wx' },
  );
};
