# TASK-003 MVP acceptance — Identity and explicit permissions

Decision: Completed — development MVP only, 2026-09-11. Owner approval and v0.2-MVP exception remain in the [task](../Tasks/Completed/TASK-003.md). Production findings remain Open.
Requirements: [REQ-FOUND-003](../Requirements/Foundation/REQ-FOUND-003.md) v0.1 AC-01–AC-03; [REQ-FOUND-004](../Requirements/Foundation/REQ-FOUND-004.md) v0.1 AC-01–AC-03

## Criterion evidence
- AC-01: Applicable linked functional rules implemented under MVP assumptions. Valid login, generic failed login, missing/expired/revoked sessions, role denials at API and use-case boundaries; browser reception/clinician/admin roles.
- AC-02: Relevant data, permission, audit, validation, failure and concurrency checks are included in [executed verification](MVP-VERIFICATION.md); no production policy is inferred.
- AC-03: Reviewed inward dependencies, generated contracts, preserved foundation behavior/tests and additive schema. [Change justification](../../Doc/Changes/Justification/TASK-003-change.md) covers implementation and test classification. Owner commits are preserved; no new deletion authorized or performed.

Implementation areas: `apps/api/src/modules/identity; apps/api/src/application/context.ts; apps/api/src/adapters/mvp-graphql.ts`.

Review scope: owner commits 3194f5e/55cf441 plus verification follow-up; exact shared commands/results and material limits are recorded in MVP-VERIFICATION.md. Test counts are shared suite counts, not independent per-task suites. Open questions are the original linked findings and production policies, not blockers for synthetic local use.
