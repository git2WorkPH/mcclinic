# TASK-034 — CI lint and formatting checks

Status: Completed locally, 2026-09-14. Approval retained; see ../../Acceptance/TASK-034-acceptance.md.
Owner approval: “can we add lint format in the github flow”.
Requirement: REQ-FOUND-001 FR-01, AC-01; additive CI formatting overlay.
Objective: expose lint in GitHub Actions and enforce consistent formatting on changed supported files.
Scope: pinned Prettier, local commands/config, changed-file CI checker and named lint/format steps. Keep every existing verification step.
Out of scope: repository-wide formatting, clinical changes, dependency remediation, push/merge and editing seven existing user changes.
Acceptance: lint remains enforced; changed unformatted supported files fail; formatted files pass; deleted/ignored/unsupported files handled safely; missing base fails clearly; full history available for PR/push comparisons; CI never auto-writes.
Expected areas: root manifests, .github/workflows/verify.yml, formatter config, tooling, README.
Tests: KEEP existing checks; verify formatter success/failure and changed-file selection. Dependencies: existing TASK-001 verification platform. No material architecture decision needed.
