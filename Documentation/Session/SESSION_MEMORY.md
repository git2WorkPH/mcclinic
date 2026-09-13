# Session memory
Updated: 2026-09-13 (Australia/Sydney).
Phase: DEVELOPMENT onboarding v0.4 COMPLETE; deployment-planning proposal prepared. Production readiness pending.
Active requirement: REQ-FOUND-012 Draft deployment readiness; REQ-FOUND-011 v0.4 completed.
Active task: TASK-026 deployment readiness/planning Proposed only; TASK-025 completed. TASK-024 remains Proposed.
Current branch: task/TASK-025-account-onboarding.
Observed HEAD before this memory update: a6f969b0f75e53dba6a80c89f1f95cc6e56363c8 (deployment proposal).
Observed status before this memory update: TASK-025 onboarding-control usability fix/tests/rationale/acceptance and this memory update pending local commit. Pre-existing owner changes in MVP_RUNBOOK.md, patient domain/use cases, certificate validation, practice services/scope and PracticeSettings.tsx remain unstaged and excluded. Untracked Prisma skills, .claude/, .windsurf/ and skills-lock.json also remain excluded. No starter deletions present.

## Reconciliation / authorization
- Memory reconciled against onboarding completion commit c777754 and unchanged owner working-tree edits. Deployment request authorizes a proposal only; no implementation branch created.
- Owner explicitly requested account onboarding before TASK-024 and canonical database name mcclinic. Approval recorded in TASK-025; ADR-007 records reversible local defaults. No deployment, push, live mail/payments, real records or deletion authorized.

## Implemented
- Normalized email registration, expiring single-use verification, optional atomic doctor practice/manager/SOLO trial creation and verified scoped staff invitations. Acceptance rechecks inviter permissions and clinician seats.
- Password recovery, credential-version-bound reset links and race-safe session revocation; TOTP MFA with encrypted secret, one-time hashed recovery codes and replay protection. New accounts cannot inherit seeded default-practice access.
- Actual GraphQL/React Native Web forms; private local mailbox links, including same-tab link handling. No external messages sent.
- New-service database defaults are mcclinic. `pnpm db:rename` preserves existing database OID/data, refuses conflicting targets, and never drops or terminates connections. Existing credentials and Docker volume retained. No configured DATABASE_URL was available, so no existing local database was renamed/migrated.

## Verification / review
- [TASK-025 evidence](../Acceptance/TASK-025-acceptance.md): 9 unit/API + 8 onboarding PostgreSQL/API + 14 existing MVP/SaaS PostgreSQL/API + 1 foundation database + 6 MVP/SaaS/onboarding browser + 2 foundation browser = 40 scenarios PASS.
- Lint/AST boundaries, TypeScript, codegen drift and API/web builds PASS. Fresh/repeated migrations plus compiled API readiness PASS. Onboarding browser screenshot visually inspected. Project-review completed; no blocking development findings.
- Initial sandbox listener failure was rerun with permission. Browser link/duplicate-key defects fixed without weakening assertions; complete rerun passed. Existing Image resizeMode deprecation warning remains nonblocking.
- Node24.21.0/pnpm10.34.5 available at /private/tmp/ehr-runtime/node_modules/.bin; Docker PostgreSQL17.6-alpine and Playwright1.63 used. All database mutations for verification were in isolated containers.

## Relevant records / unresolved questions
- [Runbook](../Project/ONBOARDING_RUNBOOK.md), [assumptions](../Project/MVP_ASSUMPTIONS.md), [requirement](../Requirements/Foundation/REQ-FOUND-011.md), [completed task](../Tasks/Completed/TASK-025.md), [ADR-007](../Architecture/Decisions/ADR-007.md).
- Canonical rationale: Doc/Changes/Justification/TASK-025-onboarding.md. Approved record retained as history. Original requirements/decisions and user edits preserved.
- FIND-010 remains Open: public identity/licensing, production mail/outbox/recovery/key custody/abuse controls/support and payments. Philippine clinical/legal/privacy/retention/signature findings remain Open/nonblocking only for synthetic development. No automatic retention/account purge.

## Deployment proposal verification
- Read governance/assessment/architecture skills and inspected loopback runtime, local Compose, dev proxy and onboarding evidence. Checked current AWS primary sources for infrastructure/Free Tier. No application changes or new runtime tests; previous test results above are historical TASK-025 evidence.
- New files: Requirements/Foundation/REQ-FOUND-012.md and Tasks/Proposed/TASK-026.md. AWS Singapore is an evaluation candidate, not an approved region; budget, ISP measurements and production policies remain undecided.

## Onboarding usability follow-up
- Owner reported the Account onboarding and recovery control appeared inactive. The disclosure opened below a short viewport without announcing its state. It now exposes collapsed/expanded state, scrolls to the form and displays a status message.
- Added browser regression passed with all 7 MVP/SaaS/onboarding browser scenarios; lint and TypeScript passed. Project-review found no data, authorization, API or clinical behavior change. The initial accessibility assertion exposed a missing emitted web attribute; implementation fixed and unchanged assertion passed.
- No development server was listening on expected ports 5173/5174 at final inspection. A previously loaded browser tab may therefore be stale; restart API/web and reload `/clinic` to receive this fix.

## Exact next action
Restart the API and web processes from the current branch, open `http://127.0.0.1:5173/clinic`, hard reload once and verify the onboarding control reveals the form. Then review TASK-026 for approval. No paid resources or deployment are authorized. Follow ONBOARDING_RUNBOOK.md for mcclinic migration/UAT; do not start TASK-024 without separate approval.
