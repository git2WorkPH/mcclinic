# TASK-029 — Harden production identity delivery and key custody

Status: Approved for local preparation, 2026-09-13. Implementation limited to the approved local sequence below.
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

## Sequence authorization — 2026-09-14

Owner: “ok i agree with the recommended sequence. Use the project-development skill and Continuity Kit workflow to implement it in sequence”. Approved sequence: TASK-035 → TASK-029/028 → TASK-030 → TASK-031. Owner further chose “Prepare locally; no AWS spending yet”. Local code, IaC and synthetic verification are authorized; deployed verification and production go/no-go cannot be claimed from local evidence. No real data, external activation, cloud apply or deletion authorized. Historical proposal retained; this record governs the approved local preparation scope.

## Local preparation checkpoint — 2026-09-20

Encrypted transactional outbox, allowlisted idempotent sink/retry, retained key versions, gated KMS unwrap adapter, cookie mode and threat/recovery policy implemented and locally verified. See `Documentation/Acceptance/TASK-029-acceptance.md`. Task remains Approved for the full scope: actual AWS/KMS IAM/restore, transactional provider/domain/bounce activation and operational custody evidence remain unverified. This does not prevent authorized local TASK-028 preparation. The sequence reuses task/TASK-035-release-readiness with separate justifications/evidence and commits; no merge/push authorized.
