# REQ-FEAT-017 — Optional laboratory requests and results

Status: Draft v0.1, 2026-09-14. Requirements discussion only; no implementation approval.
Owner intent: optional subscribed-practice features such as laboratory, X-ray and 2D echo.

## Objective

Add laboratory work as an optional practice-owned module linked to patient and encounter history.

## Scope

Separate levels: manual request/result recording and report attachments; synthetic connector workflow; later provider-specific electronic orders/results. Each level needs its own approval, not assumed by enabling a feature.

## Functional rules

- FR-01: Link request/result to a verified practice patient and optional matching consultation; preserve author, source provider, collected/issued/received times where supplied, original report and correction history.
- FR-02: Maintain distinct draft/requested/sent/acknowledged/result-received/reviewed concepts with a reviewed detailed state machine before implementation; transport success must not mark a result clinically reviewed.
- FR-03: Preserve supplied test names/codes, values, units, reference ranges and provider flags without silently normalizing or inventing clinical interpretation. Missing data is explicit.
- FR-04: Imported results need verified order/patient mapping; unmatched or conflicting identifiers require authorized reconciliation. Never use a global patient identity to share between tenants.
- FR-05: Signed/final records are corrected by attributable linked amendments, not overwrite. Show reviewed/unreviewed state and provenance in history.
- FR-06: Critical-result response, notification/escalation, ordering entitlement, clinical catalogs and clinician review rules remain explicit open production decisions. No diagnostic recommendations, auto-treatment or assumed alert service.

## Acceptance criteria

- AC-01: Authorized clinician records a synthetic request/result and source attachment; history links back to the exact source/version.
- AC-02: Wrong patient/encounter pairing or practice access is denied atomically; duplicate provider result delivery cannot create duplicates.
- AC-03: A corrected report preserves original content, correction reason/provenance and independent clinical review status.
- AC-04: Connection failure or ambiguous mapping is visible and cannot falsely complete an order or mark results reviewed.
- AC-05: Disabled feature blocks new orders but preserves authorized history/report retrieval.

## Authorization implications

Ordering, result entry, reconciliation and clinical review require separately defined clinical permissions. Reception/admin do not automatically acquire result access by enabling the feature.

## Data requirements

Practice/patient/encounter/order/result/source IDs, provider timestamps with timezone semantics, original values/units/reference ranges, report versions/review attribution and document references. No fixed lab test catalog yet.

## Audit implications

Create/amend/order/send/receive/reconcile/review/export events with versions and actor/service identity; atomic persistence where required.

## Expected tests

ADD request/result lifecycle, source identity, corrections, received-versus-reviewed, duplicate/misrouted delivery, concurrency, audit rollback and disabled-history tests using synthetic data.

## Unresolved questions / findings

FIND-015: first lab/provider, manual versus electronic MVP, supported catalogs/protocols, critical-result responsibility and local rules. Existing REQ-FOUND-009 boundary remains historical design-only scope.

## Traceability

TASK-038 and TASK-040; REQ-FOUND-009/013/014. Architecture proposal ADR-011; assessment Documentation/Assessment/OPTIONAL-MODULES.md. Preserve existing requirements and production findings.
