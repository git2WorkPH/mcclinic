
# TASK-016 development MVP justification
Task: Documentation/Tasks/Completed/TASK-016.md. Owner authorized all tasks and reversible MVP defaults on 2026-09-10.
Requirements: [REQ-PROD-001](../../../Documentation/Requirements/Product/REQ-PROD-001.md) v0.1 AC-01–AC-03
Baseline: linked v0.1 history plus v0.2-MVP overlay and MVP_ASSUMPTIONS.md.
Status: Planned/in progress; no completion until evidence.

## Problem / chosen change
At d5edb20 only foundation and lab design exist. Implement this task's previously approved scope using actual PostgreSQL/Prisma persistence, explicit inward ports, authenticated use cases and desktop React Native Web UI. Common transaction/version/print mechanisms serve identified consumers, not a catch-all domain package. Generated contracts derive from schema/documents.

## Expected impact
Feature-owned apps/api/src/modules and adapters; shared clinical-document version mechanism where applicable; API composition/GraphQL, Prisma schema/additive migrations; apps/clinical-app MVP features; codegen, tooling and tests. Dependencies/config are pinned. Protected workflows are additive under /mvp/graphql and /clinic so the existing foundation endpoints/UI/tests remain supported.

## Test decisions
KEEP all existing foundation tests, APIs and UI (root). ADD unit validation/permissions/state tests, PostgreSQL migration/constraints/atomic audit/rollback/concurrency/idempotency/backup tests, GraphQL denied/tampered/session cases and real browser patient→consultation→documents/printing→scheduling/history journey. No test weakening, skipping or removal. Generated output may be regenerated only from additive schema/docs.

## Deletion inventory
None. No code/test/field/endpoint/behavior is removed. Existing App and foundation API remain available. Record lifecycle relocation preserves history. Preserve user skill edits and leave any starter deletions unstaged. No purge/reset/drop of existing clinic data.

## Verification and recovery
Run lint/typecheck/codegen drift, unit/integration/browser checks and builds with Node 24.21.0. Migrate/restore into isolated synthetic databases. Preserve failing evidence and repair implementation. Stop local processes to recover; no destructive cleanup. Results and remaining production findings go in Documentation/Acceptance/TASK-016-acceptance.md.

## Verification follow-up — 2026-09-11
ADD certificate amendment/snapshot and history paging/source navigation assertions without removing existing coverage. Browser review found a live development API on port 4000 could receive test requests. Give the isolated test API an OS-assigned port and pass its URL to Vite; retain the default development proxy. Preserve owner commits and current branding/configuration. Re-run database/browser/build checks before completion.

## Final evidence — 2026-09-11
Completed for development MVP; see `Documentation/Acceptance/TASK-016-acceptance.md` and shared `MVP-VERIFICATION.md`. Existing tests KEEP; new scenarios ADD. No new removal. Production findings remain Open.

Generated contract review: owner formatting of server.generated.ts differed from the canonical generator. Regenerated from unchanged schemas/config, preserving the same exported types/fields; no hand patch. Drift check rerun after regeneration.

Foundation regression isolation: KEEP both original browser assertions. The suite could not start while the owner's API occupied port 4000. Configure dedicated test API/web ports with explicit Vite target, retaining root foundation behavior and leaving the owner's processes untouched. Re-run before claiming final verification.
