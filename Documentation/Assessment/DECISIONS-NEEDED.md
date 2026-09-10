# Decisions needed to continue approved implementation
All TASK-001–019 scopes were approved by the owner on 2026-09-10. No further blanket task approval is needed. The questions below are missing requirements, not repeated permission requests. Do not infer answers from task approval or workstation location.

| Decision | Minimum answer needed | Affected work |
|---|---|---|
| Operating context | Jurisdiction(s), clinical/legal policy owner and approved source documents | Prescriptions, certificates, privacy, production |
| Identity/access | Identity provider; enrollment/recovery/session/revocation policy; action/resource grants for reception, clinicians and administrators; clinic scoping | TASK-003 and all protected features |
| Data protection | Residency, storage/secrets controls, backup/restore objectives and access; retention decisions (no purge authorization implied) | Completion of TASK-002/004 |
| Clinical integrity/audit | Draft/finalized/issued/amended state/author rules; event catalogue including reads, denials and prints | TASK-004/007/008/010/011 |
| Patient workflows | Required fields/identifiers; duplicate/search rules; note format and save behavior; history time/filter rules | TASK-005–009 |
| Prescriptions/certificates | Approved field/date/wording/issuer/signature/correction rules and templates | TASK-010–014 |
| Scheduling | Duration, provider/timezone and conflict rules; cancellation reasons; check-in eligibility/reversal | TASK-017–019 |
| Supported platforms | Initial browser/OS/native matrix, print/export expectations and approved layout examples | TASK-012–014/016; native packaging |

Technical recommendations already selected within approved scope: feature-owned modular monolith/workspace (ADR-001) and document-only future lab seam (ADR-005). Unresolved substantive choices in ADR-002/003/004 are not fabricated approvals.

Until these answers arrive, preserve approved task status and do not implement guessed clinical/legal behavior, fake patient workflows, permissive authentication, or placeholder prescribing/certificate issuance.
