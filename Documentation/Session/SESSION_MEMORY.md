# Session memory
Updated: 2026-09-14 (Australia/Sydney).
Phase: local synthetic packaged MVP/SaaS COMPLETE; public staging/production pending.
Active requirement: REQ-FOUND-012 local packaging overlay; ADR-010 accepted only for local scope.
Active task: TASK-027 completed; TASK-028–031, TASK-024 and TASK-033 remain Proposed.
Current branch: task/TASK-027-local-packaging.
Observed HEAD before this memory update: b90be766afcc0439a49ad6f04fbe874155e030ec (master integration handoff).
Observed status before this memory update: intended TASK-027 runtime/build/test/docs/SBOM/provenance pending commit. Six pre-existing user-edited files remain unstaged and excluded: apps/api/src/app.ts, main.ts, modules/patient/application/patients.ts, modules/patient/domain/patient.ts, modules/subscription/application/policy.ts and modules/templates/infrastructure/snapshot.ts. No starter deletions.

## Authorization / reconciliation
- Owner approved “implement task-027, lets keep localstack optional.” Approval and local acceptance overlay: [TASK-027 approval](../Tasks/Approved/TASK-027.md). LocalStack is not required or installed.
- Read memory and actual master b90be76; remote TASK-027 search returned no branch after permitted DNS retry. Created current branch without stashing/discarding user changes.
- No merge, push, AWS resources, public exposure, real patient data, external mail/billing or deletion authorized. Prior TASK-032/demo work remains merged on master.

## Delivered / relevant files
- New packaged API/web/migration entry points and runtime helpers under apps/api/src/; old startup paths and existing tests unchanged.
- infrastructure/docker/Dockerfile.packaged, strict Dockerfile-specific ignore, compose.packaged.yaml and test override. Non-root API/web, only loopback web publication, separate persistent PostgreSQL mcclinic and local MFA/mailbox state.
- tooling/init-packaged.mjs (preserves existing secrets), package-provenance.mjs, verify-packaged.mjs and playwright.packaged.config.ts.
- [Runbook](../Project/PACKAGED_RUNBOOK.md), [completion](../Tasks/Completed/TASK-027.md), [acceptance/review](../Acceptance/TASK-027-acceptance.md), [ADR-010](../Architecture/Decisions/ADR-010.md).
- Rationale: Doc/Changes/Justification/TASK-027-cloud-artifacts.md. Node SBOM/source provenance: Documentation/Acceptance/TASK-027-artifacts/.

## Verification / running environment
- pnpm check PASS: lint/boundaries, types, 21 unit/API/runtime tests and API/web builds. Codegen drift check PASS.
- Existing PostgreSQL regressions 23 PASS; all seven existing clinical/SaaS/onboarding browser journeys PASS against built containers (no Vite); foundation browser two PASS. Total 53 scenarios.
- Fresh/repeated migration, API restart persistence, non-root/private-input inspection, readiness 200→503 during DB stop→healthy after restart and in-flight shutdown drain verified. Recorded source hashes match working tree. Synthetic clinician login visually inspected.
- Tests/build include the six user edits above but do not commit/review them as TASK-027 changes. Existing runtime tests/assertions and schema/migrations unchanged.
- Local package is running at http://127.0.0.1:8080/clinic, Compose project mcclinic-packaged, IMAGE_TAG=task027. Synthetic users clinician/reception/admin; password is privately stored in ignored .local/packaged/demo-password. WEB_PORT=8080, SOURCE_REVISION=b90be76-task027-working for current operations. Follow runbook for subsequent builds/start/stop.
- Image ID sha256:653be9a96fa4b836a64b6bdfcf4f28e1e3877095bc3849fce25e5ef360b9cb8e. Pinned runtime available at /private/tmp/ehr-runtime/node_modules/.bin. Test-only Compose project stopped; test/database/state volumes intentionally retained.

## Open findings / next action
- FIND-013: dependency audit found four high/one moderate advisory (image-size, deepmerge-ts, mysql2); reachability unassessed. Docker Scout OS scan unavailable without Docker login. Node SBOM is not full OS scan coverage. TASK-033 proposes assessment/remediation. No dependencies removed/upgraded silently.
- FIND-010/011/012 and Philippine clinical/privacy/legal/signature/retention findings remain Open. Staging/production configuration fails closed; ADR-008/009 cloud topology/recovery proposals remain Proposed. No automatic purge.
- Exact next action: test the local package using PACKAGED_RUNBOOK.md, review TASK-027 for an explicit local merge, then assess TASK-033 advisories before public staging. Do not provision TASK-028 or enable production from this memory.

Final reconciliation: initial final-image browser rerun failed history/MFA due to observed ~17-minute host/container clock skew. Clocks synchronized; unchanged seven journeys and restart passed on project mcclinic-package-test-1789335743408. Verifier now checks clock agreement before tests. A seventh unrelated formatting edit, tooling/verify-mvp-runtime.ts, remains unstaged/excluded. See acceptance evidence for failed-run history and Prisma warning.
