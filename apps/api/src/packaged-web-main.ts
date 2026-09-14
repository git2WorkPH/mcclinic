import { packagedWeb } from './runtime/packaged-web.js';
import { drainServer } from './runtime/drain.js';
if (
  process.env.APP_ENV !== 'local-container' ||
  process.env.MVP_SYNTHETIC_ONLY !== 'true'
)
  throw new Error('Only explicit synthetic local-container web is enabled.');
const port = Number(process.env.PORT ?? '8080');
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('Invalid PORT.');
if (!process.env.WEB_ASSETS || !process.env.API_ORIGIN)
  throw new Error('WEB_ASSETS and API_ORIGIN are required.');
const server = packagedWeb(
  process.env.WEB_ASSETS,
  process.env.API_ORIGIN,
).listen(port, '0.0.0.0');
server.requestTimeout = 30000;
server.headersTimeout = 10000;
let draining = false;
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.once(signal, () => {
    if (draining) return;
    draining = true;
    void drainServer(server, async () => {}).catch(() => {
      process.exitCode = 1;
    });
  });
