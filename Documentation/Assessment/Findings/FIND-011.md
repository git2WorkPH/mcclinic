# FIND-011 — Cloud deployment and operational readiness gaps
Status: Open, 2026-09-13. REQ-FOUND-012 / TASK-026.

The verified application is deliberately local. `apps/api/src/mvp-main.ts` rejects non-loopback hosts, `apps/clinical-app/vite.config.ts` is a development proxy, `infrastructure/docker/compose.yaml` is local PostgreSQL, and onboarding mail/key state is filesystem-local. No immutable production container, infrastructure-as-code, deployed secrets/mail adapter, cloud access boundary, restore drill, target-ISP measurement, load test, incident owner or cloud cost observation exists.

AWS Singapore is a reasoned measurement candidate, not an approved region, latency guarantee or Philippine data/privacy conclusion. TASK-026 estimates indicate approximately $87–94/month synthetic staging and $188–203/month small resilient production pilot before tax/support, with $105/$225 planning ceilings. Price, traffic and LCU assumptions must be refreshed before spending.

Close only through evidence from approved TASK-027–031 work and owner production decisions. Philippine privacy/clinical/legal/retention/signature findings and FIND-010 remain independently Open. This finding does not authorize provisioning, real data, external messages, live payments or deletion.
