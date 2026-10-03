# TASK-045 — Component boundaries change justification

Task/approval: [TASK-045](../../../Documentation/Tasks/Completed/TASK-045.md), explicitly approved by the owner on 2026-10-03.
Requirement/version/criteria: [REQ-FOUND-002 v0.2-MVP FR-01/03, AC-01/03](../../../Documentation/Requirements/Foundation/REQ-FOUND-002.md); [REQ-FEAT-019](../../../Documentation/Requirements/Features/REQ-FEAT-019.md).
Status: Complete locally

## Problem and evidence

The desktop MVP works, but presentation responsibilities are concentrated in `MvpApp.tsx`, `PracticeSettings.tsx`, `DocumentPanel.tsx`, `PatientWorkspace.tsx`, `OnboardingPanel.tsx`, and a minified `SchedulePanel.tsx`. Login, shell, forms, feature navigation, administration, preview, version history, and appointment actions are defined together. This makes ownership and safe continuation difficult even though server-side feature boundaries remain sound.

## Chosen change and alternatives

Extract named, typed React components along existing feature boundaries while retaining the current hooks, GraphQL gateway, state flow, labels, and entry-point exports. Keep shared visual primitives in `ui.tsx`. Avoid a new state library or broad frontend rewrite because neither is required for component ownership.

## Impact

Frontend TypeScript modules and their imports change. User-visible behavior, server authorization, GraphQL operations, schema, persistence, audit events, clinical integrity, printing data, and runtime configuration remain unchanged. The one pre-existing blank-line edit in `MvpApp.tsx` is preserved within the refactor.

## Test decisions

| Test/path or proposed scenario         | Decision                                | Requirement/criterion  | Rationale and preserved/replacement coverage                                             | Deletion approval |
| -------------------------------------- | --------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------- | ----------------- |
| Existing Vitest and integration suites | KEEP                                    | REQ-FOUND-002 AC-01/03 | Preserve domain, transport, authorization, audit, and database behavior                  | none required     |
| `tests/mvp-web/journey.spec.ts`        | KEEP                                    | REQ-FEAT-019           | Preserve patient, consultation, document, scheduling, audit and role outcomes            | none required     |
| `tests/mvp-web/onboarding.spec.ts`     | KEEP                                    | REQ-FEAT-019           | Preserve login, onboarding, recovery, MFA and invitation outcomes                        | none required     |
| `tests/mvp-web/saas.spec.ts`           | KEEP                                    | REQ-FEAT-019           | Preserve practice, branding, membership, templates and subscription outcomes             | none required     |
| Component-specific unit tests          | ADD only if extraction introduces logic | TASK-045 AC-01/02      | Pure presentational relocation is better verified by types and existing browser outcomes | none required     |

## Deletion inventory and authorization

Existing component function bodies will be removed from their oversized source files only after equivalent named modules are imported and all supported outcomes remain covered. No file, test, assertion, API, field, schema, configuration, documentation, or behavior is deleted. The owner explicitly authorized moving the functionality into its own components on 2026-10-03.

## Verification and recovery

Run formatting, dependency checks, TypeScript, Vitest, codegen drift, API/web builds, onboarding/MVP database suites, and Playwright browser suites. Review the complete diff for behavior, authorization, and deletion scope. Recovery is a Git revert of the local task commit; there is no data migration.

## Final reconciliation

All frontend edits are structural extractions covered by TASK-045. `MvpApp` is now a thin composition root and feature-owned folders contain auth, patient, appointment, consultation, document, practice, and shell components. The original GraphQL operations, accessibility labels, authorization visibility, clinical workflows, tests, schema and persistence remain intact. The initial browser label regression was corrected without changing its test. Acceptance: [TASK-045](../../../Documentation/Acceptance/TASK-045-acceptance.md).
