# REQ-FOUND-002 — Shared packages and module boundaries
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Keep feature-owned business logic inside a modular monolith; share only demonstrated cross-consumer needs.

## Functional rules
- FR-01: Domain/application modules import no React Native, Express, GraphQL Yoga or Prisma implementation.
- FR-02: Resolvers invoke use cases; persistence adapters implement inward-facing ports; modules do not manipulate each other’s tables.
- FR-03: Each shared package identifies its consumers and purpose; public/generated contracts do not expose Prisma models.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
No patient access is introduced by foundation setup/design; future protected use cases must enforce server authorization. Build tooling does not grant clinical permissions.

## Data requirements
Contract DTOs, validation primitives, module ownership and dependency map.

## Audit implications
No clinical runtime events at this stage; document architectural traceability. Future adapters must participate in the approved audit contract.

## Expected tests
Dependency boundary checks and contract generation/typecheck.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-008](../../Assessment/Findings/FIND-008.md)

## Traceability and assessment
- Proposed task: [TASK-001](../../Tasks/Proposed/TASK-001.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.

## Implementation authorization — 2026-09-10
The owner explicitly requested all proposed tasks be implemented. These technical criteria are the implementation baseline under that approval; policy-dependent findings remain open. See the current Approved task record.
