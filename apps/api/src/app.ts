import express from 'express';
import { createSchema, createYoga } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import type { Resolvers } from '../../../packages/graphql-contract/src/server.generated.js';
import { getSystemStatus } from './modules/system/application/get-system-status.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  const resolvers: Resolvers = { Query: { systemStatus: () => getSystemStatus() } };
  const yoga = createYoga({
    schema: createSchema({
      typeDefs: readFileSync(new URL('../../../packages/graphql-contract/schema.graphql', import.meta.url), 'utf8'),
      resolvers,
    }),
    graphqlEndpoint: '/graphql', graphiql: false, maskedErrors: true,
    logging: false,
  });
  app.use(yoga.graphqlEndpoint, yoga);
  app.get('/health/live', (_request, response) => response.json({ status: 'alive' }));
  return app;
}
