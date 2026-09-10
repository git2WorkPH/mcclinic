# Consolidated EHR Codex starter

Repository-local governance, six focused skills, EHR architecture, and concise committed session memory. This package contains documentation and templates; it does not include an application, approved implementation tasks, or live integrations.

## Install
1. Extract the ZIP. Copy the contents of `ehr-codex-project-starter/` into the target repository root, including hidden `.agents/`.
2. For an existing project, inspect and merge existing documents first. Do not blindly overwrite project history, approvals, or memory. Inventory overlapping Continuity/EHR skills and route each responsibility to the six skills in AGENTS.md. This package includes no competing legacy skills. Deleting existing legacy files requires explicit deletion approval; prepare the exact list for that approval and update obsolete references during the authorized consolidation.
3. Preserve the empty documentation directories. ZIP directory entries retain them on extraction. Each empty directory also contains `.gitkeep` so Git retains the structure; removal of those files follows the deletion rule.
4. Read session memory and AGENTS.md, inspect Git, and initialize PROJECT.md settings and product requirements. Keep project-specific clinical and jurisdictional decisions explicit.
5. Track and commit the kit and session memory in the project. Draft tasks and obtain explicit approval before application implementation.

## Ownership and workflow
AGENTS.md routes to one owner per concern: governance, assessment, development, review, session memory, and EHR architecture. No Jira or external task system is required. Use templates from `Documentation/Templates/`; every record is repository-local.

Requirements → assessment/findings → proposed task → explicit approval → approved task → existing branch search/reuse → task justification → implementation/test classification → verification/review → completed task and committed session memory.

Every implementation change is covered by `Documentation/Changes/Justification/<TASK-ID>-<description>.md`. There is no separate legacy documentation tree. Task approval does not implicitly approve deletions. The governance skill owns the complete deletion and approval rules; development owns KEEP/ADD/UPDATE/SPLIT/REMOVE test decisions.

## Start prompt
> Initialize this EHR repository using AGENTS.md and the six project-local skills. Read session memory first and validate it against Git. Establish project settings, draft Product/Foundation/Feature requirements from SCOPE.md, assess the repository, and propose bounded tasks with acceptance criteria. Do not implement application features until the proposed task has explicit approval. Update and commit concise repository-local session memory with the exact next action.

## Package map
- `AGENTS.md`, `README.md`: entry point and installation.
- `.agents/skills/`: six skills with distinct ownership.
- `Documentation/Project/`: project profile, scope, glossary.
- `Documentation/Requirements/{Product,Foundation,Features}/`: versioned requirements.
- `Documentation/Assessment/Findings/`: evidence-backed gaps.
- `Documentation/Architecture/Decisions/`: ADRs.
- `Documentation/Tasks/{Proposed,Approved,Completed}/`: task lifecycle.
- `Documentation/Acceptance/`: verification and review evidence.
- `Documentation/Changes/Justification/`: task implementation rationale.
- `Documentation/Session/SESSION_MEMORY.md`: committed continuation index.
- `Documentation/Templates/`: requirement, finding, task, ADR, acceptance, change-justification, and session-memory templates.

## Installed project — 2026-09-10
The kit is now installed at repository root. Begin with [session memory](Documentation/Session/SESSION_MEMORY.md), validate Git, then follow [AGENTS.md](AGENTS.md).
The nested starter is preserved unchanged as source material. Root overrides govern conflicts. All implementation justifications use `Doc/Changes/Justification/`; Jira is not used. See [requirements](Documentation/Requirements/INDEX.md), [tasks](Documentation/Tasks/Proposed/INDEX.md), and [assessment](Documentation/Assessment/INITIAL_ASSESSMENT.md).
