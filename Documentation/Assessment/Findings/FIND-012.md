# FIND-012 — Onboarding presentation and composition boundaries

Status: Open. Assessment performed 2026-09-13 at master 6d3a749.
2026-09-13 update: TASK-032 completes the public frontend extraction and backend onboarding composition relocation; see ../../Acceptance/TASK-032-acceptance.md. Remaining store orchestration and broader automated boundary enforcement stay Open for separately bounded work.

Requirements: REQ-FOUND-002 v0.2-MVP FR-01/02; REQ-FOUND-011 account lifecycle.

Evidence:

- `apps/clinical-app/src/mvp/OnboardingPanel.tsx` owns form rendering, URL-fragment parsing/listeners, workflow state and generated GraphQL calls. This couples presentation to browser and transport details and makes workflow tests require the complete screen.
- `apps/api/src/adapters/mvp-graphql.ts` constructs `onboardingUseCases(onboardingStore(database, delivery))`. The transport adapter therefore also owns persistence composition.
- `apps/api/src/modules/onboarding/infrastructure/store.ts` contains validation, cross-module persistence, token lifecycle and audit transactions. The application facade delegates most work. This is a deeper modularity gap; changing transaction boundaries requires a separate assessed task.
- `tooling/check-boundaries.mjs` checks backend inner layers only. Existing passing checks do not establish frontend separation or transport/composition separation.

Bounded first remedy: TASK-032 extracts the public onboarding screen's workflow/transport/browser concerns and moves backend onboarding construction to composition. Preserve all transaction bodies, authorization, MFA, audit and API contracts. AccountSecurityPanel and other clinical screens are outside this first refactor.

Assessment is static source inspection, not a fresh runtime verification. Existing regression suites remain mandatory. No defect in clinical behavior or production compliance is inferred from these structural findings.
