# Session memory

Updated: 2026-09-14 (Australia/Sydney).
Phase: approved release-readiness sequence; synthetic local preparation only.
Active requirement: REQ-FOUND-012 and REQ-FOUND-011.
Active task: TASK-035 completed locally; next TASK-029, then TASK-028, TASK-030 and TASK-031.
Current branch: task/TASK-035-release-readiness.
Observed HEAD before this memory update: 0523a7e (master; docs confirm TASK-033 hosted verification).
Observed status before this memory update: TASK-035 implementation/evidence and sequence approvals pending commit; separate infrastructure/docker/compose.yaml username edit preserved/excluded.

## Scope and reconciliation

- Owner approved the recommended sequence. Explicit AWS answer: “Prepare locally; no AWS spending yet”. Approved task records retain the decision. Local code/IaC/synthetic checks only; no apply, external activation, real data, push or merge.
- Earlier memory saying TASK-035 was Proposed is stale and superseded by explicit approval and Approved/Completed records. TASK-024 stays deferred; optional TASK-036–040 remain future nice-to-have proposals.
- No deletion authorization added. Original package, APIs, migrations, dependencies, tests and images preserved.

## Delivered and verification

- TASK-035: additive API/web distroless images, original full migration image, bundled dependency SBOMs, compose override and recovery verifier. See [acceptance](../Acceptance/TASK-035-acceptance.md), [completed task](../Tasks/Completed/TASK-035.md), [ADR-012](../Architecture/Decisions/ADR-012.md), [runbook](../Project/SERVING_RUNBOOK.md).
- pnpm check (28 tests/lint/types/build), codegen drift, 23 database scenarios, 7 split-image packaged browser journeys and 2 foundation browser tests passed.
- Full table fingerprints/MFA-key restore and old task033/new task035 rollback passed. Evidence retained in acceptance artifacts; local backups under .local/packaged/recovery-Geh3hJ (ignored, synthetic).
- API/web scans each report 16 low/14 medium OS occurrences; no high/critical. Explicit bundled dependency scans report none. Full migration tooling findings remain; no suppressions. Recheck by 2026-09-21 or before exposure changes.
- Existing clinic at http://127.0.0.1:8080/clinic remains task033. New task035 images tested separately; test services stopped, volumes retained. Password remains ignored .local/packaged/demo-password; never copy into records.

## Open findings and next action

- FIND-013 remains Open for public risk acceptance. Philippine clinical/privacy/legal/signature/retention findings remain Open and nonblocking only for synthetic development.
- Actual AWS validation/spending, provider activation and production go/no-go remain gated; local preparation is authorized.
- Exact next action: implement approved TASK-029 after its justification and architecture decision, preserving existing onboarding/session tests; prepare TASK-028 locally afterward. Read only those linked records and affected code.
