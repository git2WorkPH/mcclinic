# Development MVP verification — 2026-09-11

Scope: TASK-002–014 and TASK-016–019, requirements v0.2-MVP; TASK-001 foundation and TASK-015 lab design remain completed. Reviewed owner commits 3194f5e and 55cf441 plus current verification/docs diff on task/TASK-002-development-mvp. No production or native-platform completion claim.

## Executed evidence

Node 24.21.0 / pnpm 10.34.5, macOS, Docker PostgreSQL 17.6-alpine, Chromium 153 via Playwright 1.63.0. Local listeners and containers required approved sandbox escalation.

| Command | Result |
| --- | --- |
| `pnpm check` | Pass: Oxlint + dependency boundaries, TypeScript, 5 preserved unit/API tests, API and web builds |
| `pnpm test:mvp` | Pass: 9 PostgreSQL/API scenarios, including certificate amendments, history page consistency, concurrency, permissions, audit rollback and restore |
| `pnpm test:mvp:web` | Pass: 3 browser scenarios (integrated journey, administrator permissions/audit, long print layout) |
| `pnpm test:integration` | Pass: 1 preserved foundation PostgreSQL test |
| `pnpm test:web` | Pass: 2 preserved foundation browser tests |
| `node tooling/check-codegen.mjs` | Pass: generated contracts match additive schemas/operations |
| `pnpm exec tsx tooling/verify-mvp-runtime.ts` | Pass: fresh and repeated migrate deploy, compiled API database readiness |
| `docker build -f infrastructure/docker/Dockerfile.api -t ehr-api:mvp-verified .` | Pass: clean frozen install, codegen, Prisma generation and compiled API image; no deployment |
| `pdfinfo test-results/mvp/long-certificate.pdf` | Five A4 pages, no PDF JavaScript |

The clinical workspace screenshot was visually inspected: readable patient/search/profile layout, explicit identity and version, role tabs and demo banner. Browser tests verify full long-certificate content in DOM, no horizontal overflow and multipage PDF. PDF text extraction was not run successfully (pdftotext unavailable); physical printer, margins on specific hardware and print completion are not verified. Print audit records intent/dialog return, not delivery.

## Review and limitations

Application permission checks reside in use cases, Prisma in adapters, contract generation is reproducible. Writes, revisions, audit and retry receipts share a transaction; optimistic versions and PostgreSQL overlap constraints protect concurrent writes. No delete/purge API exists. Existing test assertions and foundation endpoints remain intact. Additive tests corrected a synchronous-throw assertion without changing its denial expectation.

Owner commit 55cf441 includes starter removals and credential/config/branding edits; these were already committed on resume and were not performed, restaged or reverted by this review. Historical local credential examples remain under the deletion rule; the runbook adds corrected Compose and seed guidance. Do not treat historical examples as production credentials or the runbook as verified legal/privacy policy.

Docker generation emitted an OpenSSL detection warning, but client generation/build succeeded. The verified compiled runtime uses the JavaScript PostgreSQL adapter on the host. Docker image runtime/migration operation is not approved for production; image default preserves the foundation entry point. Remote CI has not been executed by this session.

FIND-001–008 remain unresolved production decisions as applicable; MVP assumptions are provisional. Laboratory runtime, native platforms, jurisdiction-specific templates/signatures, production identity, encryption/key management, retention and disaster recovery remain production work. No deployment/push or new deletion occurred in this completion diff.

Decision: implementation accepted as a local synthetic-data development MVP. This is engineering completion under the owner's scope, not owner UAT acceptance or production readiness. Per-task records map scope to evidence.

Final rerun notes: codegen initially detected owner-applied formatting drift; canonical regeneration preserved schema types and a second drift check passed. Foundation browser startup initially encountered the owner’s port 4000 listener; dedicated ports 4188/5188 isolate the unchanged tests. No owner process was stopped.
