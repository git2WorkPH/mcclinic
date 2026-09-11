# TASK-023 — Simulated subscriptions and entitlements
Status: Completed — v0.3 development SaaS.
Requirement: REQ-FEAT-015, AC-01–04.
Approval: Owner: "I authorize requirements refinement and implementation of the bounded scope below." Current conversation, 2026-09-11. Scope below is the applicable requested phase.
## Objective / scope
Plans, clinician seat limits, trial/active/past-due/restricted states, simulated billing and permission-preserving export.
## Out of scope
Real patient data, live payments, production deployment, automatic sharing, offline sync, deletions and legal certification.
## Acceptance
Requirement AC-01–04 verified in relevant API/database/browser tests. Preserve existing tests and data. Record concrete evidence before completion.
## Areas / tests
apps/api practice-scoped application ports/adapters/Prisma; clinical-app settings; generated GraphQL contracts; integration/browser tests. ADD coverage, KEEP existing assertions.
## Dependencies / ADR
TASK-022; ADR-006 required/accepted for scoped development decisions.
## Branch / rationale
Integrated ordered branch task/TASK-020-saas-practices from 6be71e2. Local/live remote search found no TASK-020–023 branch. Rationale: Doc/Changes/Justification/TASK-023-saas.md.

## Completion — 2026-09-12
Owner approval above preserved. [Acceptance](../../Acceptance/TASK-023-acceptance.md) and [shared verification](../../Acceptance/SAAS-VERIFICATION.md) record evidence and production limits. No live billing/deployment/push. Next: local synthetic UAT; real payment TASK-024 remains Proposed.
