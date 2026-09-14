# Requirements index

All 22 requirements are Draft v0.1; no implementation approval is implied. ACs are proposed verifiable obligations, with policy-dependent details blocked by linked findings.

| ID                                           | Requirement                               | Task     |
| -------------------------------------------- | ----------------------------------------- | -------- |
| [REQ-PROD-001](Product/REQ-PROD-001.md)      | Initial clinician workflow                | TASK-016 |
| [REQ-FOUND-001](Foundation/REQ-FOUND-001.md) | Workspace and verification platform       | TASK-001 |
| [REQ-FOUND-002](Foundation/REQ-FOUND-002.md) | Shared packages and module boundaries     | TASK-001 |
| [REQ-FOUND-003](Foundation/REQ-FOUND-003.md) | Authentication                            | TASK-003 |
| [REQ-FOUND-004](Foundation/REQ-FOUND-004.md) | Authorization                             | TASK-003 |
| [REQ-FOUND-005](Foundation/REQ-FOUND-005.md) | Audit trail                               | TASK-004 |
| [REQ-FOUND-006](Foundation/REQ-FOUND-006.md) | Clinical integrity and amendments         | TASK-004 |
| [REQ-FOUND-007](Foundation/REQ-FOUND-007.md) | Printable clinical-document architecture  | TASK-012 |
| [REQ-FOUND-008](Foundation/REQ-FOUND-008.md) | Persistence and data protection           | TASK-002 |
| [REQ-FOUND-009](Foundation/REQ-FOUND-009.md) | Future laboratory integration boundary    | TASK-015 |
| [REQ-FEAT-001](Features/REQ-FEAT-001.md)     | Patient registration and profile          | TASK-005 |
| [REQ-FEAT-002](Features/REQ-FEAT-002.md)     | Patient search                            | TASK-006 |
| [REQ-FEAT-003](Features/REQ-FEAT-003.md)     | Consultations                             | TASK-007 |
| [REQ-FEAT-004](Features/REQ-FEAT-004.md)     | Consultation notes                        | TASK-008 |
| [REQ-FEAT-005](Features/REQ-FEAT-005.md)     | Patient history                           | TASK-009 |
| [REQ-FEAT-006](Features/REQ-FEAT-006.md)     | Prescriptions                             | TASK-010 |
| [REQ-FEAT-007](Features/REQ-FEAT-007.md)     | Printable prescriptions                   | TASK-013 |
| [REQ-FEAT-008](Features/REQ-FEAT-008.md)     | Medical certificates                      | TASK-011 |
| [REQ-FEAT-009](Features/REQ-FEAT-009.md)     | Printable medical certificates            | TASK-014 |
| [REQ-FEAT-010](Features/REQ-FEAT-010.md)     | Appointment booking                       | TASK-017 |
| [REQ-FEAT-011](Features/REQ-FEAT-011.md)     | Appointment rescheduling and cancellation | TASK-018 |
| [REQ-FEAT-012](Features/REQ-FEAT-012.md)     | Patient check-in                          | TASK-019 |

## Index status clarification — 2026-09-14

The initial table/status above is historical initialization text. Later approval and completion evidence in individual requirement/task records governs current work; it does not remain an accurate claim that nothing has been implemented. SaaS/auth/deployment requirements also exist in REQ-FOUND-010–012 and REQ-FEAT-013–015.

## Optional modules — new Draft requirements (no implementation approval)

| ID                                           | Requirement                                  | Proposed tasks     |
| -------------------------------------------- | -------------------------------------------- | ------------------ |
| [REQ-PROD-002](Product/REQ-PROD-002.md)      | Optional practice modules                    | TASK-036           |
| [REQ-FOUND-013](Foundation/REQ-FOUND-013.md) | Module registry, activation and entitlements | TASK-036           |
| [REQ-FOUND-014](Foundation/REQ-FOUND-014.md) | Diagnostic connectors and protected media    | TASK-037, TASK-040 |
| [REQ-FEAT-016](Features/REQ-FEAT-016.md)     | Practice feature catalog/setup               | TASK-036           |
| [REQ-FEAT-017](Features/REQ-FEAT-017.md)     | Optional laboratory requests/results         | TASK-038, TASK-040 |
| [REQ-FEAT-018](Features/REQ-FEAT-018.md)     | Optional X-ray and 2D echo records           | TASK-039, TASK-040 |

Assessment: ../Assessment/OPTIONAL-MODULES.md. Findings: FIND-014–016. ADR-011 remains Proposed.
