# TASK-044 — Role-aware workspace UI

Status: Completed for synthetic development MVP, 2026-10-03.
Requirement: [REQ-FEAT-019](../../Requirements/Features/REQ-FEAT-019.md), AC-01–06.
Dependencies: completed TASK-020, TASK-025, TASK-032 and TASK-043. No ADR required.

## Scope and approval

Implement the owner-approved UI recommendations before resuming TASK-028: desktop application shell and navigation; compact practice identity/switching; separate My account and Practice administration; administrator/explicit-manager-only invitations and settings; organized administration sections; prominent patient context; clearer status, empty and action feedback; focused responsive/accessibility styling. Preserve all workflows, API contracts and server authorization.

Out of scope: schema/API/domain changes, native navigation, offline support, new clinical behavior, live billing/email, production policy and removal of supported behavior.

Approval evidence: owner, 2026-09-28: “can you implement the recommended UI”. The preceding concrete recommendation defines this bounded scope. No deletion authorized or required; relocation/relabeling retains all actions.

## Acceptance and verification

Trace AC-01–06 through Playwright. KEEP existing tests; UPDATE selectors only for intentionally relocated controls; ADD ordinary-role and solo-manager visibility/navigation assertions. Run formatting, lint, typecheck, unit tests, build, focused onboarding/integration and all MVP browser journeys. Review the full branch diff.

Branch: `task/TASK-044-role-aware-ui` from `8af62a7bcaff6fc9bea070a8fc79c0951e98696a`. Local branch search found no TASK-044 branch; origin/master matched the base. Justification: `Doc/Changes/Justification/TASK-044-role-aware-ui.md`.

## Completion

[Acceptance and review](../../Acceptance/TASK-044-acceptance.md) pass AC-01–06. All supported workflows and server authorization remain. Commit is pending at this record update; branch is local and no merge/push is authorized by this task.
