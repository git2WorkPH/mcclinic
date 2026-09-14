# FIND-013 — Packaged dependency scan and release hardening gaps

Status: Open, 2026-09-14. TASK-027 / REQ-FOUND-012.

`pnpm audit --json` on the existing frozen dependency graph returned four high and one moderate advisory (no critical), 2026-09-13:

- image-size: GHSA-w3rx-r6r6-pgpr and GHSA-5p2g-fcmc-qvqq, high, image parser denial of service.
- deepmerge-ts: GHSA-ggr8-5vv4-36mx, high, recursive-graph stack exhaustion.
- mysql2: GHSA-3f6p-5ww8-9rcr, high, authentication downgrade; GHSA-rgwj-5xj2-c3m3, moderate, decompression denial of service.

These are dependency inventory findings, not proof that the application's runtime exposes each vulnerable path. Reachability and build/runtime classification have not been established. PostgreSQL remains the application database; mysql2 appears in the dependency graph. No dependency was silently upgraded, removed or marked safe.

Docker Scout image scan could not run because a Docker login is required. OS vulnerability coverage is UNVERIFIED. The CycloneDX inventory covers Node packages only. Image includes build tooling; runtime minimization and production privilege separation remain future work.

Local synthetic packaging can be evaluated with these findings Open. Production/public staging requires scan coverage, reachability assessment and remediation/explicit accountable risk decisions. Proposed TASK-033 records a bounded follow-up; no live exposure authorized.

## TASK-033 follow-up — 2026-09-14

Status remains **Open**. Three original npm advisories remediated by scoped Prisma overrides; two image-size advisories remain without a published patched release. Trivy OS/global-tool scan coverage now obtained, replacing the earlier UNVERIFIED gap. PCRE fixed; remaining OS/global-tool reports are not accepted for public exposure. Source-path analysis supports only current synthetic loopback use. Complete counts, limitations, commands and before/after reports: ../../Acceptance/TASK-033-acceptance.md. Proposed TASK-035 addresses runtime separation/hardening. No scanner mute or false production-readiness resolution.
