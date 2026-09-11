# FIND-007 — Patient identity and scheduling workflow detail
Status: Open
Severity: blocking for affected feature rules
Owner: project owner; technical recommendations prepared by Codex
Requirements: [REQ-FEAT-001](../../Requirements/Features/REQ-FEAT-001.md) v0.1 AC-01–AC-03, [REQ-FEAT-002](../../Requirements/Features/REQ-FEAT-002.md) v0.1 AC-01–AC-03, [REQ-FEAT-003](../../Requirements/Features/REQ-FEAT-003.md) v0.1 AC-01–AC-03, [REQ-FEAT-004](../../Requirements/Features/REQ-FEAT-004.md) v0.1 AC-01–AC-03, [REQ-FEAT-005](../../Requirements/Features/REQ-FEAT-005.md) v0.1 AC-01–AC-03, [REQ-FEAT-010](../../Requirements/Features/REQ-FEAT-010.md) v0.1 AC-01–AC-03, [REQ-FEAT-011](../../Requirements/Features/REQ-FEAT-011.md) v0.1 AC-01–AC-03, [REQ-FEAT-012](../../Requirements/Features/REQ-FEAT-012.md) v0.1 AC-01–AC-03

## Evidence and impact
SCOPE.md lists patient and scheduling actions but no mandatory identity fields, duplicate/search policy, encounter/note format, scheduling overlap policy or check-in transition matrix.
Evidence sources: [project profile](../../Project/PROJECT.md), [scope](../../Project/SCOPE.md), [initial assessment](../INITIAL_ASSESSMENT.md). This is missing policy/design evidence, not a proven application defect; no application exists.

## Proposed response / decision needed
Approve patient fields/identifiers and duplicate handling (merging excluded); search keys/matching/summaries and performance targets; note format/save semantics; clinical time/history presentation; appointment duration/conflict/timezone rules, cancellation reasons and check-in eligibility/reversal. Walk-ins remain excluded.

## Tracking
- Tasks: [TASK-005](../../Tasks/Proposed/TASK-005.md), [TASK-006](../../Tasks/Proposed/TASK-006.md), [TASK-007](../../Tasks/Proposed/TASK-007.md), [TASK-008](../../Tasks/Proposed/TASK-008.md), [TASK-009](../../Tasks/Proposed/TASK-009.md), [TASK-017](../../Tasks/Proposed/TASK-017.md), [TASK-018](../../Tasks/Proposed/TASK-018.md), [TASK-019](../../Tasks/Proposed/TASK-019.md).
- Resolution/defer evidence: pending; no owner decision fabricated.
- Verification: documentation/Git inspection only; runtime and regulatory verification NOT RUN.
- Deletions proposed: none.
