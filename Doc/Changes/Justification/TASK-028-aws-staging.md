# TASK-028 — Local AWS preparation justification

Owner-approved release sequence, specifically “Prepare locally; no AWS spending yet”. REQ-FOUND-012 AC-01–04. No apply, provisioning, purchases, DNS changes or messages authorized.

Prepare additive CloudFormation foundation and edge-access templates plus offline security checks. Separate private database, immutable registry, encrypted storage/keys, task identities, logs and cost-alert configuration. Templates are reviewable preparation, not a running staging environment. Preserve the approved topology history; managed private endpoint egress is a provisional alternative requiring a revised calculator estimate before apply. Public routing/service activation remains gated by a separately verified staging runtime, account/domain/budget and tester inputs.

Tests KEEP all application regressions; ADD offline template schema validation and policy checks for private data, retained resources, exact security-group ingress, key permissions, deny-by-default edge access and no default budget/account. No existing infrastructure edited/deleted. No deploy/teardown script is added. Document unverified provider behavior and remaining resources rather than mark deployment acceptance complete.
