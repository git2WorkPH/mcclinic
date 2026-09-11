# TASK-023 — Simulated subscriptions acceptance
Status: Completed for development SaaS, 2026-09-12.
Requirement: [REQ-FEAT-015](../Requirements/Features/REQ-FEAT-015.md), v0.3 AC-01–04.
## Evidence
- AC-01: SOLO/TEAM seat entitlements, trial/active/past-due/restricted transitions and deadline evaluation. Concurrent grants cannot exceed seats; restriction blocks writes while role-limited reads/prints/exports remain, with simulated recovery. No payment provider or charge.
- AC-02: Server permissions, malformed input/tenant denial and concurrency covered by the applicable scenarios in [shared verification](SAAS-VERIFICATION.md).
- AC-03: Existing versions/audit/records and original regressions retained; migration and snapshot tests passed. No removal approved or performed.
- AC-04: Shared commands/results record lint/type/build/API/database/browser evidence. Production findings remain Open.
Code areas: `apps/api/src/modules/subscription; apps/api/src/modules/practice; apps/clinical-app/src/mvp/PracticeSettings.tsx`.
Review scope: base 6be71e2 plus the current ordered SaaS diff. Rationale: [change justification](../../Doc/Changes/Justification/TASK-023-saas.md). Task: [canonical completed record](../Tasks/Completed/TASK-023.md).
Limitations: [FIND-010](../Assessment/Findings/FIND-010.md), original production findings and shared review limits. No production/clinical/legal certification.
