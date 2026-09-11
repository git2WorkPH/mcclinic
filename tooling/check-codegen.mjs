import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const files = ['packages/graphql-contract/src/server.generated.ts', 'packages/graphql-contract/src/operations.generated.ts'];
const before = files.map(file => readFileSync(file, 'utf8'));
const result = spawnSync('pnpm', ['codegen'], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);
if (files.some((file, index) => readFileSync(file, 'utf8') !== before[index])) {
  console.error('Generated contracts were stale. Review the regenerated files and commit them with their schema/documents.');
  process.exitCode = 1;
}
