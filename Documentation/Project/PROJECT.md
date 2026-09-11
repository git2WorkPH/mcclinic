# Project Profile

Status: REQUIREMENTS

## Project name

Clinic EHR Platform

> Working name. Replace with the final product name when decided.

## Project type

SAAS / EHR / CLINIC MANAGEMENT APPLICATION

## Product stage

REQUIREMENTS

## Product objective

Build a secure Electronic Health Record application for outpatient clinics that allows healthcare providers and clinic staff to manage patients, consultations, clinical documents, appointments, and patient check-in from a unified system.

The platform must be designed so future clinical capabilities such as laboratory requests and integrations can be added without significant restructuring of the core system.

## Technology stack

- Language: TypeScript
- Frontend: React Native
- API: GraphQL
- Backend: Express
- Database: PostgreSQL
- ORM: Prisma
- Package manager: pnpm
- Linting / Static analysis: Oxlint
- Containerization: Docker
- Architecture: Clean Architecture
- Repository strategy: Monorepo
- Shared code: Common/shared TypeScript packages consumed by frontend and backend

## Target platforms

Initial targets:

- [x] Web / desktop-class browser through React Native Web, subject to implementation validation
- [x] Tablet
- [x] Mobile
- [ ] Native desktop application
- [ ] Patient-facing application

The initial experience should prioritize healthcare professionals and clinic staff.

## Primary users

### Doctor / Healthcare Provider

Responsible for:

- reviewing patient history;
- recording consultations;
- creating clinical notes;
- issuing prescriptions;
- issuing medical certificates;
- reviewing previous clinical encounters.

### Reception / Clinic Staff

Responsible for:

- registering patients;
- searching patients;
- managing appointments;
- booking patients;
- checking patients in;
- maintaining non-clinical patient information.

### Administrator

Responsible for:

- managing clinic configuration;
- managing users;
- managing permissions and roles;
- reviewing appropriate operational records.

## Current phase

REQUIREMENTS

## Current active task

NONE

## Core product modules

### Patient Management

Responsibilities:

- patient registration;
- patient demographic information;
- patient search;
- patient profile;
- patient history.

### Clinical Records

Responsibilities:

- consultation encounters;
- consultation notes;
- clinical history;
- diagnosis/problem information where applicable;
- clinical observations where applicable;
- historical encounter browsing.

### Prescription

Responsibilities:

- create prescription;
- associate prescription with patient and consultation;
- specify medication instructions;
- generate printable prescription;
- retain issued prescription history.

### Medical Certificate

Responsibilities:

- create medical certificate;
- associate certificate with patient and consultation;
- specify relevant certificate information;
- generate printable certificate;
- retain issued certificate history.

### Appointment Management

Responsibilities:

- create appointment;
- reschedule appointment;
- cancel appointment;
- browse appointments;
- associate appointment with patient and provider.

### Patient Check-in

Responsibilities:

- identify arriving patient;
- check patient into scheduled appointment;
- support appropriate walk-in workflow in future if required;
- expose patient waiting/arrival state to clinic staff.

### Laboratory

Status: FUTURE

Responsibilities may include:

- create laboratory request;
- associate laboratory request with consultation;
- print laboratory request;
- transmit request electronically;
- receive laboratory results;
- associate results with patient record.

Initial architecture must allow this module to be introduced later without coupling existing clinical workflows directly to a particular laboratory provider.

## Shared/common library

The repository must contain shared packages that can be consumed by both frontend and backend where appropriate.

Shared packages may contain:

- domain types;
- identifiers/value objects;
- validation schemas;
- GraphQL-related types where appropriate;
- utility functions;
- date/time abstractions;
- formatting utilities;
- shared constants;
- error definitions;
- authorization primitives;
- domain-independent helpers.

Shared libraries must not become a miscellaneous dumping ground.

Code belongs in a shared package only when there is a genuine requirement for reuse across application boundaries.

Frontend-specific UI logic must remain in frontend packages.

Backend-specific persistence, infrastructure, Express, Prisma, and database logic must remain in backend packages.

## Architectural principles

The application follows Clean Architecture.

Dependencies must flow inward toward business/domain rules.

Conceptual layers:

1. Domain
2. Application / Use Cases
3. Interface Adapters
4. Infrastructure / Frameworks

Business logic must not depend directly on:

- React Native;
- Express;
- GraphQL server implementation;
- Prisma;
- PostgreSQL;
- Docker.

Infrastructure components implement interfaces defined by inner layers.

## Suggested repository structure

```text
/
├── apps/
│   ├── clinical-app/
│   └── api/
│
├── packages/
│   ├── domain/
│   ├── application/
│   ├── shared/
│   ├── validation/
│   ├── graphql-contract/
│   └── test-support/
│
├── infrastructure/
│   └── docker/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── Documentation/
│   ├── Project/
│   ├── Requirements/
│   ├── Assessment/
│   ├── Architecture/
│   ├── Tasks/
│   ├── Acceptance/
│   └── Session/
│
├── Doc/
│   └── Changes/
│       └── Justification/
│
├── pnpm-workspace.yaml
└── package.json
```

The exact structure may change through an approved Architecture Decision Record.

## API principles

GraphQL is the primary application API.

The GraphQL layer must act as an interface adapter rather than contain core business rules.

Resolvers should:

1. authenticate/authorize the request;
2. validate/normalize external inputs where appropriate;
3. invoke application use cases;
4. map use-case responses into GraphQL responses.

Resolvers must not directly contain significant clinical business logic.

## Persistence principles

PostgreSQL is the system-of-record database.

Prisma is the primary database access technology.

Prisma models and generated types must not automatically become domain entities.

Persistence models should be mapped to/from domain entities where necessary to preserve architectural boundaries.

## Clinical record principles

Clinical information must preserve historical integrity.

Where clinically or legally significant records have already been finalized or issued, changes should preferably be represented through amendments, superseding records, status changes, or auditable revisions rather than destructive replacement.

The exact immutable/auditable record policy must be established before production deployment.

## Printing/document generation

Prescriptions and medical certificates must have stable printable representations.

Generated documents should include:

- patient identification;
- provider identification;
- clinic identification;
- document date/time;
- relevant clinical/document information;
- appropriate identifiers/reference numbers.

Printed document templates must be separated from core clinical business logic.

PDF generation or platform-specific printing technology will be selected through an architecture decision.

## Authentication and authorization

Authentication and authorization are mandatory foundation capabilities.

The application must support role-based or permission-based access controls.

Initial roles:

- Doctor / Healthcare Provider
- Reception / Clinic Staff
- Administrator

Permissions must be defined at the capability level rather than relying solely on hiding frontend controls.

Backend authorization must always be authoritative.

## Auditability

Security-sensitive and clinically meaningful actions should be auditable.

Examples include:

- patient creation;
- patient demographic changes;
- consultation creation/finalization;
- clinical-note amendments;
- prescription issuance;
- medical-certificate issuance;
- appointment status changes;
- check-in;
- user/permission changes.

The detailed audit-event model must be defined during architecture design.

## Data protection

Patient and clinical information is sensitive health information.

The system must be designed around:

- least-privilege access;
- secure authentication;
- backend-enforced authorization;
- encryption in transit;
- appropriate encryption/storage protections;
- auditability;
- controlled backups;
- secure secrets management;
- session security;
- minimal exposure of patient data;
- controlled logging.

Jurisdiction-specific privacy, healthcare-record, prescription, medical-certificate, and retention requirements must be identified before production release.

## Git workflow

### Repository

- Default/base branch: `main`
- Integration branch: NONE initially
- Remote: `origin`
- Task branch required: YES

### Branch naming

Where an external work-item identifier exists, use it.

Examples:

```text
task/EHR-101-patient-registration
task/EHR-142-consultation-history
fix/EHR-205-prescription-printing
docs/EHR-220-clinical-record-policy
```

If no Jira/external identifier exists:

```text
task/TASK-014-patient-history
```

### Existing branch rule

Before creating a new branch:

1. inspect local branches;
2. inspect relevant remote branches;
3. identify branches matching the Jira/task identifier;
4. reuse the approved existing branch where appropriate.

Do not create duplicate branches for the same task without justification.

### Commit convention

```text
type(scope): description [TASK-ID]
```

Examples:

```text
feat(patient): add patient registration [EHR-101]
feat(consultation): add encounter notes [EHR-121]
test(prescription): cover issued prescription rules [EHR-150]
docs(architecture): record audit strategy [EHR-180]
```

### Remote and merge policy

- Push task branches automatically: NO
- Pull request required: YES
- Verification required before merge: YES
- Merge strategy: SQUASH
- Protected branches: `main`
- Branch deletion after merge: MANUAL

Development may create local task branches and commits for approved work.

Push, pull-request creation, merge, destructive Git operations, and branch deletion require authorization according to project policy.

## Change justification

All implemented changes must be traceable through:

```text
Doc/Changes/Justification/
```

A justification record must identify:

- requirement/task/Jira ticket;
- affected files or components;
- requested behavior;
- existing behavior;
- proposed change;
- reason for change;
- test impact;
- implementation status;
- verification evidence;
- commit hash when available.

Deletion or removal of code, tests, files, API behavior, schema fields, configuration, supported behavior, or documentation requires explicit authorization.

A failing test is not sufficient justification for deleting a test.

## Testing principles

Every requirement must identify expected verification.

Tests may be classified as:

- KEEP
- ADD
- UPDATE
- SPLIT
- REMOVE

Removal requires explicit justification and approval.

The test strategy should include, as appropriate:

- domain unit tests;
- application/use-case tests;
- authorization tests;
- GraphQL/API integration tests;
- persistence integration tests;
- critical workflow tests;
- print/document generation verification.

## Project constraints

- TypeScript is the primary application language.
- Use pnpm for dependency/workspace management.
- Follow Clean Architecture.
- Use PostgreSQL for relational persistence.
- Use Prisma for database interaction.
- Use GraphQL as the primary application API.
- Use Express as the backend HTTP host.
- Use React Native for the frontend.
- Use Docker for reproducible infrastructure/development environments.
- Use Oxlint for lint/static-analysis workflow.
- Prefer reusable shared modules where genuine cross-boundary reuse exists.
- Avoid framework dependencies inside core domain logic.
- Do not silently implement functionality outside approved requirements.
- Do not destructively remove existing functionality without approval.

## Owner decisions

Confirmed:

- React Native frontend.
- TypeScript throughout applicable application code.
- GraphQL API.
- Express backend.
- PostgreSQL database.
- Prisma ORM.
- pnpm workspace/package management.
- Oxlint.
- Docker.
- Clean Architecture.
- Shared/common library for appropriate frontend/backend code.
- Patient records and consultation notes.
- Patient history.
- Prescriptions with printing.
- Medical certificates with printing.
- Appointment booking.
- Patient check-in.
- Laboratory-request integration is a planned future capability.

## Initialization baseline — 2026-09-10 (authoritative clarification)
Earlier starter examples are retained for provenance; these specific settings supersede conflicting examples without deleting them.
- Phase: requirements and architecture assessment. No active approved task; no application exists.
- Working name: Clinic EHR Platform. SaaS is a possible delivery model, not approval for multi-tenancy.
- Confirmed stack: TypeScript; React Native; React Native Web where appropriate; Node.js; Express hosting GraphQL Yoga; GraphQL Code Generator; PostgreSQL; Prisma; Zod; pnpm workspaces; Oxlint with separate TypeScript checks; Docker/Compose; Vitest; Testcontainers; Playwright where appropriate.
- Installed architecture skill proposes Node.js 24 LTS. Resolve compatible patch and dependency versions during approved bootstrap; no packages or versions have been installed or verified here.
- Clean Architecture modular monolith: feature-owned domain/application logic; framework and persistence adapters point inward. Global `packages/domain`, `packages/application` and catch-all `shared` in the earlier illustrative tree are not the selected design. See proposed ADR-001.
- Exact target platform/browser/OS matrix remains undecided (FIND-003); prior checkboxes express candidates, not validated support.
- Current/local integration base: `master`, observed at `6f00bacd5c95312c851e2a1e5e0ed288319567d9`; no rename to `main` is planned. Remote default/protection settings are unverified. Only one local branch/worktree and cached `origin/master` exist.
- Remote: `origin`, `git@github.com:git2WorkPH/mcclinic.git`. Live head inspection failed on DNS resolution; FIND-009 must be resolved before creating a potentially duplicate implementation task branch.
- Local task naming: `task/TASK-###-description`; use local IDs exclusively. Do not use Jira. Examples using external IDs are inactive starter examples.
- No push, PR creation, merge, deletion, or task approval is authorized by this initialization. Local documentation commit is part of the installed continuity workflow.
- Canonical rationale location: `Doc/Changes/Justification/`. Root AGENTS overrides inherited skill paths.
- Proposed details require explicit approval. Approval must record approver/date/exact scope/evidence; requirement or ADR acceptance alone does not approve implementation.
- No real patient data, secrets, regulatory compliance claim, retention duration, prescribing entitlement, or certificate wording is established by this baseline.

## Current phase — 2026-09-11
DEVELOPMENT MVP COMPLETE: 19 approved task scopes completed for local synthetic desktop web (laboratory scope remains design-only). Earlier REQUIREMENTS metadata is the initial baseline. [MVP assumptions](MVP_ASSUMPTIONS.md), [runbook](MVP_RUNBOOK.md), and [verification](../Acceptance/MVP-VERIFICATION.md) define current scope. Production readiness, regulatory verification and native support are not claimed.
