# FIND-006 — Retention, backups and operational data protection
Status: Open
Severity: blocking for retention implementation and production readiness
Owner: project owner; technical recommendations prepared by Codex
Requirements: [REQ-FOUND-005](../../Requirements/Foundation/REQ-FOUND-005.md) v0.1 AC-01–AC-03, [REQ-FOUND-008](../../Requirements/Foundation/REQ-FOUND-008.md) v0.1 AC-01–AC-03

## Evidence and impact
PROJECT.md calls for data protection without durations, recovery objectives, deployment topology or approved disposal rules. No persistence or infrastructure is implemented.
Evidence sources: [project profile](../../Project/PROJECT.md), [scope](../../Project/SCOPE.md), [initial assessment](../INITIAL_ASSESSMENT.md). This is missing policy/design evidence, not a proven application defect; no application exists.

## Proposed response / decision needed
Decide record/audit/artifact retention and residency, backup recovery objectives and restore access, encryption/secrets controls, observability redaction and access/export handling. Do not introduce automated purges; every deletion needs explicit approval.

## Tracking
- Tasks: [TASK-002](../../Tasks/Proposed/TASK-002.md), [TASK-004](../../Tasks/Proposed/TASK-004.md).
- Resolution/defer evidence: pending; no owner decision fabricated.
- Verification: documentation/Git inspection only; runtime and regulatory verification NOT RUN.
- Deletions proposed: none.
