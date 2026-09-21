# Local staging preparation

**Do not apply these templates.** The owner authorized local preparation only and no AWS spending. They are an incomplete foundation, not a running app or a launch-ready stack.

- `staging-foundation.yaml`: Singapore private subnets/endpoints, TLS-only PostgreSQL `mcclinic`, retained encrypted stores/keys, immutable ECR, separate runtime/execution identities, logs/cluster and 50/80/100% cost thresholds. No application service, public ingress, migration job or database-user bootstrap exists yet.
- `staging-edge-access.yaml`: us-east-1 CloudFront-scope WAF, explicit IPv4 tester CIDRs, default block and rate limit; request sampling disabled. No distribution is created or associated yet.
- `validation-requirements.txt`: exact local validator dependencies. `test_staging_policy.py`: offline negative-exposure/retention/permission checks.

Local validation (no AWS credentials required):

```sh
python3 -m venv .local/aws-tools
.local/aws-tools/bin/python -m pip install -r infrastructure/aws/validation-requirements.txt
.local/aws-tools/bin/cfn-lint infrastructure/aws/staging-foundation.yaml --regions ap-southeast-1
.local/aws-tools/bin/cfn-lint infrastructure/aws/staging-edge-access.yaml --regions us-east-1
.local/aws-tools/bin/python infrastructure/aws/test_staging_policy.py
```

Missing input is intentional: no default monthly budget, runtime secret/key ARN, S3 managed prefix-list ID or tester CIDRs. Do not substitute a production account, RDS master secret or world-open tester list. Runtime credentials must belong to a separately bootstrapped database role with no schema DDL, audit update/delete or record-purge permissions. IAM role separation alone does not implement database privileges.

Before applying anything, the owner must approve the actual account, current Singapore service/version availability, domain/certificates, tester ranges, operator/notification contacts, dated calculator estimate and spending ceiling. Budgets are alerts, not a hard spending cap. The SNS topic currently has no subscriber, and notification/anomaly delivery is untested. The five interface endpoint services across two AZs require a new estimate; prior deployment-plan totals do not price this variant.

Remaining local work: add and verify ALB/TLS/CloudFront origin authentication and private S3 OAC policy; zero-TTL clinical/API behavior and app-shell routing; a fail-closed synthetic staging entry point and immutable ECS/migration task definitions; runtime database role/bootstrap; protected durable synthetic sink; account-bound IAM/secret handling; alarm/anomaly and release/drift verification. Preserve current local entry points and keep network activation disabled. Validate current API image/SBOM after TASK-029 changes before rollout. Foundation schema validation is not proof that AWS will accept account quotas, versions, certificate ownership or service permissions.

Recovery/deletion: no stack delete, volume delete, lifecycle purge, key disable/scheduling deletion or database replacement is authorized. Review any future change set for replacement; retained resources can still incur charges. Restore into a separate target and verify data/key integrity before switching traffic. Seven days of proposed automated PITR coverage is not clinical record retention; obtain operational acceptance before provisioning backup expiry behavior.

Sources used for schema review: [RDS CloudFormation resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-rds-dbinstance.html), [CloudFront cache policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-cloudfront-cachepolicy.html), [CloudFront-scope WAF](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-wafv2-webacl.html). No cloud behavior or Philippine regulatory compliance is certified by these documents.

## Integration continuation — 2026-09-20 (supersedes the missing-implementation list above)

The historical foundation checkpoint above is retained. The following local implementation is now present; **no template has been applied**:

- `staging-application.yaml` consumes foundation outputs and the edge WAF ARN. It adds public ALB subnets (private task/database routes stay private), TLS and CloudFront-only ingress, a secret checked by both ALB and API, private S3 OAC, exact app-shell routing, zero cache TTL for every behavior and error, HTTPS cookie forwarding, retained encrypted EFS with IAM/UID1000 access, immutable image task definitions, rollback circuit breaker and health/error alarm definitions. All static assets also use no-store initially; this conservative default can be optimized separately for content-hashed assets. The service defaults to zero tasks and KMS network activation defaults false. Applying even this zero-task stack would still incur charges; **zero tasks is not a spending safeguard**.
- `staging-database-jobs.yaml` defines separate bootstrap and migration tasks, never schedules them. Only bootstrap execution can retrieve the owner secret. The application role cannot retrieve owner/migrator secrets. Job task role has no AWS permissions; its execution role retrieves the narrowly identified secrets and image. Jobs run privately using the foundation runtime security group. Root filesystem is writable for Prisma temporary files in these non-serving jobs; they expose no HTTP port.
- `apps/api/src/staging-main.ts` is a separate synthetic-only runtime; existing packaged/local entry points still reject staging. It requires an exact HTTPS origin, explicit synthetic recipient domains, an origin credential, verified PostgreSQL CA and limited credentials, and a context-bound KMS envelope. It uses cookie sessions exclusively. No raw startup/provider errors or credentials enter logs.
- `staging-command.ts bootstrap` creates missing roles only, verifies existing role privileges, prepares the extension and schema grants. It does not rotate existing passwords. `migrate` holds a database advisory lock, runs existing Prisma migrations as the migration owner, then grants an explicit reviewed table list. New/unexpected tables or owners fail closed. Runtime can SELECT/INSERT/UPDATE mutable records, SELECT/INSERT immutable history; it cannot delete/truncate, change persistent schema or assume the migration role. No automatic seed or retention job.
- `STAGING_RELEASE_RUNBOOK.md` gives ordered release/rollback review and missing operational evidence. No apply script or credentials are committed.

Additional offline validation:

```sh
.local/aws-tools/bin/cfn-lint infrastructure/aws/staging-application.yaml infrastructure/aws/staging-database-jobs.yaml --regions ap-southeast-1
.local/aws-tools/bin/python infrastructure/aws/test_staging_application.py
pnpm exec vitest run tests/staging-runtime.test.ts tests/staging-roles.integration.test.ts tests/staging-tls.integration.test.ts
```

The last command uses local PostgreSQL containers and a locally generated test TLS certificate; it does not use AWS. Neither successful schema validation nor local database tests verify RDS-specific role restrictions, EFS policies, CloudFront/ALB behavior or actual KMS permissions. All deployed TASK-028/029/030 acceptance remains pending.

## TypeScript checks and Terraform alternative — 2026-09-21

The current custom policy command is `pnpm test:infrastructure`, with every assertion from both preserved Python suites plus strict YAML parsing checks. Python is optional for these checks; the earlier cfn-lint command is still a distinct optional CloudFormation schema check. No original script/template was deleted. Native Terraform validation/mocked plans are documented in [the parallel candidate](../terraform/README.md). Choose one owner per eventual environment; no AWS resources have been provisioned by either path.
