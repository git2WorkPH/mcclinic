# REQ-FEAT-018 — Optional X-ray and 2D echo records

Status: Draft v0.1, 2026-09-14. Requirements discussion only; no implementation approval.
Owner intent: optional subscribed-practice features such as laboratory, X-ray and 2D echo.

## Objective

Associate imaging studies and reports with patient history through optional practice modules.

## Scope

Distinguish simple report/PDF/image attachments and external study references from DICOM/PACS integration, diagnostic viewing and echo cine/structured measurements. Propose report/reference-first development; full diagnostic tooling is separately assessed.

## Functional rules

- FR-01: Use separately identifiable X-ray and echocardiography capabilities, sharing protected media/clinical record primitives; users should not need an echo entitlement just to access unrelated X-ray work.
- FR-02: Link study/report to practice patient, optional encounter, modality/procedure, performed/reported times and attributable source/author. Preserve original and amended report versions.
- FR-03: Represent report availability, media transfer and clinician review separately. An uploaded picture is not proof of a complete study or a validated diagnostic viewer.
- FR-04: Preserve original study/series/instance and accession references if a future provider supplies them; do not invent identifiers or claim ordinary PNG/JPEG files are DICOM.
- FR-05: Proposed first stage supports approved report attachments and external study references with explicit non-diagnostic preview labels; any echo clips, DICOM viewer, measurement tools or interpretation require separate compatibility/clinical validation.
- FR-06: Fetch metadata/report before full-resolution media, with explicit sizes/progress/cancel/retry and thumbnails only when safe. Originals remain retrievable to authorized users without degrading or silently recompressing clinical source data.
- FR-07: No automatic image interpretation, ejection-fraction calculations or AI diagnosis. Specialty report fields/measurements, units, validation and sign-off remain clinician-defined findings.
- FR-08: Disabling/expired entitlement preserves old study/report access and provenance under clinical permissions; no purge.

## Acceptance criteria

- AC-01: A synthetic X-ray report and echo report are independently enabled, stored and reachable through correct patient history with cross-tenant denial.
- AC-02: Report amendment preserves original media/source, author/date and review attribution.
- AC-03: Partial upload/archive outage provides visible incomplete/unavailable status, never a misleading completed study.
- AC-04: Basic preview is clearly non-diagnostic; no unsupported viewer/measurement capability is advertised.
- AC-05: Bandwidth-limited/interrupted retrieval supports explicit retry without record duplication, hidden downloads of whole studies or authorization loss.
- AC-06: Disable/re-enable preserves historical reports and permitted exports.

## Authorization implications

Clinical study/report access requires resource-scoped permission; practice admins configure connections without implicit clinical access. Validate expiring media access and derivative ownership.

## Data requirements

Practice/patient/encounter/study/report/modality IDs; source identifiers, originals and derivative references/checksums; transfer and review state; report amendments. Echo report fields and supported media types/sizes remain undecided.

## Audit implications

Study/report capture, viewing/export, amendment, review and access rejection with actor/practice/source provenance; no raw media in audit payloads.

## Expected tests

ADD separate feature entitlement tests, wrong-patient/tenant denial, interrupted large-media retrieval, historical access, report amendments and preview labeling; later DICOM/echo viewer conformance tests require actual vendor fixtures and approval.

## Unresolved questions / findings

FIND-016: report upload versus PACS/device integration, first devices/archive/provider, DICOM conformance/transfer syntaxes and echo video formats, supported viewer purpose, storage/bandwidth limits. Philippine clinical/legal/image retention policy remains open.

## Traceability

TASK-039 and TASK-040; REQ-FOUND-013/014. Architecture proposal ADR-011; assessment Documentation/Assessment/OPTIONAL-MODULES.md. Preserve existing requirements and production findings.
