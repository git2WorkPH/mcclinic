# TASK-001 change justification
Status: In progress
Task/approval: Documentation/Tasks/Approved/TASK-001.md; owner quote "use the project-development skills  I want you to implement all the proposed tasks".
Requirements: REQ-FOUND-001/002 v0.1 AC-01–03.

## Problem and evidence
No application, workspace tooling or lab boundary walkthrough exists at base a4fce11894b8a877ac3b6cb86f51fc0186c150e0. User-created Approved copies and version-1 branch were present and preserved.

## Chosen change and alternatives
Workspace manifests/lockfile/runtime pins; Express/Yoga status use case; Zod boundary validation; generated server/client GraphQL contract; React Native Web candidate shell; Vite; Compose/PostgreSQL readiness test; Oxlint/typecheck/build, Vitest/Testcontainers/Playwright and boundary checks; developer documentation and CI.
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

## Verified reconciliation — 2026-09-10
Completed bounded foundation; exact passing checks and limitations are in Documentation/Acceptance/TASK-001-acceptance.md. Source areas: apps/, packages/, tooling/, tests/, infrastructure/, root manifests/config and .github/workflows. CI and Docker pins match Node 24.21.0. `.gitignore` preserves its original .DS_Store entry (adding its missing trailing newline appears as one removed/added line). No source/test removal. Unexplained nested-starter deletions are excluded from staging.
