# REQ-PROD-001 — Initial clinician workflow
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Deliver the agreed patient, clinical documentation and scheduling workflows for authorized clinic users. Excludes billing, portals, live labs, e-prescribing, offline sync and unapproved multi-tenancy.

## Functional rules
- FR-01: A synthetic patient can be registered, found and opened, with consultation notes, issued documents and history linked to the same patient identity.
- FR-02: An authorized user can book, reschedule or cancel an appointment and check in an eligible booking; unauthorized actions are denied.
- FR-03: Each claimed supported platform completes its applicable workflow and print checks before support is advertised.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Patient, encounter, document, appointment and actor references; supported-platform matrix.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
End-to-end synthetic clinician/reception scenarios, denial and cross-patient checks; native checks where applicable.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-001](../../Assessment/Findings/FIND-001.md)
- [FIND-002](../../Assessment/Findings/FIND-002.md)
- [FIND-003](../../Assessment/Findings/FIND-003.md)

## Traceability and assessment
- Proposed task: [TASK-016](../../Tasks/Proposed/TASK-016.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.

## v0.2-MVP acceptance overlay — 2026-09-10
Owner explicitly authorizes reversible defaults in [MVP assumptions](../../Project/MVP_ASSUMPTIONS.md). Apply existing functional rules/ACs to those concrete local/synthetic defaults. Desktop web only; no production/legal/native claim. Earlier v0.1 policy questions and findings remain open for production; historical text is retained. Runtime evidence must demonstrate real database-backed behavior, permissions, integrity/audit and applicable failures before MVP completion.
