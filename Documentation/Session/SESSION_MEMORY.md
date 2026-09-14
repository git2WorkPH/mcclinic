# Session memory

Updated: 2026-09-14 (Australia/Sydney).
Phase: synthetic local SaaS/package complete; public staging/production gated.
Active requirement: REQ-FOUND-012 / FIND-013 security assessment.
Active task: TASK-033 completed locally; TASK-035 is Proposed. TASK-024 and TASK-028–031 remain Proposed.
Current branch: task/TASK-033-dependency-remediation.
Observed HEAD before this memory update: 13271c98060c476d2a70f5bf995985c1cd6c0e5c (TASK-034 formatting correction, also on origin/master).
Observed status before this memory update: only intended TASK-033 dependency/Dockerfile/test/evidence/runbook/memory changes pending commit; no unrelated edits or tracked deletions.

## Authorization and Git reconciliation

- Owner approved TASK-033 and the recommended TASK-034 merge/push, hosted verification and local rebuild. Separately confirmed “Yes, push TASK-034 to origin/master” after automatic review requested explicit authorization.
- TASK-034 merged/pushed at c7c5a38; first hosted run failed formatting across older unpushed commits. Formatting-only correction 13271c9 retained the gate and was separately inspected, merged and pushed; TASK-033 dependencies were excluded.
- GitHub run 34797793133 succeeded on 13271c9. This proves TASK-034, not the unpushed TASK-033 changes.
- Seven old user edits were explicitly discarded in the preceding session; they have not been restored. Previous claims about preserving those edits are historical.
- No TASK-033 merge/push, cloud provisioning, real data, external billing/mail, code/test removal or public risk acceptance performed. LocalStack optional.

## Delivered and relevant records

- Scoped pnpm overrides: @prisma/config>deepmerge-ts 8.0.2, prisma>mysql2 3.23.1. Three original npm advisories remediated; image-size still reports two high advisories with no published patch.
- Packaged Dockerfile pins libpcre2-8-0 security update and OpenSSL for Prisma detection. Node 24.21.0/pnpm 10.34.5 unchanged. tests/dependency-security.test.ts verifies circular merge and real Prisma config.
- [Approval](../Tasks/Approved/TASK-033.md), [completion](../Tasks/Completed/TASK-033.md), [acceptance/review](../Acceptance/TASK-033-acceptance.md), rationale Doc/Changes/Justification/TASK-033-dependency-remediation.md.
- Complete before/after audit/image reports, scanner DB/provenance and exported image SBOM/source hashes: Documentation/Acceptance/TASK-033-artifacts/.
- [Runbook](../Project/PACKAGED_RUNBOOK.md) includes testing/scanning. [TASK-035](../Tasks/Proposed/TASK-035.md) proposes serving-image separation and remaining hardening.

## Verification and local environment

- pnpm check PASS: lint/boundaries, types, 28 tests, Prisma generation and API/web builds. Codegen drift PASS.
- 23 PostgreSQL regressions, 7 packaged browser journeys, 2 foundation browser tests PASS (60 total local scenarios). Fresh/repeated migrations, clock preflight and persistent restart passed. Existing assertions preserved.
- Trivy 0.74.0 full local export scans completed. Final OS occurrences: 4 critical/52 high/94 medium/82 low/1 unknown; global-tool occurrences 8 high/7 medium. These are scanner package/advisory counts, not proven exploits. PCRE advisories gone; OpenSSL adds low/medium occurrences. Full context in acceptance.
- Running clinic http://127.0.0.1:8080/clinic: IMAGE_TAG=task033, WEB_PORT=8080, SOURCE_REVISION=c7c5a38-task033-working. Image sha256:12a5b98135b307781cabaf64bcaeb2bd4cafa9ff0fb41a4e7b55188f76beca65. Non-root uid1000, readiness healthy, existing PostgreSQL mcclinic and state/credentials preserved. Old task027 image retained.
- Synthetic clinician/reception/admin password remains in ignored .local/packaged/demo-password. Image source hashes and lock match current source; image is honestly labeled a working-tree build. Test services stopped; volumes retained.

## Open decisions and next action

- FIND-013 remains Open: image-size and remaining OS/global npm/pnpm findings block public readiness; local-only reachability decisions do not accept production risk. TASK-035 is not approved.
- Philippine clinical/legal/privacy/signature/retention findings remain Open and nonblocking only for synthetic development. No purge.
- Exact next action: review TASK-033 local commit for explicit merge/push approval, then approve TASK-035 if proceeding toward a hardened serving image. Do not deploy from this memory.
