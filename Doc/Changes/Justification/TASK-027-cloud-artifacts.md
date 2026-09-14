# TASK-027 — Packaging justification

Owner approved local implementation with optional LocalStack, 2026-09-13. REQ-FOUND-012 AC-02–04 local packaging overlay; approved task and ADR-010 define scope.

Problem: existing Dockerfile starts the foundation API, web relies on Vite, Compose provides only the development database, and the unrestricted Docker context could include local mailbox/MFA keys. A repeatable local complete-app package is needed before cloud deployment.

Chosen change: add separate packaged API/web entry points and Dockerfile with a strict context allowlist, explicit validated local config, non-root runtime, persistent separate local state, no-store proxy, health/drain handling and isolated Compose setup. Keep old entry points/Dockerfiles/Compose and all clinical logic intact. Block staging/production until their separate gates. LocalStack remains unnecessary unless an AWS adapter is added.

Tests: KEEP every existing test/assertion. ADD invalid-environment/secret validation, cache/header tests, shutdown-drain and packaged database/browser/artifact checks. Generate dependency SBOM, lock/revision provenance and security scan evidence; do not claim bit-identical OCI images or production certification. No deletion, migration reset, volume removal or account/record purge.

Preserve and exclude pre-existing app.ts, main.ts, patient application/domain, subscription policy and template snapshot edits from this task's commit. Build/tests use current shared working tree; report that limit. No push, merge or cloud spend.

Outcome 2026-09-14: all additions implemented and verified locally. Packaged delivery is an injected filesystem adapter so generated links honor WEB_PORT without changing the original local mailbox. Test-only Compose override keeps existing browser tests intact and permits non-root host-readable synthetic mailbox state. 53 scenarios passed; local ready/outage/recovery verified; no existing tests modified. Node SBOM/source provenance exported. Dependency scan completed with five advisories; Docker Scout OS scan unavailable without login, recorded Open in FIND-013 and Proposed TASK-033. Public deployment remains gated. No code/schema/file/volume removal occurred.

Follow-up verification: a rerun exposed host/container clock skew (client consultation 20:54:28 UTC versus adjacent server revisions 20:37:43 UTC). Preserve all existing assertions and add a verifier clock preflight; do not relax MFA or alter history sorting. A newly observed unrelated formatting edit in tooling/verify-mvp-runtime.ts is also preserved and excluded from this task.
