
# TASK-014 development MVP justification
Task: Documentation/Tasks/Completed/TASK-014.md. Owner authorized all tasks and reversible MVP defaults on 2026-09-10.
Requirements: [REQ-FEAT-009](../../../Documentation/Requirements/Features/REQ-FEAT-009.md) v0.1 AC-01–AC-03
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
Run lint/typecheck/codegen drift, unit/integration/browser checks and builds with Node 24.21.0. Migrate/restore into isolated synthetic databases. Preserve failing evidence and repair implementation. Stop local processes to recover; no destructive cleanup. Results and remaining production findings go in Documentation/Acceptance/TASK-014-acceptance.md.

## Final evidence — 2026-09-11
Completed for development MVP; see `Documentation/Acceptance/TASK-014-acceptance.md` and shared `MVP-VERIFICATION.md`. Existing tests KEEP; new scenarios ADD. No new removal. Production findings remain Open.
