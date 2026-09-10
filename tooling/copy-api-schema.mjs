import { copyFileSync, mkdirSync } from 'node:fs';
const target = new URL('../apps/api/dist/packages/graphql-contract/', import.meta.url);
mkdirSync(target, { recursive: true });
copyFileSync(new URL('../packages/graphql-contract/schema.graphql', import.meta.url), new URL('schema.graphql', target));
