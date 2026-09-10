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
