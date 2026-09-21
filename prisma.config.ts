// Packaged migration images intentionally contain no local development loader.
if (process.env.NODE_ENV !== 'production') {
  const { loadLocalEnvironment } =
    await import('./apps/api/src/runtime/local-environment.js');
  loadLocalEnvironment();
}
import { defineConfig } from 'prisma/config';
export default defineConfig({
  schema: 'apps/api/prisma/schema.prisma',
  migrations: { path: 'apps/api/prisma/migrations' },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://unused:unused@127.0.0.1:5432/mcclinic',
  },
});
