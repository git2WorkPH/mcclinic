# REQ-PROD-002 — Optional practice modules

Status: Draft v0.1, 2026-09-14. Requirements discussion only; no implementation approval.
Owner intent: optional subscribed-practice features such as laboratory, X-ray and 2D echo.

## Objective

Allow one-doctor or team practices to choose additional capabilities without replacing the core EHR.

## Scope

Platform-managed module catalog, practice activation and optional commercial entitlements. A module capability, its activation, an external connector, a user permission and a subscription entitlement are separate concepts. No arbitrary uploaded executable plugins, live charging or new clinical workflow is authorized by this draft.

## Functional rules

- FR-01: Core patient/history/notes/scheduling functionality remains available under existing policies regardless of optional module selection.
- FR-02: Install means enabling an already platform-deployed, compatible module for a practice; platform owners control reviewed releases, practice managers control their practice configuration.
- FR-03: Catalog states explain available, included/eligible, setup required, enabled, suspended and unavailable without claiming an integration is connected before verification.
- FR-04: Commercial packaging may include plan-included or separately entitled modules; exact prices/trials/quotas remain undecided. Development uses simulated grants only.
- FR-05: Disabling, expiration or downgrade must not delete clinical data or bypass the authorized historical read/export route; no automatic uninstall purge.

## Acceptance criteria

- AC-01: Two practices can enable different modules without sharing data or changing each other’s core EHR behavior.
- AC-02: A module can be deployed but not entitled, entitled but not configured, or configured but disabled; UI explains the state accurately.
- AC-03: Disable/re-enable and subscription restriction preserve records/provenance and existing role-limited history/export.

## Authorization implications

Practice membership and manage permission required to change activation; no implicit clinical record access for billing/practice administrators. A multi-practice user must select the target practice explicitly.

## Data requirements

Stable module identifiers, catalog/release compatibility, dependency metadata, practice activation/configuration versions, entitlement/grant provenance. Avoid tenant-specific code forks.

## Audit implications

Catalog/release changes by platform operators and activation/entitlement changes by practice actors have separate attributable events; no clinical payload in billing logs.

## Expected tests

ADD cross-practice activation, permissions, switch behavior, state explanations and disable/re-enable history tests; KEEP core SaaS/clinical regressions.

## Unresolved questions / findings

FIND-014: bundles versus paid add-ons, who can manage modules, preview/trial/seat/storage limits. Owner selects rollout priority; no prices invented.

## Traceability

TASK-036; REQ-FOUND-013 and REQ-FEAT-016. Architecture proposal ADR-011; assessment Documentation/Assessment/OPTIONAL-MODULES.md. Preserve existing requirements and production findings.
