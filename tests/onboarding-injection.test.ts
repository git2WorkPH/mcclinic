import { expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from '../apps/api/src/app';
import { createDatabase } from '../apps/api/src/infrastructure/prisma/database';
import { composeMvp } from '../apps/api/src/mvp-composition';
import { installMvpGraphql } from '../apps/api/src/adapters/mvp-graphql';
import { print } from 'graphql';
import { RegisterAccountDocument } from '../packages/graphql-contract/src/operations.generated';

it('GraphQL calls the injected onboarding use case without accessing persistence', async () => {
  // Deliberately unavailable database: success requires the injected use case.
  const db = createDatabase(
    'postgresql://synthetic:synthetic@127.0.0.1:1/mcclinic',
  );
  const services = composeMvp(db);
  const register = vi.fn().mockResolvedValue(undefined);
  services.onboarding.register = register;
  services.identity.resolve = async () => null;
  const app = createApp();
  installMvpGraphql(app, db, undefined, services);
  const server = await new Promise<Server>((resolve, reject) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
    listener.on('error', reject);
  });
  try {
    const input = {
      email: 'synthetic@example.test',
      name: 'Synthetic Doctor',
      password: 'synthetic-password',
      practiceName: 'Synthetic Clinic',
    };
    const response = await fetch(
      `http://127.0.0.1:${(server.address() as AddressInfo).port}/mvp/graphql`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: print(RegisterAccountDocument),
          variables: { input },
        }),
      },
    );
    expect(await response.json()).toEqual({ data: { registerAccount: true } });
    expect(register).toHaveBeenCalledExactlyOnceWith(input);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await db.$disconnect();
  }
});
