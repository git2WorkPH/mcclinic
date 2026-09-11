import type { CodegenConfig } from '@graphql-codegen/cli';
const config: CodegenConfig = {
  schema: ['packages/graphql-contract/schema.graphql', 'packages/graphql-contract/mvp.graphql'],
  documents: ['packages/graphql-contract/status.graphql', 'packages/graphql-contract/operations/*.graphql'],
  generates: {
    'packages/graphql-contract/src/server.generated.ts': { plugins: ['typescript', 'typescript-resolvers'] },
    'packages/graphql-contract/src/operations.generated.ts': { plugins: ['typescript', { 'typescript-operations': { importSchemaTypesFrom: './packages/graphql-contract/src/server.generated.ts', emitLegacyCommonJSImports: false, importExtension: '.js', namespacedImportName: 'SchemaTypes', scalars: { ID: { input: 'string', output: 'string' } } } }, 'typed-document-node'] },
  },
};
export default config;
