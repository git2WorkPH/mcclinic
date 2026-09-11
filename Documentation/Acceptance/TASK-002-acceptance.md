# TASK-002 MVP acceptance — Persistence, constraints, atomic writes and restore

Decision: Completed — development MVP only, 2026-09-11. Owner approval and v0.2-MVP exception remain in the [task](../Tasks/Completed/TASK-002.md). Production findings remain Open.
Requirements: [REQ-FOUND-008](../Requirements/Foundation/REQ-FOUND-008.md) v0.1 AC-01–AC-03

## Criterion evidence
- AC-01: Applicable linked functional rules implemented under MVP assumptions. Database integration scenarios: rollback, FK/cross-patient mismatch, concurrent writes, append-only rows and pg_dump/pg_restore record-count equality. Fresh/repeated migrate deploy and compiled readiness passed.
- AC-02: Relevant data, permission, audit, validation, failure and concurrency checks are included in [executed verification](MVP-VERIFICATION.md); no production policy is inferred.
- AC-03: Reviewed inward dependencies, generated contracts, preserved foundation behavior/tests and additive schema. [Change justification](../../Doc/Changes/Justification/TASK-002-change.md) covers implementation and test classification. Owner commits are preserved; no new deletion authorized or performed.

Implementation areas: `apps/api/prisma; apps/api/src/infrastructure/prisma; tooling/verify-mvp-runtime.ts`.

Review scope: owner commits 3194f5e/55cf441 plus verification follow-up; exact shared commands/results and material limits are recorded in MVP-VERIFICATION.md. Test counts are shared suite counts, not independent per-task suites. Open questions are the original linked findings and production policies, not blockers for synthetic local use.
