# TASK-028 — Provision access-controlled synthetic AWS staging

Status: Approved for local preparation, 2026-09-13. No provisioning or spending authorized.
Requirements: REQ-FOUND-012 AC-01–04. Decisions: proposed ADR-008/009. Finding: FIND-011.

## Objective / scope

After separate cost/account approval, implement reviewed infrastructure-as-code for an isolated `ap-southeast-1` synthetic staging environment: private S3/CloudFront, uncached API route, WAF/TLS, ALB, one ECS Fargate API, private single-AZ RDS PostgreSQL `mcclinic`, ECR, secrets/KMS, logs/metrics/alarms and budget alerts. Resolve NAT/endpoints/controlled-egress cost/security choice. Restrict staging testers and keep synthetic guardrails.

## Out of scope

Production or public launch, real data, live email/payment, TASK-024, DNS/account purchase without action-time approval, offline sync and deletions.

## Acceptance criteria

- Plan/apply review shows separate state, least-privilege roles/security groups, private RDS/S3, encrypted stores, no secrets in state output/logs and no authenticated shared caching.
- A dated calculator estimate remains under an owner-approved ceiling; 50/80/100% budget and anomaly notifications are tested without sending unapproved third-party messages.
- Staging requires an explicit allowlist and synthetic marker; cross-tenant, permission, migration and smoke suites pass through the deployed endpoint.
- Teardown/recreate and drift checks are documented. Destructive teardown of any deployed environment requires separate explicit approval; database/backup deletion is never implicit.

## Expected areas/tests/dependencies

New infrastructure-as-code and deployment verification tooling; no application feature change. KEEP existing tests; ADD IaC policy/security/cost and deployed smoke checks. Depends on completed TASK-027 and accepted ADR-008/009. Requires approved AWS account, budget, region/domain decisions and `Doc/Changes/Justification/TASK-028-aws-staging.md`.

## Sequence authorization — 2026-09-14

Owner: “ok i agree with the recommended sequence. Use the project-development skill and Continuity Kit workflow to implement it in sequence”. Approved sequence: TASK-035 → TASK-029/028 → TASK-030 → TASK-031. Owner further chose “Prepare locally; no AWS spending yet”. Local code, IaC and synthetic verification are authorized; deployed verification and production go/no-go cannot be claimed from local evidence. No real data, external activation, cloud apply or deletion authorized. Historical proposal retained; this record governs the approved local preparation scope.
