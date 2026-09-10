# REQ-FOUND-006 — Clinical integrity and amendments
Status: Draft
Version: 0.1
Owner: project owner (approval pending)
Approval: none; high-level user scope is recorded, detailed rules below are proposals.

## Objective and scope
Preserve provenance and prevent silent overwrite of finalized clinical information.

## Functional rules
- FR-01: Finalization stores an attributable version; edits to finalized content create a linked amendment with author, time and reason.
- FR-02: Stale concurrent writes fail visibly without overwriting another author’s version.
- FR-03: Retry of a finalization/issuance request cannot silently create duplicate finalized records.

## Acceptance criteria
- AC-01: Verify FR-01 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-02: Verify FR-02 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.
- AC-03: Verify FR-03 with a synthetic scenario demonstrating its stated success and rejection outcomes, where applicable.

## Authorization implications
Server-side action/resource authorization is mandatory; grants and clinic scope await FIND-002. No client-only enforcement.

## Data requirements
Draft/finalized state, version, author, timestamps, amendment reason/link and request identity; lifecycle per record type pending.

## Audit implications
Use REQ-FOUND-005 for applicable create/update/issue/amend/status actions and approved access/render events; do not log unnecessary clinical content. Exact catalogue awaits FIND-005/FIND-006.

## Expected tests
State transitions, concurrent writes, duplicate request and provenance reconstruction tests.
Classification: ADD when approved; existing application code/tests are absent. No test removal or weakening is authorized.

## Unresolved questions and findings
- [FIND-005](../../Assessment/Findings/FIND-005.md)

## Traceability and assessment
- Proposed task: [TASK-004](../../Tasks/Proposed/TASK-004.md).
- Architecture: [baseline](../../Architecture/BASELINE.md).
- Current implementation: absent; all ACs unimplemented and runtime verification NOT RUN. See [initial assessment](../../Assessment/INITIAL_ASSESSMENT.md).
- Acceptance evidence: none; no implementation approved.

## Decision history
- 2026-09-10: v0.1 drafted from owner scope and installed kit; all detailed policy choices remain pending.
