import { mkdirSync } from 'node:fs';
import { createApp } from './app.js';
import { createDatabase } from './infrastructure/prisma/database.js';
import { installMvpGraphql } from './adapters/mvp-graphql.js';
import { packagedConfig } from './runtime/packaged-config.js';
import { drainServer } from './runtime/drain.js';
import { packagedDelivery } from './runtime/packaged-delivery.js';

const config = packagedConfig(process.env);
mkdirSync(config.state, {recursive:true, mode:0o700});
const database = createDatabase(config.databaseUrl);
// Fail startup if PostgreSQL or the applied schema is unavailable.
await database.user.count();
const app = createApp();
let draining = false;
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (draining) { res.status(503).json({error:'Service is shutting down.'}); return; }
  next();
});
installMvpGraphql(app, database, packagedDelivery(config.state, config.origin));
const server = app.listen(config.port, '0.0.0.0', () => console.info('Synthetic packaged API ready.'));
server.requestTimeout = 30000;
server.headersTimeout = 10000;
for (const signal of ['SIGTERM','SIGINT'] as const) process.once(signal, () => {
  if (draining) return;
  draining = true;
  void drainServer(server, () => database.$disconnect()).catch(() => { process.exitCode = 1; });
});
