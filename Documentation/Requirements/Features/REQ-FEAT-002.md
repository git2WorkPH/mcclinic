# REQ-FEAT-002 — Patient search
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Find patients using approved identifiers/demographics and disclose only permitted summary fields.

## Functional rules
- FR-01: Authorized searches return paginated, deterministically ordered matching summaries within permitted scope.
- FR-02: Empty, no-match and ambiguous results are distinguishable and do not auto-select a patient.
- FR-03: Search parameter validation and unauthorized queries cannot expose hidden records or sensitive search terms in ordinary logs.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Approved search keys, summary fields and cursor/order; matching and performance thresholds pending.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
Exact/partial matching per approved policy, pagination, ambiguity, empty results and disclosure checks.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-002](../../Assessment/Findings/FIND-002.md)
- [FIND-007](../../Assessment/Findings/FIND-007.md)

## Traceability and assessment
- Proposed task: [TASK-006](../../Tasks/Proposed/TASK-006.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.

## v0.2-MVP acceptance overlay — 2026-09-10
Owner explicitly authorizes reversible defaults in [MVP assumptions](../../Project/MVP_ASSUMPTIONS.md). Apply existing functional rules/ACs to those concrete local/synthetic defaults. Desktop web only; no production/legal/native claim. Earlier v0.1 policy questions and findings remain open for production; historical text is retained. Runtime evidence must demonstrate real database-backed behavior, permissions, integrity/audit and applicable failures before MVP completion.

## MVP implementation evidence — 2026-09-11
Current v0.2-MVP scope: implemented and verified under the owner exception; see [verification index](../../Acceptance/MVP-VERIFICATION.md) and linked completed tasks. Original v0.1 history and production findings remain unchanged. MVP completion is not production readiness.
