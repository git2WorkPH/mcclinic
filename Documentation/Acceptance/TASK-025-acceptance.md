# TASK-025 acceptance and project review
Date: 2026-09-12. Reviewed base 19c634b11b9aa805d2ca81cefd7ef42585fe242c through intended TASK-025 working diff on task/TASK-025-account-onboarding.
Decision: development acceptance, subject to final commit; no production approval. REQ-FOUND-011 v0.4 and ADR-007. TASK-024 remains Proposed.

| Criterion | Implementation / observable evidence |
|---|---|
| AC-01 | Email normalization/verification, password bounds, optional atomic practice+manager+SOLO trial, legacy seed compatibility. Onboarding database scenario “verifies normalized accounts once…” checks concurrent single consumption, default-practice denial and seed rerun isolation. Browser doctor registration verifies actual forms and memberships. |
| AC-02 | Invites bind email, practice and role; current inviter authority, verified credentials/MFA and seat count are rechecked under locks. Database invitation scenario covers wrong password, duplicate acceptance, role denial, full seat and revoked authority. Existing SaaS tests retain concurrent seat and cross-tenant denials. Browser invitee obtains reception role without manager controls. |
| AC-03 | Generic request responses, persistent fixed-window limits, hashed expiring reset tokens, credential version binding, single consumption and session revocation. Database expiry/rate/reset/racing-rotation tests; browser password recovery with MFA. No clinical record change or purge. |
| AC-04 | TOTP possession confirmation, encrypted secret, hashed single-use recovery codes, password-protected enrollment/disable, anti-replay and reset MFA. RFC 6238 SHA-1 vectors; database use-case login denial, code replay, recovery consumption and revoked sessions; real browser enrollment/recovery-code login. |
| AC-05 | PostgreSQL-backed GraphQL/web workflows; audit-failure injection verifies rollback of verification, membership/practice and token consumption. Rename test preserves database OID and stored history and refuses an existing target. Existing clinical, print, audit, amendment, concurrency and tenant regressions retained. |

## Commands and final results
Runtime Node 24.21.0/pnpm 10.34.5 from /private/tmp/ehr-runtime/node_modules/.bin; PostgreSQL 17.6-alpine Testcontainers; Chromium Playwright 1.63.
- `pnpm check`: lint/Oxlint and AST dependency boundaries, TypeScript, 9 unit/API tests and API/web builds PASS.
- `pnpm test:onboarding`: 8 PostgreSQL/API scenarios PASS.
- `pnpm test:mvp`: all 14 existing PostgreSQL/API scenarios PASS.
- `pnpm test:integration`: 1 existing foundation database scenario PASS.
- `pnpm test:mvp:web`: 6 browser scenarios PASS (4 existing + 2 new).
- `pnpm test:web`: both existing foundation browser scenarios PASS.
- `pnpm codegen`: SHA-256 before/after check of both generated contracts PASS, no drift.
- `git diff --check`: PASS.
- `pnpm exec tsx tooling/verify-mvp-runtime.ts`: fresh and repeated migration deploy and compiled API readiness PASS. Browser onboarding screenshot visually inspected: readable desktop layout, practice/role context and no manager invitation controls for reception.

40 automated scenarios total, no skips in final runs. Initial sandbox-only API listener attempt failed before running its tests; the permitted loopback run passed. First onboarding browser run exposed same-tab verification-link handling and duplicate React keys; fixed implementation, retained assertions, complete rerun passed. A separate foundation run replaced shared test output, so browser capture was rerun for visual inspection.

## Review scope / remaining limits
Checked generated schema compatibility (optional MFA argument preserves existing login callers), additive-only schema, server membership checks, invitation locks matching practice operations, token/user serialization, credential rotation, audit rollback and secrets excluded from public GraphQL/exports/log payloads. New anonymous accounts cannot read clinical records without a practice membership. No production authorization/clinical entitlement inferred from a chosen role or verified email.
No blocking findings remain for the bounded synthetic development scope. FIND-010 and original clinical/legal/privacy/retention/signature findings stay Open. Mailbox delivery is local filesystem capture; operator key custody/recovery and public-signup abuse defenses remain production work. Test suites do not establish Philippine regulatory compliance.

## Usability follow-up — 2026-09-12
The reported onboarding disclosure problem was reproduced as an ambiguous collapsed control on short viewports: the content opened below the visible area and the control exposed no expanded state. The control now publishes `aria-expanded`, scrolls the opened panel into view and announces that the account options opened. Added browser coverage verifies collapsed → expanded state, in-viewport confirmation and visible registration form. `pnpm lint`, `pnpm typecheck` and the complete `pnpm test:mvp:web` suite PASS (7 scenarios). The first added check correctly failed because React Native Web did not emit `aria-expanded` from generic accessibility state; the explicit web attribute fixed it, and the unweakened rerun passed. Review found no authorization, data, API or clinical behavior change and no deletion.
No existing local database was renamed or migrated: no configured DATABASE_URL was available. New-service defaults use mcclinic; the tested `pnpm db:rename` workflow is documented for the existing local database. No push/deploy/live email/payments. Owner changes in MVP_RUNBOOK, patient/certificate/practice code, PracticeSettings and installed skills remain excluded from the task commit. No starter deletion staged.
