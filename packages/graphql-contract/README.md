# GraphQL contract
Consumers: API resolvers use server.generated.ts; clinical-app uses operations.generated.ts. Schema and operation documents are authoritative. Run `pnpm codegen`; never hand-edit generated output. No clinical domain or persistence models belong here.
