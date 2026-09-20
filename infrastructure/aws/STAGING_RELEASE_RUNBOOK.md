# Synthetic staging release review

Status: local preparation only, 2026-09-20. Owner says “Prepare locally; no AWS spending yet”. Do not execute AWS commands, publish images/assets, change DNS or run remote jobs under this authorization. This runbook describes a later separately approved operation. No production or real-patient release; TASK-031 remains NO-GO.

## Local checks now

```sh
pnpm check
pnpm codegen
git diff --exit-code -- packages/graphql-contract/src
pnpm exec vitest run tests/staging-runtime.test.ts tests/staging-roles.integration.test.ts tests/staging-tls.integration.test.ts
.local/aws-tools/bin/cfn-lint infrastructure/aws/staging-foundation.yaml infrastructure/aws/staging-application.yaml infrastructure/aws/staging-database-jobs.yaml --regions ap-southeast-1
.local/aws-tools/bin/cfn-lint infrastructure/aws/staging-edge-access.yaml --regions us-east-1
.local/aws-tools/bin/python infrastructure/aws/test_staging_policy.py
.local/aws-tools/bin/python infrastructure/aws/test_staging_application.py
```

Build with `infrastructure/docker/Dockerfile.serving` targets `staging`, `api`, `web`, `migration`, `mailbox`; pass the actual reviewed source revision. The `staging` target is the AWS candidate; `api`/`web` preserve the existing packaged regression path. Scan both each image and its `/workspace/artifacts/sbom.cdx.json` dependency inventory. A bundled JavaScript file alone does not let an image scanner enumerate every dependency. Retain scanner DB timestamp, complete reports, source revision, image architecture, digest, bundle build hash and SBOM. ARM64 is the current task definition baseline; verify the published digest is ARM64 before task activation. Current migration image findings remain FIND-013, not accepted risk.

Use an isolated Compose project for `SERVING_IMAGES=true IMAGE_TAG=... node tooling/verify-packaged.mjs`; this retains test state/volumes and does not switch the existing local clinic. Run TASK-030 interrupted-response and restoration protocols separately. No assertion may be removed or skipped to pass a release gate.

## Inputs required before any provisioning approval

Record reviewed account ID, Singapore region/service versions and quotas, a pre-owned Route53 zone/domain, two validated certificates (viewer in us-east-1, origin in Singapore), exact WAF tester IPv4 ranges, S3/CloudFront managed prefix-list IDs, operator identities, notification recipients, access review and budget ceiling. Obtain a fresh price estimate for two-AZ private interface endpoints, ALB/public IPv4, Fargate, RDS/storage/backups, EFS/backups, WAF/CloudFront/S3, logs, registry, keys/secrets and traffic. No free-tier credits assumed. Original topology estimate does not price this expanded variant. Budget alerts are not a hard cap. Cost anomaly integration and alert delivery still require account-specific preparation/testing before approval.

Separate secrets:

- Runtime JSON `{username: mcclinic_runtime, password: ...}` and migrator JSON `{username: mcclinic_migrator, password: ...}`; independent random passwords of at least 24 characters, exact supplied KMS key ARNs. RDS owner `mcclinic_owner` uses its managed master secret. Never copy it to the runtime secret.
- Origin secret: raw random base64url string of 43–128 characters, shared by the CloudFront origin header, ALB rule and server. It is not an end-user credential. Authorized infrastructure readers can see resolved origin header configuration; protect these operator permissions. Rotate through a reviewed coordinated release; changing a Secrets Manager value alone does not refresh CloudFormation dynamic references or running ECS tasks.
- Wrapped identity envelope: format in IDENTITY_READINESS.md, each version wrapped with the exact identity KMS ARN and encryption context. Keep old wrapped versions. No plaintext key env/file in staging. `EnableNetworkCustody=true` is configuration, never approval by itself.
- Public RDS CA PEM bundle from the official RDS trust store, validated and dated. Server verifies certificate chain and hostname. Supply it explicitly; no `sslmode=require`, trust-all or URL override. Plan certificate/key rotation and test it before AWS acceptance.

## Later ordered operation, only after separate approval

1. Review change sets for every stack, exact parameters and identity permissions. Reject replacements/deletions until explicitly approved. Confirm no live payment, SMTP, real data or global tester CIDR. Foundation stores and logs are retained; retained resources continue costing money. WAF stack must block unknown tester IPs before distribution access.
2. Apply reviewed foundation/edge stacks. Create narrowly encrypted role and integration secrets through an approved secure operator path; no secret values in shell history, outputs or tickets. Complete default-practice synthetic-data preparation through onboarding after migrations; never copy a local database into AWS implicitly.
3. Publish independently reviewed immutable ARM64 image digests and built web files with SHA-256 manifest. Upload only built assets, no source maps, env files, database/key/mailbox state. Preserve prior assets and versions. Do not use sync deletion. Retain the old app shell and hashed assets for rollback.
4. Create database-job definitions. Explicitly run bootstrap in private subnets with no public IP, then migration with its separate execution role. Observe successful exit and migration state; raw SQL/password logs are intentionally withheld. Verify role ownership, denied DDL/deletion and atomic audit behavior against the actual RDS target. On failure stop; do not start the API or rerun with master credentials. Investigate through an approved operator session. Existing role drift is reported, never automatically revoked or re-passworded.
5. Apply application stack with `DesiredCount=0`, custody disabled. Review exact ALB-to-task ingress, EFS access and caller role. Set foundation `WebDistributionArn` to that application's exact distribution ARN in a second reviewed change set; this adds only OAC object reads and preserves the existing insecure-transport deny. Never give two stacks ownership of the bucket policy.
6. Complete private mailbox access/restore rehearsal before onboarding testers. Sink files contain synthetic verification/reset tokens, mode0600 in a retained encrypted EFS access point; they have **no HTTP route, S3 publication or ECS Exec access**. A separate `MailboxReadJob` mounts the sink read-only with ClientMount only, no database/key secrets and no network mail. An approved operator explicitly supplies a UUID `MESSAGE_ID` and RSA (at least 3072-bit) `OPERATOR_PUBLIC_KEY` in the task override; its logs contain an AES-GCM envelope sealed with RSA-OAEP-SHA256, never the plaintext link. Named operator permission to run/pass only this task and retrieve only its log stream remains an account-time approval gate. Recover the envelope locally with `node tooling/open-sealed-mailbox.mjs <envelope.json> <private-key.pem>`; the private key must be mode0600 and plaintext is written exclusively under ignored `.local/staging-mailbox/`, never printed. Verify the chosen operator key fingerprint out of band. CloudTrail task-invocation evidence is required. Do not grant the general clinic administrator shell access or log tokens to work around it. A partial write is retained as an idempotency conflict for explicit operator reconciliation; no file is silently removed.
7. After actual KMS, database, sink and artifact checks, explicitly activate custody and one service task through a reviewed change set. Two tasks may overlap during rollout; outbox leases and database constraints protect concurrent execution. Verify exact-origin cookie login, wrong-origin and wrong-tenant denial, migration health, signed snapshot/print regressions, headers/no-cache and direct-origin rejection through the deployed endpoint. Every print remains DEMO — NOT FOR CLINICAL USE. Missing or invalid dependency makes readiness fail.
8. Attach only separately approved notification recipients and test alarms/budget/cost anomaly delivery. ALB health/5xx, generic runtime startup/delivery failure and RDS free-storage alarm definitions exist. Outbox exhaustion and private-sink backup/recovery checks remain explicit operator checks until account monitoring is completed; inspect `IdentityOutbox.exhaustedAt`/old pending intents without logging payloads. Logs-based failure alerts do not prove that a silent stuck worker is healthy. Do not treat an empty SNS topic as monitoring coverage. Run TASK-030 actual RDS/key recovery, target-ISP latency/loss, load and access drills. Record evidence before reconsidering TASK-031.

## Drift, rollback and recovery

After separate AWS read authorization, use CloudFormation drift detection for each named stack, inspect its result and compare ECS task/image digests, secret version metadata, expected grants and immutable assets with the release manifest. Drift is a finding, not permission to auto-repair. No write/deploy CLI is embedded in this repository preparation step.

Rollback restores the prior reviewed task/image digest and prior app-shell S3 version, leaving schema/data/history and new assets intact. Verify old runtime/schema compatibility in an isolated restored database first; do not reverse an applied migration. Circuit-breaker rollback is an availability aid, not proof of data compatibility. Origin-secret and key-version changes need coordinated rollback so the old service still authenticates/decrypts. A schema incompatibility requires a forward fix or isolated recovery rehearsal, never a database reset.

Restore RDS and identity keys/mailbox to separate protected targets. Verify all table hashes/counts, immutable document snapshots, amendments, permissions, audit and enrolled MFA before traffic changes. EFS default backup coverage/expiry and RDS proposed seven-day PITR must be reviewed by the operator; neither is an approved clinical retention policy. No purge, stack delete, snapshot delete, volume removal, key disable or replacement is authorized.

## References

[CloudFront cache policy behavior](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html), [EFS access points and ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/efs-volumes.html). These describe technical configuration, not Philippine legal or clinical compliance.
