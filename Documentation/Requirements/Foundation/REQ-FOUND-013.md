# REQ-FOUND-013 — Module registry, activation and entitlements

Status: Draft v0.1, 2026-09-14. Requirements discussion only; no implementation approval.
Owner intent: optional subscribed-practice features such as laboratory, X-ray and 2D echo.

## Objective

Provide a secure extension mechanism within Clean Architecture and the modular monolith.

## Scope

Code-owned module registry, explicit module contracts and tenant-scoped activation/entitlement enforcement; not microservices or a dynamic code marketplace.

## Functional rules

- FR-01: Modules own domain/application/adapters and persistence; use authorized patient/encounter/history interfaces, never cross-module table writes. Composition wires only reviewed modules.
- FR-02: For every new operation require platform module availability, compatible version/dependencies, practice activation, valid feature entitlement, user action permission and resource ownership. Client flags are never authority.
- FR-03: Missing or unsupported module state fails closed. Apply checks to GraphQL, files, exports, scheduled work and inbound/outbound adapters; revalidate state at execution, not only when queued.
- FR-04: Activation/configuration and entitlement changes use expected versions, transactionally consistent checks and atomic audit. Stale tabs or concurrent disable/purchase cannot create unauthorized writes.
- FR-05: Deploy additive shared-schema migrations through platform releases; practice activation does not execute uploaded code or unreviewed schema changes.
- FR-06: Preserve controlled historical read/export even when creation/transmission is disabled; operational suspension behavior for in-flight work must be explicit and tested.
- FR-07: Version module contract, connector protocol, configuration and clinical record separately. Preserve provenance for rollback and compatible historical reads.

## Acceptance criteria

- AC-01: Forged practice IDs, disabled module calls, expired entitlements and wrong-role direct API calls fail with no partial changes.
- AC-02: Two concurrent activation/config changes produce one consistent version and attributable audit; requests cannot race a disable to bypass policy.
- AC-03: Adding a synthetic module uses registry/ports without modifying patient/consultation domain rules or granting raw data access.
- AC-04: Suspension blocks new work while authorized historic reads/exports still function, with failed/ambiguous in-flight deliveries retained.

## Authorization implications

Per-operation policy extends existing tenant/membership checks; administrator management does not confer ordering or report-review permissions. Background jobs carry verified practice/service identity, not a trusting tenant string.

## Data requirements

Registry descriptors/dependencies; per-practice activation/config revisions; entitlement identifiers/effective dates/source; operation/version references. Existing SOLO/TEAM subscriptions remain compatible.

## Audit implications

Atomic changes with actor, practice, module ID, outcome, correlation/version; denied attempts recorded appropriately without secret leakage.

## Expected tests

ADD negative API/file/job authorization, cross-tenant data denial, concurrent activation/restriction, stale client, dependency and rollback compatibility tests; KEEP existing subscription/export regressions.

## Unresolved questions / findings

FIND-014: granular permission owners and billing defaults. ADR-011 Proposed; no generic registry exists today.

## Traceability

TASK-036; REQ-FOUND-010, REQ-FEAT-015, REQ-PROD-002. Architecture proposal ADR-011; assessment Documentation/Assessment/OPTIONAL-MODULES.md. Preserve existing requirements and production findings.
