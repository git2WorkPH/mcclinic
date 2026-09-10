# TASK-017 — Implement appointment booking and views
Status: Approved
Requirements: [REQ-FEAT-010](../../Requirements/Features/REQ-FEAT-010.md) v0.1 AC-01–AC-03

## Objective
Implement appointment booking and views, satisfying the linked requirement criteria.

## Scope
Implement approved schedule fields, conflict policy, booking and patient/provider/date views.

## Out of scope
Unrelated features, production deployment, real patient data, Jira, live laboratory integration, unapproved policy decisions, and all deletions. No approval is inferred from this proposal.

## Acceptance criteria
- AC-01: All linked requirement v0.1 AC-01–AC-03 outcomes applicable to this task are demonstrated; approve any refinement before implementation.
- AC-02: Relevant authorization, data consistency, audit and failure cases in the linked requirements pass meaningful checks; evidence names commands, environment and results.
- AC-03: Review confirms inward dependencies, approved scope, no unapproved removals, current justification and session memory. No unsupported compliance/platform claims.

## Expected code areas
apps/api/modules/appointment, clinical-app scheduling, contracts/migrations (proposed paths; no application files exist yet).

## Expected test impact
ADD the scenarios specified in linked requirements; use Vitest for domain/use cases, Testcontainers for PostgreSQL effects, and Playwright for supported web interactions. Native behavior needs native checks. TASK-015 is document-only and uses architecture review instead of runtime tests. Before changing any existing tests classify KEEP/ADD/UPDATE/SPLIT/REMOVE in the justification; no removals approved.

## Dependencies and decisions
- Tasks: [TASK-005](TASK-005.md), [TASK-004](TASK-004.md).
- Architecture decision required: No new ADR anticipated; accepted applicable baseline decisions remain prerequisites. Raise a proposal if a new choice is discovered.
- Resolve applicable policy blockers and approve linked requirement details before dependent work: [FIND-007](../../Assessment/Findings/FIND-007.md).
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
- Required justification before implementation: `Doc/Changes/Justification/TASK-017-change.md`.
- Progress: not started; proposal only. No implementation edits authorized.

## Completion
- Acceptance/review: pending at `Documentation/Acceptance/TASK-017-acceptance.md`.
- Commits: none for this task.
- Next action: obtain explicit bounded task approval and resolve its dependencies/decisions; do not move to Approved yet.

## Current approval and execution record — 2026-09-10
Status: Approved
Approver: project owner, current conversation.
Exact approval evidence: "use the project-development skills  I want you to implement all the proposed tasks"
Scope: the complete bounded task scope and linked v0.1 criteria above. This supersedes earlier pending/proposed metadata; unresolved clinical/legal/privacy policies remain unresolved, and no deletion is approved.
Canonical task: this Approved record. The Proposed copy is retained as historical proposal evidence because it already coexists with this user-created copy; do not execute it independently.
Execution: TASK-001 foundation starting; remaining tasks wait for dependencies and applicable policy answers.

## Dependency status at handoff
Task approval is recorded above and remains valid. Policy-dependent implementation awaits the applicable answers in [decisions needed](../../Assessment/DECISIONS-NEEDED.md); no clinical/legal decisions are inferred from approval. Earlier proposal/pending text is retained as history, not current authority.
