# Frontend component map

Status: development MVP baseline after TASK-045.

The React Native Web MVP uses feature-owned presentation folders under `apps/clinical-app/src/mvp/`. Components receive typed data/functions through props and continue to call the existing typed GraphQL `Api` boundary. Server use cases remain authoritative for authorization, tenant isolation, validation, concurrency, audit, and clinical integrity.

## Composition and shared UI

- `MvpApp.tsx`: session/practice context composition, authenticated/unauthenticated routing, and feature entry points.
- `types.ts`: viewer and shell-section presentation types.
- `ui.tsx`: shared visual primitives, styles, action feedback, load helper, and date conversion.
- `shell/`: header, role-aware navigation, role overview, audit view, and workspace routing.

## Feature ownership

- `auth/`: login and personal account/MFA security.
- `patients/`: patient search/directory, registration, and reusable patient form.
- `PatientWorkspace.tsx`: selected-patient context and clinical feature routing.
- `consultations/`: consultation list, note editing/version history, and patient timeline.
- `documents/`: clinical document editor, immutable-version listing, print preview, and safe defaults.
- `DocumentPanel.tsx`: document list and editor/preview orchestration.
- `appointments/`: appointment row actions and local date-input conversion.
- `SchedulePanel.tsx`: schedule filters, appointment list, and booking orchestration.
- `practices/`: practice administration, invitations, branding/template/subscription types and forms.
- `PracticeSettings.tsx`: active-practice identity, switching, export/create actions, and permission-gated administration entry.
- `OnboardingPanel.tsx`: public account registration, verification, recovery, and invitation-acceptance workflow backed by the existing onboarding feature hook.

## Rules for future changes

1. Add a component to the feature that owns the user workflow; keep `MvpApp` and the root panels focused on composition.
2. Keep server state and mutations behind the typed `Api`/GraphQL boundary. UI visibility never replaces server authorization.
3. Put cross-feature visual primitives in `ui.tsx` only when at least two features use them.
4. Preserve accessibility labels used by browser workflows unless an approved requirement changes the user-facing label and its tests.
5. Split a component when it owns an independent workflow, state lifecycle, or reusable form. Do not create empty layers or files only to reduce line counts.
6. Keep synthetic-data and **DEMO — NOT FOR CLINICAL USE** constraints visible in development document workflows.
