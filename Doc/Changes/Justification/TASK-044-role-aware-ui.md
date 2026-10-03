# TASK-044 — Change justification

The current desktop MVP presents practice creation, exports, account security, patient navigation and administration as stacked cards. Role filtering is correct after TASK-043, but the visual hierarchy makes personal security and practice administration appear related, repeats practice identity, consumes substantial vertical space and makes primary clinical work harder to scan.

Implement a presentation-only workspace shell. Keep the existing React Native Web components and GraphQL operations. Hoist primary section state to the shell; render compact practice context; move personal MFA under My account; place invitations with membership controls in manager-only Practice administration; group administration by Branding, Members, Templates and Subscription; retain role-appropriate Patients/Appointments/Audit navigation and all existing actions. Preserve the explicit `canManage` grant for a solo creator. Plan state never grants permission.

Test classification:

- KEEP all API, authorization, tenant, clinical integrity, printing and onboarding tests.
- UPDATE browser selectors and navigation steps where approved controls move; retain every workflow assertion.
- ADD role-aware shell, ordinary reception denial/visibility, manager administration and personal-account assertions.
- REMOVE none. No schema, migration, API, clinical content, test assertion or supported behavior is deleted.

Verification will include Prettier, Oxlint/boundaries, TypeScript, Vitest, build and database-backed Playwright. A visual screenshot review will check desktop hierarchy and readable focus/contrast. Session memory will include a detailed continuation handover with current branch/HEAD, completed files, test results, open work and exact commands.

The affected MVP files contained substantial legacy compact formatting. Pinned Prettier expanded those changed files, which accounts for most of the textual diff. Review uses semantic diff plus the complete regression suite; existing assertions and workflows remain.
