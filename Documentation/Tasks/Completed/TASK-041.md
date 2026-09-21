# TASK-041 — Local dotenv configuration

Status: Completed for local scope, 2026-09-21. Approval: owner request on 2026-09-21. Owner explicitly requested dotenv codebase update. Requirement: REQ-FOUND-015 AC-01–04. ADR-016 required. Branch codex/TASK-041-dotenv-terraform from 993142a; Git/remote/worktrees inspected, no matching task branch.

Objective/scope: shared local-only dotenv loader, API/Prisma/local tool integration, safe example and documented frontend boundary. Out of scope: real credentials, changing cloud injection, application workflows, deployment/push, deletions and unrelated compose/mail-reader edits.

Acceptance: all four requirement criteria verified with meaningful tests; full existing check/codegen/build pass; source and compiled paths documented; no secret output. Expected areas: API runtime/entry points, Prisma config, local seed/rename, Vite config, package manifests/lockfile, tests/docs. Dependencies: existing pinned Node/pnpm and config guards. KEEP all existing tests; ADD dotenv behavior and execution-boundary tests. Approval is the owner request, no further blanket approval needed.

## Completion evidence

All bounded local acceptance criteria verified and reviewed; see ../../Acceptance/TASK-041-acceptance.md. Original approval/scope/history above preserved. No production acceptance, merge/push, cloud execution or deletion authorization inferred. TASK-028 remains in progress.
