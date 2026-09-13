# TASK-031 — Production readiness and go-live decision
Status: Proposed, 2026-09-13. Not approved for implementation or launch.
Requirements: REQ-FOUND-012 AC-01–04 plus all production overlays. Findings: FIND-001–011 as applicable.

## Objective / scope
Create the formal evidence-based production gate after staging verification and payment sandbox work. Resolve or explicitly defer with accountable owners: Philippine clinical/privacy/legal/cross-border/retention/signature/prescribing rules; doctor/practice verification; security/penetration and RLS decision; contracts/notices; incident/on-call/support; capacity/SLA/RPO/RTO; backup/key recovery; customer export/offboarding; live mail and billing activation. Produce a go/no-go recommendation and rollback/launch checklist.

## Out of scope
Assuming compliance from tests, silently accepting risk, public launch, real patient import, live charges/messages, automatic deletion or infrastructure mutation without separate action-time authorization.

## Acceptance criteria
- Every production finding has evidence, named accountable decision owner and Resolved/Deferred state with explicit risk acceptance; no development default is mislabeled law or clinical validity.
- Independent security/tenant and restore reviews have no unresolved launch blocker; performance/capacity and operational objectives have deployed evidence.
- Billing/mail/domain/customer agreements and support/incident processes are approved; real-data migration and rollback are rehearsal-tested with synthetic fixtures.
- Owner receives one concrete go/no-go package. A “go” decision still requires explicit authorization for provisioning changes, deployment, notifications and live financial actions.

## Expected areas/tests/dependencies
Documentation/evidence and possibly separately approved remediation tasks. KEEP all tests; no deletion. Depends on TASK-027–030 and completed TASK-024 sandbox integration if subscriptions launch. ADRs and `Doc/Changes/Justification/TASK-031-production-readiness.md` required for any implementation changes.
