# FIND-010 — SaaS production controls and business policies remain unverified
Status: Open — production; nonblocking for synthetic local v0.3.
Date: 2026-09-12. Requirements REQ-FOUND-010, REQ-FEAT-013–015.

The local SaaS uses seeded accounts, explicit practice memberships, application tenant filtering and composite foreign keys. It does not certify production isolation against database-owner access. RLS is assessed in ADR-006 and deferred until a non-owner application role, FORCE RLS/pooling policy and privileged support process are designed and verified. Clinical transactions serialize per practice for correctness; production load/capacity limits need separate evidence.

Before real onboarding decide and verify account enrollment/invitations/recovery, production MFA/session management, platform support access, subscription pricing/tax/refunds/provider eligibility, tenant suspension/export handling and recovery/backup obligations. TASK-024 proposes real payment integration; no charges or provider connection is authorized.

Philippine legal/privacy/retention/signature/prescribing/template obligations remain the original Open findings. Template placeholders and generic statements are development defaults, not verified clinical/legal requirements. Physical print hardware and native clients are unverified. No automatic data deletion is implemented.

New practice and export operations currently have no cross-request idempotency key; UI disables duplicate in-flight submissions, while settings mutations use expected versions and database locks. Production onboarding needs durable request identity/payment reconciliation before public signup. This does not permit duplicate financial charges: all billing here is simulated.

## Development follow-up — 2026-09-12, TASK-025
REQ-FOUND-011/ADR-007 now implement local synthetic registration, email verification, scoped invitations, password recovery and authenticator MFA. The earlier seeded-only description is historical. This finding remains **Open for production**: captured local messages are not verified mail delivery, self-entered doctor details do not verify identity/licensing, filesystem key backup is not managed key custody, and fixed-window local abuse controls are not a public-signup defense. Operator recovery without MFA/recovery codes, mail retries/outbox operations and production security/support need separate design and approval. No production policy has been resolved by development tests.
