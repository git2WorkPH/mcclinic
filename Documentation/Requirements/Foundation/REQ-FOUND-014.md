# REQ-FOUND-014 — Diagnostic connectors and protected media

Status: Draft v0.1, 2026-09-14. Requirements discussion only; no implementation approval.
Owner intent: optional subscribed-practice features such as laboratory, X-ray and 2D echo.

## Objective

Provide tenant-safe exchange and storage primitives for laboratory and imaging modules.

## Scope

Provider adapters, external-identity reconciliation, durable delivery and protected diagnostic file access. A future synthetic/local adapter comes before any live provider connection.

## Functional rules

- FR-01: Provider/protocol details and credentials stay behind infrastructure ports; clinical domain models do not depend on vendor SDKs. Each connection belongs to a practice and explicit service authorization.
- FR-02: Verify sender identity/signature and payload before accepting external delivery; enforce replay/idempotency checks, correlation and tenant-specific patient/order mappings. Never match solely by name or guess ambiguous identity.
- FR-03: Persist clinical change/audit/outbox atomically; send after commit. Use bounded retries, visible failure/unknown status and reconciliation. A timeout is not proof that an order was not received.
- FR-04: Disabling connection stops new outbound work; already-sent order acknowledgements/results require an explicit authorized hold/reconciliation route so callbacks are not silently lost. Preserve delivery evidence.
- FR-05: Store clinical metadata in PostgreSQL and binary media behind a private storage port; keep binary payloads out of general GraphQL JSON. Reauthorize upload/fetch/export and derivative access against practice/resource ownership.
- FR-06: Validate actual file type, configurable size/quota and integrity; quarantine until content checks pass. Do not execute uploaded content. Preserve immutable originals and version/reference derivatives.
- FR-07: Support bounded/resumable transfers and cancellation where justified, explicit progress/retry, small metadata-first views and access-controlled on-demand media. No offline synchronization or silent browser clinical cache.
- FR-08: Use expiring scoped download/upload grants if selected; prevent public object paths and cross-tenant guessed keys. Backup/recovery, archive outage and quota exhaustion must be designed before real diagnostic storage.

## Acceptance criteria

- AC-01: Duplicate/replayed results create no duplicate clinical entry; malformed/authentication-failed events produce no accepted result. Ambiguous patient mappings enter a visible restricted reconciliation queue.
- AC-02: Network timeout/retry cannot silently duplicate an external order; receipt and review statuses remain distinct.
- AC-03: Another practice cannot read original files, thumbnails, cached derivatives or exports even with a valid foreign resource ID.
- AC-04: Interrupted/oversized/unsupported uploads and storage failures preserve database/audit consistency; unsafe content is not previewed.
- AC-05: Disable/expire with queued and already-sent work preserves evidence and makes unresolved deliveries visible.

## Authorization implications

Minimum required clinical access; practice management sees operational status without gaining clinical file contents. No platform operator implicit record access. Vendors cannot choose an arbitrary tenant by payload.

## Data requirements

Practice/module/connection IDs; external mapping and correlation; outbox/inbox/idempotency records; file metadata/digests/object references, quarantine and transfer state; credential references only, never secrets in logs.

## Audit implications

Connection changes, transfer acceptance/rejection, mapping/reconciliation, file access/export and delivery transitions. Retain provenance and audit versions; no automatic retention purge.

## Expected tests

ADD synthetic provider contract/failure tests, transaction rollback, duplicate/out-of-order events, revoked connection, interrupted uploads, content validation, storage failure and tenant leakage tests; KEEP core clinical regressions.

## Unresolved questions / findings

FIND-015/016: actual provider auth/protocol, file limits, scanning/viewer/archive choice, storage budget, Philippine data handling and residency/consent decisions. No regulatory compliance or DICOM conformance claimed.

## Traceability

TASK-037 and TASK-040; REQ-FOUND-008/009/013. Architecture proposal ADR-011; assessment Documentation/Assessment/OPTIONAL-MODULES.md. Preserve existing requirements and production findings.
