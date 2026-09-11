# TASK-006 MVP acceptance — Patient search

Decision: Completed — development MVP only, 2026-09-11. Owner approval and v0.2-MVP exception remain in the [task](../Tasks/Completed/TASK-006.md). Production findings remain Open.
Requirements: [REQ-FEAT-002](../Requirements/Features/REQ-FEAT-002.md) v0.1 AC-01–AC-03

## Criterion evidence
- AC-01: Applicable linked functional rules implemented under MVP assumptions. Full name-token search returns the correct patient; deterministic ordered paging is implemented; browser explicit search/selection and role-gated access. Complete UUID matching, no prefix claim.
- AC-02: Relevant data, permission, audit, validation, failure and concurrency checks are included in [executed verification](MVP-VERIFICATION.md); no production policy is inferred.
- AC-03: Reviewed inward dependencies, generated contracts, preserved foundation behavior/tests and additive schema. [Change justification](../../Doc/Changes/Justification/TASK-006-change.md) covers implementation and test classification. Owner commits are preserved; no new deletion authorized or performed.

Implementation areas: `apps/api/src/modules/patient; apps/api/src/infrastructure/prisma/database.ts; apps/clinical-app/src/mvp/MvpApp.tsx`.

Review scope: owner commits 3194f5e/55cf441 plus verification follow-up; exact shared commands/results and material limits are recorded in MVP-VERIFICATION.md. Test counts are shared suite counts, not independent per-task suites. Open questions are the original linked findings and production policies, not blockers for synthetic local use.
