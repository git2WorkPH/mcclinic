import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './infrastructure/prisma/generated/client.js';
import { stagingConfig } from './runtime/staging-config.js';
import { stagingApp } from './runtime/staging-app.js';
import { stagingSyntheticSink } from './runtime/staging-sink.js';
import { drainServer } from './runtime/drain.js';
import {
  awsKeyUnwrapper,
  loadKmsKeyring,
} from './modules/onboarding/infrastructure/kms-keyring.js';
import { installPreparedKeyring } from './modules/onboarding/infrastructure/keyring.js';
import { deliverOutboxOnce } from './modules/onboarding/infrastructure/outbox.js';

async function start() {
  const config = stagingConfig(process.env);
  installPreparedKeyring(
    await loadKmsKeyring(
      JSON.parse(process.env.IDENTITY_KMS_ENVELOPE ?? ''),
      awsKeyUnwrapper(process.env.IDENTITY_KMS_ALLOW_NETWORK === 'true'),
    ),
  );
  const database = new PrismaClient({ adapter: new PrismaPg(config.database) });
  await database.user.count();
  const sink = stagingSyntheticSink(
    config.state,
    config.origin,
    config.domains,
  );
  let draining = false;
  let delivering: Promise<unknown> | undefined;
  const timer = setInterval(() => {
    if (!draining && !delivering)
      delivering = deliverOutboxOnce(database, sink)
        .catch(() => {
          console.error('Synthetic delivery unavailable; intents retained.');
        })
        .finally(() => {
          delivering = undefined;
        });
  }, 1000);
  const server = stagingApp(database, config, () => draining).listen(
    config.port,
    '0.0.0.0',
  );
  server.requestTimeout = 30000;
  server.headersTimeout = 10000;
  for (const signal of ['SIGINT', 'SIGTERM'] as const)
    process.once(signal, () => {
      if (draining) return;
      draining = true;
      clearInterval(timer);
      void drainServer(server, async () => {
        await delivering;
        await database.$disconnect();
      }).catch(() => {
        process.exitCode = 1;
      });
    });
}
// Never emit SDK, Prisma or configuration exceptions containing injected secret values.
start().catch(() => {
  console.error(
    'Synthetic staging startup failed; inspect configuration through the authorized operator channel.',
  );
  process.exitCode = 1;
});
