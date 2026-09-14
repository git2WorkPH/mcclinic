# TASK-035 — Separate and harden serving runtime images

Status: Proposed, 2026-09-14. No implementation approval.
Requirements: REQ-FOUND-012; FIND-013; TASK-033 assessment.
Objective: reduce serving-image exposure while preserving local workflows and auditable scanner evidence.
Scope: design separate build/migration and API/web images; assess supported Node/Debian and package-manager security patches; identify exact build/native tooling that can be omitted from new serving images; establish time-bounded documented handling of remaining advisories.
Out of scope: deleting repository dependencies/files/tests/old images, dropping migrations/seed, cloud deployment, clinical behavior changes or automatic risk acceptance. Obtain explicit removal approval for any removal from existing supported artifacts; prefer additive image variants first.
Acceptance: serving image has documented minimal closure and complete OS/Node SBOM/scan; migration/seed and non-root state handling work; tenant/clinical/onboarding/print regressions, backup/restore and rollback evidence pass; no vulnerability is suppressed merely to obtain green status; public readiness separately decided.
Expected code areas: infrastructure/docker, dependency manifests, tooling and evidence. Tests: KEEP all existing tests; ADD separated-image and rollback checks. Dependencies: TASK-027/033; proposed ADR for serving/build/migration boundaries. Local change justification required before implementation.
