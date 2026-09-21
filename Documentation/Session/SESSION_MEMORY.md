# Session memory

Updated: 2026-09-21 (Australia/Sydney).
Phase: synthetic development; local release preparation, NO-GO for public/real-patient release.
Active requirements: REQ-FOUND-015 / REQ-FOUND-012.
Active tasks: TASK-041 and TASK-042 locally completed; TASK-028 remains Approved / In progress.
Current branch: master.
Observed HEAD before this memory update: 7c740caecf597cc82a749d5f007d07446a6ed1d4.
Observed status before this memory update: README invitation how-to uncommitted; otherwise clean.

## Authority / Git reconciliation

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

- README-only follow-up: shell syntax, local links and package-script references checked; versions/accounts/committed Compose username verified against source. Formatting and diff review passed. Fresh OS installation and application suites not rerun for documentation-only changes. Unrelated two-file diff hash unchanged.

- pnpm check PASS: lint/boundaries/types, 54 unit/API tests, Prisma generation and API/web builds. Codegen/contract diff PASS.
- Final four runtime/integration files PASS / eight tests: compiled dotenv API from alternate cwd; existing packaged/staging guards; rebuilt real hardened-image bootstrap/repeated migrations/original checksums/TLS denials/runtime permissions. One earlier bootstrap failure did not recur in independent/final runs; cause unestablished, no retry/skip added. Investigate if it recurs.
- Playwright foundation2 and real database-backed MVP7 journeys PASS, including account/practice/clinical/printing flows.
- Terraform fmt/schema validation and nine mocked plan runs PASS; TypeScript policy11 tests PASS. No AWS API or actual infrastructure acceptance. Hosted CI unrun; no push.
- New migration image tag task041 is compatibility evidence only, not a freshly scanned/published release. Old image scan evidence and FIND-013 remain separate; refresh before exposure. Local clinic untouched; only isolated test services used.

## Exact next action / open gates

Continue bounded local TASK-028 cost/anomaly and operator-monitoring preparation using one selected infrastructure owner; preserve both candidates/history and update justification before code. No AWS spending yet. Verify remote/master before any push; this README follow-up has only local documentation authorization.

Full TASK-028/029/030/031 remain incomplete: account/domain/budget/tester/operator approval, protected remote state, real IAM/RDS/KMS/EFS/CloudFront/notifications, drift/PITR/key/sink recovery and target-ISP/load evidence are missing. FIND-013 and Philippine clinical/privacy/legal/signature/retention findings remain Open. No purge. TASK-024 deferred; TASK-036–040 future nice-to-have. Memory is an index, never approval or ground truth.
