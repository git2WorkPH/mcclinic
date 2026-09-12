# REQ-FOUND-011 — Account onboarding and recovery
Status: Approved v0.4 local synthetic development, 2026-09-12.
Owner authorizes account onboarding before TASK-024 and database name mcclinic.
## Objective / scope
Doctor registration, email ownership verification, optional initial practice creation, staff invitations, password recovery and authenticator MFA; preserve legacy demo accounts and SaaS permissions. Local message delivery only.
## Rules / acceptance
- AC-01: Register with normalized email/name and strong development password. Unverified new accounts cannot sign in. Verification tokens are random, hashed, expiring and single-use; verified doctor/practice creation is atomic and retry-safe.
- AC-02: Practice managers invite staff by email and bounded role. Acceptance requires verified matching account, password/MFA and current inviter authority; check seats under the practice lock. No cross-practice privilege transfer.
- AC-03: Generic verification/reset responses do not disclose account existence. Rate-limit requests; password reset consumes a token, requires existing MFA if enrolled, revokes sessions and leaves clinical data untouched.
- AC-04: TOTP enrollment requires current password, confirmation and a one-time secret display. Enabled accounts require TOTP or single-use recovery code at login; replay fails. MFA changes require reauthentication. Store encrypted secrets and hashed recovery codes; audit metadata only.
- AC-05: Actual UI/database flows and negative, expiry, replay, concurrent-consumption, audit, migration and regression tests pass.
## Data / authorization / audit
Global user email/verification and security metadata; scoped invitations; challenge token hashes and retained consumption timestamps; no automatic deletion. No membership means no clinical access. Auth events stay in internal identity audit; invitations in their practice. Outgoing links are captured only in an ignored, permission-restricted local mailbox.
## Questions
Production mail delivery, identity verification/licensing, account recovery/support, abuse controls and Philippine policies remain Open. Authenticator enrollment demonstrates possession, not prescribing entitlement.
## Task
TASK-025, ADR-007. TASK-024 remains Proposed until onboarding and later explicit provider approval.

## Development acceptance — 2026-09-12
TASK-025 completed against AC-01–05; see ../../Acceptance/TASK-025-acceptance.md. Original production questions remain Open.
