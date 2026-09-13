# TASK-027 — Package immutable cloud-ready application artifacts
Status: Proposed, 2026-09-13. Not approved for implementation.
Requirements: REQ-FOUND-012 AC-02–04. Decisions: proposed ADR-008/009. Finding: FIND-011.

## Objective / scope
Add a production-shaped, non-root Node 24 API container and deterministic React Native Web build; separate local/staging/production configuration with fail-closed validation; retain the loopback local entry point; add cloud health/readiness and graceful shutdown; generate image provenance/SBOM and scan evidence. Define same-origin web/API routing and disable API/document caching.

## Out of scope
AWS resource provisioning, deployment/push, external mail/payments, real data, changes to clinical behavior, offline sync and deletions.

## Acceptance criteria
- Rebuilding the same commit/lockfile produces traceable immutable artifacts without repository/database secrets or local mailbox/key files.
- Local remains loopback/synthetic; staging cannot start without explicit environment, synthetic-data and approved secret configuration. Production cannot be enabled accidentally.
- Container runs non-root, reports readiness only after database access, drains requests on termination and passes existing lint/type/unit/database/browser/build suites.
- Cache and security-header tests demonstrate fingerprinted public assets may cache while GraphQL, account links and clinical documents do not use shared caching.

## Expected areas/tests/dependencies
Dockerfiles/ignore, apps/api runtime/config, clinical-app build/config, tooling and CI proposal. KEEP existing tests; ADD artifact/config/container/cache tests. Depends on TASK-026. ADR-008/009 acceptance required before final topology-specific behavior. Future implementation requires `Doc/Changes/Justification/TASK-027-cloud-artifacts.md`.
