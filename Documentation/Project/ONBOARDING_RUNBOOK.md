# Local onboarding (TASK-025)
Synthetic data only. No external mail, live billing or deployment. Continue the API/web setup in SAAS_RUNBOOK.md; the canonical database name is now **mcclinic**.

## Existing database: preserve data
Back up the existing database and stop the API, Prisma Studio and other clients. Keep the existing Docker volume. Set DATABASE_URL to its existing local database (`ehr_mvp`, or legacy `ehr_dev`), then run `pnpm db:rename`. This executes ALTER DATABASE RENAME: same database, ownership, records and OID. It refuses a pre-existing mcclinic target, unknown source or remote host. It never drops data or terminates sessions. If another client prevents renaming, stop it and retry. Update DATABASE_URL's database component to mcclinic after success. Do not change credentials merely to rename a database.

For a fresh database, Compose now creates mcclinic. POSTGRES_DB affects only an empty volume; changing Compose alone does not rename a populated database. Do not remove the volume. From the root:

```sh
export DATABASE_URL='postgresql://ehr_dev:<your-local-password>@127.0.0.1:5432/mcclinic'
export MVP_SYNTHETIC_ONLY=true
pnpm db:generate
pnpm db:migrate
pnpm dev:mvp
# Second terminal:
pnpm dev:web
```
Use the actual local password/port from your existing environment or Compose; the example must match it. Demo seeding remains optional and does not grant newly registered email accounts access to the default practice.

## Account flows
At http://127.0.0.1:5173/clinic open **Account onboarding and recovery**. Register a synthetic email/display name, 12–128 character password and optional practice name. Supplying a practice name creates a SOLO trial practice only after verification; leave it blank to join an invited practice.

Run `pnpm dev:mailbox` from the repository root to read local messages. Open the verification link and click Verify account. Sign in using the email as username. Links use the URL fragment and are removed from the address bar after loading. They are not sent in HTTP requests. No public mailbox endpoint exists. Anyone with operator filesystem access can read these development messages; do not use real data.

A practice manager opens **Account security and invitations**, chooses an invited email/role and sends a local invitation. The invitee registers/verifies that email, opens the invite link and accepts using their password (and MFA if enabled). Existing members can also accept from the sign-in page after signing out. Sign in and switch practices. Authority and seats are rechecked when accepting.

Recovery: request a reset link from the recovery form, read the local mailbox, enter a new password and existing authenticator/recovery code if enabled. Sessions are revoked. Unrecognized emails receive the same response; no matching message is captured.

MFA: enter your current password in Account security, select Set up authenticator, manually enter the displayed secret in an authenticator app, then Confirm authenticator with its six-digit code. Save the eight recovery codes and sign in again. Each code is single-use; a TOTP code cannot be replayed, so wait for the next 30-second code after confirmation/login. Disabling MFA requires password and a fresh authenticator/recovery code and revokes sessions.

The ignored `.local/` directory contains permission-restricted mailbox files and `onboarding-key`, which encrypts MFA secrets. Back up this key securely together with the development database; loss makes enrolled factors unusable. EHR_LOCAL_STATE_DIR can override its absolute location; API and mailbox commands must use the same location. No automatic account, mailbox, token, audit or retention purge exists.

## Verification
`pnpm check`, `pnpm test:onboarding`, `pnpm test:mvp`, `pnpm test:integration`, `pnpm test:mvp:web`, `pnpm test:web`. Database/browser suites create isolated disposable Testcontainers databases and require Docker. TASK-024 remains Proposed. Production identity/mail/recovery, abuse controls, Philippine policy and prescribing entitlement are not verified by this development implementation.
