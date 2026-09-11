# TASK-012 MVP acceptance — Clinical document adapter

Decision: Completed — development MVP only, 2026-09-11. Owner approval and v0.2-MVP exception remain in the [task](../Tasks/Completed/TASK-012.md). Production findings remain Open.
Requirements: [REQ-FOUND-007](../Requirements/Foundation/REQ-FOUND-007.md) v0.1 AC-01–AC-03

## Criterion evidence
- AC-01: Applicable linked functional rules implemented under MVP assumptions. Renderer port separates template from use case. Patient/issuer/version snapshots, HTML escaping, selected issued version, print request/cancel audit. Browser iframe and five-page A4 layout.
- AC-02: Relevant data, permission, audit, validation, failure and concurrency checks are included in [executed verification](MVP-VERIFICATION.md); no production policy is inferred.
- AC-03: Reviewed inward dependencies, generated contracts, preserved foundation behavior/tests and additive schema. [Change justification](../../Doc/Changes/Justification/TASK-012-change.md) covers implementation and test classification. Owner commits are preserved; no new deletion authorized or performed.

Implementation areas: `apps/api/src/clinical-document/application/documents.ts; infrastructure/html-renderer.ts; apps/clinical-app/src/mvp/DocumentPanel.tsx`.

Review scope: owner commits 3194f5e/55cf441 plus verification follow-up; exact shared commands/results and material limits are recorded in MVP-VERIFICATION.md. Test counts are shared suite counts, not independent per-task suites. Open questions are the original linked findings and production policies, not blockers for synthetic local use.
