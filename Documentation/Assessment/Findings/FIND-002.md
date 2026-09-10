# FIND-002 — Identity, permission matrix and clinic scope
Status: Open
Severity: blocking for identity and protected workflows
Owner: project owner; technical recommendations prepared by Codex
Requirements: [REQ-FOUND-003](../../Requirements/Foundation/REQ-FOUND-003.md) v0.1 AC-01–AC-03, [REQ-FOUND-004](../../Requirements/Foundation/REQ-FOUND-004.md) v0.1 AC-01–AC-03, [REQ-FOUND-005](../../Requirements/Foundation/REQ-FOUND-005.md) v0.1 AC-01–AC-03, [REQ-FEAT-001](../../Requirements/Features/REQ-FEAT-001.md) v0.1 AC-01–AC-03, [REQ-FEAT-002](../../Requirements/Features/REQ-FEAT-002.md) v0.1 AC-01–AC-03, [REQ-FEAT-005](../../Requirements/Features/REQ-FEAT-005.md) v0.1 AC-01–AC-03

## Evidence and impact
PROJECT.md names user personas but defines no grants, identity provider, session policy or organization model; SCOPE.md excludes unapproved multi-tenancy.
Evidence sources: [project profile](../../Project/PROJECT.md), [scope](../../Project/SCOPE.md), [initial assessment](../INITIAL_ASSESSMENT.md). This is missing policy/design evidence, not a proven application defect; no application exists.

## Proposed response / decision needed
Choose identity provider/enrollment/session expiry/revocation/recovery rules; approve action/resource matrix for reception, clinicians and administrators, including history, audit and print/export. Decide single-clinic versus explicit clinic scope without assuming SaaS tenancy.

## Tracking
- Tasks: [TASK-003](../../Tasks/Proposed/TASK-003.md).
- Resolution/defer evidence: pending; no owner decision fabricated.
- Verification: documentation/Git inspection only; runtime and regulatory verification NOT RUN.
- Deletions proposed: none.
