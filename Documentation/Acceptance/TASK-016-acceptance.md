# TASK-016 MVP acceptance — Integrated desktop clinician journey

Decision: Completed — development MVP only, 2026-09-11. Owner approval and v0.2-MVP exception remain in the [task](../Tasks/Completed/TASK-016.md). Production findings remain Open.
Requirements: [REQ-PROD-001](../Requirements/Product/REQ-PROD-001.md) v0.1 AC-01–AC-03

## Criterion evidence
- AC-01: Applicable linked functional rules implemented under MVP assumptions. Real isolated PostgreSQL-backed reception registration/profile/schedule/check-in followed by clinician notes, amendments, documents, preview/print and history. Reload persists data. Admin audit and no clinical tabs. Separate OS-assigned test API avoids the running development API.
- AC-02: Relevant data, permission, audit, validation, failure and concurrency checks are included in [executed verification](MVP-VERIFICATION.md); no production policy is inferred.
- AC-03: Reviewed inward dependencies, generated contracts, preserved foundation behavior/tests and additive schema. [Change justification](../../Doc/Changes/Justification/TASK-016-change.md) covers implementation and test classification. Owner commits are preserved; no new deletion authorized or performed.

Implementation areas: `apps/clinical-app/src/mvp; tests/mvp-web; tooling/run-mvp-browser.ts`.

Review scope: owner commits 3194f5e/55cf441 plus verification follow-up; exact shared commands/results and material limits are recorded in MVP-VERIFICATION.md. Test counts are shared suite counts, not independent per-task suites. Open questions are the original linked findings and production policies, not blockers for synthetic local use.
