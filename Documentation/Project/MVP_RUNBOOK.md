# Development MVP runbook

Local synthetic data only. Production findings remain Open; read [MVP assumptions](MVP_ASSUMPTIONS.md). Never enter real patient information. Native platforms and production deployment are outside this MVP.

## Start

Use Node 24.21.0, pnpm 10.34.5 and running Docker Desktop. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm db:generate
# Choose local-only passwords; keep these exports in both API/setup terminals.
export POSTGRES_PASSWORD='sql'
export DEMO_PASSWORD='d0ntg8sick!!'
export DATABASE_URL="postgresql://postgres:${POSTGRES_PASSWORD}@127.0.0.1:5432/mcclinic"
export MVP_SYNTHETIC_ONLY=true
docker compose -f infrastructure/docker/compose.yaml up -d postgres
# Wait for the service to be healthy, then:
pnpm db:migrate
pnpm db:seed
pnpm dev:mvp
# In another terminal:
pnpm dev:web
```

Use URL-safe database password characters (letters, numbers, hyphens); otherwise percent-encode the password in DATABASE_URL. Open `http://127.0.0.1:5173/clinic`. Accounts are `clinician`, `reception`, and `admin` with the chosen DEMO_PASSWORD. Seed creates absent accounts and never overwrites an existing password. Credentials belong only in your local shell or an ignored environment file; do not commit them. Sessions expire after eight hours; sign out revokes them on the server.

The original `/` foundation page and public `/graphql` status API are preserved. Clinical workflows use the protected `/mvp/graphql` API. API readiness: `http://127.0.0.1:4000/health/ready`. Stop foreground processes with Ctrl-C; the named database volume persists. Never use volume-removal or purge commands.

## Backup and restore rehearsal

Backups contain synthetic records and audit history; keep them outside Git with restricted filesystem access. Take a custom-format backup:

```sh
umask 077
mkdir -p /tmp/ehr-mvp-backups
docker compose -f infrastructure/docker/compose.yaml exec -T postgres pg_dump -U ehr_dev -d ehr_dev -Fc > /tmp/ehr-mvp-backups/ehr-demo.dump
# Restore only to a NEW empty database; do not overwrite the working database.
docker compose -f infrastructure/docker/compose.yaml exec -T postgres createdb -U ehr_dev ehr_restore_rehearsal
docker compose -f infrastructure/docker/compose.yaml exec -T postgres pg_restore -U ehr_dev -d ehr_restore_rehearsal --exit-on-error < /tmp/ehr-mvp-backups/ehr-demo.dump
```

Use a fresh database name for each rehearsal. Verify patient, revision and audit counts before considering a backup usable. This is a development rehearsal, not a production retention, encryption, disaster-recovery or compliance policy. No automatic deletion is implemented.

## Verify

```sh
pnpm db:generate
node tooling/check-codegen.mjs
pnpm check
pnpm test:integration
pnpm test:mvp
pnpm exec playwright install chromium
pnpm test:web
pnpm test:mvp:web
```

Database/browser MVP tests create isolated synthetic PostgreSQL containers. The MVP browser runner uses ports 4000 and 5174; stop any conflicting development servers first. Browser printing opens the browser/OS print dialog; audit records a request/dialog return, never proof of physical printing.
