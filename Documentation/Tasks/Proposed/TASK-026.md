# TASK-026 — Deployment readiness and synthetic staging plan
Status: Proposed, 2026-09-12. User requested a deployment-plan task suggestion; implementation and deployment are not approved.
Requirements: REQ-FOUND-012 AC-01–04; preserve REQ-FOUND-010 tenant isolation, REQ-FOUND-011 onboarding and existing clinical integrity requirements. FIND-010 remains Open.

## Objective
Deliver an actionable, costed plan to take the local SaaS to access-controlled synthetic staging, with a distinct future production readiness gate for Philippine clinics.

## Scope / proposed deliverables
1. Inventory local-only assumptions and produce Documentation/Project/DEPLOYMENT_PLAN.md with a topology and release checklist.
2. Evaluate AWS Singapore as the initial regional candidate; compare latency from intended Philippine clinic locations/ISPs against another suitable region. CloudFront can accelerate static assets through Manila edge locations; it cannot make live clinical writes work without internet. Do not cache authenticated GraphQL/clinical documents at the CDN.
3. Compare a modest single API container/VM plus managed PostgreSQL against ECS/Fargate plus managed PostgreSQL. Consider S3/CloudFront for the built web app, same-origin API routing, TLS, private networking, least privilege, secret/key storage and observability. Keep one modular-monolith API; no Kubernetes or microservice expansion.
4. Produce dated monthly estimates for synthetic staging and a small production pilot using explicit load/storage/availability assumptions. Include fixed infrastructure overhead, backups, egress, monitoring and post-credit costs; propose spending alerts. Do not choose a paid plan or purchase resources.
5. Plan cloud-specific entry point/config, immutable artifacts and deployment pipeline with separate approval before execution; private staging access and synthetic-only guard. Plan persistent MFA key custody, protected test mail delivery and session/abuse controls rather than exposing the developer mailbox.
6. Plan additive mcclinic migrations, serialized migration execution, tested backup restoration with keys and audit/version integrity, compatible application rollback/roll-forward and incident ownership. Propose RPO/RTO for approval; never invent a clinical/legal retention period.
7. Define network tests (candidate simulations: 1 Mbps down, 256 kbps up, 300 ms RTT, and interrupted requests; synthetic engineering profiles, not claims about national connectivity). Measure real target ISPs before selecting a region; verify visible failure, safe retry and no duplicate writes. Record any required UI/draft protection as a bounded follow-up; no offline sync.
8. Propose individually scoped follow-up implementation tasks for packaging/config, infrastructure, identity/mail/secrets hardening, staging release/restore verification and production readiness. Each requires approval and a pre-implementation Doc/Changes/Justification record.

## Existing evidence / gaps
- apps/api/src/mvp-main.ts deliberately rejects non-loopback hosts and requires MVP_SYNTHETIC_ONLY. Preserve this local path; public exposure is not a configuration-only rollout.
- apps/clinical-app/vite.config.ts supplies a development proxy, not deployed routing. Plan built-asset hosting and /mvp/graphql routing explicitly.
- infrastructure/docker/compose.yaml provisions local PostgreSQL, with mcclinic name; it is not a cloud operations design.
- Onboarding infrastructure uses local mailbox links and .local/onboarding-key. Ephemeral containers need an approved durable key/delivery design before rollout.
- TASK-025 acceptance documents 40 passing local scenarios; no cloud, ISP or production tests are claimed.

## Out of scope
Provisioning AWS accounts/resources, credentials, domain/DNS changes, deployment/push, real data, external mail, live charges/TASK-024 implementation, offline synchronization, automatic purges and all deletions. No blanket production approval.

## Acceptance criteria
- AC-01: Costed candidate architecture/region comparison and explicit assumptions satisfy REQ-FOUND-012 AC-01; no unverified monthly price or latency guarantee.
- AC-02: Gap register links each item to concrete files, proposed work and test evidence needed; includes durable MFA keys, tenancy, auth, logs, public-cache exclusions and privacy/data-location findings.
- AC-03: Staging release/restore/network verification plan and separate production gate are reviewable, with responsibilities, proposed service targets and non-destructive recovery.
- AC-04: Local proposed implementation tasks and required ADRs are created with stable IDs/dependencies; owner can approve bounded preparation independently of paid provisioning/deployment.

## Expected code areas / test impact
Planning edits only under Documentation/. Future candidates: apps/api runtime/config, onboarding adapters, clinical-app build/routing, infrastructure/, deployment workflow and verification tooling. KEEP all regression tests. Planning validation: check source links, cost assumptions and requirement/task traceability; do not mark cloud tests passed.

## Dependencies / architecture decision
Depends on completed TASK-020–023 and TASK-025. Planning can precede TASK-024; synthetic staging needs only simulated subscriptions. Production billing has its separate TASK-024 approval. ADR required for provider/region/topology, environment/security boundary and recovery strategy; proposed choices are not yet accepted.

## Current primary sources (checked 2026-09-12)
- AWS infrastructure: https://aws.amazon.com/about-aws/global-infrastructure/
- Singapore region listing: https://docs.aws.amazon.com/pdfs/global-infrastructure/latest/regions/regions-zones.pdf
- CloudFront lists Manila edge locations: https://aws.amazon.com/cloudfront/features/
- Free Tier: https://aws.amazon.com/free/free-tier-faqs/ — eligible new accounts can receive up to $200 credits; Free Plan ends at six months or credit exhaustion, whichever comes first. Verify account/service eligibility; do not assume the proposed topology will be free.
