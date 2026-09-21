# TASK-043 — Change justification

The owner reported that a non-admin signup sees settings and specified that only administrators should invite or add members. The current AccountSecurityPanel always labels its button “Account security and invitations”, even when the invitation form is hidden. Practice settings are already gated by administrator role or an explicit management grant. Server practice member writes and invitations use the same management capability; ordinary reception/clinician memberships are denied.

Change the nonmanager button label to “Account security” so personal MFA remains accessible without suggesting membership authority. Preserve the manager label and current solo creator management grant, an administrator capability expressly defined in MVP assumptions. Add browser assertions for nonmanager visibility and a direct API denial for member changes. KEEP all existing tests and gates; ADD only focused regression assertions. No record, schema, API or supported-behavior removal. Verify lint, typecheck, focused database/browser tests and build as appropriate.

The two existing test files were previously condensed into single-line tests. Pinned Prettier expanded their formatting to satisfy changed-file CI; the existing assertions remain intact. The review must assess semantic additions separately from this formatting.
