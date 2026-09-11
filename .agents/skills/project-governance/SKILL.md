---
name: project-governance
description: Manage repository-local requirements, findings, task approval, and deletion authorization for this EHR project.
---

# Project governance

This skill owns lifecycle and approval rules. Other skills reference these rules instead of redefining them.

## Records and authority
Use `Documentation/Templates/` to create records. Keep stable IDs and repository-relative links:

| Record | Location | ID / lifecycle |
|---|---|---|
| Product requirement | `Documentation/Requirements/Product/` | `REQ-PROD-###`; Draft → Approved → Superseded |
| Foundation requirement | `Documentation/Requirements/Foundation/` | `REQ-FOUND-###`; same lifecycle |
| Feature requirement | `Documentation/Requirements/Features/` | `REQ-FEAT-###`; same lifecycle |
| Finding | `Documentation/Assessment/Findings/` | `FIND-###`; Open → Resolved or Deferred |
| Task | `Documentation/Tasks/Proposed/`, `Approved/`, `Completed/` | `TASK-###`; Proposed → Approved → Completed |
| Architecture decision | `Documentation/Architecture/Decisions/` | `ADR-###`; Proposed → Accepted → Superseded |
| Acceptance evidence | `Documentation/Acceptance/` | `<TASK-ID>-acceptance.md` |
| Implementation rationale | `Documentation/Changes/Justification/` | `<TASK-ID>-<description>.md` |

Search existing records before assigning IDs or proposing overlapping work. Requirements express behavior and numbered acceptance criteria; tasks reference specific requirement versions/criteria. Findings capture evidence and gaps, not implementation authorization. Decisions retain history and link successors.

## Approval gate
Assessment, proposals, and documentation of current facts may proceed without implementation approval. Every proposed task requires explicit user/owner approval of its concrete scope before implementation. Approval of a requirement or ADR alone does not approve a task. Record approver, date, exact approved scope, and durable decision evidence in the task; quote a conversation approval faithfully if no link is available. Never fabricate approval or infer it from a filename, status, silence, or session memory.

Move an approved task record from Proposed to Approved, preserving its ID and approval history. The lifecycle permits this record relocation; it does not authorize deleting its contents. Keep only one canonical task record and update links. Material scope expansion returns the changed scope to proposal for approval; unaffected already-approved work can continue. Complete only after acceptance evidence, required verification, review, justification, and memory updates are recorded. Completion is separate from acceptance by an owner or merge to the base branch.

## Explicit deletion gate
Never delete code, tests, files, schema, APIs, configuration, documentation, migrations, or supported behavior without explicit deletion approval. This includes removals hidden inside replacement, refactoring, migration, test UPDATE/SPLIT, or cleanup. Failing tests are never sufficient justification or approval. Disabling/skipping tests or bypassing behavior must not evade this gate.

Before removal, record exact targets and behavior affected, requirement rationale, callers/dependents, compatibility and data effects, replacement coverage, and recovery plan. Obtain and record explicit approval naming that removal scope. General task approval counts only if it explicitly approves those deletions. Retain the evidence in both task and justification. Do not execute unapproved removals; proceed with unaffected authorized work. Do not remove applied migrations to repair history.

## Repository policy
Use PROJECT.md for base branch and remote policy. Local task branches and commits of approved work are permitted by the starter baseline. Pushing, merging, publishing, destructive Git operations, and branch deletion need explicit authorization unless already covered by project policy/user decisions. Preserve unrelated working-tree changes and stage only intended files. Never put patient data, secrets, or credentials in documentation or fixtures; use synthetic examples.
