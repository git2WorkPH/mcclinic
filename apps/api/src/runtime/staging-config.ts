import { X509Certificate } from 'node:crypto';
import { isAbsolute } from 'node:path';
import { syntheticRecipientPolicy } from '../modules/onboarding/infrastructure/outbox.js';
import { sessionCookiePolicy } from '../adapters/session-cookie.js';

// No connection strings: pg URL options must never override certificate verification.
export function stagingConfig(env: NodeJS.ProcessEnv) {
  if (env.APP_ENV !== 'synthetic-staging' || env.MVP_SYNTHETIC_ONLY !== 'true')
    throw new Error('Synthetic staging must be explicitly selected.');
  if (
    env.DATABASE_URL ||
    env.IDENTITY_KEYRING_FILE ||
    env.POSTGRES_PASSWORD_FILE
  )
    throw new Error('Local database/key overrides are forbidden in staging.');
  const origin = env.WEB_ORIGIN ?? '';
  sessionCookiePolicy(origin);
  const host = env.DB_HOST ?? '';
  if (!/^[a-zA-Z0-9.-]+$/.test(host)) throw new Error('Invalid database host.');
  const ca = env.DB_CA_PEM ?? '';
  try {
    const certs = ca.match(
      /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g,
    );
    if (!certs?.length || certs.some((pem) => !new X509Certificate(pem).ca))
      throw new Error();
  } catch {
    throw new Error('A valid database CA bundle is required.');
  }
  let password: string;
  try {
    const secret: unknown = JSON.parse(env.DB_RUNTIME_SECRET ?? '');
    if (
      !secret ||
      typeof secret !== 'object' ||
      !('username' in secret) ||
      secret.username !== 'mcclinic_runtime' ||
      !('password' in secret) ||
      typeof secret.password !== 'string' ||
      secret.password.length < 24
    )
      throw new Error();
    password = secret.password;
  } catch {
    throw new Error('Limited runtime database credentials are required.');
  }
  const originSecret = env.STAGING_ORIGIN_SECRET ?? '';
  if (!/^[A-Za-z0-9_-]{43,128}$/.test(originSecret))
    throw new Error('A strong staging origin secret is required.');
  const state = env.EHR_LOCAL_STATE_DIR ?? '';
  if (!isAbsolute(state))
    throw new Error('An absolute durable state directory is required.');
  const domains = (env.IDENTITY_SYNTHETIC_DOMAINS ?? '').split(',');
  syntheticRecipientPolicy(domains);
  const port = Number(env.PORT ?? '4000');
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('Invalid port.');
  return {
    origin,
    originSecret,
    state,
    domains,
    port,
    database: {
      host,
      port: 5432,
      database: 'mcclinic',
      user: 'mcclinic_runtime',
      password,
      max: 10,
      connectionTimeoutMillis: 5000,
      query_timeout: 5000,
      ssl: { ca, rejectUnauthorized: true as const },
    },
  };
}
