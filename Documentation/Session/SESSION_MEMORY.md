# Session memory
Updated: 2026-09-13 (Australia/Sydney).
Phase: synthetic development MVP/SaaS; TASK-032 onboarding boundary refactor complete. Production readiness pending.
Active requirements: REQ-FOUND-002 v0.2-MVP and REQ-FOUND-011.
Active task: TASK-032 completed. TASK-024 and TASK-027–031 remain Proposed.
Current branch: master.
Observed HEAD before this memory update: fd296b7 (client demo and clinical module formatting).
Observed status before this memory update: clean after owner-approved fast-forward merge of all pending project changes, including TASK-032, four formatting-only files and the demo video/docs. No starter changes or deleted files. Ignored local captures/state remain outside Git. No push.

## Reconciliation and approval
- Started from master 6d3a749 (README flow commit); prior owner edits were no longer uncommitted. Initial pending files were the TASK-032 assessment records from this conversation.
- Read-only remote search initially failed DNS in sandbox; permitted retry found no TASK-032 branch. Created this branch without stashing or discarding work.
- Owner authorized assessment and bounded refactoring, then explicitly approved exact code extractions with “yes i approved”. Approval targets/history: [TASK-032](../Tasks/Approved/TASK-032.md). No broader deletion, merge, push or deployment authorized.

## Delivered / relevant files
- Frontend: apps/clinical-app/src/features/onboarding/{contracts,gateway,browser,useOnboarding}.ts; public OnboardingPanel delegates to the hook/adapters. AccountSecurityPanel and public exports preserved.
- Backend: apps/api/src/mvp-composition.ts constructs onboarding services; adapters/mvp-graphql.ts consumes injected services with backward-compatible existing callers.
- [Completed task](../Tasks/Completed/TASK-032.md), [acceptance/review](../Acceptance/TASK-032-acceptance.md), [FIND-012](../Assessment/Findings/FIND-012.md).
- Justification: Doc/Changes/Justification/TASK-032-onboarding-boundaries.md. New tests: tests/onboarding-boundaries.test.ts and tests/onboarding-injection.test.ts.

## Verification
- pnpm check PASS: lint/boundaries, types, 18 unit/API scenarios, Prisma generation and API/web builds.
- node tooling/check-codegen.mjs PASS without drift.
- PostgreSQL regression suites: 23 PASS. Existing MVP/SaaS/onboarding browser: 7 PASS; foundation browser: 2 PASS. Total 50 scenarios.
- Existing tests/assertions, schema, onboarding transactions and AccountSecurityPanel retained; code-removal review matches exact approved extraction scope. git diff --check PASS.
- Initial socket sandbox failure passed after escalation; new test setup corrected to generated contracts without weakening assertions. Existing image deprecation warning remains.
- Checks used shared working tree with unrelated appointment/consultation edits excluded from task scope. Runtime: /private/tmp/ehr-runtime/node_modules/.bin; disposable Docker PostgreSQL for database/browser tests. No real data or external mail.

## Remaining findings and context
- FIND-012 stays Open for deeper onboarding-store orchestration and broader boundary enforcement; not part of this completed refactor.
- Production Philippine clinical/privacy/legal/retention/signature findings and FIND-010/011 remain Open. Database name mcclinic; local/synthetic only. No automatic deletion/purge or live billing.
- [Onboarding runbook](../Project/ONBOARDING_RUNBOOK.md), [README flows](../../README.md), [MVP assumptions](../Project/MVP_ASSUMPTIONS.md).
- TASK-026 deployment planning is complete; [deployment plan](../Project/DEPLOYMENT_PLAN.md), proposed ADR-008/009 and TASK-027–031 remain the future deployment path. Earlier completed task records preserve full history.

## Exact next action
Review TASK-027 cloud artifact/config packaging for approval; TASK-032 and the demo are now merged locally. Do not push, deploy or start deeper store restructuring from this handoff.

## Client demonstration — 2026-09-13
Owner requested a prospect demo video. Created Documentation/Demos/MCClinic-Client-Demo.mp4 and accompanying README: captioned 1:44 walkthrough of real local synthetic workflows. Separate disposable PostgreSQL used; no application changes. MP4 full-decode check passed and document/history frames visually inspected. Raw capture/script retained in .local/client-demo-v2/. Observed HEAD a344c97; these media/docs and this memory addition are uncommitted. Four unrelated appointment/consultation edits remain unstaged. Next: review the demo locally; no sending/publishing authorized.

## Integration update — supersedes pending status above
Owner requested “merge to master all the changes”. Committed remaining changes as fd296b7 and fast-forwarded master from 6d3a749, including a344c97. All four appointment/consultation files are structurally AST-equivalent to their prior versions. Existing 50-scenario verification included them; no behavior changed. Demo and documentation are now tracked. No starter deletion, merge conflict or uncommitted project change before this memory update. Raw media and local secrets remain ignored.
