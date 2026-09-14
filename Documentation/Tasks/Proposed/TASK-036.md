# TASK-036 — Practice module catalog and activation

Status: Proposed, 2026-09-14. No implementation approval.
Requirements: REQ-PROD-002; REQ-FOUND-013; REQ-FEAT-016.

## Objective

Implement registry, persisted practice activation and feature entitlements with real server/UI workflows.

## Scope

Code-owned module descriptors, manager setup flow, simulated grants, operation policies, concurrency/audit and preserved historical access.

## Out of scope

Live billing, arbitrary plugin execution, lab/imaging clinical workflows and provider connection.

## Acceptance criteria

Cross-practice activation/use denied; disabled/not-entitled operations rejected by API; stale changes fail atomically; historical reads/exports retained; practice switching updates UI.

## Expected code / document areas

modules/capabilities (proposed), modules/subscription, modules/practice, mvp-composition, GraphQL contracts and practice settings; additive Prisma models.

## Test impact

ADD negative API/UI activation, concurrent disable, entitlement and historical access tests; KEEP SaaS/core regressions.

## Dependencies

Existing TASK-020–023 foundation; ADR-011 review.

## Architecture decision

Registry/activation ADR-011 required before implementation.

Governance: synthetic development only unless separately approved. Requirements remain Draft. Before future implementation create Doc/Changes/Justification/TASK-036-<description>.md and explicit approval evidence. No deletion of files, tests, fields, APIs or behavior authorized.
