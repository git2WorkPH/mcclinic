# TASK-034 acceptance and project review

Base: fe84b36d6d00dcd5819c553c3435e0fcaf2c274f. Branch: task/TASK-034-ci-formatting. Date: 2026-09-14.

- REQ-FOUND-001 FR-01/AC-01: explicit lint and read-only changed-file formatting steps added to Verify, full Git history checked out, pinned Prettier 3.9.6 with frozen lockfile. Existing pnpm check and every regression step retained.
- Five tests pass: formatted additions/spaced filenames and ignore handling; bad formatting rejected without rewriting; missing base rejected; new-branch default-base selection includes multiple commits; deleted fixture files excluded.
- pnpm check PASS: lint/boundaries, TypeScript, 26 unit/API/tooling tests, Prisma generation and API/web builds. First sandbox run failed on local socket EPERM; same suite passed with socket access. No test disabled or weakened.
- Codegen drift check passed. Git diff whitespace check passed. Formatter checks applied to intended changed supported files only; seven existing user edits are excluded from this task and remain untouched.
- Formatter follows the pinned Prettier API and documented ignore behavior: https://prettier.io/docs/api and https://prettier.io/docs/cli . This adopts formatting on changed files; it does not certify existing legacy formatting.

Project-review: no application behavior or authorization changes; changes stay within CI approval and TASK-034 justification. Generated contracts, lockfile, starter and acceptance artifact bytes excluded appropriately. CI receives base values via environment and Git is invoked without shell interpolation. Local tests cover success and failure paths. No tracked source/test deletion. No GitHub run claimed: branch has not been pushed. No database/browser rerun required for formatter-only changes; existing workflow retains those checks. Dependency advisories under FIND-013 remain open and unrelated.
