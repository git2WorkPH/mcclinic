# REQ-FEAT-019 — Role-aware desktop workspace

Status: Approved for synthetic development MVP, v0.1, 2026-09-28.
Owner approval: “implement the recommended UI” following the recommended role-aware shell, separate account/practice administration, compact practice controls, patient context and clearer feedback.

## Objective and scope

Provide a clear desktop web workspace for clinicians, reception users, practice administrators and solo-practice owners. Preserve existing workflows and server authorization. Subscription entitlements and permissions remain separate: SOLO limits clinician seats; administration requires the administrator role or an explicit practice-management grant held by the solo creator.

## Functional rules and acceptance criteria

- AC-01: Signed-in users receive a consistent application shell with practice identity, role, role-specific overview, primary navigation, personal account access and sign-out.
- AC-02: Ordinary clinician/reception memberships cannot see practice administration, invitations or membership controls. Administrators and explicit practice managers can access them. Server authorization remains authoritative.
- AC-03: Practice switching and status are compact; creation, export, branding, templates, membership and simulated subscription controls live in Practice administration.
- AC-04: Personal password/MFA controls live under My account and do not expose practice invitations.
- AC-05: Patient identity remains visually prominent across profile, consultations, documents, history and appointments. Existing clinical and scheduling workflows remain functionally equivalent.
- AC-06: Keyboard/browser accessibility, visible selected navigation, loading/error/success feedback and desktop responsive layout receive browser coverage. Existing onboarding, authorization, audit, printing and clinical regression checks remain passing.

## Authorization, data, audit and tests

UI visibility mirrors `role === ADMINISTRATOR || canManage`; it never replaces server checks. No schema, GraphQL contract, clinical record, audit rule, retention rule or subscription transition changes. KEEP all existing API/database tests. UPDATE browser selectors only where controls move without weakening outcomes; ADD role-aware navigation and denial/visibility assertions.

## Findings

This remains desktop React Native Web for the development MVP. Native navigation, offline operation, production identity/email, measured usability with Philippine clinic staff and jurisdiction-specific policy remain outside this requirement.

## Traceability

- Task: [TASK-044](../../Tasks/Completed/TASK-044.md)
- Acceptance: [TASK-044 acceptance](../../Acceptance/TASK-044-acceptance.md)
- No ADR required: this refines the existing React Native Web presentation and preserves module/API boundaries.
