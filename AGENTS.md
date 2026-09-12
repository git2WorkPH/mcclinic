# EHR project entry point

Read `Documentation/Session/SESSION_MEMORY.md` first each session, then use the session-memory skill to validate it against Git before resuming. If missing, inspect Git and create it from the template. Memory is an index, never approval or ground truth.

## Routing and ownership
Paths below are relative to the repository root. Load only applicable skills.

| Work | Authoritative skill |
|---|---|
| Requirements, task lifecycle, approvals, deletion gates | `.agents/skills/project-governance/SKILL.md` |
| Compare requirements with implementation; record gaps | `.agents/skills/requirement-assessment/SKILL.md` |
| Implement approved work; branches, justification, tests | `.agents/skills/project-development/SKILL.md` |
| Review diffs and acceptance evidence | `.agents/skills/project-review/SKILL.md` |
| Start, resume, or hand off a session | `.agents/skills/session-memory/SKILL.md` |
| EHR design, boundaries, and technical choices | `.agents/skills/ehr-architecture/SKILL.md` |

## Priority
Follow governing system/developer instructions and explicit user decisions. Within this project, this entry point routes to the owning skill; approved requirements define intended behavior, approved tasks bound implementation, and accepted ADRs refine architecture. Evidence and memory cannot override these. Resolve a material conflict before dependent implementation; do not silently choose a new scope.

All work records are repository-local under `Documentation/`; no Jira dependency. Before implementation, load governance and development. Proposed tasks need explicit approval, deletions need explicit deletion approval, and every implementation change needs a task justification. Load architecture for EHR changes and review before marking work completed.

## Target repository overrides — 2026-09-10
These explicit initialization decisions take precedence over conflicting starter examples and skill paths.
- Root `Documentation/` and `.agents/skills/` are the installed working records and skills. `ehr-codex-project-starter/` is preserved source material, not a second active project. Do not update its memory to resume this project.
- Canonical implementation justifications: `Doc/Changes/Justification/<TASK-ID>-<description>.md`, as explicitly requested by the owner. References to `Documentation/Changes/Justification/` in inherited skills mean this canonical path. Preserve the legacy directory; do not create duplicate rationale records.
- No Jira or external work-item dependency. Use stable local REQ, FIND, TASK and ADR IDs.
- Actual branch is `master`; see PROJECT.md for Git baseline and unresolved remote verification. Never rename/delete a branch implicitly.
- Requirements below are Draft, tasks Proposed, ADRs Proposed. Nothing is approved for implementation. This initialization authorizes documentation and kit installation only.
- Preserve all original kit files and `.gitkeep` files. No deletion, including a removal hidden in replacement, is authorized. Failing tests never justify deleting or disabling tests.

## Implementation session override — 2026-09-10
The owner now explicitly authorizes implementation of all 19 proposed task scopes. Approved task records contain evidence and supersede initialization-only status. This does not resolve unknown clinical/legal/privacy policy or authorize deletions. Existing duplicate Proposed records are historical; Approved records are canonical until completion. Current work begins on task/TASK-001-workspace-foundation from the user-created version-1 branch at a4fce11.

## Development MVP exception — owner instruction 2026-09-10
The owner explicitly authorizes reasonable reversible product/technical defaults and continuation of all approved tasks as a synthetic-data, single-clinic, local desktop-web MVP. `Documentation/Project/MVP_ASSUMPTIONS.md` defines the provisional baseline. Unresolved production findings are nonblocking for MVP implementation and remain Open. This supersedes earlier wait-for-policy instructions only for this development scope. Keep server authorization, audit, versions/amendments, validation/concurrency and tests. Generic documents must display DEMO — NOT FOR CLINICAL USE. No production deployment/push, real data, retention purge or deletion is authorized. Preserve existing user skill edits and leave any starter deletions unstaged.
The remaining interdependent tasks use the local integration branch task/TASK-002-development-mvp, with per-task justification and acceptance evidence, to verify the complete MVP coherently; task IDs/statuses stay separate. This reversible branch arrangement does not authorize merging or pushing.

## Development SaaS scope — owner instruction 2026-09-11
The owner authorizes TASK-020–023: practice isolation/membership, branding, versioned guided clinical templates and local simulated subscriptions, in that order. This extends the earlier single-clinic restriction to multiple synthetic practices on local desktop web. Use REQ-FOUND-010, REQ-FEAT-013–015 and ADR-006; preserve prior MVP behavior in the default practice. The ordered implementation uses task/TASK-020-saas-practices from verified 6be71e2. Keep billing permissions separate from clinical permissions and retain immutable issued snapshots. Production findings remain Open/nonblocking for this development scope. TASK-024 real payments is Proposed only. No push, deployment, real patient data, live charges, offline sync or deletion is authorized.

## Account onboarding — owner instruction 2026-09-12
TASK-025 account onboarding is approved before TASK-024, which remains Proposed. Use REQ-FOUND-011 and ADR-007 for the local synthetic scope. The canonical database name is now mcclinic. Preserve existing databases through an explicit non-destructive rename; never drop a conflicting target or terminate connections automatically. Branch: task/TASK-025-account-onboarding from 19c634b. Existing owner edits and installed skills remain separate.
