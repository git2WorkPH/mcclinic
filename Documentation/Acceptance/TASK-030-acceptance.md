# TASK-030 — Local network rehearsal checkpoint

2026-09-20; local sequence only. Status: Approved / In progress, no deployed acceptance. Full TASK-028 environment dependency remains unmet.

Added `tests/release-network.integration.test.ts` under its prior change justification. It runs the built React Native Web app against PostgreSQL with 250 ms GraphQL delay, discards the first committed patient-write response and retries through the real UI. PASS: input retained, same idempotency key, one patient and one patient.create audit. Complete log retained in TASK-030-artifacts. Original clinical/onboarding/browser assertions unchanged; no application source changed by this task.

Review: isolated synthetic Testcontainer, local browser/proxy, no external messages/network targets, no real patient data or active clinic mutation. This tests one observable failure path and does not prove all connectivity/clinical workflows. Existing TASK-035 local restore evidence and TASK-029 key/cookie evidence remain tied to their tested versions. STAGING_VERIFICATION.md defines the missing RDS/KMS, alert/tabletop, rollout/load and real-ISP evidence. RPO/RTO and public readiness are not accepted. Task remains Approved.
