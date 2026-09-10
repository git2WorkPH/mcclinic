# TASK-001 acceptance
Reviewer/date: Codex, 2026-09-10.
Scope: full task changes from a4fce11894b8a877ac3b6cb86f51fc0186c150e0 on task/TASK-001-workspace-foundation, plus owner-authorized task-approval bookkeeping. Unexplained nested-starter deletions excluded.
Requirements: REQ-FOUND-001/002 v0.1 AC-01–03.

| Criterion | Evidence | Result |
|---|---|---|
| Workspace reproducibility | Pinned Node 24.21.0/pnpm 10.34.5/manifests/lockfile; fresh temporary-copy offline frozen install, lint/typecheck/unit tests/build | PASS |
| Express/Yoga and contracts | Status resolver invokes system use case; Code Generator typed server/client operations; runtime Zod startup validation | PASS |
| Verification/containers | Compose validation; PostgreSQL transaction smoke; web connection/failure/retry; Docker build; CI configuration | PASS locally; remote CI not run |
| Inward dependencies/shared ownership | AST boundary checker; only shared package is actual API/client GraphQL contract; no Prisma/domain leakage | PASS for present code |
| Scope and rationale | TASK-001-change.md, no clinical workflow, generated code regenerated from sources, no intended removal | PASS |

## Exact verification
Environment: macOS arm64, isolated /private/tmp/ehr-runtime Node 24.21.0 and pnpm 10.34.5; Docker 29.7.2; Chromium installed through Playwright 1.63.0. See lockfile for complete dependency versions.
- `pnpm codegen`: PASS.
- `node tooling/check-codegen.mjs`: PASS, deterministic output/no drift.
- `pnpm check`: PASS, Oxlint/import boundaries, TypeScript, 5 API/config tests, API and web builds.
- Fresh copy `/private/tmp/ehr-clean-cs6ibyw8`: `pnpm install --frozen-lockfile --offline` then `pnpm check`: PASS. Initial sandbox in-place offline attempt refused module-directory recreation; no purge performed, fresh-copy check used instead.
- `pnpm test:integration`: PASS, PostgreSQL 17.6 connection and failed transaction rollback (1 test).
- `pnpm exec playwright install chromium`, `pnpm test:web`: PASS (2 tests, actual server and failure/retry).
- Compiled API spawned with Node at port 4401 and queried through fetch: PASS; shutdown after check.
- `POSTGRES_PASSWORD=synthetic-config-check docker compose -f infrastructure/docker/compose.yaml config --quiet`: PASS.
- `docker build -f infrastructure/docker/Dockerfile.api -t ehr-api:local .`: PASS.
- `git diff --check`: PASS before final metadata review.
- Native packaging/device interaction/clinical printing: NOT RUN; no support claim and outside candidate-shell scope.
- Remote CI/push/deployment: NOT RUN; not authorized.

## Review and decision
Task approval is the owner's explicit request to implement all proposed tasks. Technical ADR-001 approach selected within that scope. Test classification ADD; no pre-existing tests existed. No tests removed, skipped or weakened. User-created version-1 and Approved task copies preserved; proposal copies retained as historical records.
TASK-001 is Completed for its bounded non-clinical foundation. TASK-002 onward remain Approved and subject to their missing policy dependencies. Detected nested starter deletions were not caused by this work, are not approved, and remain unstaged. Do not interpret this acceptance as deletion approval.
