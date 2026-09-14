# Separate local serving images

TASK-035 / ADR-012. Synthetic local use only. Original package and migration commands remain available; no volumes are deleted.

```sh
export SOURCE_REVISION=$(git rev-parse HEAD)
export IMAGE_TAG=task035
export WEB_PORT=8080
docker compose -f infrastructure/docker/compose.packaged.yaml -f infrastructure/docker/compose.serving.yaml build api web migrate
docker compose -f infrastructure/docker/compose.packaged.yaml -f infrastructure/docker/compose.serving.yaml up -d postgres
docker compose -f infrastructure/docker/compose.packaged.yaml -f infrastructure/docker/compose.serving.yaml run --rm migrate
docker compose -f infrastructure/docker/compose.packaged.yaml -f infrastructure/docker/compose.serving.yaml up -d --wait api web
```

Initialize secrets with tooling/init-packaged.mjs before first use (see PACKAGED_RUNBOOK). Run seed explicitly only for a fresh synthetic database. The migration image retains pnpm/Prisma CLI; API/web are non-root Node bundles on a pinned official distroless Debian runtime. Both serve existing contracts and use existing state/database volumes. Live local service may still use task033 until explicitly switched.

Verification: `IMAGE_TAG=task035 SERVING_IMAGES=true WEB_PORT=8085 node tooling/verify-packaged.mjs`. It preserves all existing browser assertions and leaves the test project/state for recovery testing. Then run `RECOVERY_SOURCE_PROJECT=<reported-test-project> RECOVERY_SOURCE_STATE=<reported-state-path> IMAGE_TAG=task035 node tooling/verify-serving-recovery.mjs`. The latter restores all table fingerprints and MFA key decryption into a separate project, switches to old task033 images and back, then verifies unchanged records. Retains backups/state/volumes; uses port 8086.

Rollback for the existing clinic: choose previous IMAGE_TAG=task033 and omit compose.serving.yaml when running `up -d --wait api web`. Preserve current DB/state; for actual future incompatible migrations use a separately approved rollback plan. Never overwrite an existing backup/production database.

Bundle SBOM/build metadata live at /workspace/artifacts in each image. Scan both OS image exports and bundle SBOM with Trivy; do not infer no dependencies from absence of node_modules. TASK-035-artifacts holds scan/recovery evidence. Current lower-severity OS findings require recheck by 2026-09-21 or before any exposure change; no production risk acceptance. Full migration image retains tooling findings and must run only in controlled release jobs.
