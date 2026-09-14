# REQ-FEAT-015 — Simulated subscriptions and entitlements

Status: Approved for synthetic development SaaS, v0.3. Owner instruction 2026-09-11.

## Objective and scope

Plans, clinician seat limits, trial/active/past-due/restricted states, simulated billing and permission-preserving export.

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

[TASK-023](../../Tasks/Completed/TASK-023.md)

## Implementation evidence — 2026-09-12

SOLO/TEAM seat entitlements, trial/active/past-due/restricted transitions and deadline evaluation. Concurrent grants cannot exceed seats; restriction blocks writes while role-limited reads/prints/exports remain, with simulated recovery. No payment provider or charge. See [acceptance](../../Acceptance/TASK-023-acceptance.md). Production findings remain Open.

## Future add-on entitlement proposal — 2026-09-14

REQ-PROD-002/REQ-FOUND-013 propose module entitlements distinct from current SOLO/TEAM seat limits. Current simulated subscription behavior remains unchanged; no live pricing or charging approved. TASK-036 is Proposed only; see FIND-014.
