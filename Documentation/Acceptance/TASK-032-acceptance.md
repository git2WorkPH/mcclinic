# TASK-032 acceptance and project review
Date: 2026-09-13. Base: 6d3a7494c3ac7d3f7eb3cd176cb1e95ebf1da32b. Branch: task/TASK-032-onboarding-boundaries.
Decision: Completed for the approved behavior-preserving onboarding extraction. No production or deployment acceptance.

## Acceptance evidence
- AC-01 PASS: OnboardingPanel uses useOnboarding; contracts define gateway/browser ports. gateway.ts owns the six public account GraphQL operations; browser.ts owns fragment parsing, consumption, listener lifecycle and scrolling. The hook retains state, pending/error handling and unchanged success messages. AccountSecurityPanel remains byte-for-byte identical; its generated calls intentionally remain in the original file.
- AC-02 PASS: composeMvp builds onboardingUseCases/onboardingStore. installMvpGraphql consumes services.onboarding and accepts injected services as an optional fourth argument, preserving all existing three-argument callers and the synthetic delivery seam. A local GraphQL test with an unavailable database proves injected registration is used.
- AC-03 PASS: Existing persistence/schema/generated contracts and regression tests are unchanged. Database and browser suites verify registration, verification, invitations, MFA/recovery, practice isolation, permissions, audit and clinical integrity. New adapter tests preserve fragment precedence, credential mapping, cleanup and error propagation without mutation retries.
- AC-04 PASS: Commands below passed and project-review found no blocking scoped issue. Removed source blocks correspond only to the exact relocation scope explicitly approved by the owner; no file, API, test, assertion or supported behavior was deleted.

## Commands and results
Using PATH=/private/tmp/ehr-runtime/node_modules/.bin:$PATH:
- `pnpm check`: lint/AST boundaries, TypeScript, 18 unit/API scenarios and API/web builds PASS.
- `node tooling/check-codegen.mjs`: PASS, no generated drift.
- `pnpm exec vitest run tests/onboarding.integration.test.ts tests/mvp.integration.test.ts tests/database.integration.test.ts`: 23 PostgreSQL scenarios PASS.
- `pnpm test:mvp:web`: 7 existing browser scenarios PASS.
- `pnpm test:web`: 2 foundation browser scenarios PASS.
- `git diff --check`: PASS. Source comparison verified AccountSecurityPanel byte equality and no changes to onboarding transactions, Prisma schema/migrations, generated contracts or existing regression tests.

50 scenarios passed in total. The initial sandbox run could not bind its API test listener; the unchanged tests passed with permitted local socket access. New test setup initially used an unavailable root package alias and an incorrect handwritten GraphQL input name; corrected to existing generated contracts, retaining assertions. Existing Image resizeMode/NO_COLOR warnings remain nonblocking.

## Review limitations and remaining scope
FIND-012 remains Open for deeper onboarding-store cross-module transaction orchestration and broader boundary enforcement. This task does not claim complete frontend/backend architectural conformance. Production findings remain Open. No runtime majors, dependencies, schema, permission policy or UX flow changed.

Tests ran in the shared working tree; four unrelated appointment/consultation edits appeared during the session and are excluded from the task commit. Those edits were not reviewed or approved by this task. No push, merge, deployment or external message occurred.
