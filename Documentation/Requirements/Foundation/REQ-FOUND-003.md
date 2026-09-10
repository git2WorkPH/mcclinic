# REQ-FOUND-003 — Authentication
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Establish actor identity for protected operations. Identity provider, enrollment and session lifecycle require approval.

## Functional rules
- FR-01: Requests without a valid session cannot read or mutate protected resources.
- FR-02: Logout or revocation and expired/invalid sessions are rejected according to the approved session policy.
- FR-03: Clients receive safe authentication failures without credentials or sensitive data in logs.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Actor identifier, identity-provider subject, session metadata; credential storage approach undecided.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
Valid/expired/revoked/malformed session tests and provider failure integration checks.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-002](../../Assessment/Findings/FIND-002.md)

## Traceability and assessment
- Proposed task: [TASK-003](../../Tasks/Proposed/TASK-003.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.
