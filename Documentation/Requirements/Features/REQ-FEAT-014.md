# REQ-FEAT-014 — Versioned practice document templates
Status: Approved for synthetic development SaaS, v0.3. Owner instruction 2026-09-11.
## Objective and scope
Guided allowlisted placeholders, draft/publish, synthetic preview, immutable populated issue snapshots and safe missing-value handling.
## Functional rules and acceptance criteria
- AC-01: Actual persisted UI/API workflow within an authenticated practice; no client-only access control.
- AC-02: Invalid inputs, unauthorized roles, cross-practice IDs and stale updates fail without partial writes.
- AC-03: Audit and version provenance survive changes; prior MVP functionality and records remain available in the default practice.
- AC-04: Relevant browser/integration checks pass; production/legal readiness is not claimed.
## Authorization
Verified active membership; role is practice-specific. Clinical operations retain clinician-only authorization; practice administrators manage configuration. No implicit platform support access.
## Data and audit
Stable practice/user/resource IDs, versioned state and actor/time/correlation metadata. No automatic removal. Tenant ownership applies to all record access and exports.
## Expected tests
ADD tenant denial, validation/concurrency, state transitions and persisted UI tests; KEEP prior regressions.
## Findings
Philippine legal/privacy/signature/retention rules remain Open production questions. See MVP_ASSUMPTIONS and ADR-006. No legal verification inferred.
## Task
[TASK-022](../../Tasks/Completed/TASK-022.md)

## Implementation evidence — 2026-09-12
Guided allowlisted sections/layout and synthetic full-document preview; draft/publish versions, preserved published revisions, issue-time age/address and immutable populated/rendered snapshots. Invalid tokens/markup/missing fields and cross-tenant printing denied; previous versions unchanged after branding/template edits and amendments. See [acceptance](../../Acceptance/TASK-022-acceptance.md). Production findings remain Open.
