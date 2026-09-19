# Session memory

Updated: 2026-09-20 (Australia/Sydney).
Phase: synthetic development; release preparation, NO-GO for public/real-patient release.
Active requirement: REQ-FOUND-012 / REQ-FOUND-011.
Active task: TASK-028 local integration still in progress; TASK-029 local controls verified. TASK-030/031 have local rehearsal/decision checkpoints only.
Current branch: task/TASK-035-release-readiness.
Observed HEAD before this memory update: d6ac8a183ac8f7372003a7ba63655f31fa576743 (TASK-029 local implementation).
Observed status before this memory update: TASK-028 foundation, TASK-030 local network rehearsal and TASK-031 NO-GO package pending commit. Unrelated infrastructure/docker/compose.yaml and tooling/read-local-mail.ts edits preserved/excluded.

## Authority and reconciliation

- Owner approved the release sequence and explicitly chose “Prepare locally; no AWS spending yet”. No apply, account provisioning, external mail/payment, real data, push or merge performed/authorized here. No deletion approval added.
- Memory was stale after usage-limit interruption: actual HEAD was 26bdb0b, with TASK-029 changes uncommitted. Reconciled source/tests and restored expired temporary tooling to ignored .local/runtime. TASK-029 is now committed as d6ac8a1.
- TASK-035 completed locally at 26bdb0b. Full TASK-028/029/030/031 remain Approved until their remaining acceptance evidence exists. TASK-024 deferred; optional TASK-036–040 future nice-to-have only.

## Delivered and verification

- [TASK-029 acceptance](../Acceptance/TASK-029-acceptance.md): encrypted transactional outbox/retry/audit, synthetic sink, retained/versioned keys and gated KMS adapter, optional exact-origin cookie sessions. Real enrolled MFA key-file restore and built-client HTTPS login/reload/logout verified. Original modes/contracts preserved. [Identity runbook](../Project/IDENTITY_READINESS.md), ADR-013, per-task justification.
- TASK-029: pnpm check PASS (30 tests/lint/types/build), 30 database/HTTPS scenarios, seven unchanged browser journeys, codegen drift/formatting. Identity-port review follow-up passed; logs tracked. Earlier check-in stall did not recur; no assertion removed/weakened.
- [TASK-028 checkpoint](../Acceptance/TASK-028-acceptance.md): two CloudFormation templates, offline schema validation and five security policy tests PASS. infrastructure/aws/README.md lists missing ingress/cache/runtime/migration/operational integration and required account/domain/budget inputs. ADR-014 records provisional private endpoints and cost reassessment. No deployment.
- [TASK-030 checkpoint](../Acceptance/TASK-030-acceptance.md): built browser/PostgreSQL lost-response retry PASS with retained inputs, same key and exactly one patient/audit. [Protocol](../Project/STAGING_VERIFICATION.md) separates local evidence from unrun RDS/KMS/ISP/alert drills.
- [TASK-031 review](../Acceptance/TASK-031-acceptance.md): [NO-GO package](../Project/FIRST_RELEASE_READINESS.md) records missing evidence/owners without resolving findings or accepting risks.
- Latest lint/type checks for the new network test and template schema/policy checks passed. No application changes after TASK-029 except the added TASK-030 test.

## Open gates and exact next action

- Complete remaining TASK-028 local ingress/TLS/CloudFront zero-cache routing, staging runtime/task/migration/DB-role/sink and operational wiring. Build/scan new serving images after TASK-029; previous image evidence applies only to its exact versions. Do this before any AWS approval request.
- Then obtain scoped account/domain/tester/budget/operator approvals for concrete reviewed changes; current standing instruction remains no AWS spending. Run deployed TASK-029/030 evidence before reconsidering TASK-031 NO-GO.
- FIND-013 and Philippine clinical/privacy/legal/signature/retention findings remain Open. Actual KMS/IAM/provider, RDS PITR, target-ISP metrics and production owners are unverified/unassigned. No purge.
- Existing local clinic/image was not switched in this continuation. Verify running containers before future action. Synthetic credentials remain ignored under .local; never copy them into records. New test databases isolated from that clinic.
