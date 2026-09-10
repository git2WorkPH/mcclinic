# TASK-002 — Establish persistence and protection foundation
Status: Proposed
Requirements: [REQ-FOUND-008](../../Requirements/Foundation/REQ-FOUND-008.md) v0.1 AC-01–AC-03

## Objective
Establish persistence and protection foundation, satisfying the linked requirement criteria.

## Scope
Establish database adapter/transaction patterns, synthetic migration and restore checks, and the approved secrets/logging/storage policy. Clinical models belong to later feature tasks.

## Out of scope
Unrelated features, production deployment, real patient data, Jira, live laboratory integration, unapproved policy decisions, and all deletions. No approval is inferred from this proposal.

## Acceptance criteria
- AC-01: All linked requirement v0.1 AC-01–AC-03 outcomes applicable to this task are demonstrated; approve any refinement before implementation.
- AC-02: Relevant authorization, data consistency, audit and failure cases in the linked requirements pass meaningful checks; evidence names commands, environment and results.
- AC-03: Review confirms inward dependencies, approved scope, no unapproved removals, current justification and session memory. No unsupported compliance/platform claims.

## Expected code areas
apps/api persistence adapters and composition root, Prisma schema/migrations, infrastructure/docker (proposed paths; no application files exist yet).

## Expected test impact
ADD the scenarios specified in linked requirements; use Vitest for domain/use cases, Testcontainers for PostgreSQL effects, and Playwright for supported web interactions. Native behavior needs native checks. TASK-015 is document-only and uses architecture review instead of runtime tests. Before changing any existing tests classify KEEP/ADD/UPDATE/SPLIT/REMOVE in the justification; no removals approved.

## Dependencies and decisions
- Tasks: [TASK-001](TASK-001.md).
- Architecture decision required: Yes — [ADR-002](../../Architecture/Decisions/ADR-002.md)
- Resolve applicable policy blockers and approve linked requirement details before dependent work: [FIND-001](../../Assessment/Findings/FIND-001.md), [FIND-005](../../Assessment/Findings/FIND-005.md), [FIND-006](../../Assessment/Findings/FIND-006.md).
- TASK-001 may proceed without settling clinical policy only after its bounded scope and ADR-001 are explicitly approved and remote branch discovery is resolved. TASK-015 is design-only; it does not depend on bootstrap implementation.

## Approval record
- Implementation approval: PENDING.
- Approver/date/exact scope/evidence: none.
- Subsequent scope changes: none.

## Deletion approval (separate)
- Proposed targets: none. Preserve starter files, placeholders and existing behavior/tests.
- Explicit deletion approval: none. Any discovered removal requires exact inventory, impact, replacement coverage, recovery and owner approval. A failing test is never sufficient justification.

## Execution
- Branch/base: unassigned; no task branch created.
- Branch discovery: initial local/cached refs have no task branches; live remote query failed (FIND-009). Repeat exact-ID local/remote/worktree search before implementation.
- Required justification before implementation: `Doc/Changes/Justification/TASK-002-change.md`.
- Progress: not started; proposal only. No implementation edits authorized.

## Completion
- Acceptance/review: pending at `Documentation/Acceptance/TASK-002-acceptance.md`.
- Commits: none for this task.
- Next action: obtain explicit bounded task approval and resolve its dependencies/decisions; do not move to Approved yet.
