# TASK-033 — Assess and remediate packaged dependency advisories
Status: Proposed, 2026-09-14. Not approved for implementation.
Requirements: REQ-FOUND-012 security/release verification; FIND-013.

Objective/scope: trace the five reported advisories to dependency owners and runtime/build reachability; obtain complete OS/image scanning through an approved local scanner or configured Docker Scout; propose minimal compatible dependency fixes and assess a reduced runtime image.

Out of scope: unapproved dependency/API/test removal, runtime-major changes, live deployment, cloud resources, clinical changes and accepting production risk without owner evidence.

Acceptance: dependency paths and exposure documented; relevant advisories remediated or explicitly triaged with evidence and accountable decision; OS scan evidence obtained; no regressions in existing lint/types/codegen/database/browser/build/package tests. Never weaken tests to obtain a clean scan.

Expected areas: lockfile/package manifests, packaging Dockerfile, dependency tests and release evidence. KEEP existing tests; ADD regression checks for reachable vulnerable paths where meaningful. Depends on TASK-027 artifacts. ADR needed if runtime packaging architecture changes materially; otherwise use ADR-010. Any removals require exact approval. Future justification: Doc/Changes/Justification/TASK-033-dependency-remediation.md.
