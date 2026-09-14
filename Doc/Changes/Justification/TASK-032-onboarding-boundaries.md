# TASK-032 — Onboarding boundary justification

2026-09-13: owner explicitly approved the exact relocation request with “yes i approved”. Replace only the public onboarding panel's extracted state/actions/browser/transport logic and backend onboarding construction; preserve all files, exports, tests, behavior and transaction bodies.
Requirement: REQ-FOUND-002 v0.2-MVP and REQ-FOUND-011. Finding: FIND-012. Owner authorizes bounded assessment/refactoring; exact code relocation remains subject to the explicit deletion rule.

Problem: the public onboarding component mixes UI, workflow, browser and transport responsibilities; the GraphQL adapter constructs onboarding persistence. Chosen remedy: extract the frontend responsibilities behind focused feature interfaces and inject backend application dependencies from composition. Exact existing targets and acceptance criteria are recorded in Approved/TASK-032.md.

Compatibility: preserve component exports, schema/operations, screen labels and flows, server permission checks, transaction boundaries, audit atomicity, token/MFA semantics and concurrency. No database or migration changes. Inspect all composition callers before signature changes. Preserve the original files; extracted logic remains tracked in new files and recoverable through Git history.

Test classification: KEEP all existing tests/assertions; ADD observable workflow/gateway/browser-adapter and injection checks. Verification includes existing onboarding/MVP/SaaS database/browser regressions, lint, types, codegen drift and builds. Do not treat historical test results as new verification.

Recovery: revert only the explicitly scoped refactor in a new approved change if needed; never discard unrelated work or remove tests. No source edits or code removals performed during assessment. The deeper store/transaction decomposition is deferred.

Implementation outcome: extracted contracts.ts, gateway.ts, browser.ts and useOnboarding.ts under the frontend onboarding feature. Preserved all component exports and AccountSecurityPanel. Backend construction moved into composeMvp, with optional fourth installer argument preserving existing callers. Added nine tests; existing tests untouched. Test setup corrections retained assertions. Acceptance records 50 passed scenarios, lint/types/build/codegen and review. No migrations, dependencies, transactional edits or policy changes.

## Owner-approved integration follow-up

2026-09-13: owner requested “merge to master all the changes”, authorizing inclusion of the previously excluded appointment/consultation application/domain formatting and the requested client-demo media/documentation. Structural TypeScript AST comparison against HEAD passed for all four code files: identifiers, literals and syntax-node structure are identical. No behavior, tests, fields or APIs removed. Existing TASK-032 checks ran with these edits present; no redundant application test run needed for formatting/media integration. The demo MP4 has a successful full-decode check. Keep ignored raw captures/local state outside Git; no push or deployment.
