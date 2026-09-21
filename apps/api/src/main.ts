import { loadLocalEnvironment } from './runtime/local-environment.js';
loadLocalEnvironment();
import { createApp } from './app.js';
import { readConfig } from './config.js';
const config = readConfig(process.env);
const server = createApp().listen(config.PORT, config.HOST, () => {
  console.info(`API listening on http://${config.HOST}:${config.PORT}`);
});
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => server.close(() => process.exit(0)));
}
