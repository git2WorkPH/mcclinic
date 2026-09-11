# REQ-FOUND-005 — Audit trail
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Provide protected evidence for meaningful clinical/security operations without excessive clinical payloads.

## Functional rules
- FR-01: Approved mutation events record actor, subject, action, timestamp, outcome and correlation/version references.
- FR-02: A clinical mutation and required durable audit evidence commit together or neither commits.
- FR-03: Ordinary users cannot edit/delete audit entries; audit access and read/search/print event coverage follow the approved catalogue.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Audit ID, actor/subject/action/time/outcome/correlation/version; retention undecided.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
Atomic rollback, restricted audit access, redaction, event catalogue and retry tests.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-002](../../Assessment/Findings/FIND-002.md)
- [FIND-005](../../Assessment/Findings/FIND-005.md)
- [FIND-006](../../Assessment/Findings/FIND-006.md)

## Traceability and assessment
- Proposed task: [TASK-004](../../Tasks/Proposed/TASK-004.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.

## v0.2-MVP acceptance overlay — 2026-09-10
Owner explicitly authorizes reversible defaults in [MVP assumptions](../../Project/MVP_ASSUMPTIONS.md). Apply existing functional rules/ACs to those concrete local/synthetic defaults. Desktop web only; no production/legal/native claim. Earlier v0.1 policy questions and findings remain open for production; historical text is retained. Runtime evidence must demonstrate real database-backed behavior, permissions, integrity/audit and applicable failures before MVP completion.
