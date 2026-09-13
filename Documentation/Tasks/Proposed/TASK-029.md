# TASK-029 — Harden production identity delivery and key custody
Status: Proposed, 2026-09-13. Not approved for implementation.
Requirements: REQ-FOUND-011 production findings and REQ-FOUND-012 AC-02/04. Finding: FIND-010/011.

## Objective / scope
Replace filesystem-only onboarding delivery/key assumptions behind existing ports: protected synthetic staging mail sink, proposed production transactional-mail adapter/outbox, domain authentication/bounce handling, KMS-backed MFA-key versioning/rotation/recovery, centralized persistent abuse controls, secure session/cookie policy and auditable operator recovery. Define verified doctor/practice enrollment and platform-support access without granting clinical entitlement.

## Out of scope
Sending production mail, activating a provider, real users/data, live payments, changing clinical permissions, automatic account/record deletion and unsupported legal claims.

## Acceptance criteria
- Threat model and approved recovery policy cover token leakage, replay, enumeration, compromised mailbox, lost MFA device/key and privileged support actions.
- Delivery uses a transactional outbox with idempotency/retry and metadata-only audit; staging cannot send outside allowlisted synthetic domains.
- Key backup/restore and rotation preserve enrolled-account access without exposing secrets; all session/token/tenant denial regressions pass.
- Provider, data processing, domain ownership and Philippine privacy/identity/licensing questions stay explicit gates before production activation.

## Expected areas/tests/dependencies
Onboarding/identity application ports and adapters, outbox persistence, secrets configuration and operational docs. KEEP all onboarding tests; ADD delivery failure/retry, key rotation/restore, abuse/concurrency and operator-denial tests. Depends on TASK-027; can be exercised in TASK-028 staging after separate approval. ADR required. Future justification: `Doc/Changes/Justification/TASK-029-identity-delivery.md`.
