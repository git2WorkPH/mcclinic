# REQ-FEAT-008 — Medical certificates
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Create and issue attributable patient certificates; approved wording/date/issuer policy required.

## Functional rules
- FR-01: Approved certificate fields and date relationships validate before issuance; unsupported or unauthorized content is rejected.
- FR-02: Patient/issuer/optional encounter relationships are consistent and issuance stores an attributable version.
- FR-03: Authorized history and amendment access preserves prior issued content; no silent replacement occurs.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Patient/issuer/encounter, issue and certificate-specific dates, approved content, versions; diagnosis disclosure/signature policy pending.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
Approved date/content rules, issuer denial, cross-patient association and version/amendment checks.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-001](../../Assessment/Findings/FIND-001.md)
- [FIND-004](../../Assessment/Findings/FIND-004.md)
- [FIND-005](../../Assessment/Findings/FIND-005.md)

## Traceability and assessment
- Proposed task: [TASK-011](../../Tasks/Proposed/TASK-011.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.

## v0.2-MVP acceptance overlay — 2026-09-10
Owner explicitly authorizes reversible defaults in [MVP assumptions](../../Project/MVP_ASSUMPTIONS.md). Apply existing functional rules/ACs to those concrete local/synthetic defaults. Desktop web only; no production/legal/native claim. Earlier v0.1 policy questions and findings remain open for production; historical text is retained. Runtime evidence must demonstrate real database-backed behavior, permissions, integrity/audit and applicable failures before MVP completion.

## MVP implementation evidence — 2026-09-11
Current v0.2-MVP scope: implemented and verified under the owner exception; see [verification index](../../Acceptance/MVP-VERIFICATION.md) and linked completed tasks. Original v0.1 history and production findings remain unchanged. MVP completion is not production readiness.
