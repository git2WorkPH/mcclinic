# TASK-029 — Identity delivery and custody justification

Approved scope: owner-approved release sequence, locally only; no AWS spending/provider activation. Requirements REQ-FOUND-011 and REQ-FOUND-012 AC-02/04.

Observed gap: account tokens commit before filesystem delivery; a crash loses delivery and no durable retry exists. MFA encryption has one unversioned filesystem key. Existing database rate limits and account/MFA authorization remain valid and must be retained.

Chosen change: additive encrypted database outbox, transactional enqueue, allowlisted synthetic sink with stable message IDs, lease/retry and atomic metadata audit. Preserve legacy delivery mode and all current token contracts. Add version-aware encryption separately before claiming full custody acceptance. No production provider enabled. Scope includes operational threat model and local verification, not proof of deployed controls.

Tests: KEEP every existing onboarding/session/tenant/clinical assertion. ADD real PostgreSQL enqueue rollback, encrypted payload, retry, competing worker, sink allowlist and audit checks. ADD key rotation/restore and policy tests when implemented. No REMOVE/SKIP/weakening. Preserve original migrations and APIs. Additive schema is forward compatible; older app ignores outbox table.

Expected areas: onboarding infrastructure, Prisma additive migration, opt-in packaged runtime composition, tests and operational evidence. Task stays Approved until every locally authorized criterion is verified; deployed/provider evidence remains explicitly separate.

Cookie transport refinement: opt-in HTTPS-origin policy at GraphQL boundary, exact Origin/JSON POST guard, HttpOnly Secure SameSite cookie, persistent login rate counters and public nonsecret session marker preserve the generated login shape. Every alias resolves the marker rather than raw token; cookie mode ignores bearer headers. Legacy local bearer behavior remains. Proxy forwards Set-Cookie with no-store. ADD cookie/CSRF/alias/logout/tenant tests; no existing contract/assertion removed. KMS adapter still pending; local keyring is not production custody.

KMS preparation: pinned SDK 3.1132.0, explicit network-activation gate, exact key ARN/region and authenticated encryption context per version. Local tests inject an unwrap provider; no AWS calls. Unwrapped keys stay in memory; retained encrypted envelope supports recovery/rotation. Failed unwrap is fail-closed. ADD mock-provider context/backup/denial tests; actual KMS/IAM drill remains unverified until AWS authorization.

Review follow-up: route persistent login limits through IdentityPorts and the identity use case; keep the resolver thin and fail closed if the protected mode lacks a limiter. Existing local default is unchanged. Review also verifies no secrets in browser aliases and no raw provider errors in audit. Generated .pnpm-store cache is ignored and retained. Source formatting changes in compact identity/onboarding files preserve behavior. Local TLS browser and enrolled PostgreSQL MFA-rotation tests are included in acceptance.
