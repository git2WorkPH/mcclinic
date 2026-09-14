# Proposed tasks

All tasks remain Proposed; no approval or implementation has occurred. Each implementation task requires `Doc/Changes/Justification/` before its first edit.

Recommended first approval: **TASK-001**, limited to workspace/bootstrap and module boundaries, with ADR-001 acceptance and fresh branch discovery. Clinical-policy decisions can proceed independently; they block dependent feature work, not this bounded setup.

| Task                    | Objective                                                | Dependencies                                     |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| [TASK-001](TASK-001.md) | Bootstrap workspace and module boundaries                | None                                             |
| [TASK-002](TASK-002.md) | Establish persistence and protection foundation          | TASK-001                                         |
| [TASK-003](TASK-003.md) | Implement approved identity and permission policy        | TASK-001, TASK-002                               |
| [TASK-004](TASK-004.md) | Establish audit and clinical version primitives          | TASK-002, TASK-003                               |
| [TASK-005](TASK-005.md) | Implement patient registration and profile               | TASK-003, TASK-004                               |
| [TASK-006](TASK-006.md) | Implement patient search                                 | TASK-005                                         |
| [TASK-007](TASK-007.md) | Implement consultations                                  | TASK-005                                         |
| [TASK-008](TASK-008.md) | Implement consultation notes and amendments              | TASK-007, TASK-004                               |
| [TASK-009](TASK-009.md) | Implement longitudinal patient history                   | TASK-008, TASK-010, TASK-011                     |
| [TASK-010](TASK-010.md) | Implement prescription creation and issuance             | TASK-007, TASK-004                               |
| [TASK-011](TASK-011.md) | Implement medical-certificate creation and issuance      | TASK-007, TASK-004                               |
| [TASK-012](TASK-012.md) | Implement clinical-document rendering ports and adapters | TASK-001, TASK-003, TASK-004                     |
| [TASK-013](TASK-013.md) | Implement printable prescriptions                        | TASK-010, TASK-012                               |
| [TASK-014](TASK-014.md) | Implement printable medical certificates                 | TASK-011, TASK-012                               |
| [TASK-015](TASK-015.md) | Document future laboratory integration seam              | None                                             |
| [TASK-016](TASK-016.md) | Verify the initial clinician journey                     | TASK-006, TASK-009, TASK-013, TASK-014, TASK-019 |
| [TASK-017](TASK-017.md) | Implement appointment booking and views                  | TASK-005, TASK-004                               |
| [TASK-018](TASK-018.md) | Implement appointment changes                            | TASK-017                                         |
| [TASK-019](TASK-019.md) | Implement scheduled patient check-in                     | TASK-018                                         |

## Current index clarification — 2026-09-14

The initialization status and first-approval recommendation above are historical. Individual Approved/Completed records govern tasks already implemented; preserved proposals do not reverse their approval. TASK-035 runtime hardening remains Proposed.

## Optional module proposals — no implementation approval

| Task                    | Objective                                         | Dependencies                         |
| ----------------------- | ------------------------------------------------- | ------------------------------------ |
| [TASK-036](TASK-036.md) | Catalog, activation and feature entitlements      | Existing SaaS foundation; ADR-011    |
| [TASK-037](TASK-037.md) | Protected media and diagnostic delivery           | TASK-036; FIND-015/016               |
| [TASK-038](TASK-038.md) | Synthetic/manual laboratory workflow              | TASK-036/037; lab-stage decision     |
| [TASK-039](TASK-039.md) | X-ray/echo report/reference workflow              | TASK-036/037; imaging-stage decision |
| [TASK-040](TASK-040.md) | Selected provider feasibility/contract assessment | Provider/direction selection         |

Owner asked for requirements only. No blanket implementation approval is implied. Each future implementation needs explicit task approval and Doc/Changes/Justification/ record.
