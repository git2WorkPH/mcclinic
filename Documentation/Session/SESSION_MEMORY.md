# Session memory
Updated: 2026-09-11 (Australia/Sydney)
Phase: DEVELOPMENT MVP COMPLETE; owner local synthetic UAT next. Production readiness pending.
Active requirement: v0.2-MVP across REQ-PROD-001, REQ-FOUND-001–009 and REQ-FEAT-001–012; original v0.1 preserved.
Active task: none implementing; all 19 approved scopes completed for MVP/design only.
Current branch: task/TASK-002-development-mvp.
Observed HEAD before this memory update: 55cf441797f14651c0d9f7fbb69098fc64733a51 (owner: update credentials).
Observed status before this memory update: verification follow-up edits, new compiled-runtime verifier, acceptance/requirements/runbook updates and Approved→Completed task relocations. No unexplained unstaged starter deletions.

## Reconciliation and authority
- Previous memory was stale: owner commits 3194f5e and 55cf441 contain implementation/config/branding and starter-directory removal. Preserve these commits; this session did not delete or stage starter removals.
- Owner authorizes all approved tasks plus reversible MVP defaults. No blanket reapproval needed. Production findings remain Open and nonblocking only for the synthetic local MVP.
- No new deletion, purge, push, deployment or merge authorized. Preserve user changes. Any future starter deletions must remain unstaged.

## Implemented / verified
- Actual PostgreSQL patient/profile/search, consultation/note amendment/history, prescription/certificate draft/issue/amend/preview/print, appointment book/reschedule/cancel/check-in workflows.
- Local identity, server permissions, atomic audit/revisions, idempotent retries, optimistic concurrency and database overlap constraints.
- [Shared verification](../Acceptance/MVP-VERIFICATION.md): 5 unit/API + 1 foundation database + 9 MVP integration + 2 foundation browser + 3 MVP browser scenarios passed. Lint/boundaries/typecheck/codegen/build passed.
- Fresh/repeated migrate deploy, compiled MVP API readiness, backup/restore and local Docker build passed. Five-page A4 demo certificate checked; physical printer and remote CI unverified.
- Node 24.21.0 / pnpm 10.34.5: prepend /private/tmp/ehr-runtime/node_modules/.bin on this host. Docker required. Browser test API isolated on OS-assigned port; Vite 5174 must be free.

## Records / unresolved questions
- [Assumptions](../Project/MVP_ASSUMPTIONS.md); [runbook](../Project/MVP_RUNBOOK.md) includes current correction for Compose identity and seed minimum; preserve owner-specific historical examples.
- [Task index](../Tasks/Approved/INDEX.md); canonical remaining records now in ../Tasks/Completed/. Individual acceptance records map criteria to code/tests; rationale lives in root Doc/Changes/Justification/.
- [Decisions](../Assessment/DECISIONS-NEEDED.md), ADR-002/003/004 MVP overlays. Clinical/legal/privacy/jurisdiction, production identity, retention/protection, signature/template and native/platform findings remain unresolved for production.
- TASK-015 laboratory boundary remains design-only. No vendor integration.

## Exact next action
Validate this pre-commit snapshot against Git and the completion commit, then perform owner synthetic-data UAT following MVP_RUNBOOK.md at /clinic. If changes are requested, read only the affected completed requirement/task/justification and record the bounded follow-up before editing. Do not reopen production policy questions as MVP blockers; do not infer production readiness from passing tests.
