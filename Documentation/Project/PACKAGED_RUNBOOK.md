# Local packaged MCClinic — TASK-027

Synthetic development only. This runs built API and React Native Web assets, not Vite. LocalStack is optional future AWS-adapter testing and is neither installed nor required. No AWS account or cloud spending is needed. Staging/production values are rejected by these entry points.

## Start from the repository root

Use Docker Desktop and the pinned Node/pnpm runtime from DEVELOPMENT.md. The following uses a separate `mcclinic-packaged` Compose project and never renames or removes the existing development database/volume.

```sh
node tooling/init-packaged.mjs
export SOURCE_REVISION=$(git rev-parse HEAD)
export IMAGE_TAG=local
export WEB_PORT=8080
docker compose -f infrastructure/docker/compose.packaged.yaml build api
docker compose -f infrastructure/docker/compose.packaged.yaml up -d postgres
docker compose -f infrastructure/docker/compose.packaged.yaml run --rm migrate
docker compose -f infrastructure/docker/compose.packaged.yaml run --rm seed
docker compose -f infrastructure/docker/compose.packaged.yaml up -d --wait api web
```

Open **http://127.0.0.1:8080/clinic**. Synthetic seeded usernames: `clinician`, `reception`, `admin`. Read the local password privately from `.local/packaged/demo-password`; do not commit or share the secret file. Seeding is optional for an empty database; self-registration creates its own practice after verification.

At TASK-027 handoff, the running image is `mcclinic-packaged:task027` (use `IMAGE_TAG=task027` for operations against it). A later build with `IMAGE_TAG=local` intentionally selects a different tag. The verified source label is `b90be76-task027-working`; embedded source hashes distinguish its actual working tree from the base commit.

The initializer preserves existing secrets and generates new ones only when absent. Do not regenerate a database password for an existing volume: POSTGRES_PASSWORD_FILE initializes a new database only. Keep `.local/packaged/db-password` with the associated database. The database is named `mcclinic`; neither API nor PostgreSQL exposes a host port. Only web is published, on 127.0.0.1. Set WEB_PORT before starting to change it; account links follow that port.

## Account verification and recovery

Messages are stored privately inside the API state volume. Inspect them locally:

```sh
docker compose -f infrastructure/docker/compose.packaged.yaml exec -T api node -e 'const fs=require("fs");const p="/var/lib/mcclinic/mailbox";if(fs.existsSync(p))for(const n of fs.readdirSync(p))console.log(fs.readFileSync(p+"/"+n,"utf8"));'
```

This intentionally displays local verification/reset/invitation links to the operator. Open only your synthetic account's link. No mailbox HTTP route or external email delivery exists. The API state volume also preserves the MFA encryption key across restarts. Never expose the mailbox or key as web assets.

## Health, stop and resume

```sh
docker compose -f infrastructure/docker/compose.packaged.yaml ps
curl http://127.0.0.1:8080/health/ready
docker compose -f infrastructure/docker/compose.packaged.yaml stop
docker compose -f infrastructure/docker/compose.packaged.yaml up -d --wait api web
```

Keep SOURCE_REVISION, IMAGE_TAG and WEB_PORT set in the shell for these commands. Readiness depends on database access. API startup checks the applied schema; run migrations explicitly before a new release. Shutdown drains active requests for up to 15 seconds before closing remaining sockets. Volumes survive stop/start. Do not run `down -v`, delete volumes or reset/drop the database.

## Backup without deleting data

Stop web/API briefly to capture database and MFA state consistently. Create a new backup directory each time:

```sh
docker compose -f infrastructure/docker/compose.packaged.yaml stop web api
backup_dir=$(mktemp -d .local/packaged/backup-XXXXXX)
docker compose -f infrastructure/docker/compose.packaged.yaml exec -T postgres pg_dump -U mcclinic -d mcclinic -Fc > "$backup_dir/mcclinic.dump"
docker compose -f infrastructure/docker/compose.packaged.yaml cp api:/var/lib/mcclinic "$backup_dir/onboarding-state"
cp .local/packaged/db-password "$backup_dir/db-password"
docker compose -f infrastructure/docker/compose.packaged.yaml up -d --wait api web
```

Check every command succeeded. Treat backups as sensitive even in synthetic development; never add them to Git. Restore into a separate database/state volume first, verify records and MFA, then explicitly choose a switch. This task did not execute a full restore drill or establish production RPO/RTO; TASK-030 owns that evidence. A container rollback is safe only when its code remains compatible with the applied schema; otherwise roll forward without removing migrations.

## Verification and artifacts

```sh
pnpm check
node tooling/check-codegen.mjs
pnpm exec vitest run tests/onboarding.integration.test.ts tests/mvp.integration.test.ts tests/database.integration.test.ts
IMAGE_TAG=local WEB_PORT=8085 node tooling/verify-packaged.mjs
pnpm test:web
```

The packaged verifier uses a distinct timestamped Compose project, fresh synthetic database and a test-only bind mount for local mailbox visibility. It applies migrations twice, runs all seven existing clinical/SaaS/onboarding browser journeys against the built web server, checks API restart persistence, then stops services. Test volumes/state are deliberately retained; no deletion is automated. The test-only override sets the API to the host's non-root uid; normal Compose uses image user node (uid 1000).

The image contains `/workspace/artifacts/sbom.cdx.json` and `provenance.json`. The SBOM inventories Node dependencies including build tools, not OS packages. The image ID/digest is the immutable deployment identity; tags can move. Frozen lockfile and source hashes provide traceability, not a promise of bit-identical OCI layers. Build from a clean reviewed commit for a release; working-tree builds must be labeled as such.

Current [acceptance evidence](../Acceptance/TASK-027-acceptance.md) and [FIND-013](../Assessment/Findings/FIND-013.md) document dependency advisories and the Docker Scout login limitation. Production OS scanning, dependency remediation, smaller runtime images, separate runtime/migration DB privileges, cloud ingress/TLS and protected delivery remain release gates. Do not expose this package publicly.

Clock prerequisite: keep the host and Docker Desktop VM clocks synchronized, especially after sleep. The verifier rejects clock skew beyond one second before browser tests because MFA and clinical timestamps depend on accurate time. Synchronize/restart Docker Desktop as appropriate, then rerun; do not disable MFA checks.

## TASK-033 patched package and repeatable scanning

Current local handoff uses `IMAGE_TAG=task033`, `SOURCE_REVISION=c7c5a38-task033-working`, and `WEB_PORT=8080`. The earlier task027 image is retained. Database and local state volumes are shared across those local image revisions; no migration was changed by TASK-033. For subsequent builds label the actual checked-out revision and record any working-tree changes.

Trivy 0.74.0 was downloaded from the [official release](https://github.com/aquasecurity/trivy/releases/tag/v0.74.0), verified against its published SHA-256 checksums, and run locally. On this workstation the temporary executable is `/private/tmp/task033-trivy/trivy`; install/verify the correct official binary on another machine. Do not reuse an unverified download.

```sh
mkdir -p .local/security
pnpm audit --json > .local/security/npm-audit.json
docker save mcclinic-packaged:task033 -o .local/security/image.tar
/private/tmp/task033-trivy/trivy image \
  --input .local/security/image.tar \
  --cache-dir .local/security/trivy-cache \
  --scanners vuln --format json \
  --output .local/security/image-scan.json
```

`pnpm audit` currently exits nonzero for the two known image-size advisories. Read and retain the reports; do not add a mute to make them green. Image scanning does not upload the image and needs no Docker socket inside a scanner container. Scan command completion does not mean there are no vulnerabilities. TASK-033 acceptance records the findings and public-release blockers. Runtime separation is proposed under TASK-035; LocalStack remains optional.
