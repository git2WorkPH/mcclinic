# SaaS development verification — 2026-09-12

Scope: TASK-020–023, requirements v0.3; reviewed against base 6be71e24fa231fa7e9ab15d4417d992a6828b92f on task/TASK-020-saas-practices. Owner approval is preserved in the task records. This evidence applies to local synthetic development, not production readiness.

## Executed checks

Environment: Node 24.21.0, pnpm 10.34.5, macOS, PostgreSQL 17.6-alpine via Testcontainers, Playwright Chromium. No external service or live payment provider.

| Command | Result |
| --- | --- |
| `pnpm check` | Passed lint/import boundaries, TypeScript, 8 unit/API tests and API/web builds |
| `pnpm test:mvp` | Passed 14 database/API scenarios (9 preserved MVP plus 5 SaaS scenarios) |
| `pnpm test:mvp:web` | Passed 4 browser scenarios including preserved clinical journey, administrator restrictions, multipage printing and SaaS settings/switching |
| `pnpm test:integration` | Passed 1 preserved foundation PostgreSQL test |
| `pnpm test:web` | Passed 2 preserved foundation browser tests |
| `node tooling/check-codegen.mjs` | Passed generated contract drift check |
| `pnpm exec tsx tooling/verify-mvp-runtime.ts` | Passed fresh/repeated two-migration deployment and compiled API database readiness |

29 scenarios in total. The database suite retains backup/restore and atomic audit failure tests. SaaS tests verify pre-migration patient version/audit timestamp preservation, forged practice and resource IDs, cross-tenant patient/note/document/print/appointment/history denial, role-limited exports and audit, composite FK rejection, membership-role changes, seat-grant races, restricted/expired grace behavior, optimistic updates, full issued snapshots, missing template fields and immutable template revisions. Solo clinician creation preserves clinical access and adds a separately verified management grant.

## Review

Tenant ownership is explicit on all clinical/version/audit/receipt models. Clinical adapters apply tenant scope to reads and writes; server transactions revalidate membership role and management grant. Practice-scoped locks serialize clinical changes with membership, template and subscription decisions. Composite foreign keys reject cross-practice associations. Account/session resolution is global; global identity audit uses an internal practice with no memberships. No clinical access follows from billing or ordinary administrator permissions.

Prisma stays in adapters. Practice use cases enforce action permissions through a persistence port; template/subscription policies are injected through application ports. Issued revisions store the exact rendered HTML, populated values, branding, template version and issue timestamp; legacy documents retain their renderer fallback. Current template previews use the same rendering adapter with synthetic data. Safe allowlisted text and PNG/JPEG data URLs avoid executable templates or remote logo fetching.

Existing tests and assertions are retained. Harness migration setup now applies all additive migrations, with a fixture demonstrating migration preservation. The earlier browser run stopped at a scheduling interaction and its dependent audit assertion; unchanged assertions passed on subsequent isolated runs. No failing test was removed, skipped or relaxed. Final evidence is the completed reruns, not the earlier failure.

No destructive migration or new schema/API removal. TASK-020–023 relocation to Completed preserves task history. The owner’s unstaged MVP_RUNBOOK.md database-name edit is excluded from the completion commit. No existing local database, deployment or external payment was changed by tests. No push or merge.

## Remaining production findings

[FIND-010](../Assessment/Findings/FIND-010.md) and original clinical/legal/privacy findings remain Open. RLS is not enabled or claimed. Real identity onboarding, payment integration, database-owner controls, production scale/backup/security and Philippine document/signature rules need separate work. Physical printing, remote CI and SaaS Docker image runtime are not newly verified in this session; host compiled runtime and browser PDF layout are verified.

Decision: completed for the approved development SaaS scope after the recorded checks. Owner UAT is the next step; production approval is separate.

Final UI review: the synthetic SaaS screenshot was visually inspected after the passing logo/theme/header browser test. Custom name and blue theme appear in the system header, active practice is explicit and clinical tabs remain absent for the administrator. React Native Web emits a nonblocking resizeMode deprecation warning for the logo; rendering assertions pass.
