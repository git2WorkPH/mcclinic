# TASK-043 — Restrict practice administration controls

Status: Completed for synthetic development, 2026-09-21.
Approval: Owner: “if i signed up as non admin i should not see the setting. only admin can invite and add member”.
Requirements: REQ-FOUND-010, REQ-FOUND-011. Existing explicit practice-management grant for a solo clinician creator remains an administrator capability under MVP_ASSUMPTIONS; ordinary clinician/reception memberships lack it.

Objective: Make practice management and invitation controls visible only to members with administrator/management permission. Keep personal account security available to every signed-in user. Verify server denial for ordinary nonmanager invite and member-update requests.

Scope: UI labeling/visibility and focused regression evidence. Out of scope: changing practice creation, role schema, clinical permissions or revoking the existing creator management grant.

Acceptance: A reception invitee sees Account security and no Practice settings/invitation controls; direct invite and member mutations are forbidden for that membership; manager flow still works. KEEP all existing tests and behavior; ADD focused assertions. No deletions.

Evidence: [TASK-043 acceptance](../../Acceptance/TASK-043-acceptance.md). UI, isolated database, browser, lint, typecheck and build checks passed. Existing practice creator management grant remains; broader production policy remains open.
