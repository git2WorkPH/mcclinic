# TASK-015 change justification
Status: In progress
Task/approval: Documentation/Tasks/Approved/TASK-015.md; owner quote "use the project-development skills  I want you to implement all the proposed tasks".
Requirements: REQ-FOUND-009 v0.1 AC-01–03.

## Problem and evidence
No application, workspace tooling or lab boundary walkthrough exists at base a4fce11894b8a877ac3b6cb86f51fc0186c150e0. User-created Approved copies and version-1 branch were present and preserved.

## Chosen change and alternatives
Documentation-only future lab boundary contract sketch and scenario walkthrough; no runtime schema/API/vendor implementation.
Use the existing stack and accepted bounded ADR-001/005 approaches. No clinical feature or policy is introduced by this foundation.

## Impact
Add only task-scoped source, tests, configuration and documentation. Existing starter content remains preserved. No real patient data/secrets. Status API exposes no patient information. Generated contracts derive from schema/documents, never hand-edited.

## Test decisions
ADD: API status success, malformed input rejection, readiness adapter failure, graph contract consistency, inward import boundaries, rendered web status/error behavior and PostgreSQL readiness/transaction rollback smoke as applicable to TASK-001. TASK-015 uses document scenario review instead of runtime tests.
KEEP: every existing document/placeholder and any existing test. No UPDATE/SPLIT/REMOVE of existing behavior or assertions is planned.

## Deletion inventory and authorization
None. No deletion approved. Retain existing duplicate proposal as historical evidence; Approved task is canonical. A failing test never authorizes deleting/skipping/weakening it.

## Verification and recovery
Run install, codegen, Oxlint, tsc, Vitest, Testcontainers, build and Playwright for the foundation; capture actual outcomes in acceptance records. Recovery is to stop using new local services, preserve data and diagnose failures; no destructive cleanup or volume deletion.

## Final reconciliation
Pending checks and acceptance review; policies FIND-001–007 remain unresolved for dependent feature tasks.

## Final review — 2026-09-10
Completed design-only scope, verified in Documentation/Acceptance/TASK-015-acceptance.md. Branch task/TASK-015-laboratory-boundary based on f9c3390bed07e25a9bbb490b3780dfc2b9e85991. Task record relocated Approved → Completed with all content/history preserved per lifecycle. No runtime changes or other removals.
