import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { expect, it } from 'vitest';
it('connects to PostgreSQL and rolls back a failed synthetic transaction', async () => {
  const container = await new PostgreSqlContainer('postgres:17.6-alpine').start();
  const client = new Client({ connectionString: container.getConnectionUri() });
  try {
    await client.connect();
    expect((await client.query('SELECT 1 AS ready')).rows).toEqual([{ ready: 1 }]);
    await client.query('CREATE TEMP TABLE bootstrap_probe (id integer PRIMARY KEY)');
    await client.query('BEGIN');
    await client.query('INSERT INTO bootstrap_probe VALUES (1)');
    await expect(client.query('INSERT INTO bootstrap_probe VALUES (1)')).rejects.toThrow();
    await client.query('ROLLBACK');
    expect((await client.query('SELECT * FROM bootstrap_probe')).rows).toEqual([]);
  } finally { await client.end(); await container.stop(); }
});
