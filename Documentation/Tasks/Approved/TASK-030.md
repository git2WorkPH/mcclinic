# TASK-030 — Verify deployed recovery, connectivity and security

Status: Approved for local preparation, 2026-09-13. Implementation limited to the approved local sequence below.
Requirements: REQ-FOUND-012 AC-03–04. Decisions: proposed ADR-008/009. Finding: FIND-011.

## Objective / scope

On approved synthetic staging, execute release rollback/roll-forward, RDS PITR/restore with MFA-key recovery, tenant/clinical/audit integrity checks, load and slow/interrupted-network profiles, alert/incident tabletop, print/browser smoke and measured Philippine target-ISP comparison. Refine proposed RPO/RTO/performance targets from evidence.

## Out of scope

Real patient data, production traffic, destructive testing against non-disposable resources, unsupported nationwide connectivity claims, offline sync, live payments and deletions.

## Acceptance criteria

- Restore into a separate RDS instance preserves practice isolation, memberships, versions/amendments, immutable document snapshots, audit timestamps and enrolled synthetic MFA; evidence records achieved RPO/RTO.
- Interrupted idempotent writes do not duplicate clinical/audit records; UI preserves or clearly reconciles unsent state and reports timeouts/recovery.
- Manila/Cebu/Davao or actual pilot-location measurements compare Singapore with a second candidate across fixed/mobile samples, without personal location/patient data.
- Security/config/tenant suite and representative registration→practice→clinical→print workflows pass through the deployed endpoint; alerts and incident ownership are exercised.

## Expected areas/tests/dependencies

Deployment/recovery/network test tooling and evidence; bounded application fixes discovered by testing require separate scope/approval. KEEP all suites; ADD deployed Testcontainers-equivalent, Playwright throttling, load/restore and audit comparisons. Depends on TASK-027–029 and an approved TASK-028 staging environment. Future justification: `Doc/Changes/Justification/TASK-030-staging-verification.md`.

## Sequence authorization — 2026-09-14

Owner: “ok i agree with the recommended sequence. Use the project-development skill and Continuity Kit workflow to implement it in sequence”. Approved sequence: TASK-035 → TASK-029/028 → TASK-030 → TASK-031. Owner further chose “Prepare locally; no AWS spending yet”. Local code, IaC and synthetic verification are authorized; deployed verification and production go/no-go cannot be claimed from local evidence. No real data, external activation, cloud apply or deletion authorized. Historical proposal retained; this record governs the approved local preparation scope.

## Local rehearsal checkpoint — 2026-09-20

One independent local delayed/lost-response rehearsal passed through the built browser and PostgreSQL, retaining inputs/idempotency and a single patient/audit result. See `Documentation/Acceptance/TASK-030-acceptance.md` and `Documentation/Project/STAGING_VERIFICATION.md`. No deployed dependency or criterion is marked passed; AWS/PITR/KMS/ISP/incident evidence remains pending. Full task stays Approved / In progress.
