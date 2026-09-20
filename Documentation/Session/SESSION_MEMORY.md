# Session memory

Updated: 2026-09-20 (Australia/Sydney).
Phase: synthetic development; local release preparation, NO-GO for public/real-patient release.
Active requirement: REQ-FOUND-012 / REQ-FOUND-011.
Active task: TASK-028; local application integration verified, full task Approved/In progress.
Current branch: task/TASK-028-staging-integration.
Observed HEAD before this memory update: b2cfacf8765b7b848d1183190dc9544882226d48 (docs: record release-readiness integration into master).
Observed status before this memory update: intended TASK-028 runtime/IaC/tests/docs/evidence additions uncommitted; two unrelated edits preserved in infrastructure/docker/compose.yaml and tooling/read-local-mail.ts.

## Authority / reconciliation

- Read memory first and compared Git branch/HEAD/status. Previous master handoff is superseded by the task branch created from b2cfacf after exact remote/worktree/branch inspection; no matching remote task branch. Prior release branch retained.
- Owner approved the release sequence, chose “Prepare locally; no AWS spending yet”, then “ok continue” / “continue”. Local implementation and commits only; no new push, merge, apply, AWS account action, external messages, real data or deletion authorized.
- TASK-035 locally Completed; TASK-028/029/030/031 remain Approved pending outstanding acceptance. TASK-024 deferred; optional TASK-036–040 remain future nice-to-have.

## Delivered / source-of-truth links

- [TASK-028 acceptance](../Acceptance/TASK-028-acceptance.md), [canonical task](../Tasks/Approved/TASK-028.md), [ADR-015](../Architecture/Decisions/ADR-015.md), [justification](../../Doc/Changes/Justification/TASK-028-aws-staging.md).
- Separate synthetic staging entry point, exact-origin cookie/origin guards, verified DB TLS, migration/runtime roles and explicit jobs, private durable sink and sealed read-only operator retrieval. Original local entry points/schema/tests unchanged.
- Complementary ALB/CloudFront/ECS/EFS/application and database-job templates; private task network, zero cache TTL, retained storage, OAC, alarm definitions. Defaults: zero tasks, custody disabled. Even applying these defaults would cost money and is unauthorized.
- [AWS preparation index](../../infrastructure/aws/README.md), [release runbook](../../infrastructure/aws/STAGING_RELEASE_RUNBOOK.md), [MVP defaults](../Project/MVP_ASSUMPTIONS.md), [release NO-GO](../Project/FIRST_RELEASE_READINESS.md). Original requirements/decisions preserved; no new clinical requirement or finding resolved.

## Verification

- pnpm check PASS: lint/boundaries/types, 34 unit/API tests, generated DB client and API/web builds. Final lint/types and codegen drift PASS.
- Eight database/TLS/browser integration files PASS (33 scenarios); final packaged images seven browser journeys + persisted restart PASS; two foundation browser journeys PASS. New sealed-message CLI recovery/wrong-key/path/file-preservation checks PASS.
- Four CloudFormation templates schema-valid; ten offline policy checks PASS. Actual AWS behavior unrun.
- Five ARM64 images built; exact identities/full reports/SBOMs/logs/hashes in [TASK-028 artifacts](../Acceptance/TASK-028-artifacts/integration-2026-09-20/). API/web/staging/mailbox: 16 low/15 medium, zero high/critical; bundle inventories none. Migration: 60 high/4 critical, FIND-013 Open; no waiver or remote execution acceptance.
- Local clinic remains mcclinic-packaged task033 at localhost:8080; not switched. Isolated test services stopped and state/volumes retained. .local runtime/tools/secrets remain ignored.
- Unrelated two-file diff SHA256 remains c717836a243d8d6c76afcf557cbea8d231473ac67c67b50ab32b4581e76791d6. Exclude these from task commits.

## Open gates / exact next action

- Continue TASK-028 locally: prepare the remaining cost/anomaly and operator monitoring review, and assess/remediate migration-image FIND-013 before requesting provisioning approval. Refresh scans by 2026-09-21 or before exposure changes.
- No account/domain/budget/tester/operator approval yet. Actual RDS role behavior, KMS/IAM/EFS/CloudFront, alert/anomaly delivery, provider custody, drift/PITR/key/sink recovery and target-ISP/load remain unverified. Do not claim deployed completion.
- After the local package is reviewable, obtain narrowly scoped cloud authorization, then run TASK-029/030 deployed evidence before revisiting TASK-031. All Philippine clinical/privacy/legal/signature/retention findings remain Open. No purge.
