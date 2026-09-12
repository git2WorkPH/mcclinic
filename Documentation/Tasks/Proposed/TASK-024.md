# TASK-024 — Assess and integrate a real subscription payment provider
Status: Proposed — not approved for implementation.
## Objective and scope
Select a provider suitable for the intended Philippine SaaS business and approved settlement/tax/refund requirements, then propose a bounded sandbox integration against the existing subscription adapter.
## Out of scope
Live charges, storing card details, automatic record deletion, deployment and changes to clinical permissions.
## Acceptance criteria
Document provider/merchant eligibility, fees and settlement with current primary sources; agree pricing, taxes/refunds, cancellation and grace policy. Verify signed webhooks, idempotency, replay/out-of-order events, reconciliation and tenant mapping in sandbox. Preserve access/export policy and clinical/audit history.
## Expected code/test areas
Subscription provider adapter, webhook boundary, entitlement reconciliation, Testcontainers and sandbox contract tests.
## Dependencies / decisions
TASK-023 development simulator; provider/business and privacy decisions. New ADR required. No credentials or money movement until explicitly authorized.
## Requirements / rationale
REQ-FEAT-015; future approved implementation requires Doc/Changes/Justification/TASK-024-payment-provider.md.

2026-09-12 owner ordering: TASK-025 account onboarding must complete first. TASK-024 remains Proposed; no live billing approval inferred.
