# Session memory
Updated: 2026-09-12 (Australia/Sydney).
Phase: DEVELOPMENT onboarding v0.4 COMPLETE; synthetic local UAT next. Production readiness pending.
Active requirement: REQ-FOUND-011 v0.4, preserving completed SaaS/MVP requirements.
Active task: TASK-025 completed; TASK-024 real payments remains Proposed, not approved.
Current branch: task/TASK-025-account-onboarding.
Observed HEAD before this memory update: 19c634b11b9aa805d2ca81cefd7ef42585fe242c (completed SaaS).
Observed status before this memory update: intended onboarding/config/generated/tests/docs pending local commit. Pre-existing owner changes in MVP_RUNBOOK.md, patient domain/use cases, certificate validation, practice services/scope and PracticeSettings.tsx remain unstaged and excluded. Untracked Prisma skills, .claude/, .windsurf/ and skills-lock.json also remain excluded. No starter deletions present.

## Reconciliation / authorization
- Previous memory described the parent of the SaaS completion commit; reconciled against 19c634b, branch, log and actual diff. New task branch created after local/worktree/live remote search found no TASK-025 branch.
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

## Exact next action
Validate this memory against the TASK-025 completion commit and owner working-tree changes. Follow ONBOARDING_RUNBOOK.md: with the existing local DATABASE_URL, back up and stop clients, run `pnpm db:rename` if its database is ehr_mvp/ehr_dev, update the URL to mcclinic, generate/migrate and start API/web. Perform synthetic registration→local mailbox verification→practice invitation→MFA/recovery UAT. Do not start TASK-024 without separate approval. Preserve .local/onboarding-key alongside database backups.
