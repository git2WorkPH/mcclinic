# Session memory
Updated: 2026-09-12 (Australia/Sydney).
Phase: DEVELOPMENT SaaS v0.3 COMPLETE; local synthetic UAT next. Production readiness pending.
Active requirement: REQ-FOUND-010 and REQ-FEAT-013–015 v0.3, extending the preserved v0.2 MVP.
Active task: TASK-020–023 completed for approved scope; TASK-024 real payments Proposed only.
Current branch: task/TASK-020-saas-practices.
Observed HEAD before this memory update: 6be71e24fa231fa7e9ab15d4417d992a6828b92f (completed MVP).
Observed status before this memory update: SaaS implementation/schema/generated/test changes and new requirements/ADR/tasks/acceptance/rationale/runbook. Owner edit in Documentation/Project/MVP_RUNBOOK.md changes a database name; preserve it unstaged and exclude it from this commit. No starter deletions present.

## Authorization / reconciliation
- Owner explicitly approved bounded tenant/membership → branding → templates → simulated subscription implementation and reversible development defaults. Requirements/tasks retain approval evidence.
- Prior memory matched the MVP completion commit. Local/worktree/live remote search found no TASK-020–023 branches; new branch uses verified 6be71e2. Do not merge/push/deploy, charge users, use real records or delete anything.
- Existing starter removal was in the owner's earlier commit, not this work. Leave any future starter deletions unstaged.

## Implemented
- Tenant-scoped database-backed clinical records, membership roles, explicit switching and a separate creator management grant for solo clinicians. Ordinary administrators still have no clinical access.
- System name/header, PNG/JPEG logo, contacts and accessible theme choices; guided allowlisted prescription/certificate templates, full synthetic preview, draft/published versions and immutable issue-time rendered/value/branding snapshots.
- SOLO/TEAM clinician seats, local simulated trial/active/past-due/restricted subscriptions, concurrent seat enforcement, preserved reads/print/role-limited export and simulated recovery. No payment provider.
- Additive default-practice migration preserves existing patient versions/audit timestamps. Existing issued documents retain fallback rendering. Global identity audit is outside practice-visible exports.

## Verification
- [SaaS evidence](../Acceptance/SAAS-VERIFICATION.md): 8 unit/API + 14 PostgreSQL/API + 1 foundation database + 4 MVP/SaaS browser + 2 foundation browser scenarios passed (29 total).
- Lint/dependency boundaries, TypeScript, generated contract drift and builds passed. Fresh/repeated migrations and compiled API readiness passed. Existing audit rollback/restore and print layout scenarios retained.
- Final branding browser run passed; screenshot visually inspected. Prior scheduling/browser failure did not reproduce in subsequent complete runs; no assertions removed or weakened.
- Node 24.21.0/pnpm 10.34.5 at /private/tmp/ehr-runtime/node_modules/.bin on this host. Tests use isolated Docker PostgreSQL 17.6-alpine. No existing local database was migrated by this session.

## Relevant records / remaining questions
- [SaaS runbook](../Project/SAAS_RUNBOOK.md), [assumptions](../Project/MVP_ASSUMPTIONS.md), [ADR-006](../Architecture/Decisions/ADR-006.md), [FIND-010](../Assessment/Findings/FIND-010.md).
- Completed TASK-020–023 have per-task acceptance and Doc/Changes/Justification/TASK-020–023-saas.md. [TASK-024](../Tasks/Proposed/TASK-024.md) requires separate approval.
- Original Philippine clinical/legal/privacy/signature/retention findings remain Open. RLS assessed but not enabled; non-owner database roles, production identity/support, scale/recovery and real billing require later work. No native, production or physical-printer certification.

## Exact next action
Validate this snapshot against Git/completion commit; keep the owner runbook edit unstaged. For local UAT, follow SAAS_RUNBOOK.md using the existing synthetic DATABASE_URL: generate client, back up/migrate the existing database, start API/web, then create and switch practices and test settings/issued snapshots. Read only affected task/requirement/rationale for requested follow-up work. Do not treat production findings as development blockers or TASK-024 as approved.
