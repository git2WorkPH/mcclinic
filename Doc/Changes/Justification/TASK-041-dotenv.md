# TASK-041 — Change justification

Owner request authorizes local dotenv implementation; REQ-FOUND-015 AC-01–04. Existing local commands depend on exported shell variables; workspace working directories differ and naive dotenv/config would read inconsistent files. Add one local-only resolver at the API infrastructure edge, loading root .env before config use with override=false and quiet logging. Keep process environment authoritative and skip cloud/packaged/production/test/CI contexts. Root Prisma config/local tools reuse it; frontend only consumes supported nonsecret proxy config. Pin already installed dotenv version; do not update unrelated dependencies. Preserve two unrelated edits and all existing .env files.

KEEP all tests/guards. ADD root-path/compiled-path, precedence, missing/error and cloud/test boundary checks; verify safe example ignored/private configuration exclusions. No removal of existing behavior/files/migrations. Docs/requirements/task/ADR/memory updated; local commit only.

Build-context review found the legacy broad Dockerfile.api COPY uses the root ignore file, which did not exclude .local tooling/state or new Terraform state. Add exclusions for these private/generated paths; preserve all files on disk and existing dedicated packaged/serving allowlists. This prevents credentials/state entering the old development image; no supported application behavior removed.

Prisma loads the local helper lazily outside NODE_ENV=production: hardened migration images intentionally exclude source-only local configuration. ADD rebuilt real-image migration regression to prove the injected production job remains independent of dotenv/local files.

Frontend boundary refined: load a copied environment for the local proxy target, never populate root dotenv values into Vite's process/client env. KEEP all existing public VITE_* and proxy behavior. ADD real compiled API startup in an isolated fixture cwd, with private-value log denial; dependency links match workspace layout. Preserve unrelated compose/mail-reader edits by original diff hash. Existing MVP browser journeys verify proxy regression.
