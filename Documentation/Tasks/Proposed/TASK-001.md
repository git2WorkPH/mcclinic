# TASK-001 — Bootstrap workspace and module boundaries
Status: Proposed
Requirements: [REQ-FOUND-001](../../Requirements/Foundation/REQ-FOUND-001.md) v0.1 AC-01–AC-03; [REQ-FOUND-002](../../Requirements/Foundation/REQ-FOUND-002.md) v0.1 AC-01–AC-03

## Objective
Bootstrap workspace and module boundaries, satisfying the linked requirement criteria.

## Scope
Create minimal typed app/API shells, generation/validation plumbing, reproducible local database configuration and meaningful smoke checks. Pin compatible tool versions and record commands. No clinical schema or workflow.

## Out of scope
Unrelated features, production deployment, real patient data, Jira, live laboratory integration, unapproved policy decisions, and all deletions. No approval is inferred from this proposal.

## Acceptance criteria
- AC-01: All linked requirement v0.1 AC-01–AC-03 outcomes applicable to this task are demonstrated; approve any refinement before implementation.
- AC-02: Relevant authorization, data consistency, audit and failure cases in the linked requirements pass meaningful checks; evidence names commands, environment and results.
- AC-03: Review confirms inward dependencies, approved scope, no unapproved removals, current justification and session memory. No unsupported compliance/platform claims.

## Expected code areas
package.json, pnpm-workspace.yaml, apps/api, apps/clinical-app, focused packages, infrastructure/docker, tooling checks (proposed paths; no application files exist yet).

## Expected test impact
ADD the scenarios specified in linked requirements; use Vitest for domain/use cases, Testcontainers for PostgreSQL effects, and Playwright for supported web interactions. Native behavior needs native checks. TASK-015 is document-only and uses architecture review instead of runtime tests. Before changing any existing tests classify KEEP/ADD/UPDATE/SPLIT/REMOVE in the justification; no removals approved.

## Dependencies and decisions
- Tasks: None.
- Architecture decision required: Yes — [ADR-001](../../Architecture/Decisions/ADR-001.md)
- Resolve applicable policy blockers and approve linked requirement details before dependent work: [FIND-003](../../Assessment/Findings/FIND-003.md), [FIND-008](../../Assessment/Findings/FIND-008.md), [FIND-009](../../Assessment/Findings/FIND-009.md).
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
- Required justification before implementation: `Doc/Changes/Justification/TASK-001-change.md`.
- Progress: not started; proposal only. No implementation edits authorized.

## Completion
- Acceptance/review: pending at `Documentation/Acceptance/TASK-001-acceptance.md`.
- Commits: none for this task.
- Next action: obtain explicit bounded task approval and resolve its dependencies/decisions; do not move to Approved yet.
