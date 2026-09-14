# FIND-015 — Laboratory/provider workflow and external contract unknowns

Status: Open, 2026-09-14. REQ-FEAT-017, REQ-FOUND-014.
Evidence: REQ-FOUND-009 and LABORATORY-BOUNDARY.md define a design seam only; current schema/module inventory contains no laboratory order/result or durable provider delivery workflow.
Decisions needed: manual reports/requests first or electronic integration; which laboratory and provider version; outbound orders, inbound results or both; identifiers/codes/units and correction semantics; credentials/sandbox/licensing; clinical ordering/review permissions; critical-result notification responsibility; failure/in-flight handling. No protocol or critical-value/alert rule is invented here.
Patient matching must not rely on name alone. A received result is not a reviewed result. Existing clinical, privacy, consent, retention and Philippine legal findings stay open.
Next: TASK-040 provider assessment if electronic integration is desired, then separate bounded connector approval. TASK-038 manual/synthetic stage is only Proposed.
