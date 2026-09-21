# Local environment configuration

TASK-041 / REQ-FOUND-015 / ADR-016. Dotenv17.4.2 is pinned without changing existing transitive versions. This improves the synthetic local MVP setup; it does not change authorization, database contents or production readiness.

From the repository root, copy the example only when you do not already have `.env`:

```sh
# -n preserves an existing local file.
cp -n .env.example .env
```

Edit `.env` locally with your existing synthetic PostgreSQL credentials and database **mcclinic**. Percent-encode special characters in the database URL password. Set a development-only demo password of at least 12 characters if explicitly seeding. The example's CHANGE_ME values are placeholders, not working credentials. Do not overwrite an existing password, rename/drop a database or delete a volume as part of configuration setup.

```sh
pnpm db:generate
pnpm db:migrate
# Only if you intend to create/preserve synthetic demo accounts:
pnpm db:seed
pnpm dev:mvp
# Separate terminal:
pnpm dev:web
```

Open `http://127.0.0.1:5173/clinic`. The PostgreSQL service must already be configured/running; these commands do not provision it. Continue following the onboarding/MVP runbooks for key custody and synthetic accounts. Existing exported-variable commands still work.

## Loading and precedence

- Local `dev:api`, `dev:mvp`, compiled local `start`/`start:mvp`, Prisma CLI, seed and explicit rename command use the workspace-root `.env`, independent of shell cwd. The rename command retains all existing non-destructive guards and is not run automatically.
- Explicit process variables win, even when their value is empty. No expansion or `.env.local`/environment-specific layering is added. Quoted values/comments follow dotenv parsing. `DOTENV_CONFIG_*` cannot override the loader's precedence or turn on secret logging.
- Missing `.env` is allowed so injected-variable workflows remain compatible. Other read errors fail with a generic message, without contents. Existing synthetic-only, loopback and validation guards still run.
- `NODE_ENV=production`/`test`, truthy CI other than `false`, and non-development `APP_ENV` skip loading. Production Prisma configuration does not even import the local loader, preserving the minimal migration image. Staging/packaged entry points continue taking injected variables or their existing secret-file mechanism.
- Vite reads only `EHR_API_TARGET` from an isolated copy of the local configuration for its development proxy. Root dotenv values are not copied into Vite's process/client environment. Existing Vite application-specific public `VITE_*` behavior is unchanged: those values are public, never put credentials there.
- The currently edited `tooling/read-local-mail.ts` is unrelated owner work and was not changed. Its existing explicit environment behavior remains; custom mailbox state paths must still be supplied to that command explicitly.

`.env` files are ignored by Git and excluded from Docker builds; `.env.example` is safe tracked documentation. No actual `.env` was created, read for inspection, overwritten or committed by this task. Terraform state/plans and ignored local state/tools are excluded from the broad legacy API Docker context as well. Staging secrets remain managed/injected separately; dotenv is not a vault.

## Verification

```sh
pnpm check
pnpm exec vitest run tests/local-environment.test.ts tests/local-environment.integration.test.ts
pnpm test:infrastructure
```

The compiled-entry test requires a prior `pnpm build` (included by `pnpm check`). It creates an isolated synthetic workspace and starts a local test API; it does not edit your `.env` or connect to your database. Docker image migration regression uses the established isolated synthetic database test documented in the staging release runbook.
