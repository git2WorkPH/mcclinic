# REQ-FOUND-008 — Persistence and data protection
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Use PostgreSQL with Prisma adapters, safe migrations and explicit data protection decisions.

## Functional rules
- FR-01: Constraints reject invalid patient/encounter references and cross-patient document associations.
- FR-02: Transactions preserve clinical/version/audit consistency under failure and concurrency.
- FR-03: Approved migration, backup/restore and secrets/logging protection procedures are documented and verified with synthetic data before release.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Relational identities, foreign keys, versions, UTC instants plus relevant local-zone context; residency/retention and backup policy pending.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
Testcontainers constraints, migrations, rollback/concurrency and synthetic restore verification.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-001](../../Assessment/Findings/FIND-001.md)
- [FIND-005](../../Assessment/Findings/FIND-005.md)
- [FIND-006](../../Assessment/Findings/FIND-006.md)

## Traceability and assessment
- Proposed task: [TASK-002](../../Tasks/Proposed/TASK-002.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.

## v0.2-MVP acceptance overlay — 2026-09-10
Owner explicitly authorizes reversible defaults in [MVP assumptions](../../Project/MVP_ASSUMPTIONS.md). Apply existing functional rules/ACs to those concrete local/synthetic defaults. Desktop web only; no production/legal/native claim. Earlier v0.1 policy questions and findings remain open for production; historical text is retained. Runtime evidence must demonstrate real database-backed behavior, permissions, integrity/audit and applicable failures before MVP completion.

## MVP implementation evidence — 2026-09-11
Current v0.2-MVP scope: implemented and verified under the owner exception; see [verification index](../../Acceptance/MVP-VERIFICATION.md) and linked completed tasks. Original v0.1 history and production findings remain unchanged. MVP completion is not production readiness.
