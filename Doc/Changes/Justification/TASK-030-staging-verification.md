# TASK-030 — Local rehearsal preparation

Owner-approved release sequence, local only. REQ-FOUND-012 AC-03/04. TASK-028 has no deployed environment; no deployed criterion can pass yet. Prepare the independent local interrupted-response rehearsal and evidence protocol while preserving that dependency gate.

KEEP existing tests and full legacy recovery evidence. ADD one real built-browser/PostgreSQL scenario with deterministic latency and a deliberately lost response after a patient write commits, then a retry that must preserve form state, reuse idempotency and produce one patient/audit record. This is a synthetic engineering profile, not measured Philippine connectivity. No clinical implementation changes or automatic retry/purge. RDS PITR, alert/incident tabletop, target-ISP comparison and achieved RPO/RTO remain unrun.
