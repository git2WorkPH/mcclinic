# TASK-025 — Implement account onboarding before live billing
Status: Completed for local synthetic development, 2026-09-12. Requirement REQ-FOUND-011 AC-01–05.
Approval: Owner: "Use the project-development skill and Continuity Kit workflow to implement account onboarding before implementing task-024. Also, from now onwards we will change the database name to mcclinic from ehr_mvp".
## Objective/scope
Implement registration, verification, doctor/practice initialization, staff invitation acceptance, recovery and TOTP MFA with local message delivery. Change new database configuration to mcclinic and provide a tested non-destructive rename workflow for existing databases.
## Out of scope
Real email delivery/payments, patient data, deployment/push, deletions, regulatory verification and weakening existing tests.
## Acceptance
REQ-FOUND-011 AC-01–05; existing demo accounts and clinical/SaaS regressions preserved. Validate safe database rename and additive migration in isolated containers. Review and record precise evidence before completion.
## Areas/tests
Identity/onboarding application ports and Prisma adapters; additive schema; GraphQL generated contracts; web login/account controls; local mailbox and rename tools; Vitest/Testcontainers/Playwright.
## Dependencies/ADR
Completed TASK-020–023. ADR-007 accepted local scope. TASK-024 stays Proposed and depends on this task.
## Branch/rationale
Local task/TASK-025-account-onboarding from 19c634b after local/worktree/live remote search (no matching branch). Existing user edits and new skills retained. Doc/Changes/Justification/TASK-025-onboarding.md.

## Acceptance evidence
All REQ-FOUND-011 AC-01–05 passed; see ../../Acceptance/TASK-025-acceptance.md (40 automated scenarios, full checks, migration/runtime and project review). Approval source remains preserved in ../Approved/TASK-025.md. TASK-024 stays Proposed.
