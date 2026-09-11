# TASK-021 — Practice branding acceptance
Status: Completed for development SaaS, 2026-09-12.
Requirement: [REQ-FEAT-013](../Requirements/Features/REQ-FEAT-013.md), v0.3 AC-01–04.
## Evidence
- AC-01: Practice-specific system name, PNG/JPEG logo, contact/address and supported accessible colors. Administrator/manager permission and expected version required. Browser verifies persistent name/logo/theme and header updates; issued snapshots retain old branding.
- AC-02: Server permissions, malformed input/tenant denial and concurrency covered by the applicable scenarios in [shared verification](SAAS-VERIFICATION.md).
- AC-03: Existing versions/audit/records and original regressions retained; migration and snapshot tests passed. No removal approved or performed.
- AC-04: Shared commands/results record lint/type/build/API/database/browser evidence. Production findings remain Open.
Code areas: `apps/api/src/modules/practice/application/settings.ts; apps/clinical-app/src/mvp/PracticeSettings.tsx; MvpApp.tsx`.
Review scope: base 6be71e2 plus the current ordered SaaS diff. Rationale: [change justification](../../Doc/Changes/Justification/TASK-021-saas.md). Task: [canonical completed record](../Tasks/Completed/TASK-021.md).
Limitations: [FIND-010](../Assessment/Findings/FIND-010.md), original production findings and shared review limits. No production/clinical/legal certification.
