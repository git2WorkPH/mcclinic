# Architecture baseline
Date: 2026-09-10. Phase: requirements. No runtime implementation exists.

## Confirmed constraints
TypeScript; React Native; React Native Web where appropriate; Node.js; Express hosts GraphQL Yoga; GraphQL Code Generator; Zod at untrusted boundaries; PostgreSQL via Prisma adapters; pnpm workspaces; Oxlint plus separate TypeScript checks; Docker/Compose; Vitest, Testcontainers and Playwright where appropriate. Clean Architecture and a modular monolith are owner constraints. Compatible versions are an approved-bootstrap activity; the local architecture skill names Node.js 24 LTS.

Dependencies point inward from UI/GraphQL/persistence adapters to use cases/domain. Authorization is enforced at server application boundaries. Feature modules own rules and data access; a composition root connects ports. Generated GraphQL and Prisma types do not define domain models. Shared code needs identified consumers and purpose.

## Proposed decisions
- [ADR-001](Decisions/ADR-001.md): feature-owned module/workspace layout; recommended for first acceptance.
- [ADR-002](Decisions/ADR-002.md): transaction/audit/version/concurrency foundation.
- [ADR-003](Decisions/ADR-003.md): identity and capability boundaries; provider/policy unresolved.
- [ADR-004](Decisions/ADR-004.md): issued snapshot/render/print ports; renderer/platform choice unresolved.
- [ADR-005](Decisions/ADR-005.md): document future lab seam only.
All ADRs are Proposed. Neither this document nor an accepted ADR approves task implementation.

## Data and clinical boundaries
Patient owns demographics/search; consultation owns encounters/notes; prescription and certificate own their issuance versions/content; appointment owns booking/status/check-in. History composes authorized source queries and does not become an alternate write owner. Identity provides actor context; audit protects durable evidence. Versioned amendments preserve finalized provenance; exact transitions and legal rules require findings resolution. No speculative lab schema or vendor integration.

## Verification baseline
Vitest checks observable business rules and denials; Testcontainers verifies PostgreSQL constraints/transactions/migrations/concurrency; Playwright verifies supported web workflows. Native printing/behavior requires separate checks. Validate clinical content and pagination against approved templates using synthetic data. No automated or legal checks have run because no application exists.
