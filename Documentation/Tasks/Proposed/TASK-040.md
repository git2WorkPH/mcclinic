# TASK-040 — Selected diagnostic-provider feasibility and contract assessment

Status: Proposed, 2026-09-14. No implementation approval.
Requirements: REQ-FEAT-017/018; REQ-FOUND-014.

## Objective

Assess a selected laboratory or imaging provider before proposing an actual connector.

## Scope

Read authorized vendor documentation and conformance statement, map sandbox/protocol/version/auth/identities, costs, duplicate/correction semantics, licensing, network/storage and clinical responsibilities; propose bounded connector tasks.

## Out of scope

Real patient data, provider contracts/purchases, live connections, infrastructure provisioning or implementation without further approval.

## Acceptance criteria

Evidence-backed provider matrix, supported/unsupported workflows, sample synthetic payloads if available, mapping/retry/acknowledgement obligations and unresolved policy findings; no generic compatibility claim.

## Expected code / document areas

Documentation/Assessment and proposed ADR/requirements/task records; no application code expected for assessment.

## Test impact

Document expected future connector contract/conformance/failure tests; no live test or regression modification in this assessment.

## Dependencies

Owner selects provider and desired direction (send orders/receive results/report viewing), supplies authorized documentation/access where not public; FIND-015/016.

## Architecture decision

Propose provider-specific ADR; acceptance/conformance must precede connector implementation.

Governance: synthetic development only unless separately approved. Requirements remain Draft. Before future implementation create Doc/Changes/Justification/TASK-040-<description>.md and explicit approval evidence. No deletion of files, tests, fields, APIs or behavior authorized.
