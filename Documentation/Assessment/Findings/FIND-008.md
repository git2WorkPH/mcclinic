# FIND-008 — Starter path and architecture conflicts
Status: Open
Severity: medium; routing reconciled, architecture acceptance pending
Owner: project owner; technical recommendations prepared by Codex
Requirements: [REQ-FOUND-002](../../Requirements/Foundation/REQ-FOUND-002.md) v0.1 AC-01–AC-03, [REQ-FOUND-009](../../Requirements/Foundation/REQ-FOUND-009.md) v0.1 AC-01–AC-03

## Evidence and impact
Original nested kit README expects root installation. PROJECT.md suggests global domain/application/shared packages while ehr-architecture requires feature ownership. Inherited skills use Documentation/Changes/Justification but owner explicitly requires Doc/Changes/Justification.
Evidence sources: [project profile](../../Project/PROJECT.md), [scope](../../Project/SCOPE.md), [initial assessment](../INITIAL_ASSESSMENT.md). This is missing policy/design evidence, not a proven application defect; no application exists.

## Proposed response / decision needed
Root kit installed preserving the source. Root AGENTS makes Doc/Changes/Justification authoritative and disables Jira examples. Accept ADR-001 for concrete layout and ADR-005 for future lab seam. Preserved source/examples are not current decisions.

## Tracking
- Tasks: [TASK-001](../../Tasks/Proposed/TASK-001.md), [TASK-015](../../Tasks/Proposed/TASK-015.md).
- Resolution/defer evidence: pending; no owner decision fabricated.
- Verification: documentation/Git inspection only; runtime and regulatory verification NOT RUN.
- Deletions proposed: none.
