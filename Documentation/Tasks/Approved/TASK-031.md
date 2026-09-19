# TASK-031 — Production readiness and go-live decision

Status: Approved for local preparation, 2026-09-13. No launch authorized.
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

## Sequence authorization — 2026-09-14

Owner: “ok i agree with the recommended sequence. Use the project-development skill and Continuity Kit workflow to implement it in sequence”. Approved sequence: TASK-035 → TASK-029/028 → TASK-030 → TASK-031. Owner further chose “Prepare locally; no AWS spending yet”. Local code, IaC and synthetic verification are authorized; deployed verification and production go/no-go cannot be claimed from local evidence. No real data, external activation, cloud apply or deletion authorized. Historical proposal retained; this record governs the approved local preparation scope.

## Initial decision package — 2026-09-20

`Documentation/Project/FIRST_RELEASE_READINESS.md` recommends NO-GO for public/real-patient release with explicit missing owners/evidence and a re-entry sequence. See `Documentation/Acceptance/TASK-031-acceptance.md`. Full task remains Approved / In progress; no production findings or risks are accepted. No launch authorized.
