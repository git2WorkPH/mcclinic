import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { rootCertificates } from 'node:tls';
import { lookup } from 'node:dns/promises';
import { it, expect } from 'vitest';

it('connects to PostgreSQL with verified TLS and rejects an unrelated CA and hostname', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'mcclinic-pg-tls-'));
  const key = join(dir, 'server.key'),
    cert = join(dir, 'server.crt');
  execFileSync(
    'openssl',
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-days',
      '1',
      '-subj',
      '/CN=localhost',
      '-addext',
      'subjectAltName=DNS:localhost,IP:127.0.0.1',
      '-addext',
      'basicConstraints=critical,CA:TRUE',
      '-keyout',
      key,
      '-out',
      cert,
    ],
    { stdio: 'ignore' },
  );
  const container = await new PostgreSqlContainer('postgres:17.6-alpine')
    .withDatabase('mcclinic')
    .withCopyFilesToContainer([
      { source: key, target: '/certs/server.key' },
      { source: cert, target: '/certs/server.crt' },
    ])
    .withEntrypoint(['/bin/sh', '-c'])
    .withCommand([
      'chown postgres:postgres /certs/server.key /certs/server.crt && chmod 600 /certs/server.key && exec docker-entrypoint.sh postgres -c ssl=on -c ssl_cert_file=/certs/server.crt -c ssl_key_file=/certs/server.key',
    ])
    .start();
  const ca = readFileSync(cert, 'utf8');
  const config = {
    host: container.getHost(),
    port: container.getPort(),
    database: 'mcclinic',
    user: container.getUsername(),
    password: container.getPassword(),
    connectionTimeoutMillis: 5000,
  };
  try {
    const valid = new Client({
      ...config,
      ssl: { ca, rejectUnauthorized: true },
    });
    try {
      await valid.connect();
      expect(
        (
          await valid.query(
            'SELECT ssl FROM pg_stat_ssl WHERE pid=pg_backend_pid()',
          )
        ).rows[0].ssl,
      ).toBe(true);
    } finally {
      await valid.end();
    }
    for (const ssl of [
      { ca: rootCertificates[0], rejectUnauthorized: true },
      { ca, rejectUnauthorized: true, servername: 'wrong.example.test' },
    ]) {
      // pg replaces SNI for DNS hosts. Connect to the resolved address so the intentionally wrong SNI is tested.
      const host = ssl.servername
        ? (await lookup(config.host, { family: 4 })).address
        : config.host;
      const invalid = new Client({ ...config, host, ssl });
      try {
        if (ssl.servername)
          await expect(invalid.connect()).rejects.toMatchObject({
            code: 'ERR_TLS_CERT_ALTNAME_INVALID',
          });
        else await expect(invalid.connect()).rejects.toThrow();
      } finally {
        await invalid.end();
      }
    }
  } finally {
    await container.stop();
  }
});
