# Session memory

Updated: 2026-09-21 (Australia/Sydney).
Phase: synthetic development; local release preparation, NO-GO for public/real-patient release.
Active requirement: REQ-FOUND-012 / REQ-FOUND-011.
Active task: TASK-028, Approved / In progress; local migration-hardening checkpoint verified.
Current branch: master.
Observed HEAD before this memory update: 80233f9e48629f205d9a1c78e1fb8cf35160ef78.
Observed status before this memory update: verified migration checkpoint committed and fast-forwarded to master; memory handoff updated; two unrelated edits in infrastructure/docker/compose.yaml and tooling/read-local-mail.ts remain unstaged/excluded.

## Authority / Git reconciliation

- Read memory first; branch/HEAD/status matched the prior handoff. Reused the existing task branch; no new branch needed.
- Owner requested “merge all the branches to remote master and continue with the next task”, then “continue”. All prior branches integrated/pushed to remote master at 3cf00e7; histories retained. [Merge evidence](../Acceptance/MASTER-INTEGRATION-2026-09-20.md) records identical-tree/ancestry proof. The owner subsequently requests these changes on master and refers to pushing remote master; merge/push of this checkpoint is now authorized. Hosted CI remains unverified: gh unauthenticated.
- Owner's “Prepare locally; no AWS spending yet” remains binding. No apply, publication, remote jobs, external mail, real data or deletion. Master fast-forwarded to 80233f9; push this checkpoint and its memory handoff, then verify the remote ref. This does not authorize deployment. TASK-035 Completed; TASK-028/029/030/031 still Approved with outstanding acceptance. TASK-024 deferred; TASK-036–040 future nice-to-have.

## Delivered / source of truth

- [TASK-028 acceptance](../Acceptance/TASK-028-acceptance.md), [task](../Tasks/Approved/TASK-028.md), [ADR-015](../Architecture/Decisions/ADR-015.md), [justification](../../Doc/Changes/Justification/TASK-028-aws-staging.md).
- Previous staging integration: separate TLS/origin/cookie runtime, restricted database roles/jobs, private sealed synthetic mailbox and complementary offline AWS templates. Original local serving/clinical behavior retained; no deployed evidence.
- New additive migration-hardened image: frozen Prisma CLI closure/native engine, bundled operator command, UID1000/passwd compatibility, strict native TLS. Original full migration image and pnpm path retained. No shell/package installers in the new candidate.
- [Migration artifacts](../Acceptance/TASK-028-artifacts/migration-2026-09-21/): exact image ID/digest metadata, full scans, both SBOMs, native-engine/source hashes, build/check logs and checksum manifest. Candidate labeled 3cf00e7-migration-candidate with working-source hashes, not a published release.
- [Release runbook](../../infrastructure/aws/STAGING_RELEASE_RUNBOOK.md), [MVP defaults](../Project/MVP_ASSUMPTIONS.md), [NO-GO](../Project/FIRST_RELEASE_READINESS.md), [FIND-013](../Assessment/Findings/FIND-013.md).

## Verification

- pnpm check PASS: lint/boundaries/types, 34 unit/API tests, Prisma generation, API/web builds. Final lint/types/codegen and generated-contract drift checks PASS.
- Real image bootstrap/migrate twice, original checksums/timestamps, special-character credentials, runtime write/audit, deletion/history/DDL denial, native wrong-CA/hostname rejection PASS. Existing role/audit/pg TLS regressions PASS (three integration files).
- ARM64 candidate image eb16dc5d634ea17eeabcc4987a5974793a43b6b8e5082abf7cc69a975ebb122e: zero high/critical, 16 low/15 medium. CLI131-package and command15-package inventories: no reported findings. Native embedded dependency/reachability coverage limited; no waiver.
- Historical previous checkpoint: 33 integration scenarios, seven packaged/two foundation browser journeys, four CloudFormation validations and ten policy checks passed. Not rerun wholesale for this operator-only change; no AWS execution.
- Existing mcclinic-packaged task033 clinic untouched. Two unrelated edits' combined diff SHA256 c717836a243d8d6c76afcf557cbea8d231473ac67c67b50ab32b4581e76791d6 unchanged; exclude from commits.

## Open gates / exact next action

Continue TASK-028 with bounded local cost/anomaly and operator monitoring preparation; update justification before code and preserve current infrastructure/history. Prepare a concrete account/domain/budget/operator review package before asking for cloud authorization. No AWS spending yet.

FIND-013 remains Open: original full image still has high/critical findings; new candidate's lower-severity findings remain. Refresh scans of all reviewed images before publication/exposure or scanner DB changes. Account/domain/budget/tester/operator approval, actual RDS/IAM/KMS/EFS/CloudFront/alerts, drift/PITR/key/sink recovery and target-ISP/load evidence remain missing. Philippine clinical/privacy/legal/signature/retention findings remain Open. No purge. Session memory is an index, not approval or ground truth.

## MVP master handoff — 2026-09-21

Owner: “i want these changes to be in master branch. can you confirm that what we are pushing to master remote are the mvp?” Fetched origin; only 80233f9 was ahead of origin/master (3cf00e7). Fast-forward merge preserves the same verified implementation. Master contains the development SaaS MVP plus local release-preparation/hardening; it is not a production release. No real data, live payments, cloud deployment or spending authorized. Unrelated two-file diff remains excluded. Verify final remote master equals the handoff commit after push; then resume the next local TASK-028 action above.
