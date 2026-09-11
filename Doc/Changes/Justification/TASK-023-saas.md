# TASK-023 SaaS change justification
Requirement REQ-FEAT-015 v0.3. Owner approved bounded implementation 2026-09-11.
Problem: current single-practice MVP lacks simulated subscriptions and entitlements.
Change: Plans, clinician seat limits, trial/active/past-due/restricted states, simulated billing and permission-preserving export. Implement inward application contracts, scoped persistence adapters, additive migrations, generated schema/client operations and actual React Native Web workflows.
Test classification: KEEP all original assertions; ADD tenant isolation, migration preservation, membership switching, branding/template snapshots, billing/seat/export and browser checks. UPDATE harness setup to apply all additive migrations; no scenario removed or weakened.
No deletion approved or planned. Preserve schema/API fields and old document rendering. New non-default practices scope duplicate keys; existing global provider conflict protection remains conservative across practices. No real data/payment/deploy/push. Verification: lint/typecheck/codegen/build, Vitest/Testcontainers/Playwright and final review. Acceptance pending.

## Completion review — 2026-09-12
Implemented and verified for synthetic development. See Documentation/Acceptance/TASK-023-acceptance.md and SAAS-VERIFICATION.md. Existing tests KEEP, SaaS scenarios ADD; harness setup UPDATE preserves all assertions. Owner runbook edit remains unstaged; no new removal or external action.
