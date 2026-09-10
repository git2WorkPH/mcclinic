# FIND-005 — Clinical lifecycle, concurrency and event catalogue
Status: Open
Severity: blocking for finalized records and audit implementation
Owner: project owner; technical recommendations prepared by Codex
Requirements: [REQ-FOUND-005](../../Requirements/Foundation/REQ-FOUND-005.md) v0.1 AC-01–AC-03, [REQ-FOUND-006](../../Requirements/Foundation/REQ-FOUND-006.md) v0.1 AC-01–AC-03, [REQ-FOUND-008](../../Requirements/Foundation/REQ-FOUND-008.md) v0.1 AC-01–AC-03, [REQ-FEAT-003](../../Requirements/Features/REQ-FEAT-003.md) v0.1 AC-01–AC-03, [REQ-FEAT-004](../../Requirements/Features/REQ-FEAT-004.md) v0.1 AC-01–AC-03, [REQ-FEAT-005](../../Requirements/Features/REQ-FEAT-005.md) v0.1 AC-01–AC-03, [REQ-FEAT-006](../../Requirements/Features/REQ-FEAT-006.md) v0.1 AC-01–AC-03, [REQ-FEAT-008](../../Requirements/Features/REQ-FEAT-008.md) v0.1 AC-01–AC-03, [REQ-FEAT-011](../../Requirements/Features/REQ-FEAT-011.md) v0.1 AC-01–AC-03

## Evidence and impact
ehr-architecture prescribes attributable amendments and atomic audit but domain-specific transitions, reason rules and read/search/print events are undefined.
Evidence sources: [project profile](../../Project/PROJECT.md), [scope](../../Project/SCOPE.md), [initial assessment](../INITIAL_ASSESSMENT.md). This is missing policy/design evidence, not a proven application defect; no application exists.

## Proposed response / decision needed
Approve draft/finalized/issued/amended/void states per record type, author privileges, reason rules and timestamp semantics. Approve event catalogue, denied-action treatment, read/search/print auditing and audit access; design optimistic versioning and idempotency in ADR-002.

## Tracking
- Tasks: [TASK-004](../../Tasks/Proposed/TASK-004.md), [TASK-007](../../Tasks/Proposed/TASK-007.md), [TASK-008](../../Tasks/Proposed/TASK-008.md), [TASK-010](../../Tasks/Proposed/TASK-010.md), [TASK-011](../../Tasks/Proposed/TASK-011.md), [TASK-018](../../Tasks/Proposed/TASK-018.md).
- Resolution/defer evidence: pending; no owner decision fabricated.
- Verification: documentation/Git inspection only; runtime and regulatory verification NOT RUN.
- Deletions proposed: none.
