# TASK-039 — X-ray and echo report/reference development workflow

Status: Proposed, 2026-09-14. No implementation approval.
Requirements: REQ-FEAT-018; REQ-FOUND-014.

## Objective

Implement independently enabled X-ray and echo report/history workflows for synthetic development.

## Scope

Owner-approved report/reference-first stage, protected attachments, source/version metadata, on-demand non-diagnostic previews and resilient transfer status.

## Out of scope

PACS/device connection, diagnostic viewing, measurement calculations, arbitrary video support, AI interpretation and clinical certification.

## Acceptance criteria

REQ-FEAT-018 AC-01–06 pass; entitlement independent by modality; source/report versions preserved; wrong-tenant file access denied; interrupted transfer is explicit; no false diagnostic capability.

## Expected code / document areas

proposed imaging module and shared diagnostic media ports; patient history interface; upload/review UI and additive Prisma models.

## Test impact

ADD synthetic report/media persistence, privacy, amendment, interrupt/retry and browser preview tests; KEEP clinical history regressions.

## Dependencies

TASK-036/037; FIND-016 stage/media/viewer decisions.

## Architecture decision

ADR for study/report/media ownership and non-diagnostic preview boundary required.

Governance: synthetic development only unless separately approved. Requirements remain Draft. Before future implementation create Doc/Changes/Justification/TASK-039-<description>.md and explicit approval evidence. No deletion of files, tests, fields, APIs or behavior authorized.

## Owner priority decision — 2026-09-14

Optional modules are future nice-to-have backlog, not near-term work. Preserve these proposals and open findings; no implementation approval. Owner instruction: “lets keep that as future and a nice to have for now”.
