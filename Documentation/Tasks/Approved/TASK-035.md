# TASK-035 — Separate and harden serving runtime images

Status: Approved for local preparation, 2026-09-14. Owner approval recorded below.
Requirements: REQ-FOUND-012; FIND-013; TASK-033 assessment.
Objective: reduce serving-image exposure while preserving local workflows and auditable scanner evidence.
Scope: design separate build/migration and API/web images; assess supported Node/Debian and package-manager security patches; identify exact build/native tooling that can be omitted from new serving images; establish time-bounded documented handling of remaining advisories.
Out of scope: deleting repository dependencies/files/tests/old images, dropping migrations/seed, cloud deployment, clinical behavior changes or automatic risk acceptance. Obtain explicit removal approval for any removal from existing supported artifacts; prefer additive image variants first.
Acceptance: serving image has documented minimal closure and complete OS/Node SBOM/scan; migration/seed and non-root state handling work; tenant/clinical/onboarding/print regressions, backup/restore and rollback evidence pass; no vulnerability is suppressed merely to obtain green status; public readiness separately decided.
Expected code areas: infrastructure/docker, dependency manifests, tooling and evidence. Tests: KEEP all existing tests; ADD separated-image and rollback checks. Dependencies: TASK-027/033; proposed ADR for serving/build/migration boundaries. Local change justification required before implementation.

## Sequence authorization — 2026-09-14

Owner: “ok i agree with the recommended sequence. Use the project-development skill and Continuity Kit workflow to implement it in sequence”. Approved sequence: TASK-035 → TASK-029/028 → TASK-030 → TASK-031. Owner further chose “Prepare locally; no AWS spending yet”. Local code, IaC and synthetic verification are authorized; deployed verification and production go/no-go cannot be claimed from local evidence. No real data, external activation, cloud apply or deletion authorized. Historical proposal retained; this record governs the approved local preparation scope.

## Completion — 2026-09-14

Local implementation and review complete; see `Documentation/Tasks/Completed/TASK-035.md` and `Documentation/Acceptance/TASK-035-acceptance.md`. Approval history retained.
