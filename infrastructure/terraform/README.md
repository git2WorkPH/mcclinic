# Native Terraform staging candidate

TASK-042 / ADR-017. **Local preparation only. No AWS spending or apply is authorized.** This is a native `hashicorp/aws` configuration alongside the preserved CloudFormation templates. It does not wrap CloudFormation stacks or replace the TypeScript application. The existing Python files remain available as optional legacy validation; the normal custom policy checks now run in Vitest.

## Local checks (no AWS credentials)

Install the pinned Terraform **1.14.9** CLI from HashiCorp and verify the published checksum. This is a tested pinned version, not a claim to be the latest release. The AWS provider is pinned to **6.65.0**, with a committed lockfile. Node and pnpm remain the existing project versions.

```sh
pnpm install --frozen-lockfile
pnpm test:infrastructure
terraform -chdir=infrastructure/terraform/staging init -backend=false -input=false -lockfile=readonly
terraform -chdir=infrastructure/terraform/staging fmt -check -recursive
terraform -chdir=infrastructure/terraform/staging validate
terraform -chdir=infrastructure/terraform/staging test
```

Initialization downloads the pinned provider; it does not create a backend or contact AWS. The checked-in tests mock both Singapore and us-east-1 providers, use only `command = plan`, and do not provision resources. Mocked computed identifiers are synthetic. Tests cover private encrypted RDS and retained stores, restricted runtime/jobs/secrets, no clinical caching, WAF default denial, read-only mailbox retrieval, budget thresholds and invalid provisioning/activation/input denials. Mock tests do not establish real IAM/service behavior, pricing, quotas, TLS, restore or alert delivery. The GitHub Terraform workflow has no AWS credentials or OIDC write permissions.

`pnpm test:infrastructure` retains every assertion from the two preserved Python suites and adds strict YAML parsing checks. It is a policy check, not the entire `cfn-lint` schema engine. If modifying the old CloudFormation schema, its optional original validator remains documented in `infrastructure/aws/README.md`. Terraform's own provider schema is checked by `terraform validate`.

## Configuration and state boundary

`staging/synthetic.tfvars.example` is documentation for synthetic placeholders only. It is not an approved account, certificate, image, CA, budget or secret. No `.tfvars` is auto-created. Root application `.env` is **not** read by Terraform; use separately reviewed inputs and a protected input channel. `provisioning_approved` defaults false and fails the normal plan gate. Setting a boolean does not constitute owner approval.

Before a real plan/apply, require approved account/domain/region/AZs/tester CIDRs/operators/budget and current pricing, reviewed image digests/scans and CA bundle, original TASK-028 release gates, and an encrypted/versioned remote state backend with locking and named least-privilege operators. Local state/plans/vars and `.terraform` are ignored and excluded from Docker contexts. Local state has no encryption guarantee; use it only for offline mocks. Do not run a real plan with secrets in an unmanaged local backend. Backend creation/access itself needs later authorization; none is provisioned here.

Database passwords and identity envelopes are not read by Terraform: task definitions reference their exact secret/key ARNs. RDS manages its separate owner password; only bootstrap can fetch it. The **origin header value is a state-bearing secret** because ALB and CloudFront configuration require it. Marking the input sensitive redacts displays but does not remove it from state or saved plans. It must match the separately managed ECS origin secret; verify/rotate both together under the release runbook. Never commit secrets, use shell-history literals or print plan JSON into public CI artifacts. No secret-version data source or local `.env` shortcut is provided.

The example image repository is an existing reviewed repository, scoped through `image_repository_arn`; all three images must actually reside there and match their ARM64 digests. A separate immutable retained registry is prepared for future releases. Image upload, static-asset publication, KMS envelope preparation, role bootstrap/migrations and service activation remain explicit later operator actions. No task is scheduled automatically; desired service count is zero and network custody false.

## Ownership and preservation

Choose **one** infrastructure owner for any real environment. Use distinct Terraform names/state (`mcclinic-tf-*`) and a separate reviewed VPC; do not apply both candidates into one resource set. There are no deployed resources to import in this repository's evidence. Do not use imports, state removal, targeted applies or dual writers as an implicit migration. A future CloudFormation-to-Terraform ownership transfer needs a resource-by-resource retained/import plan and explicit approval before either tool changes it.

RDS, KMS keys, ECR, S3, logs, EFS/access point, ALB and distribution have Terraform `prevent_destroy`; AWS deletion protection/retention settings reinforce this where supported. `prevent_destroy` does not protect an object after its resource block is removed, and it is not identical to CloudFormation `Retain`. All plans must be reviewed for deletes/replacements, and no such action is approved. No lifecycle purge, automatic record deletion, volume deletion, secret/key removal or test removal is implemented. RDS seven-day PITR and default EFS backup policy remain provisional operational defaults, not approved clinical retention rules.

## Mapping to the preserved CloudFormation candidate

| CloudFormation area                       | Terraform area                    | Preserved behavior / explicit differences                                                                                                                                                                                                           |
| ----------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation network/endpoints              | `staging/network.tf`              | Two private AZ subnets, five interface endpoints and S3 gateway; no private internet/default route. Public subnets serve ALB only.                                                                                                                  |
| Foundation RDS/keys/registry/assets/logs  | `staging/storage.tf`              | mcclinic PostgreSQL17.6, verified-TLS prerequisite, managed owner secret, encrypted/private/versioned retained stores. Names isolated; engine availability still needs AWS verification.                                                            |
| Runtime/execution and job identities      | `staging/identity.tf`             | Separate runtime, migration, bootstrap and mailbox identities; precise secret/key scopes. Task trust adds source-account/ARN restrictions.                                                                                                          |
| Application/service/database/mailbox jobs | `staging/runtime.tf`              | Existing image entry points, UID1000/ARM64, private Fargate, no Exec, zero API tasks, read-only mailbox, explicit database jobs. Same ephemeral writable /tmp job requirement.                                                                      |
| us-east-1 tester WAF                      | `staging/edge.tf` with `aws.edge` | /24-or-narrower explicit IPv4 allowlist, default block, rate block first, no payload sampling.                                                                                                                                                      |
| ALB/CloudFront/OAC/headers/DNS            | `staging/edge.tf`                 | HTTPS/origin secret, zero TTL/errors, cookie forwarding, printable-document CSP, private S3 exact-distribution grant. Single Terraform bucket-policy owner avoids two-phase cross-stack grant. Origin value is stored in protected Terraform state. |
| Budget and health/storage/runtime alarms  | `staging/monitoring.tf`           | 50/80/100% account budget, no email subscribers, health/error/log/storage alarms. API alarm actions disabled while service inactive; no deletion on deactivation. Anomaly delivery and silent-worker monitoring remain TASK-028 gaps.               |
| Outputs/operator handoff                  | `staging/outputs.tf`              | Non-secret resource identifiers only; no secret-value outputs or remote commands.                                                                                                                                                                   |

Full account cost, tested notifications, migration/IAM/KMS/EFS/RDS/CloudFront behavior, state custody, recovery, Philippine ISP measurements and clinical/legal/privacy readiness remain unverified. Existing FIND-013 and other production findings remain Open. A passing Terraform test is not a release approval.

References: [Terraform mocked providers](https://developer.hashicorp.com/terraform/language/tests/mocking), [sensitive state](https://developer.hashicorp.com/terraform/language/manage-sensitive-data), [lifecycle limitations](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle).
