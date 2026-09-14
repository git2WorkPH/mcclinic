# TASK-038 — Laboratory request and result development workflow

Status: Proposed, 2026-09-14. No implementation approval.
Requirements: REQ-FEAT-017; REQ-FOUND-009/014.

## Objective

Implement first approved laboratory stage with synthetic data.

## Scope

After owner selects stage, manual request/result and attachment workflow plus synthetic delivery if included; patient history, review, corrections, reconciliation and audit.

## Out of scope

Unselected live provider, invented reference ranges/test catalogs, automatic clinical interpretation/alerts or unverified legal validity.

## Acceptance criteria

REQ-FEAT-017 AC-01–05 pass with actual persisted workflow; wrong patient/tenant rejected; received versus reviewed distinct; original report/corrections retrievable.

## Expected code / document areas

proposed laboratory module; authorized patient/consultation/history interfaces; feature UI and GraphQL; additive clinical schema.

## Test impact

ADD clinical lifecycle, amendment, permission, duplicate/reconciliation, concurrency/audit and browser tests; KEEP core history tests.

## Dependencies

TASK-036/037; FIND-015 selection of manual stage and review semantics. Real integration additionally requires TASK-040 assessment and separate implementation approval.

## Architecture decision

Laboratory lifecycle/record ownership ADR required before implementing stage.

Governance: synthetic development only unless separately approved. Requirements remain Draft. Before future implementation create Doc/Changes/Justification/TASK-038-<description>.md and explicit approval evidence. No deletion of files, tests, fields, APIs or behavior authorized.

## Owner priority decision — 2026-09-14

Optional modules are future nice-to-have backlog, not near-term work. Preserve these proposals and open findings; no implementation approval. Owner instruction: “lets keep that as future and a nice to have for now”.
