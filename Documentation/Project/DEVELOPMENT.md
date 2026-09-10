# Local development
TASK-001 foundation. No clinical workflow, authentication, patient data or production deployment is available yet.

## Runtime and install
Use Node `24.21.0` (`nvm install && nvm use`) and pnpm `10.34.5` (`npm install --global pnpm@10.34.5`). Versions are pinned consistently in `.nvmrc`, `.node-version`, package.json, CI and the API Dockerfile.

```sh
pnpm install --frozen-lockfile
pnpm codegen
pnpm check
pnpm dev:api
# In another terminal:
pnpm dev:web
```

Open http://127.0.0.1:5173. The React Native component shell uses React Native Web through Vite; native packaging and platform support have not been validated. The status query has no protected data. API liveness is not database readiness. Production authentication/authorization must precede protected routes.

## Verification
```sh
node tooling/check-codegen.mjs
pnpm test:integration
pnpm exec playwright install chromium
pnpm test:web
```

Database checks require a running Docker daemon. A failure to start containers fails the test; it is never silently skipped. Tests use isolated synthetic containers, not a clinic database. `pnpm lint` includes an AST import-boundary check for API inner layers. CI runs the same checks; CI configuration presence is not evidence a remote CI run succeeded.

## PostgreSQL development service
Set `POSTGRES_PASSWORD` in your local shell to a development-only value, then:

```sh
docker compose -f infrastructure/docker/compose.yaml up -d postgres
```

The service binds only to loopback and stores data in a named volume. No default password is embedded. Do not run volume deletion or destructive cleanup. Real patient data is prohibited in this development environment. Residency, backup/retention and production protection policies remain FIND-006 decisions.

## API container
```sh
docker build -f infrastructure/docker/Dockerfile.api -t ehr-api:local .
docker run --rm -p 127.0.0.1:4000:4000 ehr-api:local
```

The image is a development foundation, not an approved production deployment. Review deployment hardening separately when authorized.

## Technical references
- [GraphQL Yoga documentation](https://the-guild.dev/graphql/yoga-server/docs)
- [Prisma upgrade/configuration documentation](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7) for the pending persistence task; no Prisma implementation is claimed by TASK-001.
