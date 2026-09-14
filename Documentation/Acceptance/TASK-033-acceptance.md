# TASK-033 — Dependency assessment, remediation and review

Date: 2026-09-14. Approved local/synthetic scope; completed assessment and safe fixes, **not production clearance**. Branch: task/TASK-033-dependency-remediation. Initial base c7c5a38; TASK-034 formatting-only correction 13271c9 was separately merged/pushed to master. Canonical rationale: Doc/Changes/Justification/TASK-033-dependency-remediation.md.

## Original advisory decisions

| Dependency and path                                     | Evidence / exposure                                                                                                                                                                                                                                                 | Decision                                                                                                                                                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prisma CLI → mysql2 3.15.3                              | Auth downgrade and compressed-packet denial of service; application uses PostgreSQL through adapter-pg, no MySQL connection path                                                                                                                                    | Scoped `prisma>mysql2` override to 3.23.1; both advisories absent from refreshed audit. Keep dependency/API intact.                                                                                                           |
| Prisma → @prisma/config → deepmerge-ts 7.1.5            | Prisma config loader uses deepmerge; repository config contains plain strings/objects, no Maps or untrusted recursive graph; remote/rc/package extensions disabled by Prisma loader                                                                                 | Scoped override to 8.0.2; real config loading and circular merge tested. v8 changes Map merge semantics, which this config does not use. Advisory absent.                                                                     |
| React Native → community CLI → Metro → image-size 1.2.1 | Two image-parser infinite-loop advisories; registry latest 2.0.2 still affected. Vite aliases React Native to React Native Web; packaged API/web do not start Metro. Branding accepts PNG/JPEG data URLs and renders in browser, without calling this server parser | Retain dependency and both advisories. No supported upstream patch identified. Assessed nonblocking only for current synthetic loopback workflows; do not run Metro against untrusted assets or claim public risk acceptance. |

Source evidence: `pnpm why` paths, installed Prisma config loader, prisma.config.ts, apps/clinical-app/vite.config.ts, practice settings validation and package entry points. This is scoped source/config reachability analysis, not proof of absence under all future uses. Upstream references: [Deepmerge v8 changes](https://github.com/RebeccaStevens/deepmerge-ts/releases/tag/v8.0.0), [MySQL2 fix](https://github.com/sidorares/node-mysql2/releases/tag/v3.23.1), and advisory URLs in the preserved npm reports.

## Image findings and fixes

Trivy 0.74.0 was downloaded from its official release and checked against the release SHA-256. It scanned local Docker exports, without a Docker socket mount, cloud image upload or Docker login. DB metadata and scanner/report hashes are retained in TASK-033-artifacts/. Reports cover the arm64 image inspected here, not every architecture. Workspace npm audit and the Node SBOM complement the image scan's Debian/global-tool coverage.

- Pinned Debian libpcre2-8-0 update to 10.42-1+deb12u1 removes CVE-2026-86145 and CVE-2026-89161 from the image report.
- Added pinned openssl 3.0.20-1~deb12u2 for Prisma platform detection; repeated migrations now run without the previous OpenSSL warning. OpenSSL adds low/medium scanner occurrences, retained rather than suppressed.
- npm audit: **4 high + 1 moderate → 2 high**, both image-size. No advisory allowlist or mute was introduced.
- Image OS occurrences: **225 → 233** (after: 4 critical, 52 high, 94 medium, 82 low, 1 unknown). Lower high count does not imply a clean image; OpenSSL/package additions increase the total.
- Global npm/pnpm tool occurrences remain **15** (8 high, 7 medium), in bundled brace-expansion, ip-address, tar and undici. Workspace overrides do not patch these global-tool copies. Their input paths are build/install tooling, not the clinical HTTP entry points; retained as release blockers, not dismissed.
- Critical OS reports include Perl and zlib findings. Vendor statuses include affected/fix_deferred/will_not_fix; no claim of exploitability or safety is inferred solely from severity. Full package paths, fixed versions, vendor references and statuses are retained. Public exposure requires separate review/remediation.

### Reduced-runtime assessment

The final image is approximately 1.11 GB and intentionally still includes workspace source, build/native tooling, npm/pnpm and Prisma CLI so the existing migration command works. A future split into build/migration and API/web runtime images could omit build/native tooling from the serving image. It must preserve migration/seed commands, Prisma generated files/engines, workspace links, SBOMs, non-root state permissions, rollback and all clinical behavior. Do not implement this by deleting dependencies or tests to reduce scanner counts. Proposed TASK-035 scopes that work; current Dockerfile and rollback image remain available. No new architectural pattern was required for the narrow overrides/OS patch.

## Verification

- `pnpm check`: PASS, lint/boundaries, types, **28 tests**, Prisma generation, API/web builds. Two new tests cover circular-object handling and actual repository config loading.
- `node tooling/check-codegen.mjs`: PASS, no generated drift.
- `pnpm exec vitest run tests/onboarding.integration.test.ts tests/mvp.integration.test.ts tests/database.integration.test.ts`: **23 PASS**.
- `pnpm test:web`: **2 PASS**.
- `SOURCE_REVISION=c7c5a38-task033-working IMAGE_TAG=task033 WEB_PORT=8085 node tooling/verify-packaged.mjs`: **7 PASS**, clock preflight, fresh/repeated migrations and restart persistence PASS. All existing assertions preserved. Total local scenarios: **60**.
- Frozen Docker install/build PASS. Final image `sha256:12a5b98135b307781cabaf64bcaeb2bd4cafa9ff0fb41a4e7b55188f76beca65`; exported provenance describes the working-tree build, not an exact source commit. Source hashes and lock hash retained.
- Local mcclinic-packaged API/web updated to IMAGE_TAG=task033, unchanged PostgreSQL/state volumes and credentials, uid 1000, readiness healthy at http://127.0.0.1:8080/clinic. Old task027 image retained for rollback.
- TASK-034 [GitHub run 34797793133](https://github.com/git2WorkPH/mcclinic/actions/runs/34797793133) **SUCCESS**, including formatting, lint, build, database and browser steps. Earlier run 34797099817 failed formatting across older unpushed commits; correction preserved the gate. This is hosted evidence for commit 13271c9, not the unpushed TASK-033 changes.

## Review decision

Project-review: scoped overrides, pinned OS fixes, complete before/after evidence and local reachability decisions satisfy the bounded TASK-033 assessment. No clinical permissions, schema, APIs, tests or supported behavior removed. Findings remain visible; no live deployment/payment/data or production risk acceptance. FIND-013 remains Open for image-size and remaining OS/global-tool exposure. TASK-035 is Proposed, not approved. TASK-033 is locally complete; its final merge/push remains a separate action.
