# Staging verification protocol

TASK-030 local preparation, 2026-09-20. No AWS environment exists from this sequence. Do not label local tests RDS PITR, an ISP benchmark or a production recovery drill.

## Verified local rehearsals

- TASK-035 restored a separate local PostgreSQL database, compared all public-table fingerprints, recovered enrolled legacy MFA using its backed-up key and exercised prior/new image rollback. Evidence is tied to those exact old image IDs and schema; it is not a restore certificate for later changes.
- TASK-029 verifies enrolled-account access across retained key versions and a separately restored key file; injected KMS-provider tests verify context/denial/backup behavior. Real AWS KMS is untested.
- `tests/release-network.integration.test.ts`: real built web app and isolated PostgreSQL; 250 ms added delay per GraphQL request, one response discarded after patient creation commits, manual retry with unchanged input/idempotency key. Exactly one patient and one patient.create audit event result. This models a specific failure, not national network quality, offline synchronization or every write path.

Run `pnpm build` then `pnpm exec vitest run tests/release-network.integration.test.ts` with Docker/Chromium. The test creates only disposable synthetic databases and leaves the existing clinic untouched. No existing test assertion was weakened.

## Required deployed evidence after explicit infrastructure approval

| Rehearsal                     | Evidence to retain without secrets/patient payloads                                                                                                                 | Current status                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Artifact rollout and reversal | Commit/digests, migration IDs, readiness timing, prior image compatibility and roll-forward result                                                                  | Not run on AWS                                                        |
| Separate RDS PITR/restore     | Source/target resource IDs, recovery point, start/finish, complete table counts/fingerprints, versions/amendments, snapshots/audit/membership checks                | Not run                                                               |
| Key recovery                  | Key ARN/version inventory and contextual unwrap result, independently restored wrapped envelope and enrolled-account login; never plaintext keys/TOTP codes         | Not run on AWS                                                        |
| Network interruption/load     | Profiles, concurrency/sample sizes, route/action, response-loss timing, retained UI inputs and database/audit/idempotency outcome                                   | One local patient-write scenario passed; deployed/load matrix pending |
| Clinical and tenant smoke     | Registration→practice switch→clinical note/document→preview/print, cross-tenant/membership denials and immutable reprint                                            | Existing local suites passed; deployed suites pending                 |
| Alert/tabletop                | Named incident owner, safe synthetic trigger, acknowledgment/response times, backup/operator escalation decisions                                                   | Not run; owner unassigned                                             |
| Philippine clinic samples     | General city/provider, fixed/mobile, time window, latency/loss and workflow timings for Singapore vs second candidate; no precise personal location or patient data | Not collected                                                         |

Proposed RPO/RTO in DEPLOYMENT_PLAN.md remain unaccepted targets. Do not start disaster tests on existing resources without scoped approval. Restore into a separate target; never delete source, backup, key or clinical history as part of a test. Do not infer permission for messages to providers/testers or purchases from this protocol.
