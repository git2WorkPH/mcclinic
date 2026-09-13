---
name: project-review
description: Review EHR task diffs against approved requirements, deletion authorization, architecture, and acceptance evidence.
---

# Project review

Use project-governance as the authority for gates and ehr-architecture for relevant technical constraints. Review the task's actual diff against its recorded base, including uncommitted changes where applicable; inspect the whole task change, not only the latest commit.

Trace every acceptance criterion to implementation and verification. Check scope against recorded approval, including follow-up edits. Confirm all implementation changes are explained in the task justification. Inspect removed lines, renamed/replaced files, schema/migrations, API changes, test skips and changed assertions for deletion approval and lost behavior. Examine KEEP/ADD/UPDATE/SPLIT/REMOVE decisions against requirements.

Check boundary direction, runtime validation, authorization enforcement, audit events, clinical amendment/version rules, transaction and concurrency handling when affected. Confirm generated contracts match schema and clients. Review clinical printing and external adapters when changed. Do not infer clinical correctness or regulatory compliance from a green suite.

Record findings with severity, file/symbol, concrete trigger, consequence, and requirement link. Distinguish blockers, nonblocking findings, and unverified checks. Re-run focused checks when evidence is insufficient or the diff changed after verification. Review documentation-only work proportionally.

Write/update `Documentation/Acceptance/<TASK-ID>-acceptance.md` with reviewed commit/diff scope, criterion outcomes, commands/results, open findings, and decision. Recommend completion only when criteria and required checks pass and no blocking findings or missing approvals remain. Do not fix newly discovered out-of-scope issues during review; propose tasks. Review is not permission to merge, publish, delete, or expand scope.
