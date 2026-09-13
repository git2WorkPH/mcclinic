import type { Server } from 'node:http';
import { setTimeout, clearTimeout } from 'node:timers';

export function drainServer(server: Server, disconnect: () => Promise<void>, timeoutMs = 15000): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => server.closeAllConnections(), timeoutMs);
    server.close(error => {
      clearTimeout(timeout);
      void disconnect().then(() => error ? reject(error) : resolve(), reject);
    });
    server.closeIdleConnections();
  });
}
