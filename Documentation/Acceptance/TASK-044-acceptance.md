# TASK-044 — Acceptance evidence

Date: 2026-10-03 (Australia/Sydney). Scope: REQ-FEAT-019 AC-01–06 on `task/TASK-044-role-aware-ui`, base `8af62a7bcaff6fc9bea070a8fc79c0951e98696a`.

## Outcome by criterion

- AC-01 PASS: signed-in desktop shell shows branded practice context, role/status badges, primary navigation, My account and sign-out. Clinician, reception and administrator receive distinct overview guidance and quick actions. Selected navigation exposes accessibility state.
- AC-02 PASS: ordinary reception/clinician membership sees **Practice**, with switching/creation/export actions, but no **Practice administration**, membership controls or invitations. Administrator and explicit `canManage` creator see **Practice administration**. Existing server-side invite/member denial tests remain passing.
- AC-03 PASS: compact practice header provides switching/status; expanded Practice view contains practice actions. Manager administration is split into Branding, Members, Templates and Subscription without API/schema changes.
- AC-04 PASS: personal MFA is under **My account → Manage account security**. Invitations moved to **Practice administration → Members** and remain manager-only.
- AC-05 PASS: patient context uses a distinct identity panel above Profile, Consultations, Documents, History and Appointments. Existing patient, clinical integrity, printing and scheduling browser journeys pass unchanged in outcome.
- AC-06 PASS: navigation wraps for narrower screens, controls retain accessible names/selected states, feedback remains live/visible, and empty/loading states are preserved. Desktop screenshots were reviewed for clinician, reception and administrator journeys.

## Verification

- `pnpm check`: PASS — boundaries/lint, TypeScript, 13 unit files / 54 tests, Prisma generation, API build and web build.
- `pnpm test:onboarding`: PASS — 1 file / 8 database-backed tests.
- `pnpm test:mvp`: PASS — 1 file / 14 database-backed tests.
- `pnpm test:mvp:web`: PASS — 7 database-backed Playwright journeys.
- `pnpm test:web`: PASS — 2 foundation Playwright checks.
- Targeted Prettier and `git diff --check`: PASS.

The first sandboxed `pnpm check` attempt failed because local test servers could not bind `127.0.0.1` (`EPERM`), not because of an application assertion. The same command passed with approved local socket access. The first MVP browser attempt after the change found two expected selector/state presentation differences; tests were updated to assert the same underlying membership/subscription outcomes in the new sections, and the final complete run passed. No skip, retry logic or weakened authorization assertion was added.

## Review

No blocking finding. The change stays in the React Native Web presentation layer and retains GraphQL/domain/persistence boundaries. Subscription plan never grants management permission; explicit role/`canManage` continues to control UI and the server remains authoritative. No files, tests, APIs, schema fields, migrations, records or supported actions were deleted. Legacy compact files were formatted by pinned Prettier after modification; semantic behavior is covered above. Production usability research, native/offline UI and jurisdictional readiness remain open.
