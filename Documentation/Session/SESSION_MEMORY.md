# Session memory
Updated: 2026-09-13 (Australia/Sydney).
Phase: DEVELOPMENT deployment-readiness planning COMPLETE; synthetic staging implementation pending approval. Production readiness pending.
Active requirement: REQ-FOUND-012 v0.1 planning accepted; production evidence pending.
Active task: TASK-026 completed for planning. TASK-027–031 and TASK-024 remain Proposed.
Current branch: task/TASK-026-deployment-readiness.
Latest completed task commit: `00bfd5f` (`docs: complete deployment readiness plan`).
Observed status after the task commit: no TASK-026 changes pending. Pre-existing owner changes in MVP_RUNBOOK.md, patient domain/use cases, certificate validation, practice services/scope and PracticeSettings.tsx remain unstaged and excluded. Untracked Prisma skills, .claude/, .windsurf/ and skills-lock.json also remain excluded. No starter deletions present.

## Reconciliation / authorization
- Memory reconciled against `e53b208` and unchanged owner working-tree edits. Live remote search found no TASK-026/deployment branch; local branch `task/TASK-026-deployment-readiness` was created without stashing or discarding changes.
- Owner explicitly approved implementing TASK-026 and agreed TASK-024 follows deployment readiness. This authorizes planning artifacts only; no cloud provisioning, spending, deployment, push, real data, external mail/payment, offline synchronization or deletion.
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

## TASK-026 delivery / verification
- [Deployment plan](../Project/DEPLOYMENT_PLAN.md) recommends measuring AWS Singapore, managed S3/CloudFront → ALB/ECS Fargate → private RDS `mcclinic`, and a Lightsail lower-cost alternative. Planning estimates: $87–94/month synthetic staging and $188–203/month small resilient pilot, with $105/$225 proposed ceilings. Prices/eligibility must be refreshed before spending.
- Proposed [ADR-008](../Architecture/Decisions/ADR-008.md), [ADR-009](../Architecture/Decisions/ADR-009.md), TASK-027–031 and Open [FIND-011](../Assessment/Findings/FIND-011.md). TASK-024 stays Proposed and is required before production go-live only if paid subscriptions launch; simulated billing is sufficient for synthetic staging.
- [TASK-026 acceptance](../Acceptance/TASK-026-acceptance.md): AC-01–04 planning PASS. Official Singapore price catalogs recalculated; ten AWS pricing/architecture links returned HTTP 200; document/ID inventory and diff checks passed. No application/cloud/ISP/restore test was run or claimed because this task changes documentation only.
- Project-review found no blocking planning issue. Singapore region, private egress/staging access, budget/account/domain, RPO/RTO, production identity/mail/key operations and Philippine policy remain unresolved approval gates.

## Onboarding usability follow-up
- Owner reported the Account onboarding and recovery control appeared inactive. The disclosure opened below a short viewport without announcing its state. It now exposes collapsed/expanded state, scrolls to the form and displays a status message.
- Added browser regression passed with all 7 MVP/SaaS/onboarding browser scenarios; lint and TypeScript passed. Project-review found no data, authorization, API or clinical behavior change. The initial accessibility assertion exposed a missing emitted web attribute; implementation fixed and unchanged assertion passed.
- No development server was listening on expected ports 5173/5174 at final inspection. A previously loaded browser tab may therefore be stale; restart API/web and reload `/clinic` to receive this fix.

## Exact next action
Review proposed ADR-008/009 and approve TASK-027 if you want cloud-ready artifact/config implementation. TASK-028 requires separate region, AWS account and spending-ceiling approval after TASK-027; do not provision or deploy from TASK-026. Continue local onboarding UAT through ONBOARDING_RUNBOOK.md and preserve all owner changes.
