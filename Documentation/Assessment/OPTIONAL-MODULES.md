# Optional practice modules — requirements assessment

Date: 2026-09-14. Read-only code assessment against 649fab8; clean Git state before documentation edits. Owner asks how feasible optional subscribed features are and requests requirements only. No runtime changes, migrations, live integration, task approval, deployment or additional billing authorized.

## Feasibility based on current implementation

| Capability                          | What exists                                                                                | What is missing                                                                                                                                                          | Relative effort / uncertainty                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Practice-specific optional features | Practice membership/switching, server role/resource policies and tenant-scoped persistence | Module registry, feature grants, per-practice activation/configuration and consistent enforcement across every channel                                                   | Moderate foundation work; compatible with current architecture                          |
| Catalog / enable feature            | Practice settings and simulated subscription UI/API                                        | Catalog, setup validation, prerequisites, disable/re-enable and feature-specific entitlement UX                                                                          | Relatively straightforward after the foundation; not a switch that exists today         |
| Laboratory records/manual reports   | Patient/encounter/history/version/audit concepts and a documented future lab seam          | Entire lab order/result/review domain, schema, UI and report storage                                                                                                     | Medium-to-large feature scope; manual/synthetic stage simpler than live integration     |
| Electronic laboratory connection    | Ports/adapters approach, no provider coupling in core                                      | Provider contract, credentials, mapping/reconciliation, outbox/inbox, retries/duplicate handling and clinical review rules                                               | High and vendor-dependent; cannot estimate reliably before provider assessment          |
| X-ray/echo reports and attachments  | Existing patient/history/document patterns                                                 | Protected media storage, study/report model, transfer validation, dedicated preview/access and review                                                                    | Medium-to-large; reusable media foundation helps both modalities                        |
| Full X-ray/echo imaging integration | No PACS/DICOM/device/viewer implementation                                                 | Archive/device compatibility, study/series/media retrieval, potentially cine and structured measurements, diagnostic viewer validation and bandwidth/storage engineering | High; a separate integration/viewer undertaking, not equivalent to an attachment screen |

These are relative engineering judgments, not calendar estimates or vendor-compatibility claims. Actual internet/storage targets and selected provider documentation are prerequisites to estimates.

## Concrete implementation evidence and gaps

- `apps/api/src/modules/practice/infrastructure/scope.ts`: verifyMembership and scoped repository wrapper verify practice membership and scoped models. New models/operations must be explicitly covered; adding a table does not automatically make it safely tenant-scoped.
- `apps/api/src/modules/subscription/application/policy.ts`: SOLO/TEAM map to clinician seats; effectiveState evaluates trial/past-due restriction. This is not a general add-on licensing system.
- `apps/api/src/infrastructure/prisma/database.ts`: write transaction checks subscription restriction, with existing role-limited historical access/export behavior. It needs additional capability-aware checks, including jobs and media.
- `apps/api/src/mvp-composition.ts`: explicit use-case/module wiring can host further modules; a dynamic plugin loader is absent and not recommended by ADR-011.
- `apps/api/prisma/schema.prisma`: current practice/membership/subscription and clinical records exist; diagnostic study/order/result and activation/connector persistence are absent in this inspection.
- `Documentation/Architecture/LABORATORY-BOUNDARY.md`: intended lab ownership, identity lookup, outbox/dedup/reconciliation sketches; explicitly not implemented. Preserve this design history.
- Existing regression evidence is in TASK-020–023/025/027/033 acceptance. Tests were not rerun for this documentation assessment, and their existence does not verify the proposed capabilities.

## Proposed product flow

1. Practice manager selects the active practice and opens Features.
2. Catalog shows Laboratory, X-ray reports, Echo reports and future reviewed modules, with eligibility, prerequisites and supported scope.
3. Manager enables an eligible module and completes its setup. A paid purchase would require a later separately approved billing flow; development grants are simulated.
4. Authorized staff see the enabled workflow. The server independently verifies practice, resource, clinical permission, entitlement and module/connection state on each operation.
5. Suspension blocks new work while preserving authorized historical records and handling in-flight provider messages through the documented reconciliation route.

## Recommended sequence and decisions

First agree on managed practice activation instead of arbitrary uploaded plugins (REQ-PROD-002 / ADR-011), then implement TASK-036 only after approval. Build delivery/private-media foundation TASK-037 before diagnostic workflows. Prefer manual/report-reference synthetic stages TASK-038/039 to validate clinic workflow. Perform TASK-040 against selected provider documentation before proposing a real connector. Neither a report stage nor a DICOM label implies diagnostic viewing, clinical review, legal validity or provider conformance.

Owner decisions are FIND-014 (commercial/activation), FIND-015 (lab depth/provider/clinical responsibilities), FIND-016 (imaging depth/media/viewer). Pricing, clinical/regulatory/retention rules and unknown interfaces are deliberately unresolved. Existing security/public-release gates remain; new requirements do not override TASK-035/FIND-013.

## Records and verification

Draft requirements: REQ-PROD-002, REQ-FOUND-013/014, REQ-FEAT-016–018. Proposed tasks: TASK-036–040. Proposed ADR-011. No records promoted to Approved by this assessment.
Documentation review checks IDs, requirement/task/ADR mappings, objective/scope/rules/acceptance/auth/data/audit/tests/questions fields and consistency with existing module and lab boundaries. No application tests, dependency upgrades, schema migration or feature implementation performed. Local formatting and Git whitespace checks apply only to these documentation changes.

## Owner priority decision — 2026-09-14

Optional modules are future nice-to-have backlog, not near-term work. Preserve these proposals and open findings; no implementation approval. Owner instruction: “lets keep that as future and a nice to have for now”.
