# Session memory

Updated: 2026-09-20 (Australia/Sydney).
Phase: approved release-readiness sequence; synthetic local preparation only.
Active requirement: REQ-FOUND-012 and REQ-FOUND-011.
Active task: TASK-029 local preparation verified, full scope still Approved pending AWS/provider evidence. Next: TASK-028 local preparation, then TASK-030/031.
Current branch: task/TASK-035-release-readiness.
Observed HEAD before this memory update: 26bdb0bf5e7f32069743b053100c1f2ba543373d (TASK-035 local commit).
Observed status before this memory update: TASK-029 implementation uncommitted after usage-limit interruption; unrelated infrastructure/docker/compose.yaml and tooling/read-local-mail.ts edits preserved/excluded. Untracked .pnpm-store is generated tooling cache.

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
- Exact next action: prepare TASK-028 infrastructure locally from its approved record and ADR-008/009; no AWS apply/spending. TASK-029 acceptance and IDENTITY_READINESS.md index completed local controls and remaining provider/KMS gates.
- TASK-029: encrypted transactional outbox with allowlisted sink/retry, optional versioned keys/gated KMS unwrap, opt-in exact-origin HttpOnly cookie sessions, persistent identity budget via application port. Existing modes preserved. Local tests exercise enrolled-account key rotation/restore and real built-client HTTPS login/reload/logout. Rationale: Doc/Changes/Justification/TASK-029-identity-delivery.md; ADR-013; acceptance: Documentation/Acceptance/TASK-029-acceptance.md.
- Verification: pnpm check passed (30 tests/lint/types/build), 30 database/HTTPS scenarios, seven unchanged browser journeys, codegen drift and formatting. Earlier check-in/browser failure did not recur; no assertions weakened. Review follow-up keeps login limits behind identity ports. Logs retained in acceptance artifacts; pinned tooling restored to ignored .local/runtime after temporary files expired.
- Existing serving images predate TASK-029; build and scan new images before later rollout. Actual KMS/IAM, production mail and deployed recovery not verified. No production finding closed.
