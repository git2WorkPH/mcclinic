# FIND-014 — Optional feature commercial and activation model

Status: Open, 2026-09-14. REQ-PROD-002, REQ-FOUND-013, REQ-FEAT-016.
Evidence: current subscription policy has SOLO/TEAM clinician seat limits and coarse write restriction; no per-module catalog, grant, activation or configuration lifecycle. Existing clinical permissions must not become billing entitlements.
Decisions needed: included bundles versus separately paid modules; trials/quotas and who may authorize eventual charges; whether practice managers as well as administrators may enable modules; first add-on priority. Proposed development default: platform-managed catalog, explicit per-practice activation, simulated grants, no live charges or arbitrary plugin uploads. Default is a proposal, not implemented or silently approved.
Risks/tests: unauthorized direct API use, inconsistent practice switching and disabled-history lockout; require independent permission, tenant and feature-state tests.
Next: review requirements and TASK-036. Requirements recording does not approve implementation.
