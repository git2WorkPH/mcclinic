import { readFileSync } from 'node:fs';
import { isAbsolute } from 'node:path';

export function packagedConfig(env: NodeJS.ProcessEnv) {
  if (env.APP_ENV !== 'local-container' || env.MVP_SYNTHETIC_ONLY !== 'true')
    throw new Error(
      'Packaged runtime requires APP_ENV=local-container and MVP_SYNTHETIC_ONLY=true. Staging and production are not enabled.',
    );
  const port = Number(env.PORT ?? '4000');
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('Invalid PORT.');
  if (!env.EHR_LOCAL_STATE_DIR || !isAbsolute(env.EHR_LOCAL_STATE_DIR))
    throw new Error('An absolute EHR_LOCAL_STATE_DIR is required.');
  if (!env.POSTGRES_PASSWORD_FILE || !isAbsolute(env.POSTGRES_PASSWORD_FILE))
    throw new Error('POSTGRES_PASSWORD_FILE is required.');
  let password: string;
  try {
    password = readFileSync(env.POSTGRES_PASSWORD_FILE, 'utf8').trim();
  } catch {
    throw new Error('Database secret file is unavailable.');
  }
  if (password.length < 16)
    throw new Error('Database secret must contain at least 16 characters.');
  const host = env.DB_HOST ?? 'postgres';
  if (!/^[a-zA-Z0-9.-]+$/.test(host)) throw new Error('Invalid DB_HOST.');
  const origin = new URL(env.WEB_ORIGIN ?? 'http://127.0.0.1:8080');
  if (
    origin.protocol !== 'http:' ||
    !['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname) ||
    origin.username ||
    origin.password ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash
  )
    throw new Error('WEB_ORIGIN must be a local loopback HTTP origin.');
  return {
    port,
    state: env.EHR_LOCAL_STATE_DIR,
    origin: origin.origin,
    databaseUrl: `postgresql://mcclinic:${encodeURIComponent(password)}@${host}:5432/mcclinic`,
  };
}
