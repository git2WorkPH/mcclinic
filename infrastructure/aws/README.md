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
