# Local synthetic SaaS testing

Requires Node 24.21.0, pnpm 10.34.5 and PostgreSQL 17.6 (Docker for integration tests). This remains development-only. Do not use real patient data or activate live billing.

## Upgrade the existing local MVP

Keep your existing DATABASE_URL and database; do not change database names to follow an example or create a replacement volume. Take a backup first using the existing runbook's backup procedure adapted to your actual database/user. The SaaS migration adds a default practice and preserves existing records, versions and audit timestamps.

From the repository root, in the terminal containing your local environment:

```sh
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:migrate
export MVP_SYNTHETIC_ONLY=true
# Only if demo accounts are not yet seeded; DEMO_PASSWORD must be at least 12 characters:
pnpm db:seed
pnpm dev:mvp
```

In another terminal:

```sh
pnpm dev:web
```

Open `http://127.0.0.1:5173/clinic`. Use your existing local demo credentials (`admin`, `clinician`, `reception`). Seed never changes existing passwords. On this host the previously verified Node/pnpm runtime is `/private/tmp/ehr-runtime/node_modules/.bin`; prepend it to PATH if needed. Owner-specific connection edits in MVP_RUNBOOK.md are preserved; inspect your actual database configuration rather than copying historical credentials.

## Exercise SaaS workflows

1. Sign in as `admin`. Existing records appear in **Default practice**. Create a new synthetic practice; it starts empty on SOLO/TRIAL.
2. Open **Practice settings**. Set the system name, clinic contacts, PNG/JPEG logo (up to 100 KB) and one of the supported accessible colors. Save; the workspace header updates.
3. Add an existing synthetic account by username as clinician/reception/administrator. SOLO allows one active clinician; TEAM allows five. The server prevents removing the last active manager and enforces concurrent seat grants.
4. Choose a prescription or certificate template. Edit heading/body/footer with allowed double-brace placeholders. Live preview uses synthetic data and the document renderer. Save a draft or publish; unpublished edits do not affect the published template.
5. Sign in as `clinician`, switch into that practice, register a synthetic patient and create/issue a document. Referenced missing fields must be supplied before issue. Templates and branding are snapshotted; change them as manager and reprint the old issued version to verify it is unchanged. Amendments retain earlier versions.
6. As manager, simulate RESTRICTED. New record writes fail, while permitted reads, prints and **Export authorized records** remain available. Administrator/reception exports exclude clinical notes/documents. Set ACTIVE to recover. No payment occurs.
7. To test a solo doctor, sign in as `clinician` and create a practice. The creator retains clinician access and receives an explicit management grant, using one seat. Standard administrator role alone never grants clinical access.

Practice selection persists within the tab; switching remounts patient workspaces. Login resets selection and picks an active membership. No patient sharing, remote logo fetching, external files, offline synchronization or background billing exists. Global identity audit is kept outside practice-visible audit/export; no platform-admin endpoint is exposed.

## Verification

```sh
pnpm check
pnpm test:mvp
pnpm test:mvp:web
pnpm test:integration
pnpm test:web
node tooling/check-codegen.mjs
pnpm exec tsx tooling/verify-mvp-runtime.ts
```

Tests use isolated synthetic databases. Browser Vite port 5174, foundation test ports 4188/5188 and compiled runtime verification port 4187 must be free. The current development server can remain on port 4000.

Production findings remain Open: identity onboarding, tenant recovery/support, non-owner database roles/RLS, Philippine clinical/privacy/signature rules, payment provider and tax/refund handling, production backup/encryption/retention, scale and operational monitoring. TASK-024 is only a proposed real-payment integration. No hosting or regulatory readiness is claimed.
