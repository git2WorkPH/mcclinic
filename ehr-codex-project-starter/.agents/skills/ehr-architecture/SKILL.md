---
name: ehr-architecture
description: Design, implement, and review EHR application boundaries, clinical integrity, and the agreed TypeScript stack.
---

# EHR architecture

This skill owns the technical baseline. Use project-governance for task/deletion approval. Changes to this baseline require an accepted ADR and appropriately approved implementation task; do not silently change platforms or runtime majors.

## Stack
- TypeScript application code; Node.js 24 LTS baseline, pinned consistently in development, CI, and Docker. Resolve compatible patch/dependency versions during project bootstrap and commit the lockfile.
- React Native; React Native Web where appropriate. Validate clinician note entry, dense forms, patient history, keyboard use, prescriptions, certificates, and printing before committing to the web UI approach. If unsuitable, propose a dedicated React web app through an ADR.
- Express hosts GraphQL Yoga. Thin resolvers invoke application use cases. GraphQL Code Generator produces typed server/client contracts; generated types do not replace runtime checks.
- Zod validates untrusted inputs at boundaries; domain rules remain in domain/application code.
- PostgreSQL and Prisma, with Prisma confined to persistence adapters. Review migrations for data safety and compatibility; do not expose Prisma models as domain or public contracts.
- pnpm workspaces and lockfile; Oxlint plus a separate TypeScript type check; Docker/Compose for reproducible services; Vitest, Testcontainers, and Playwright where appropriate.

## Modular monolith and dependency direction
Start with one backend deployment and explicit feature modules such as patient, consultation, prescription, medical-certificate, appointment, identity, and audit. Each owns its domain, application use cases/ports, adapters, and infrastructure. Dependencies point inward: adapters/infrastructure depend on application/domain; domain imports no Express, GraphQL, Prisma, React Native, or database concerns. Composition roots wire implementations into ports.

Use `apps/clinical-app` and `apps/api` as an initial layout to evaluate at bootstrap. Keep focused shared packages for actual cross-consumer contracts, validation primitives, UI foundations, or test support. Keep feature domain/application logic in its owning module; avoid a catch-all shared package or premature global domain/application packages. Modules communicate through explicit application interfaces/events, not cross-module table manipulation. Do not adopt microservices without a demonstrated need and accepted ADR.

## Identity, audit, and clinical integrity
Enforce authentication and resource/action authorization in server application boundaries, including patient/organization scope where applicable. UI hiding is not authorization. Use an explicit actor/context through use cases, least-privilege policies, and negative authorization tests.

Define auditable clinical actions in requirements: actor, subject, action, time, outcome, and correlation/version references. Protect audit records from ordinary editing/deletion and avoid unnecessary sensitive payloads in logs. Design atomic persistence of clinical changes and required audit evidence; use a transactional outbox where delivery crosses boundaries.

Specify draft/finalized clinical states. Finalized records retain provenance and history; corrections use linked amendments with author, time, reason, and version relationships instead of silent overwrites. Use database constraints, transactions, concurrency control, and idempotency where needed to prevent lost updates or duplicate actions. Define time-zone, identifier, and retention behavior in requirements; do not invent jurisdiction-specific clinical or legal rules. Use synthetic data in tests. No starter document certifies regulatory compliance.

## Printing and integrations
Put prescription/certificate document generation and printing behind application ports with platform adapters. Keep clinical content decisions separate from layout and printer/browser behavior. Test content, pagination/layout where material, patient identity, and version provenance across supported platforms. Do not embed printer dependencies into domain code.

Prepare future lab integration through ports/adapters and explicit internal contracts. Keep vendor/protocol details outside the domain. Plan identity mapping, authentication, idempotency, acknowledgements, retries, audit and error reconciliation when integration is approved; do not implement speculative vendor integration now.

## Verification focus
Use Vitest for domain/use-case rules, Testcontainers with PostgreSQL for persistence constraints, migrations and transactions, and Playwright for supported web clinician workflows. Add suitable native-platform checks when native behavior is affected; Playwright is not proof of native correctness. Include authorization denials, amendments, concurrency and audit atomicity when those requirements change. Apply development's test classification and governance's deletion gate.
