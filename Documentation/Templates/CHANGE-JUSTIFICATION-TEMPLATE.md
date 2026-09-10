# <TASK-ID> — <description> change justification
Canonical destination: `Documentation/Changes/Justification/<TASK-ID>-<description>.md`
Task/approval: <path and evidence>
Requirement/version/criteria: <links and IDs>
Status: Planned

## Problem and evidence
<Current behavior, relevant code/tests, why approved behavior needs this change.>
## Chosen change and alternatives
<Approach, rejected alternatives, tradeoffs, ADR links.>
## Impact
<Files/modules, observable behavior, APIs/schema/config/docs/migrations, compatibility, data integrity, authorization, audit, printing/integration effects as applicable.>

## Test decisions
| Test/path or proposed scenario | KEEP / ADD / UPDATE / SPLIT / REMOVE | Requirement/criterion | Rationale and preserved/replacement coverage | Deletion approval if applicable |
|---|---|---|---|---|
| <test> | <classification> | <ID/AC> | <reason> | <none required / pending / evidence> |

## Deletion inventory and authorization
<Exact removals including assertions/behavior within replacements; impact, dependents, recovery, explicit approval evidence. Say none if none. Failing tests never authorize removal.>
## Verification and recovery
<Planned and actual commands/results, acceptance link, rollback or forward-recovery strategy and migration constraints.>
## Final reconciliation
<How all implementation edits including follow-ups are covered; remaining findings and scope decisions.>

## Installed path override
Canonical destination for this repository is `Doc/Changes/Justification/<TASK-ID>-<description>.md`. The earlier starter destination is retained only as source provenance; do not use it for new records.
