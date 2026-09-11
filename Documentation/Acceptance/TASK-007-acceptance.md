# TASK-007 MVP acceptance — Consultation lifecycle

Decision: Completed — development MVP only, 2026-09-11. Owner approval and v0.2-MVP exception remain in the [task](../Tasks/Completed/TASK-007.md). Production findings remain Open.
Requirements: [REQ-FEAT-003](../Requirements/Features/REQ-FEAT-003.md) v0.1 AC-01–AC-03

## Criterion evidence
- AC-01: Applicable linked functional rules implemented under MVP assumptions. Create/list consultation, finalize required note then close, author restriction and clinical role denial; browser encounter creation.
- AC-02: Relevant data, permission, audit, validation, failure and concurrency checks are included in [executed verification](MVP-VERIFICATION.md); no production policy is inferred.
- AC-03: Reviewed inward dependencies, generated contracts, preserved foundation behavior/tests and additive schema. [Change justification](../../Doc/Changes/Justification/TASK-007-change.md) covers implementation and test classification. Owner commits are preserved; no new deletion authorized or performed.

Implementation areas: `apps/api/src/modules/consultation; apps/clinical-app/src/mvp/PatientWorkspace.tsx`.

Review scope: owner commits 3194f5e/55cf441 plus verification follow-up; exact shared commands/results and material limits are recorded in MVP-VERIFICATION.md. Test counts are shared suite counts, not independent per-task suites. Open questions are the original linked findings and production policies, not blockers for synthetic local use.
