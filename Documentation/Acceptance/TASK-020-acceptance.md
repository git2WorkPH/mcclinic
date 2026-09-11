# TASK-020 — Practice membership and tenant isolation acceptance
Status: Completed for development SaaS, 2026-09-12.
Requirement: [REQ-FOUND-010](../Requirements/Foundation/REQ-FOUND-010.md), v0.3 AC-01–04.
## Evidence
- AC-01: Additive default-practice migration; memberships/management grants; scoped repositories and composite tenant foreign keys; switching and role-limited exports. Migration preservation, forged-ID denial, role changes, solo clinician and seat-race scenarios passed.
- AC-02: Server permissions, malformed input/tenant denial and concurrency covered by the applicable scenarios in [shared verification](SAAS-VERIFICATION.md).
- AC-03: Existing versions/audit/records and original regressions retained; migration and snapshot tests passed. No removal approved or performed.
- AC-04: Shared commands/results record lint/type/build/API/database/browser evidence. Production findings remain Open.
Code areas: `apps/api/src/modules/practice; apps/api/src/infrastructure/prisma; apps/api/prisma; apps/clinical-app/src/mvp/PracticeSettings.tsx`.
Review scope: base 6be71e2 plus the current ordered SaaS diff. Rationale: [change justification](../../Doc/Changes/Justification/TASK-020-saas.md). Task: [canonical completed record](../Tasks/Completed/TASK-020.md).
Limitations: [FIND-010](../Assessment/Findings/FIND-010.md), original production findings and shared review limits. No production/clinical/legal certification.
