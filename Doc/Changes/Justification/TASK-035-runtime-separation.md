# TASK-035 — Runtime separation rationale

Owner approved the release sequence on 2026-09-14; AWS preparation only, no spending. REQ-FOUND-012/FIND-013.

The current serving image includes compiler, native/mobile tooling, npm/pnpm and Prisma CLI. Add new bundled API/web serving images with pinned Node binary and official Debian non-root runtime base, while retaining original package/Dockerfile and full migration/seed image. No source/API/test/dependency deletion. Bundle manifest and scoped SBOM report actual shipped code; scan OS and dependencies without hiding findings. Preserve local config guard, mounted key/database state, privacy/cache headers and clinical semantics.

KEEP all tests; ADD bundle-runtime behavior, absence of build tools, full packaged journeys and restored database/key/rollback checks. Existing helpers may gain explicit optional image selection; original behavior remains default. Separate image variants first; no rewrite of clinical logic. ADR-012 records boundaries and compatibility.
