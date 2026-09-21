# TASK-042 — Parallel Terraform staging and TypeScript policy checks

Status: Completed for local scope, 2026-09-21. Approval: owner request on 2026-09-21. Owner selected “Implement Terraform alongside CloudFormation now”. Requirements: REQ-FOUND-012 AC-01–04, existing security/retention/tenant boundaries. ADR-017 required. Same bounded integration branch as TASK-041; separate evidence/justification.

Objective/scope: native Terraform AWS staging candidate alongside preserved CloudFormation, explicit environment/state separation, private database/network, origin/cache/WAF controls, retained stores, isolated runtime/jobs, budgets/alarms and offline mocked tests. Port all ten existing custom Python policy scenarios to TypeScript with assertion parity; retain original Python and cfn-lint files as historical/optional verification.

Out of scope: provisioning, AWS credentials/account calls, live billing/email, real data, destructive commands/imports/state migration, removing existing templates/tests, completing deployed TASK-028 criteria.

Acceptance: pinned Terraform/provider lockfile; fmt/validate and mocked plan tests without AWS calls; negative activation/input controls; no automatic migrations or plaintext clinical data; state/secrets/deletion guidance and CloudFormation ownership parity matrix. Every Python assertion remains covered in TypeScript. Existing application regressions retained. Expected areas: infrastructure/terraform, TypeScript policy tests/parser, package scripts/dependency, CI/docs. Dependencies: TASK-028 prepared topology and existing image commands. Material differences recorded in ADR-017 and open findings, not silently accepted as production-ready. Exact tests/evidence in acceptance record. No real apply or resource removal authorized.

## Completion evidence

All bounded local acceptance criteria verified and reviewed; see ../../Acceptance/TASK-042-acceptance.md. Original approval/scope/history above preserved. No production acceptance, merge/push, cloud execution or deletion authorization inferred. TASK-028 remains in progress.
