# TASK-034 — CI formatting rationale

Owner approval 2026-09-14: “can we add lint format in the github flow”. REQ-FOUND-001 FR-01/AC-01.
Existing workflow runs lint indirectly via pnpm check but has no formatter. Add explicit named lint and read-only changed-file Prettier checking, pinned dependency and local commands. Adopt formatting as files change; no mass rewrite of historical code or existing user changes. Preserve existing pnpm check and all tests (KEEP). ADD observable good/bad formatter verification and Git file-selection checks. Generated files, lockfile, starter and artifact evidence excluded from formatting. No runtime/data/authorization impact; no deletion, push or merge.
