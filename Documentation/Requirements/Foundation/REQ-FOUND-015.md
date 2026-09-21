# REQ-FOUND-015 — Local dotenv configuration

Status: Approved for synthetic development, 2026-09-21. Owner: “i want to use dotenv can you update the codebase”.

Objective/scope: consistent repository-root .env loading for local API, Prisma and local seed/rename commands; preserve explicit process environment and existing runtime guards. No application feature or production secret management change.

## Rules / acceptance criteria

- AC-01: Root .env resolves independently of shell working directory for source and compiled API entry points. Existing process variables win; missing file is allowed; other file errors fail safely without printing values. Tests exercise source/compiled consumers, precedence, missing files and failures.
- AC-02: Load before local configuration is consumed. Preserve synthetic-only, loopback and validation checks. APP_ENV synthetic-staging/packaged, NODE_ENV production/test and CI execution do not implicitly load developer .env. No secret values in logs.
- AC-03: Prisma and explicit local seed/rename commands share local loading. Packaged/staging/operator commands retain injected configuration. Vite consumes only the explicitly supported local proxy setting; no database secrets exposed to browser bundles.
- AC-04: Commit a safe .env.example with mcclinic placeholders, preserve existing .env files, document setup/precedence and verify ignore/build-context exclusions. Existing regressions remain.

Authorization: configuration does not grant clinical or cloud access; existing server permissions unchanged. Data: local synthetic credentials, ignored .env; example has no usable secret. Audit: no clinical audit changes, retain task rationale/provenance. Expected tests: loader/entry-point boundary and existing runtime regressions; codegen, lint/types/build. Open production questions: secret custody/rotation and cloud approval remain governed by REQ-FOUND-012; dotenv is not a production vault.

## Local acceptance — 2026-09-21

TASK-041 completed for synthetic local scope; AC-01–04 evidence in ../../Acceptance/TASK-041-acceptance.md. No production secret-custody or legal readiness acceptance.
