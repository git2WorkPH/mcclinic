# TASK-043 — Acceptance evidence

2026-09-21, local synthetic development. Owner-authorized scope: non-admin settings visibility and admin-only invitation/member management. Reviewed source and application use cases: `PracticeBar` already hides Practice settings from memberships lacking `ADMINISTRATOR`/`canManage`; invite form was already manager-gated, but its parent button was misleadingly labeled “Account security and invitations” for all users. The API revalidates membership and refuses ordinary nonmanager invite/member writes. The clinician practice creator's explicit `canManage` grant is an administrator capability preserved by existing approved SaaS defaults.

- Changed nonmanager account button to **Account security** while preserving personal MFA and recovery actions. Manager label and invitation form remain.
- Browser journey now asserts an invited receptionist sees no Practice settings or invitation label/form and can open Account security.
- Onboarding integration now asserts direct `SetPracticeMember` denial for that receptionist, alongside existing direct invite denial.
- KEEP existing tests, API behavior, clinical permissions and creator grant. No test was removed, disabled or weakened. Pinned Prettier expanded the two legacy one-line test files; semantic additions are limited to the assertions above.

Verification: `pnpm lint` PASS; `pnpm typecheck` PASS; `pnpm build` PASS, including Prisma client, API and web bundle; `pnpm test:onboarding` PASS, 8 tests using isolated Testcontainers PostgreSQL; `pnpm test:mvp:web` PASS, 7 real database-backed browser journeys. First sandboxed database run could not access Docker; rerun with Docker access passed. Formatting and diff checks pass. No production claim, Git push or deployment.

Review: nonmanager UI matches server permission; own account security remains accessible; admin/explicit-manager invitation journey passes. No new schema, data migration or API change. No blocking findings for this bounded task.
