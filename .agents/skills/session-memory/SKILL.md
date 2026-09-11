---
name: session-memory
description: Resume and hand off EHR work using concise committed repository-local session memory validated against Git.
---

# Session memory

Canonical file: `Documentation/Session/SESSION_MEMORY.md`. Read it first each session. Keep it in this repository, tracked and committed; do not use an external memory file or ignore it. It is a short index, ideally 30–80 lines, not a transcript or duplicate changelog.

## Start/resume
Inspect Git branch, full HEAD, status including untracked files, and recent relevant commits. Compare them with the memory snapshot. Read linked active requirement/task, approval evidence, justification, and relevant findings/ADRs. Validate task status and scope; memory is never approval. Git is authoritative for repository state; approved records govern intended behavior.

If memory is stale, reconcile using the diff/log and relevant records, then correct it before resuming. Preserve unexplained changes. Broaden discovery only enough to repair missing/inconsistent context. If Git is uninitialized or has no commits, record that explicitly rather than inventing branch/commit values.

## Update/handoff
After meaningful work and before a handoff or commit, update timestamp, active requirement/task, branch, observed full HEAD, working-tree snapshot, completed changes, verification, relevant files, unresolved findings, and one exact next action. Include blockers and pending approvals. Keep historical details in task/acceptance/justification records and link them. Use synthetic data only.

Record the commit as **observed HEAD before this memory update**, and the working tree as **observed status before this memory update**. This avoids an impossible self-referential commit hash and false claims of a clean final tree. Commit the memory with the work it describes; do not repeatedly amend just to chase its own commit hash. At next start validate the snapshot and intervening commit diff. If a commit cannot be made, report that memory remains uncommitted and why; do not describe the handoff as committed.
