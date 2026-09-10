# REQ-FEAT-006 — Prescriptions
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Create and issue patient prescriptions under approved prescribing rules; excludes medication databases, interactions and electronic transmission.

## Functional rules
- FR-01: Approved medication/directions and prescriber/patient fields validate before issuance; invalid or unauthorized issuance fails.
- FR-02: If an encounter is linked, it belongs to the same patient; issuance stores immutable attributable clinical content.
- FR-03: Authorized users can retrieve prior prescriptions and trace amendments/status changes using the approved lifecycle.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Patient/prescriber/optional encounter, medication items/directions, issue time, identifiers and versions; legal fields, repeats and signature unresolved.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
Approved field validation, prescriber denials, association, retry, lifecycle and retrieval tests.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-001](../../Assessment/Findings/FIND-001.md)
- [FIND-004](../../Assessment/Findings/FIND-004.md)
- [FIND-005](../../Assessment/Findings/FIND-005.md)

## Traceability and assessment
- Proposed task: [TASK-010](../../Tasks/Proposed/TASK-010.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.
