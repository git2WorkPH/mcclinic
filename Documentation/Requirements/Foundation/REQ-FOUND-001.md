# REQ-FOUND-001 — Workspace and verification platform
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Establish the specified reproducible development stack without implementing clinical features.

## Functional rules
- FR-01: A clean checkout can install from a committed pnpm lockfile and run documented lint, typecheck, test and build commands.
- FR-02: Express hosts GraphQL Yoga; Code Generator output derives from schema/documents and Zod checks untrusted boundary inputs.
- FR-03: Docker Compose supports reproducible PostgreSQL development; Vitest, Testcontainers and appropriate Playwright entry points have meaningful smoke checks.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
No patient access is introduced by foundation setup/design; future protected use cases must enforce server authorization. Build tooling does not grant clinical permissions.

## Data requirements
Workspace manifests, runtime pins, configuration, synthetic fixtures; no credentials committed.

## Audit implications
No clinical runtime events at this stage; document architectural traceability. Future adapters must participate in the approved audit contract.

## Expected tests
Clean install/build and generated-contract reproducibility; database connection smoke and startup failure behavior.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-003](../../Assessment/Findings/FIND-003.md)
- [FIND-009](../../Assessment/Findings/FIND-009.md)

## Traceability and assessment
- Proposed task: [TASK-001](../../Tasks/Proposed/TASK-001.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.
