# TASK-026 deployment-readiness justification

Owner approved TASK-026 on 2026-09-13 and agreed TASK-024 should remain after deployment readiness. Requirement REQ-FOUND-012 AC-01–04; approved task record preserves the exact scope.

Problem: the application has verified local synthetic workflows, but its loopback-only API, Vite development proxy, local PostgreSQL Compose service, filesystem mailbox and MFA key do not define a safe cloud deployment. Region, recurring cost, operational ownership, recovery and production gates are undecided.

Chosen change: create a repository-local deployment plan with explicit assumptions and current primary sources; propose ADRs for topology/environment and recovery; create independently approvable implementation tasks for packaging, infrastructure, production identity delivery/security, staging verification and production readiness. This task does not alter application/runtime behavior or provision resources.

Affected records: PROJECT deployment plan, REQ-FOUND-012 approval history, ADR-008/009 proposals, TASK-027–031 proposals, FIND-011 deployment gaps, TASK-026 approval/completion/acceptance and session memory. Historical proposal and unresolved production findings remain intact.

Test classification: KEEP all existing tests unchanged. ADD documentation traceability/source/link checks only. No application test is required for a planning-only change; cloud, restore, network and security tests remain explicitly unrun until their proposed implementation tasks are approved and environments exist. No test, assertion, API, file, requirement or behavior is removed.

Verification: inspect referenced source/config paths, validate links and internal IDs, check Git diff/deletions, and conduct project-review against every TASK-026 criterion. Cost figures are dated planning estimates with explicit quantities and contingency, not quotes or Free Tier promises.
