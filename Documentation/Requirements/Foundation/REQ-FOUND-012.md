# REQ-FOUND-012 — Deployment readiness and staged release

Status: Approved v0.1 for planning only, 2026-09-13. No cloud execution approved.

## Objective / scope

Produce a reviewable deployment plan for the Philippine SaaS audience, beginning with private synthetic staging and separating production release readiness. Preserve the modular monolith, desktop React Native Web, PostgreSQL database name mcclinic and existing functionality.

## Functional rules

- FR-01: Separate local development, synthetic staging and production configurations, credentials, databases and release approvals. Preserve local loopback protection; any future cloud entry point is a separately approved addition.
- FR-02: Compare regional connectivity and full recurring cost; account for runtime, database, backups, ingress/egress, load balancing/NAT, logs, secrets and support. Promotional credits are not a sustainable budget.
- FR-03: Specify HTTPS, private database access, least-privilege runtime/migration roles, tenant-safe caching/storage, durable key custody, secure sessions, mail delivery, monitoring and restricted staging access.
- FR-04: Define additive migration, rollback/roll-forward, backup restore, recovery targets, failure response and clinical integrity checks without destructive rollback or retention purges.
- FR-05: Measure Philippine fixed/mobile connectivity and simulate slow/lost connections. Protect unsaved work and retry correctness without introducing offline synchronization or caching clinical responses publicly.

## Acceptance criteria

- AC-01: Owner can review candidate topology, region tradeoffs, dated cost estimate with traffic assumptions, staging restrictions and separate production gates.
- AC-02: Every observed local-only gap has a proposed implementation task, dependency, verification method and required decision; no secrets or resources provisioned during planning.
- AC-03: Release/runbook specifies build artifact, deployment authorization, migrations, health checks, rollback, restore drill, monitoring and measurable proposed RPO/RTO/performance targets (clearly unapproved until accepted).
- AC-04: Security/tenant/clinical regressions, interrupted requests, restore integrity and browser/print smoke tests are traced to later release gates. Production findings remain Open.

## Authorization / data / audit

Infrastructure permissions are separate from clinic roles; cloud operator access must be explicit and auditable. Use synthetic data in staging; no automatic production-to-staging copies. Keep clinical/audit data, MFA keys, mail links and credentials out of public caches and operational logs. Preserve clinical audit atomicity and record migration/deployment provenance.

## Expected tests

Planning: source/code/config review and traceability only. Future implementation: infrastructure validation, isolation/security checks, existing test suite, slow-network/retry tests, migration/restore and deployment smoke tests. KEEP existing tests; no removals authorized.

## Unresolved questions

Budget, launch scale/concurrency, target Philippine locations/ISPs, domain/account ownership, availability/recovery targets, mail/key management, operational owner and Philippine privacy/cross-border/clinical obligations. No legal compliance or data-location approval inferred. See FIND-010.

## Traceability

TASK-026 completed for planning; REQ-FOUND-010/011 and existing clinical integrity requirements remain in force. Proposed follow-ups TASK-027–031 require separate approval. Future material decisions require accepted ADRs.

## Decision history

- 2026-09-12: Drafted with TASK-026 proposal.
- 2026-09-13: Owner explicitly approved implementing TASK-026 after onboarding and agreed TASK-024 should remain later. This approves AC-01–04 planning artifacts only; it does not approve infrastructure provisioning, deployment or production use.
- 2026-09-13: AC-01–04 planning accepted by project review; see `Documentation/Acceptance/TASK-026-acceptance.md`. Production and cloud checks remain unrun by design.

## Local packaging overlay — 2026-09-14

Owner approved TASK-027 and requested optional LocalStack. AC-02–04 now have local implementation evidence under TASK-027: built non-root API/web, same-origin uncached clinical routing, explicit local configuration, persistent isolated mcclinic database/state, migrations, health/drain behavior and regression/artifact checks. Staging/production remain fail-closed until separate controls are approved; ADR-010 governs local packaging without accepting ADR-008/009 cloud topology. See ../../Acceptance/TASK-027-acceptance.md and Open FIND-013. No production security certification or cloud deployment approval inferred.

## Local release-preparation overlay — 2026-09-20

Owner approved TASK-035 → TASK-029/028 → TASK-030 → TASK-031, explicitly limiting AWS work to local preparation with no spending. AC-02/04 now have identity, offline infrastructure-policy and interrupted-response evidence in the respective acceptance records. TASK-028 application staging integration and all deployed criteria remain incomplete; no local passing test resolves FIND-011/013 or production findings. FIRST_RELEASE_READINESS.md records NO-GO and exact missing evidence/owners. Existing cost estimates, proposed recovery targets and ADR-008/009 are preserved and require revalidation before approval.
