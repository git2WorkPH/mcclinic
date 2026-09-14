# TASK-037 — Diagnostic delivery and private media foundation

Status: Proposed, 2026-09-14. No implementation approval.
Requirements: REQ-FOUND-014; REQ-FOUND-013.

## Objective

Implement synthetic connector/media ports and reliable tenant-scoped exchange primitives.

## Scope

Private local storage adapter, validated/quarantined uploads, scoped downloads, outbox/inbox/idempotency, explicit reconciliation and retry/disable state.

## Out of scope

Live provider credentials, production object storage, DICOM viewer, clinical alert rules, automatic purge or offline sync.

## Acceptance criteria

Duplicate/sender-invalid/wrong-tenant events denied; ambiguous mappings quarantined; DB/audit/outbox rollback atomic; interruptions and quota limits handled; in-flight work retained on disable; no public file path.

## Expected code / document areas

proposed integration/media modules, Prisma, protected API routes, worker composition, tests and local fixtures.

## Test impact

ADD contract, failure/replay, rollback, media validation and tenant access tests; KEEP existing tests.

## Dependencies

TASK-036; FIND-015/016 technical defaults; preserve TASK-035 public-release gates.

## Architecture decision

ADR required for private storage and delivery/in-flight-state guarantees; ADR-011 is conceptual only.

Governance: synthetic development only unless separately approved. Requirements remain Draft. Before future implementation create Doc/Changes/Justification/TASK-037-<description>.md and explicit approval evidence. No deletion of files, tests, fields, APIs or behavior authorized.

## Owner priority decision — 2026-09-14

Optional modules are future nice-to-have backlog, not near-term work. Preserve these proposals and open findings; no implementation approval. Owner instruction: “lets keep that as future and a nice to have for now”.
