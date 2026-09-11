# REQ-FOUND-009 — Future laboratory integration boundary
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Document a future feature/module port boundary without building laboratory capabilities.

## Functional rules
- FR-01: The architecture describes how a future lab module consumes explicit patient/encounter interfaces without table access or vendor dependencies in core modules.
- FR-02: Identity mapping, credentials, idempotency, acknowledgements, retries and reconciliation are recorded as future design obligations.
- FR-03: No lab endpoint, schema fields, vendor SDK or speculative request/result workflow is added by the boundary-design task.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
No patient access is introduced by foundation setup/design; future protected use cases must enforce server authorization. Build tooling does not grant clinical permissions.

## Data requirements
Conceptual references only; no lab persistence model or protocol selected.

## Audit implications
No clinical runtime events at this stage; document architectural traceability. Future adapters must participate in the approved audit contract.

## Expected tests
Architecture dependency review and future integration scenario walkthrough; no live lab tests.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-008](../../Assessment/Findings/FIND-008.md)

## Traceability and assessment
- Proposed task: [TASK-015](../../Tasks/Proposed/TASK-015.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.

## Implementation authorization — 2026-09-10
The owner explicitly requested all proposed tasks be implemented. These technical criteria are the implementation baseline under that approval; policy-dependent findings remain open. See the current Approved task record.

## v0.2-MVP acceptance overlay — 2026-09-10
Owner explicitly authorizes reversible defaults in [MVP assumptions](../../Project/MVP_ASSUMPTIONS.md). Apply existing functional rules/ACs to those concrete local/synthetic defaults. Desktop web only; no production/legal/native claim. Earlier v0.1 policy questions and findings remain open for production; historical text is retained. Runtime evidence must demonstrate real database-backed behavior, permissions, integrity/audit and applicable failures before MVP completion.
