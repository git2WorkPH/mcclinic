# TASK-035 — Separate and harden serving runtime images

Status: Completed locally, 2026-09-14.

Requirements: REQ-FOUND-012; FIND-013 remains Open for public readiness. Scope/approval history: [approved record](../Approved/TASK-035.md).

All local acceptance criteria passed: additive minimal API/web images with complete OS and bundled-dependency scans, non-root state, retained migration/seed image, 60 regression scenarios, full database/MFA-key restore and old/new image rollback. [Acceptance and review](../../Acceptance/TASK-035-acceptance.md); [ADR-012](../../Architecture/Decisions/ADR-012.md); justification: `Doc/Changes/Justification/TASK-035-runtime-separation.md`.

Remaining lower-severity serving OS findings and full migration-image findings require recheck by 2026-09-21 or before exposure changes. This is not production approval. No deployment, push, merge, deletion or real data.
