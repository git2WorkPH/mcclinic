import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { expect, test } from 'vitest';

const require = createRequire(import.meta.url);
const prismaRequire = createRequire(require.resolve('prisma/package.json'));
const configPath = prismaRequire.resolve('@prisma/config');
const configRequire = createRequire(configPath);

test('patched Prisma config dependency safely merges circular records', async () => {
  const { deepmerge } = await import(
    pathToFileURL(configRequire.resolve('deepmerge-ts')).href
  );
  const left: Record<string, unknown> = { value: 1 };
  const right: Record<string, unknown> = { other: 2 };
  left.self = left;
  right.self = right;
  const merged = deepmerge(left, right);
  expect(merged.value).toBe(1);
  expect(merged.other).toBe(2);
  expect(merged.self).toBe(merged);
});

test('Prisma still loads the real repository configuration with the patched merger', async () => {
  const { loadConfigFromFile } = await import(pathToFileURL(configPath).href);
  const result = await loadConfigFromFile({ configFile: 'prisma.config.ts' });
  expect(result.error).toBeUndefined();
  expect(result.config.schema).toContain('apps/api/prisma/schema.prisma');
  expect(result.config.migrations.path).toContain('apps/api/prisma/migrations');
  expect(result.config.datasource.url).toBe(
    process.env.DATABASE_URL ??
      'postgresql://unused:unused@127.0.0.1:5432/mcclinic',
  );
});
