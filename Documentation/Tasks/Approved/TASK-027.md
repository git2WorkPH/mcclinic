# TASK-027 — Package immutable application artifacts
Status: Completed for local synthetic packaging, 2026-09-14. Approval history retained; canonical completion ../Completed/TASK-027.md. Base b90be76; branch task/TASK-027-local-packaging.
Requirements: REQ-FOUND-012 AC-02–04, local packaging overlay below. Historical proposal retained at ../Proposed/TASK-027.md.

Owner approval: “Use the project-development skill and Continuity Kit workflow to implement task-027, lets keep localstack optional.”

Scope: add non-root Node 24 API/web artifacts, frozen dependency installation, traceable image provenance/SBOM and scan evidence, fail-closed configuration, same-origin uncached API routing, health/readiness/shutdown, isolated local Compose PostgreSQL mcclinic, controlled additive migrations, persistent local mailbox/key, startup/backup runbook and packaged regression verification. Preserve existing entry points, tests and user edits.

AC-01: Artifacts use pinned inputs and revision/lock hashes, exclude local secrets/state and provide SBOM/scan evidence.
AC-02: Explicit local-container/synthetic configuration is required. Missing secrets/invalid config fail closed. Staging/production fail closed pending separate approval; no accidental public environment enablement.
AC-03: API/web run non-root; readiness checks DB access, shutdown drains requests; current lint/type/codegen/unit/database/browser/build and packaged smoke pass.
AC-04: Built web serves same-origin GraphQL; API/account/document responses are no-store, only fingerprinted static assets receive immutable caching; headers and authorization regressions are verified.

ADR-010 defines topology-independent local packaging; ADR-008/009 cloud topology/recovery proposals remain Proposed. No AWS resources, LocalStack subscription, live mail/billing, real data, schema deletion, test removal or clinical behavior change authorized. LocalStack is optional future AWS-adapter testing, absent from mandatory services.

Expected areas: new apps/api runtime/entry points, infrastructure/docker packaging files, tooling, tests and docs. KEEP all existing tests; ADD config/headers/drain/artifact/package tests. No existing code deletion needed. Canonical rationale: Doc/Changes/Justification/TASK-027-cloud-artifacts.md.

Completion: AC-01–04 locally verified; see ../../Acceptance/TASK-027-acceptance.md. 53 tests passed; dependency advisories and unavailable OS scan remain Open under FIND-013/TASK-033. This completes packaging, not security remediation or public staging readiness.
