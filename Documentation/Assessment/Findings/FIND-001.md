# FIND-001 — Jurisdiction and clinical/privacy policy
Status: Open
Severity: blocking for clinical-document rules and production
Owner: project owner; technical recommendations prepared by Codex
Requirements: [REQ-PROD-001](../../Requirements/Product/REQ-PROD-001.md) v0.1 AC-01–AC-03, [REQ-FOUND-007](../../Requirements/Foundation/REQ-FOUND-007.md) v0.1 AC-01–AC-03, [REQ-FOUND-008](../../Requirements/Foundation/REQ-FOUND-008.md) v0.1 AC-01–AC-03, [REQ-FEAT-006](../../Requirements/Features/REQ-FEAT-006.md) v0.1 AC-01–AC-03, [REQ-FEAT-007](../../Requirements/Features/REQ-FEAT-007.md) v0.1 AC-01–AC-03, [REQ-FEAT-008](../../Requirements/Features/REQ-FEAT-008.md) v0.1 AC-01–AC-03, [REQ-FEAT-009](../../Requirements/Features/REQ-FEAT-009.md) v0.1 AC-01–AC-03

## Evidence and impact
PROJECT.md Data protection and SCOPE.md Prescription/Medical certificate explicitly defer jurisdiction-specific requirements. User provided no governing jurisdiction; workstation timezone is not evidence of jurisdiction.
Evidence sources: [project profile](../../Project/PROJECT.md), [scope](../../Project/SCOPE.md), [initial assessment](../INITIAL_ASSESSMENT.md). This is missing policy/design evidence, not a proven application defect; no application exists.

## Proposed response / decision needed
Identify operating jurisdiction(s), responsible clinical/legal policy owner, privacy/residency/consent/access obligations, and source of approved prescription/certificate rules. Record sourced decisions before dependent implementation; no compliance claim now.

## Tracking
- Tasks: [TASK-002](../../Tasks/Proposed/TASK-002.md), [TASK-010](../../Tasks/Proposed/TASK-010.md), [TASK-011](../../Tasks/Proposed/TASK-011.md), [TASK-013](../../Tasks/Proposed/TASK-013.md), [TASK-014](../../Tasks/Proposed/TASK-014.md).
- Resolution/defer evidence: pending; no owner decision fabricated.
- Verification: documentation/Git inspection only; runtime and regulatory verification NOT RUN.
- Deletions proposed: none.
