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
