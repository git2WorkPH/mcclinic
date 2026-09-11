# REQ-FOUND-010 — Tenant isolation and practice membership
Status: Approved for synthetic development SaaS, v0.3. Owner instruction 2026-09-11.
## Objective and scope
Practice ownership, membership-based roles, explicit switching, tenant-bound queries and additive default-practice migration.
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
[TASK-020](../../Tasks/Completed/TASK-020.md)

## Implementation evidence — 2026-09-12
Additive default-practice migration; memberships/management grants; scoped repositories and composite tenant foreign keys; switching and role-limited exports. Migration preservation, forged-ID denial, role changes, solo clinician and seat-race scenarios passed. See [acceptance](../../Acceptance/TASK-020-acceptance.md). Production findings remain Open.
