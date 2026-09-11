# TASK-022 — Versioned document templates acceptance
Status: Completed for development SaaS, 2026-09-12.
Requirement: [REQ-FEAT-014](../Requirements/Features/REQ-FEAT-014.md), v0.3 AC-01–04.
## Evidence
- AC-01: Guided allowlisted sections/layout and synthetic full-document preview; draft/publish versions, preserved published revisions, issue-time age/address and immutable populated/rendered snapshots. Invalid tokens/markup/missing fields and cross-tenant printing denied; previous versions unchanged after branding/template edits and amendments.
- AC-02: Server permissions, malformed input/tenant denial and concurrency covered by the applicable scenarios in [shared verification](SAAS-VERIFICATION.md).
- AC-03: Existing versions/audit/records and original regressions retained; migration and snapshot tests passed. No removal approved or performed.
- AC-04: Shared commands/results record lint/type/build/API/database/browser evidence. Production findings remain Open.
Code areas: `apps/api/src/modules/templates; apps/api/src/clinical-document; apps/clinical-app/src/mvp/PracticeSettings.tsx`.
Review scope: base 6be71e2 plus the current ordered SaaS diff. Rationale: [change justification](../../Doc/Changes/Justification/TASK-022-saas.md). Task: [canonical completed record](../Tasks/Completed/TASK-022.md).
Limitations: [FIND-010](../Assessment/Findings/FIND-010.md), original production findings and shared review limits. No production/clinical/legal certification.
