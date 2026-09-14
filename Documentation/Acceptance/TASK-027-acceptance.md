# TASK-027 acceptance and project review

Date: 2026-09-14. Base b90be76; branch task/TASK-027-local-packaging. Decision: Completed for approved local synthetic packaging; no staging/production readiness claim.

## Criteria

- AC-01 PASS for local artifacts: pinned Node 24.21.0 base digest, pnpm 10.34.5/frozen lockfile, compiled API/web, image revision label and source/lock SHA-256 provenance, CycloneDX Node dependency inventory. Inspected image uid 1000 and absence of .local, .git, .env, Documentation and starter content. No runtime secret was passed as a build argument. Dependency scan completed with findings; OS scan remains unavailable and explicitly recorded in FIND-013.
- AC-02 PASS: local-container plus synthetic opt-in and mounted DB secret required; invalid port/origin/state/secret fails closed. Staging and production intentionally rejected until separately approved controls. Existing loopback entry points preserved. Only web is published to 127.0.0.1; DB/API internal. LocalStack is optional, absent from default setup.
- AC-03 PASS: read-only non-root API/web containers, health/readiness, explicit migrate/seed and preserved state. 53 scenarios passed: 21 unit/API/runtime, 23 PostgreSQL regressions, seven packaged browser journeys and two foundation browser tests. Fresh and repeated migrations passed. Packaged verifier checked restart persistence. Running local readiness returned 200, then 503 when the isolated database stopped, then recovered healthy after restart. Shutdown unit test confirms in-flight response completes before disconnect.
- AC-04 PASS: no-store API/account/SPA/document paths, immutable hashed public assets, CSP/nosniff/same-origin frame/referrer headers; request body, query parameters, authorization and practice scope preserved through proxy. Existing tenant/clinical/document/MFA journeys passed through the actual built web/API containers with no Vite server.

## Commands/results

All use the pinned runtime on PATH (`/private/tmp/ehr-runtime/node_modules/.bin` in this environment).

- `pnpm check`: PASS lint/boundaries, TypeScript, 21 tests and API/web builds.
- `node tooling/check-codegen.mjs`: PASS, no drift.
- `pnpm exec vitest run tests/onboarding.integration.test.ts tests/mvp.integration.test.ts tests/database.integration.test.ts`: 23 PASS.
- `SOURCE_REVISION=b90be76-task027-working IMAGE_TAG=task027 WEB_PORT=8085 node tooling/verify-packaged.mjs`: seven PASS; repeated migration and persistent restart PASS. Test services stopped, volumes retained.
- `pnpm test:web`: two PASS.
- Docker Compose build/start/health, image uid/private-input inspection and local readiness outage/recovery: PASS.
- `pnpm audit --json`: completed, exit 1 due to four high/one moderate existing advisories; FIND-013 and TASK-033 preserve evidence/next action. `docker scout cves ...`: unavailable because Docker login required; not marked passed.
- `git diff --check`: PASS. No existing files, tests, schema fields, migrations or supported behavior deleted.

## Artifact and environment evidence

Image `mcclinic-packaged:task027`, ID `sha256:653be9a96fa4b836a64b6bdfcf4f28e1e3877095bc3849fce25e5ef360b9cb8e`; Node base digest `sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553`. PostgreSQL 17.6-alpine uses its separate mcclinic-packaged volume. SBOM/provenance are in TASK-027-artifacts/.

Build source is labeled a working-tree build, not the base commit alone: six pre-existing user changes in app.ts/main.ts, patient application/domain, subscription policy and template snapshot were present for builds/tests and remain excluded from the task commit. Embedded source hashes record exact inputs. No claim of byte-identical OCI rebuild or complete OS SBOM.

## Review and limitations

Project-review found no blocking local packaging issue. Changes are additive and covered by TASK-027 rationale; existing Dockerfiles, local entry points, tests and user edits preserved. Codegen/schema unchanged. ADR-010 accepts local packaging only; ADR-008/009 remain Proposed. Staging/public exposure, external delivery, cloud secrets, production least-privilege roles, restore drills and image/dependency hardening remain Open. These do not block the synthetic loopback demonstration but do block a production-readiness claim. No push, merge, cloud provisioning or live data.

## Final rerun and reconciliation

The first final-image rerun passed five browser tests and failed history navigation/MFA. Retained synthetic metadata identified clock skew: client consultation time 2026-09-13 20:54:28.550 UTC versus adjacent server note revisions 20:37:43 UTC. With host/container clocks synchronized, the unchanged seven-test suite passed in 9.3 seconds, followed by persistent restart verification (project mcclinic-package-test-1789335743408). Added a one-second-tolerance clock preflight to the host verifier; no clinical logic, MFA windows or test assertions changed. Final image remains the ID above; the verifier is excluded from the image. `node --check tooling/verify-packaged.mjs` passed. Prisma emitted an OpenSSL autodetection warning during successful migrations; image dependency/OS hardening remains a release gate.

A seventh unrelated edit, formatting in tooling/verify-mvp-runtime.ts, appeared during this session and is preserved unstaged alongside the six listed above. It is not included in the image or task commit. Final project-review confirms additive implementation, unchanged regression assertions, traceable local criteria and documented scan limitations.
