# REQ-FEAT-007 — Printable prescriptions
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Produce and print/export approved prescription content through the common document architecture.

## Functional rules
- FR-01: An authorized request renders the selected issued prescription version with exactly its approved medication/directions and identity fields.
- FR-02: Approved template fields remain legible and complete with long/multiple medication items across pages.
- FR-03: Cancel/failure/reprint behavior is visible and audited as approved without reissuing the prescription.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Prescription snapshot/template version and rendering/print request metadata; paper/signature rules pending.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
Snapshot/content, multi-item pagination, denial, cancellation and supported print-adapter checks.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-001](../../Assessment/Findings/FIND-001.md)
- [FIND-003](../../Assessment/Findings/FIND-003.md)
- [FIND-004](../../Assessment/Findings/FIND-004.md)

## Traceability and assessment
- Proposed task: [TASK-013](../../Tasks/Proposed/TASK-013.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.
