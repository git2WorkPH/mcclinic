# FIND-003 — Supported platforms and printing feasibility
Status: Open
Severity: blocking for platform support claims and rendering selection
Owner: project owner; technical recommendations prepared by Codex
Requirements: [REQ-PROD-001](../../Requirements/Product/REQ-PROD-001.md) v0.1 AC-01–AC-03, [REQ-FOUND-001](../../Requirements/Foundation/REQ-FOUND-001.md) v0.1 AC-01–AC-03, [REQ-FOUND-007](../../Requirements/Foundation/REQ-FOUND-007.md) v0.1 AC-01–AC-03, [REQ-FEAT-007](../../Requirements/Features/REQ-FEAT-007.md) v0.1 AC-01–AC-03, [REQ-FEAT-009](../../Requirements/Features/REQ-FEAT-009.md) v0.1 AC-01–AC-03

## Evidence and impact
PROJECT.md has unvalidated web/tablet/mobile targets; ehr-architecture requires evaluating React Native Web clinician interactions and printing. No app exists to test.
Evidence sources: [project profile](../../Project/PROJECT.md), [scope](../../Project/SCOPE.md), [initial assessment](../INITIAL_ASSESSMENT.md). This is missing policy/design evidence, not a proven application defect; no application exists.

## Proposed response / decision needed
Prioritize browser/OS/native targets and print/export expectations. Approve feasibility criteria for keyboard/dense forms, note entry, history, long document pagination and native printing. Bootstrap creates candidate shells only; a platform deviation requires accepted ADR.

## Tracking
- Tasks: [TASK-001](../../Tasks/Proposed/TASK-001.md), [TASK-012](../../Tasks/Proposed/TASK-012.md), [TASK-016](../../Tasks/Proposed/TASK-016.md).
- Resolution/defer evidence: pending; no owner decision fabricated.
- Verification: documentation/Git inspection only; runtime and regulatory verification NOT RUN.
- Deletions proposed: none.
