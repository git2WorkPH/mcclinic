# Consolidated EHR Codex starter

> Current project: MCClinic includes a synthetic-data development MVP with clinical workflows, multiple practices and account onboarding. The original starter and foundation descriptions below are preserved as history. See the current account flows at the end of this README and the [onboarding runbook](Documentation/Project/ONBOARDING_RUNBOOK.md) for local setup.

## Run MCClinic locally — first-time setup

This guide runs the database in Docker and the API and desktop web app on your computer. Use **synthetic patients only**; this is a development MVP. You need internet access for the initial downloads, repository access, a browser and a text editor. Run commands one block at a time and stop if a command fails.

### 1. Install your operating system prerequisites

**macOS — Terminal**

Install Apple's command-line tools and finish the installer before continuing:

```sh
xcode-select --install
```

If they are already installed, continue. Install [Homebrew](https://brew.sh/) if `brew --version` is unavailable:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the installer's **Next steps** to add Homebrew to your shell, then open a new terminal:

```sh
brew install git
git --version
touch ~/.zshrc
```

Download [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/), choosing Apple silicon or Intel to match your Mac. Install and open it, finish setup and wait until its engine is running. Keep Docker Desktop open while using the app.

**Windows — WSL 2 / Ubuntu**

Use the Linux environment for the remaining commands. In an administrator PowerShell window, follow [Microsoft's WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install):

```powershell
wsl --install -d Ubuntu
```

Restart if requested, open Ubuntu and create its Linux username/password. Install Docker Desktop for Windows and enable its [WSL 2 integration](https://docs.docker.com/desktop/features/wsl/) for Ubuntu. Run the following in **Ubuntu**, then continue there, keeping the checkout under your Linux home directory:

```sh
sudo apt update
sudo apt install -y git curl ca-certificates
```

**Linux — Ubuntu/Debian**

Install Git, curl and certificates using the two `apt` commands above. Follow the official [Docker Engine installation instructions](https://docs.docker.com/engine/install/) for your distribution, including the Compose plugin and permission setup. Ensure your user can run `docker info`. Other distributions should use their own package manager. Homebrew is not required on Linux or Windows.

### 2. Install Node.js and pnpm

In macOS Terminal, Ubuntu/WSL or your Linux shell, install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) if you do not already have it:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
```

Open a new terminal, or load the default nvm installation in the current one:

```sh
. "$HOME/.nvm/nvm.sh"
nvm install 24.21.0
nvm use 24.21.0
npm install --global pnpm@10.34.5
```

Use the repository's pinned versions, rather than installing the latest Node or pnpm. Node includes npm; [pnpm supports installation through npm](https://pnpm.io/installation). No global Prisma, TypeScript or React installation is needed.

Confirm the tools work before continuing:

```sh
node --version
pnpm --version
git --version
docker --version
docker compose version
docker info
```

Expect Node `v24.21.0`, pnpm `10.34.5`, and a successful Docker server connection. Terraform, AWS CLI, LocalStack, Python and a separate PostgreSQL installation are **not required** for this local app setup.

### 3. Get the project and install dependencies

For a new checkout:

```sh
git clone https://github.com/git2WorkPH/mcclinic.git
cd mcclinic
```

If GitHub denies access, ask the maintainer for repository access and the intended release/branch. Use a checkout containing this guide and `.env.example`; the dotenv changes must be available in the branch supplied to you. If you already have the project, open a terminal in its root instead of cloning again. All remaining commands run from that root, where `package.json` lives.

```sh
nvm install
nvm use
pnpm install --frozen-lockfile
```

### 4. Configure the local environment

Copy the example only if you do not already have `.env`:

```sh
cp -n .env.example .env
```

Open `.env` in your text editor. For a **fresh database using the committed Compose configuration**, use the following structure. Replace both occurrences of `YOUR_DB_PASSWORD` with the same development-only password; choose letters and numbers to avoid URL-encoding issues. Replace `YOUR_DEMO_PASSWORD` with a different password of at least 12 characters. These uppercase values are placeholders.

```dotenv
APP_ENV=development
MVP_SYNTHETIC_ONLY=true
HOST=127.0.0.1
PORT=4000
POSTGRES_PASSWORD=YOUR_DB_PASSWORD
DATABASE_URL=postgresql://ehr_dev:YOUR_DB_PASSWORD@127.0.0.1:5432/mcclinic
DEMO_PASSWORD=YOUR_DEMO_PASSWORD
EHR_API_TARGET=http://127.0.0.1:4000
```

`POSTGRES_PASSWORD` is an additional setting for Docker Compose. The committed Compose database user is `ehr_dev`; **the database name is `mcclinic`**. If your local Compose file has a different `POSTGRES_USER`, use that username in `DATABASE_URL`. For an existing database, retain its actual credentials and volume. Editing `.env` does not change passwords stored in an existing database.

The app loads root `.env` automatically for local development. Existing exported shell variables take precedence, so remove stale exports from your shell if they conflict. Never commit `.env` or put secrets in `VITE_*` variables. See [environment configuration](Documentation/Project/ENVIRONMENT_CONFIGURATION.md) for details.

### 5. Start PostgreSQL and prepare the database

```sh
docker compose --env-file .env -f infrastructure/docker/compose.yaml up -d --wait postgres
docker compose --env-file .env -f infrastructure/docker/compose.yaml ps
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

The database should report healthy before running the Prisma commands. These steps generate the database client, apply migrations and create synthetic demo accounts. Seeding preserves existing accounts and **does not reset their passwords**. If your existing database is still named `ehr_mvp`, follow the non-destructive rename procedure in the [onboarding runbook](Documentation/Project/ONBOARDING_RUNBOOK.md) first; do not delete its volume.

### 6. Start the app in two terminals

**Terminal 1 — API**, from the repository root:

```sh
nvm use
pnpm dev:mvp
```

**Terminal 2 — web app**, also from the repository root:

```sh
nvm use
pnpm dev:web
```

Leave both terminals running. Open **<http://127.0.0.1:5173/clinic>**. Use the `/clinic` path for the complete MVP. The web development server forwards API requests to port 4000.

Sign in with one of the seeded usernames and the `DEMO_PASSWORD` you selected:

| Username    | Main purpose                                                   |
| ----------- | -------------------------------------------------------------- |
| `clinician` | Patient records, consultations, prescriptions and certificates |
| `reception` | Reception, appointments and check-in                           |
| `admin`     | Practice settings, membership and administrative workflows     |

Use the [SaaS walkthrough](Documentation/Project/SAAS_RUNBOOK.md) to try practice switching, branding and templates. For a new account, open **Account onboarding and recovery** and use a synthetic email such as `doctor@example.test`. Verification and recovery messages stay local; in a third terminal run:

```sh
pnpm dev:mailbox
```

Open the local verification link, verify the account, then sign in. No real email is sent. See the [onboarding runbook](Documentation/Project/ONBOARDING_RUNBOOK.md) for practice creation, invitations and recovery. Keep the ignored `.local/` state and its onboarding encryption key with your development database; custom state paths must also be supplied to the mailbox command.

### 7. Stop and resume safely

Press **Ctrl+C** in each app terminal. Stop PostgreSQL without deleting its data:

```sh
docker compose --env-file .env -f infrastructure/docker/compose.yaml stop postgres
```

Next time, open Docker, repeat the PostgreSQL `up -d --wait postgres` command and start the two app terminals. You do not need to reinstall dependencies or seed again each time. After receiving code updates, install with the frozen lockfile and run database generation/migrations as instructed by that release. Preserve your `.env`, database volume and `.local/` state; do not use `down -v`, volume pruning or database deletion to troubleshoot setup.

### Troubleshooting and optional verification

| Problem                                  | What to check                                                                                                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brew` / `nvm` / `pnpm` not found        | Complete the installer's shell setup, reopen the terminal and run `nvm use` in the project. With nvm, install pnpm without `sudo`.                                    |
| Cannot connect to Docker                 | Start Docker Desktop or the Linux Docker service. On Windows, confirm Ubuntu WSL integration is enabled.                                                              |
| PostgreSQL password authentication fails | Match `DATABASE_URL` to the actual database user/password. Existing volumes keep their original credentials despite Compose environment changes.                      |
| Port already in use                      | Check for another local service on 5432, 4000 or 5173. Stop only a service you recognize, or coordinate matching port changes in Compose, `.env` and the browser URL. |
| Web page opens but requests fail         | Confirm `pnpm dev:mvp` is running, migrations succeeded and `EHR_API_TARGET` matches the API port. Check both terminal error messages.                                |
| Demo login fails after changing `.env`   | Seeding never overwrites passwords; use the account's existing password.                                                                                              |
| Database client missing                  | Run `pnpm db:generate` after dependency installation. Do not broadly enable blocked dependency scripts.                                                               |

For contributors, these checks are optional for simply opening the app. Docker must be running for integration/browser tests:

```sh
pnpm check
pnpm test:integration
pnpm test:mvp
pnpm exec playwright install chromium
pnpm test:mvp:web
```

On Linux/WSL, Playwright may request OS browser dependencies; use `pnpm exec playwright install --with-deps chromium` when needed. Fresh-machine installer steps have been checked against official documentation; they have not been executed on every operating system. For the separately packaged Docker app, see the [packaged runbook](Documentation/Project/PACKAGED_RUNBOOK.md).

## Historical starter setup (preserved)

The sections below retain the original kit installation history. Use the first-time app setup above to run today's MCClinic MVP.

Repository-local governance, six focused skills, EHR architecture, and concise committed session memory. This package contains documentation and templates; it does not include an application, approved implementation tasks, or live integrations.

## Install

1. Extract the ZIP. Copy the contents of `ehr-codex-project-starter/` into the target repository root, including hidden `.agents/`.
2. For an existing project, inspect and merge existing documents first. Do not blindly overwrite project history, approvals, or memory. Inventory overlapping Continuity/EHR skills and route each responsibility to the six skills in AGENTS.md. This package includes no competing legacy skills. Deleting existing legacy files requires explicit deletion approval; prepare the exact list for that approval and update obsolete references during the authorized consolidation.
3. Preserve the empty documentation directories. ZIP directory entries retain them on extraction. Each empty directory also contains `.gitkeep` so Git retains the structure; removal of those files follows the deletion rule.
4. Read session memory and AGENTS.md, inspect Git, and initialize PROJECT.md settings and product requirements. Keep project-specific clinical and jurisdictional decisions explicit.
5. Track and commit the kit and session memory in the project. Draft tasks and obtain explicit approval before application implementation.

## Ownership and workflow

AGENTS.md routes to one owner per concern: governance, assessment, development, review, session memory, and EHR architecture. No Jira or external task system is required. Use templates from `Documentation/Templates/`; every record is repository-local.

Requirements → assessment/findings → proposed task → explicit approval → approved task → existing branch search/reuse → task justification → implementation/test classification → verification/review → completed task and committed session memory.

Every implementation change is covered by `Documentation/Changes/Justification/<TASK-ID>-<description>.md`. There is no separate legacy documentation tree. Task approval does not implicitly approve deletions. The governance skill owns the complete deletion and approval rules; development owns KEEP/ADD/UPDATE/SPLIT/REMOVE test decisions.

## Start prompt

> Initialize this EHR repository using AGENTS.md and the six project-local skills. Read session memory first and validate it against Git. Establish project settings, draft Product/Foundation/Feature requirements from SCOPE.md, assess the repository, and propose bounded tasks with acceptance criteria. Do not implement application features until the proposed task has explicit approval. Update and commit concise repository-local session memory with the exact next action.

## Package map

- `AGENTS.md`, `README.md`: entry point and installation.
- `.agents/skills/`: six skills with distinct ownership.
- `Documentation/Project/`: project profile, scope, glossary.
- `Documentation/Requirements/{Product,Foundation,Features}/`: versioned requirements.
- `Documentation/Assessment/Findings/`: evidence-backed gaps.
- `Documentation/Architecture/Decisions/`: ADRs.
- `Documentation/Tasks/{Proposed,Approved,Completed}/`: task lifecycle.
- `Documentation/Acceptance/`: verification and review evidence.
- `Documentation/Changes/Justification/`: task implementation rationale.
- `Documentation/Session/SESSION_MEMORY.md`: committed continuation index.
- `Documentation/Templates/`: requirement, finding, task, ADR, acceptance, change-justification, and session-memory templates.

## Installed project — 2026-09-10

The kit is now installed at repository root. Begin with [session memory](Documentation/Session/SESSION_MEMORY.md), validate Git, then follow [AGENTS.md](AGENTS.md).
The nested starter is preserved unchanged as source material. Root overrides govern conflicts. All implementation justifications use `Doc/Changes/Justification/`; Jira is not used. See [requirements](Documentation/Requirements/INDEX.md), [tasks](Documentation/Tasks/Proposed/INDEX.md), and [assessment](Documentation/Assessment/INITIAL_ASSESSMENT.md).

## Development foundation

The approved TASK-001 workspace is implemented. See [local development](Documentation/Project/DEVELOPMENT.md) for pinned runtime, install, API/web startup and verification commands. This is a non-clinical shell; no patient workflow or prescribing capability is implemented. Remaining approved work is tracked in [decisions needed](Documentation/Assessment/DECISIONS-NEEDED.md).

## Current MVP account and practice flows

An **account identifies a person**. A **practice owns its subscription, patients and clinical records**. One account can belong to multiple practices with separate permissions. These flows describe the current local, synthetic-data implementation; they do not establish production identity verification or prescribing entitlement.

### 1. New doctor starting a practice

```mermaid
flowchart TD
  A[Open Account onboarding and recovery] --> B[Enter name, email, password and practice name]
  B --> C[Register]
  C --> D[Open verification link and verify account]
  D --> E[System creates practice and simulated SOLO trial]
  E --> F[Doctor receives clinician and practice-management permissions]
  F --> G[Sign in with email and password]
  G --> H[Open practice workspace]
  H --> I[Configure branding and templates and invite staff]
```

The practice is created after successful account verification. The platform owner does not need to create it manually. Passwords must contain 12–128 characters.

### 2. Staff member joining an existing practice

```mermaid
flowchart TD
  A[Practice manager invites email and selects role] --> B[Invitee registers without a practice name]
  B --> C[Verify account]
  C --> D[Open invitation link]
  D --> E[Accept using password and MFA if enabled]
  E --> F[Sign in]
  F --> G[Access invited practice with assigned permissions]
```

The manager sends invitations from **Account security and invitations**, choosing clinician, reception or administrator. An existing verified user skips registration and verification; the current invitation flow can be accessed from the sign-in page after signing out. Acceptance rechecks the inviter's authority and available clinician seats.

### 3. Returning user signing in

```mermaid
flowchart TD
  A[Enter email and password] --> B{MFA enabled?}
  B -->|Yes| C[Enter authenticator or recovery code]
  B -->|No| D[Sign in]
  C --> D
  D --> E[Load practice membership]
  E --> F[Open workspace]
  F --> G[Switch between practices you belong to]
```

Switching practices changes the applicable permissions and visible records. Patients and clinical records are not automatically shared between practices. MFA recovery codes are single-use.

### 4. Signed-in user creating another practice

```mermaid
flowchart TD
  A[Open practice bar] --> B[Enter New practice name]
  B --> C[Click Create practice]
  C --> D[Create separate practice and simulated SOLO trial]
  D --> E[Creator receives management permission]
  E --> F[Switch to the new practice]
```

**Create practice is currently visible to signed-in practice users, including reception users.** It is not restricted to the platform owner or existing administrators. A clinician creator remains a clinician with management permission; a non-clinician creator becomes an administrator in the new practice. This grants no additional authority in other practices or platform administration.

### Development limitations and recovery

- Registration without a practice name is intended for invitation-based joining. A dedicated “no practice yet—create one or accept an invitation” journey is not established.
- Verification, invitation and password-reset messages go to the local development mailbox, not real email inboxes. Run `pnpm dev:mailbox` from the repository root, open the relevant link and complete the displayed action.
- To recover an account, request a reset link, open it from the local mailbox and enter a new password plus an authenticator or recovery code if MFA is enabled. A successful reset revokes existing sessions.
- Subscriptions are simulated; creating a practice does not charge anyone. Use synthetic data only. Clinical previews and prints remain marked **DEMO — NOT FOR CLINICAL USE**.

See the [onboarding runbook](Documentation/Project/ONBOARDING_RUNBOOK.md) for startup, verification, invitations, MFA and recovery instructions, and the [SaaS runbook](Documentation/Project/SAAS_RUNBOOK.md) for practice workflows.

## Packaged local testing

TASK-027 adds a complete Docker Compose environment with a built frontend, non-root API and persistent PostgreSQL `mcclinic`. LocalStack is optional and not required. Follow the [packaged runbook](Documentation/Project/PACKAGED_RUNBOOK.md) for startup, synthetic login, mailbox, health checks, backups and verification. The default local address is http://127.0.0.1:8080/clinic. This remains synthetic development; public staging/production are not enabled.

## Lint and formatting

GitHub Verify runs an explicit `pnpm lint` step and checks changed supported files with pinned Prettier. Existing `pnpm check` and regression steps remain. Formatting is adopted when files change; unchanged legacy files are not mass-reformatted. CI reports errors and never writes fixes.

- Check specific files: `pnpm format:check path/to/file.ts`
- Format specific files: `pnpm format path/to/file.ts`
- Check committed changes against a base: `FORMAT_BASE=$(git rev-parse master) pnpm format:changed`

The changed-file check uses the merge base of the PR base/push predecessor and HEAD. For a new branch push, it uses the remote default branch; when that is HEAD, it checks the previous commit. A repository with no parent/base must supply an existing base commit. Missing base history fails rather than silently skipping checks. Fetch full history locally when needed. This command checks committed file selection against working-tree content; use a clean checkout to reproduce CI exactly. Generated contracts, lockfile, starter history and exported artifact evidence are excluded. Avoid passing `.` to the write command unless you intend to format all supported files.

## Dotenv and infrastructure tooling — current development setup

Use the repository-root `.env.example` for optional local dotenv configuration; existing shell variables take precedence. See [environment setup](Documentation/Project/ENVIRONMENT_CONFIGURATION.md) for safe setup, commands and the local/cloud boundary.

A native [Terraform staging candidate](infrastructure/terraform/README.md) now sits alongside the preserved CloudFormation templates. Run `pnpm test:infrastructure` for the TypeScript policy checks; Python is no longer needed for these custom checks. Original Python/cfn-lint files remain optional for legacy CloudFormation validation. Terraform verification uses mocked providers; no AWS apply, spending or production release is authorized.
