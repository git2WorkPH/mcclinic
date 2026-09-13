# TASK-027 — Package immutable application artifacts
Status: Completed for local synthetic packaging, 2026-09-14.
Requirements: REQ-FOUND-012 local packaging overlay, AC-02–04. ADR-010 accepted for this scope; ADR-008/009 remain Proposed.

Owner approval, scope and acceptance criteria retained in [approval history](../Approved/TASK-027.md). [Acceptance evidence](../../Acceptance/TASK-027-acceptance.md) records 53 passed scenarios, build/type/lint/codegen checks, non-root/private-input inspection, fresh/repeated migrations and readiness outage/recovery.

Delivered separate built-web/proxy and API containers, PostgreSQL mcclinic with isolated persistent storage, explicit configuration, local mailbox links, graceful shutdown, SBOM/provenance and [operator runbook](../../Project/PACKAGED_RUNBOOK.md). LocalStack remains optional and is not installed. No original entry point or test removed.

FIND-013/TASK-033 retain dependency advisories, OS scan login limitation and release-hardening work. Public staging/production startup is blocked. No cloud provisioning, push, merge, live mail/billing or real data. Canonical justification: Doc/Changes/Justification/TASK-027-cloud-artifacts.md.
