---
name: project-development
description: Implement approved EHR tasks with branch reuse, change justifications, requirement-driven test changes, and verification.
---

# Project development

Load project-governance for approval/deletion rules and ehr-architecture for EHR changes. Validate memory first. Verify the task's explicit approval evidence, linked requirement criteria, dependencies, and accepted decisions before editing implementation.

## Branch selection
Inspect current branch, HEAD, working tree, worktrees, local branches, remotes, and remote task branches before creating a branch. Search by exact task ID plus task-record branch references; do not assume the slug is unchanged. Useful commands include `git status --short --branch`, `git worktree list`, `git branch --list`, `git branch -r`, and `git ls-remote --heads <remote>` for each configured relevant remote. Refresh remote refs when available; do not prune/delete as part of the search.

Reuse the matching local task branch, or create a local tracking branch for the existing remote task branch. If several branches match, inspect ancestry and task history before choosing; ask only if ambiguity remains. Never switch in a way that loses unrelated work or take over another active worktree. If remote inspection fails, record the limitation and do not claim no remote branch exists; resolve it before creating a potentially duplicate task branch. With no configured remote, record that fact and search local branches. Create `task/<TASK-ID>-<description>` from the configured, verified base only when no matching task branch exists. Do not reset, stash, or discard user changes automatically.

## Implementation and rationale
Before the first implementation edit, create/update `Documentation/Changes/Justification/<TASK-ID>-<description>.md` using the change-justification template. Every implementation change, including follow-up fixes, tests, configuration, and migrations, must be covered by this task's current justification. Explain requirement → observed problem → chosen change → affected files/behavior → verification. Keep it accurate as scope evolves. Proposal bookkeeping alone does not need an implementation justification.

Implement only approved scope, preserving compatibility and satisfying the governance deletion gate. Record newly discovered work as findings/proposals. Keep generated GraphQL output tied to its schema/documents and generation command; do not hand-patch generated files.

## Requirement-driven test classification
Classify affected existing and proposed tests in the justification before altering them:

| Classification | Decision |
|---|---|
| KEEP | Test still represents a valid approved requirement; preserve it and fix implementation if needed. |
| ADD | Approved behavior lacks coverage; add a meaningful observable check. |
| UPDATE | Approved behavior changed; document old/new expectation and preserve unrelated assertions. |
| SPLIT | Separate distinct behaviors while retaining traceable coverage of each valid obligation. |
| REMOVE | Requirement no longer applies; identify replacement/coverage effects and obtain explicit deletion approval. |

UPDATE and SPLIT never authorize removing assertions, tests, or supported behavior implicitly. A failing test is evidence to investigate, not permission to weaken coverage. Classify by requirement, not by what makes the suite pass.

## Verification and completion
Run relevant lint, TypeScript checking, code generation checks, tests, and build checks required by the project/task. Use Vitest for logic, Testcontainers for database/infrastructure behavior, and Playwright for appropriate web flows. Capture exact commands, results, environment, and blockers in acceptance evidence; never mark an unrun check passed. Review the final diff using project-review. Update task, finding/requirement links, justification, and session memory. Commit intended changes and memory together when ready under repository policy. If checks or approvals remain unresolved, keep the task Approved and record the exact next action; do not claim completion.
