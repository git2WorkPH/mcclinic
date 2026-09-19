import { readFileSync } from 'node:fs';
import { isAbsolute } from 'node:path';
import {
  awsKeyUnwrapper,
  loadKmsKeyring,
} from './modules/onboarding/infrastructure/kms-keyring.js';
import { installPreparedKeyring } from './modules/onboarding/infrastructure/keyring.js';
import {
  outboxDelivery,
  deliverOutboxOnce,
  syntheticFileSink,
} from './modules/onboarding/infrastructure/outbox.js';
import { mkdirSync } from 'node:fs';
import { createApp } from './app.js';
import { createDatabase } from './infrastructure/prisma/database.js';
import { installMvpGraphql } from './adapters/mvp-graphql.js';
import { packagedConfig } from './runtime/packaged-config.js';
import { drainServer } from './runtime/drain.js';
import { packagedDelivery } from './runtime/packaged-delivery.js';

const config = packagedConfig(process.env);
if (process.env.IDENTITY_KMS_ENVELOPE_FILE) {
  if (
    !isAbsolute(process.env.IDENTITY_KMS_ENVELOPE_FILE) ||
    process.env.IDENTITY_KEYRING_FILE
  )
    throw new Error(
      'Choose one absolute wrapped key envelope; local keyring cannot be combined.',
    );
  const provider = awsKeyUnwrapper(
    process.env.IDENTITY_KMS_ALLOW_NETWORK === 'true',
  );
  installPreparedKeyring(
    await loadKmsKeyring(
      JSON.parse(readFileSync(process.env.IDENTITY_KMS_ENVELOPE_FILE, 'utf8')),
      provider,
    ),
  );
}
mkdirSync(config.state, { recursive: true, mode: 0o700 });
const database = createDatabase(config.databaseUrl);
// Fail startup if PostgreSQL or the applied schema is unavailable.
await database.user.count();
const app = createApp();
let draining = false;
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (draining) {
    res.status(503).json({ error: 'Service is shutting down.' });
    return;
  }
  next();
});
const durableDelivery = process.env.IDENTITY_DELIVERY_MODE === 'outbox';
if (
  process.env.IDENTITY_DELIVERY_MODE &&
  !['outbox', 'mailbox'].includes(process.env.IDENTITY_DELIVERY_MODE)
)
  throw new Error('Unsupported identity delivery mode.');
const domains = (process.env.IDENTITY_SYNTHETIC_DOMAINS ?? '')
  .split(',')
  .filter(Boolean);
const delivery = durableDelivery
  ? outboxDelivery(domains)
  : packagedDelivery(config.state, config.origin);
const sink = durableDelivery
  ? syntheticFileSink(config.state, config.origin, domains)
  : null;
let delivering: Promise<unknown> | undefined;
const deliveryTimer = sink
  ? setInterval(() => {
      if (!delivering && !draining)
        delivering = deliverOutboxOnce(database, sink)
          .catch(() => {
            console.error(
              'Identity delivery worker unavailable; persisted intents retained.',
            );
          })
          .finally(() => {
            delivering = undefined;
          });
    }, 1000)
  : undefined;
installMvpGraphql(
  app,
  database,
  delivery,
  undefined,
  process.env.IDENTITY_COOKIE_ORIGIN
    ? { cookieOrigin: process.env.IDENTITY_COOKIE_ORIGIN }
    : {},
);
const server = app.listen(config.port, '0.0.0.0', () =>
  console.info('Synthetic packaged API ready.'),
);
server.requestTimeout = 30000;
server.headersTimeout = 10000;
for (const signal of ['SIGTERM', 'SIGINT'] as const)
  process.once(signal, () => {
    if (draining) return;
    draining = true;
    if (deliveryTimer) clearInterval(deliveryTimer);
    void drainServer(server, async () => {
      await delivering;
      await database.$disconnect();
    }).catch(() => {
      process.exitCode = 1;
    });
  });
