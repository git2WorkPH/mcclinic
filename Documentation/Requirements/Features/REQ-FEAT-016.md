# REQ-FEAT-016 — Practice feature catalog and setup

Status: Draft v0.1, 2026-09-14. Requirements discussion only; no implementation approval.
Owner intent: optional subscribed-practice features such as laboratory, X-ray and 2D echo.

## Objective

Let eligible practice managers discover, enable, configure and suspend optional capabilities.

## Scope

Practice settings catalog and setup/status flow, initially simulated entitlement changes and synthetic connector validation. Not an app-store executable download.

## Functional rules

- FR-01: Show clear module descriptions, prerequisites, availability/entitlement, setup status and any known development limitations; do not fabricate pricing.
- FR-02: Require explicit practice context and authorized manager confirmation of activation/config changes. A clinician without manage permission can use an enabled capability only within clinical permissions.
- FR-03: Enablement validates module dependencies and server entitlements; secrets are write-only/redacted and synthetic connection tests must not contact production endpoints.
- FR-04: Practice switching refreshes feature navigation and configuration state; stale screens cannot use former practice credentials or activation.
- FR-05: Suspend/disable explains impact on new work and preserves access to existing history according to clinical permissions; no delete/uninstall-record action.
- FR-06: Connection successful, subscription eligible and clinical permission granted are separately represented. No claim of provider or legal verification from a green demo status.

## Acceptance criteria

- AC-01: Manager enables a synthetic feature, completes required setup and sees working state for only that practice; unauthorized users cannot mutate setup by API.
- AC-02: Missing dependency/entitlement or failed connection produces actionable state, not placeholder success.
- AC-03: Switching practices and disabling a module updates navigation while direct APIs remain independently enforced.
- AC-04: Disabled module records remain accessible/exportable to authorized users and inaccessible to other roles/tenants.

## Authorization implications

Practice manager changes settings; clinical action rights separate. Platform catalog publication restricted to platform operators.

## Data requirements

Catalog descriptions, activation/config versions, setup validation result/time, redacted connector metadata and entitlement explanation.

## Audit implications

Activation/disable/config/test outcomes with actor/practice/module/correlation; no credential or clinical payload disclosure.

## Expected tests

ADD actual persisted UI/API workflows, manager/clinician/reception denials, switch/stale-tab tests and configuration failure recovery; KEEP existing practice settings.

## Unresolved questions / findings

FIND-014: menu label (Features/Add-ons), who can enable a paid feature and future pricing flow; do not implement charges.

## Traceability

TASK-036; REQ-PROD-002, REQ-FOUND-013/014. Architecture proposal ADR-011; assessment Documentation/Assessment/OPTIONAL-MODULES.md. Preserve existing requirements and production findings.
