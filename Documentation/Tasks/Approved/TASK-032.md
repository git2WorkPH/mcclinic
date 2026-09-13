# TASK-032 — Separate onboarding presentation and composition
Status: Completed 2026-09-13; retained approval/relocation history. Canonical completion: ../Completed/TASK-032.md.
Date: 2026-09-13.

## Authorization
Owner: “Use the project-development skill and Continuity Kit workflow to implement code assessment and a bounded refactoring task.” This authorizes assessment and a bounded behavior-preserving refactor. It does not explicitly waive the existing rule covering code removal inside refactoring. No blanket task approval is needed again.

## Requirements and objective
REQ-FOUND-002 v0.2-MVP FR-01/02 and AC-01/02; REQ-FOUND-011 current development lifecycle. Address the first two findings in FIND-012 with dependency separation in frontend and backend.

## Scope and expected code areas
- Keep `apps/clinical-app/src/mvp/OnboardingPanel.tsx` and its exports; extract only public onboarding workflow state/actions into a feature hook, generated operations into a feature gateway and URL-fragment handling into a browser adapter under `apps/clinical-app/src/features/onboarding/`.
- Keep `apps/api/src/adapters/mvp-graphql.ts` and its API contracts; inject onboarding use cases constructed in `apps/api/src/mvp-composition.ts` instead of constructing the persistence store inside the GraphQL adapter. Inspect and preserve all factory callers, including tests, before changing its signature; use a compatibility entry point if required.
- Add focused tests and architecture evidence. Preserve original requirements, files, exports and history.

## Out of scope
New onboarding steps, no-practice UX, practice-creation policy, payments, deployments, schema changes, token/audit transactions, store decomposition, AccountSecurityPanel extraction, broader clinical-screen restructuring, test removal or weakening.

## Acceptance criteria
- AC-01: Public onboarding JSX invokes workflow actions; browser globals and direct generated GraphQL calls for that panel are delegated to explicit feature adapters.
- AC-02: Backend onboarding persistence construction resides in composition; resolvers invoke injected application use cases. Existing callers remain compatible.
- AC-03: Registration, verification, resend, reset, invitation, link consumption and success/error/loading behavior remain equivalent; existing MFA/tenant/integrity regression suites remain unchanged and pass.
- AC-04: Lint/boundaries, typecheck, codegen drift, relevant unit/database/browser suites and builds pass with exact evidence. Review all removed lines against explicit relocation approval.

## Tests, dependencies and architecture
KEEP every existing test and assertion. ADD gateway delegation/error, fragment parsing and use-case injection tests that check observable behavior. Run onboarding and existing MVP/SaaS database/browser coverage. Depends on completed TASK-025 and existing MVP contracts. A new architecture decision is not required: this applies the existing inward-dependency rule without changing stack or runtime topology. Any material new decision must be separately recorded.

## Exact relocation permission requested
Owner replied “yes i approved” to this exact relocation request on 2026-09-13. The replacements below are explicitly authorized. Branch: task/TASK-032-onboarding-boundaries from 6d3a749; remote branch search returned no matches after retrying outside the network sandbox.
Replace the existing public-panel state/effect/action and link-parsing implementations in OnboardingPanel.tsx with imports/calls to their extracted implementations. Replace onboarding store imports/construction in mvp-graphql.ts with injected application dependencies wired by mvp-composition.ts. Preserve behavior, public exports, every file, all tests and all persistence transaction bodies. Permission does not extend to deletion elsewhere.

Rationale: `Doc/Changes/Justification/TASK-032-onboarding-boundaries.md`. Implementation proceeds under the recorded relocation approval.

## Completion
AC-01–04 passed; see ../../Acceptance/TASK-032-acceptance.md. Existing three-argument GraphQL installer remains compatible through an optional fourth services argument. No new product behavior or transaction restructuring. Approval record retained to preserve history.
