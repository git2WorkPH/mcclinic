import type { CodegenConfig } from '@graphql-codegen/cli';
const config: CodegenConfig = {
  schema: 'packages/graphql-contract/schema.graphql',
  documents: 'packages/graphql-contract/*.graphql',
  generates: {
    'packages/graphql-contract/src/server.generated.ts': { plugins: ['typescript', 'typescript-resolvers'] },
    'packages/graphql-contract/src/operations.generated.ts': { plugins: ['typescript', 'typescript-operations', 'typed-document-node'] },
  },
};
export default config;
