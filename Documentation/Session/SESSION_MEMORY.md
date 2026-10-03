# Session memory

Updated: 2026-10-03 (Australia/Sydney).
Phase: synthetic development; local release preparation, NO-GO for public/real-patient release.
Active requirements: REQ-FEAT-019 / REQ-FOUND-012.
Active tasks: TASK-044 completed locally; TASK-028 remains Approved / In progress.
Current branch: task/TASK-044-role-aware-ui.
Observed HEAD before this memory update: 8af62a7bcaff6fc9bea070a8fc79c0951e98696a.
Observed status before this memory update: intended TASK-044 UI, browser tests, requirements, runbooks, acceptance and handover uncommitted; no unrelated changes.

## Current technical handover — TASK-044

Authority: owner requested implementation of the recommended UI and a detailed handover before TASK-028. [REQ-FEAT-019](../Requirements/Features/REQ-FEAT-019.md), [completed task](../Tasks/Completed/TASK-044.md), [justification](../../Doc/Changes/Justification/TASK-044-role-aware-ui.md), and [acceptance](../Acceptance/TASK-044-acceptance.md) are canonical. Branch was created from verified `master`/`origin/master` at `8af62a7`; no remote TASK-044 branch existed locally. Do not push/merge/deploy without separate authorization.

Implementation map:

- `apps/clinical-app/src/mvp/MvpApp.tsx`: owns shell section state and role-aware navigation. Sections are Overview, Patients, Appointments, Practice/Practice administration, My account, and administrator-only Audit. Overview gives clinician, reception and administrator distinct guidance/quick actions. Practice switching resets to Overview and reloads the actor for the selected practice.
- `PracticeSettings.tsx`: compact practice identity/status/switcher; expanded practice actions retain create/export for existing users. Only `ADMINISTRATOR` or `canManage` sees administration. Administration subsections are Branding, Members, Templates and Subscription; subsection selection survives data refresh. The plan badge does not grant authority.
- `OnboardingPanel.tsx`: `AccountSecurityPanel` now contains personal MFA only. `PracticeInvitationPanel` moved beside membership management and continues using the same invite mutation/local mailbox, role selection and seven-day message.
- `PatientWorkspace.tsx`: patient identity/version/tabs use a distinct context panel so identity remains prominent while changing clinical tabs.
- `ui.tsx`: adds shell/navigation/compact/status/patient styles and selected accessibility state; existing controls and feedback primitives remain.
- `tests/mvp-web/onboarding.spec.ts` and `saas.spec.ts`: selectors follow the new shell; reception cannot see Practice administration/invitations; manager invitation, branding, membership, templates and subscription outcomes remain exercised. Existing journey/printing/foundation tests remain unchanged.
- `README.md`, `ONBOARDING_RUNBOOK.md`, and `SAAS_RUNBOOK.md`: current labels are **Practice administration → Members/Branding** and **My account → Manage account security**.

Authorization invariant: ordinary invited clinician/reception memberships never see practice administration or invitations. Administrator role and the explicit `canManage` grant held by a solo practice creator are management capabilities. `SOLO` is a clinician-seat entitlement only. UI checks mirror server rules; GraphQL use cases/persistence still revalidate authority.

Verification completed on 2026-10-03: `pnpm check` PASS (54 tests plus lint/type/build); `pnpm test:onboarding` PASS 8; `pnpm test:mvp` PASS 14; `pnpm test:mvp:web` PASS 7; `pnpm test:web` PASS 2; targeted Prettier and diff checks PASS. Browser screenshots under ignored `test-results/mvp/` were visually reviewed for clinician, reception and administrator layouts. The initial sandboxed check could not bind loopback; approved local-socket rerun passed. No tests were skipped/weakened.

Resume procedure after interruption or credit limit:

1. Read this file, then run `git status --short --branch`, `git rev-parse HEAD`, `git log -3 --oneline`, and compare with the snapshot above.
2. Read the four canonical TASK-044 records linked above. If the task commit exists, inspect `git show --stat <commit>`; otherwise inspect `git diff 8af62a7 --` and continue only the recorded scope.
3. Do not recreate the UI or reformat unrelated files. Preserve APIs, schema, migrations, authorization and clinical workflows. Most large line counts are pinned Prettier expansion of legacy compact files.
4. If code changes after the recorded verification, rerun targeted formatting, `pnpm check`, `pnpm test:onboarding`, `pnpm test:mvp`, `pnpm test:mvp:web`, and `pnpm test:web`. Docker Desktop is required for database/browser suites; local socket tests may need approved execution outside the sandbox.
5. Review the full diff using project-review. Confirm no nonmanager invitation/settings path, no plan-derived privilege, no lost workflow/assertion and no deletion. Update acceptance and this handover with only newly observed evidence.
6. Commit only TASK-044 files locally. Rebuild packaged Docker images before demonstrating this UI; an older running image will continue showing the previous layout. Merge/push require explicit owner authorization.

Known limits: this is desktop React Native Web, with no offline synchronization or native navigation. No formal clinic-user usability study, production email, live billing, real data, Philippine legal/privacy/signature/retention conclusion or public deployment is included. The bundled app grew slightly; no performance threshold was established. These limits do not block synthetic MVP demonstration.

## Authority / Git reconciliation

- TASK-043: owner said non-admin signups should not see settings and only admins may invite/add members. Ordinary invited clinician/reception memberships lack management permission. Personal Account security remains visible; invitation/Practice settings controls require administrator role or the existing explicit creator management grant. Direct invite/member denial and receptionist UI covered. [Task](../Tasks/Completed/TASK-043.md), [evidence](../Acceptance/TASK-043-acceptance.md), [justification](../../Doc/Changes/Justification/TASK-043-admin-settings.md). Git at 78298db on master before this work; no unrelated changes present. Remote task branch check failed due network DNS, so no new branch was created.

- Owner requested invitation acceptance steps in "how to use". README now covers manager invitation, matching-email registration/verification, local mailbox access, **Join practice**, sign-in and practice switching. Checked exact UI labels against `OnboardingPanel.tsx` and `useOnboarding.ts`; no application change. Git shows prior 7c740ca and 0b0fee7 on master, with clean pre-edit status; prior two unrelated working-tree edits are absent. Local documentation-only follow-up, no push/deploy.

- README follow-up: owner requested setup for machines without brew/Node/pnpm. Validated prior memory against 0b0fee7, which committed TASK-041/042. Added OS prerequisites, pinned tooling, dotenv/database setup, synthetic login/onboarding and safe stop/resume to [README](../../README.md). Historical content preserved; no merge/push or database mutation.

- Read memory and checked branch/HEAD/status, worktrees and local/remote branches. Prior handoff matched after master merge at 993142a, verified origin/master. Created this task branch from that base; no matching remote/local TASK-041/042 branch.
- Owner requested dotenv codebase update and moving away from Python, then explicitly chose “Implement Terraform alongside CloudFormation now”, followed by “continue”. This approves the two bounded local tasks. No new merge/push, AWS spending/apply, real data, live mail/billing or deletion authorized.
- Existing master contains the development SaaS MVP and TASK-028 migration checkpoint. Branch histories retained. Existing user two-file diff SHA256 remains c717836a243d8d6c76afcf557cbea8d231473ac67c67b50ab32b4581e76791d6; exclude from commits.

## Delivered / source of truth

- [TASK-041](../Tasks/Completed/TASK-041.md), [acceptance](../Acceptance/TASK-041-acceptance.md), [REQ-FOUND-015](../Requirements/Foundation/REQ-FOUND-015.md), [ADR-016](../Architecture/Decisions/ADR-016.md), [justification](../../Doc/Changes/Justification/TASK-041-dotenv.md).
- Optional root dotenv for local source/compiled API, Prisma and seed/rename commands. Process variables win; cloud/production/test/CI do not load it. Vite reads only local proxy target using an isolated env copy; no root dotenv values promoted to client env. Safe .env.example; existing .env untouched. [Setup](../Project/ENVIRONMENT_CONFIGURATION.md).
- [TASK-042](../Tasks/Completed/TASK-042.md), [acceptance](../Acceptance/TASK-042-acceptance.md), [ADR-017](../Architecture/Decisions/ADR-017.md), [justification](../../Doc/Changes/Justification/TASK-042-terraform.md).
- Native [Terraform candidate](../../infrastructure/terraform/README.md) alongside unchanged CloudFormation/Python. TypeScript preserves all ten Python policy scenarios; original cfn-lint optional. Pinned Terraform1.14.9/AWS6.65.0 with lockfile, no-AWS mocked-plan CI. No real state/backend/resources created. Origin secret remains a documented state-bearing secret for a later protected-state deployment.
- [Shared logs](../Acceptance/TASK-041-artifacts/2026-09-21/); [MVP defaults](../Project/MVP_ASSUMPTIONS.md). No clinical/product behavior, schema/migration or permission removal.

## Verification

- TASK-043: lint, typecheck, build, onboarding integration 8/8 and MVP Playwright 7/7 PASS with Docker access; first sandboxed integration attempt could not reach Docker and was rerun successfully. Changed-file format/diff checks pass. No production claim.

- README-only follow-up: shell syntax, local links and package-script references checked; versions/accounts/committed Compose username verified against source. Formatting and diff review passed. Fresh OS installation and application suites not rerun for documentation-only changes. Unrelated two-file diff hash unchanged.

- pnpm check PASS: lint/boundaries/types, 54 unit/API tests, Prisma generation and API/web builds. Codegen/contract diff PASS.
- Final four runtime/integration files PASS / eight tests: compiled dotenv API from alternate cwd; existing packaged/staging guards; rebuilt real hardened-image bootstrap/repeated migrations/original checksums/TLS denials/runtime permissions. One earlier bootstrap failure did not recur in independent/final runs; cause unestablished, no retry/skip added. Investigate if it recurs.
- Playwright foundation2 and real database-backed MVP7 journeys PASS, including account/practice/clinical/printing flows.
- Terraform fmt/schema validation and nine mocked plan runs PASS; TypeScript policy11 tests PASS. No AWS API or actual infrastructure acceptance. Hosted CI unrun; no push.
- New migration image tag task041 is compatibility evidence only, not a freshly scanned/published release. Old image scan evidence and FIND-013 remain separate; refresh before exposure. Local clinic untouched; only isolated test services used.

## Exact next action / open gates

Review the local TASK-044 commit with the owner, then obtain explicit authorization before merging/pushing it to master. After integration, rebuild the packaged demo and resume bounded local TASK-028 cost/anomaly and operator-monitoring preparation. No AWS spending yet.

Full TASK-028/029/030/031 remain incomplete: account/domain/budget/tester/operator approval, protected remote state, real IAM/RDS/KMS/EFS/CloudFront/notifications, drift/PITR/key/sink recovery and target-ISP/load evidence are missing. FIND-013 and Philippine clinical/privacy/legal/signature/retention findings remain Open. No purge. TASK-024 deferred; TASK-036–040 future nice-to-have. Memory is an index, never approval or ground truth.
