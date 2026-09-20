# Development MVP assumptions — v0.2-MVP

Authority: owner instruction "I authorize you to make reasonable, reversible product and technical decisions without asking me to resolve every open finding first." Scope: synthetic data, local development, one clinic, desktop web through React Native Web. This is not approved production/clinical/legal policy.

## Identity and permissions

Local accounts provisioned by an explicit seed command with operator-supplied demo password (minimum 12 characters); no public registration/default password. Passwords use salted scrypt. Random opaque bearer sessions are stored hashed, expire after 8 hours, and are revocable on logout. Browser holds token in sessionStorage for this local-only MVP. Authentication failures are generic and rate limited. Loopback-only binding and same-origin JSON API are required; deployment needs separate security review.

- Reception: patient demographics/search, provider list, appointment booking/reschedule/cancel/check-in. No clinical notes/history/documents/audit.
- Clinician: reception capabilities plus consultations, notes, clinical history, prescriptions/certificates and their preview/print. May write/finalize/amend only own encounters/documents; all clinicians may read clinical history within this one clinic.
- Administrator: user/provider directory, patient demographics/search, scheduling and audit access. No implicit clinical read/write/print. Accounts are seeded locally; no role management UI is assumed.
  No data scope beyond one synthetic clinic is claimed. Deny absent grants at every application boundary, not only GraphQL/UI. No supplied client role/author is trusted.

## Patient and clinical defaults

Patient: stable UUID, required given/family names and YYYY-MM-DD birth date (not future), optional phone/email/address. Exact case-insensitive name + date-of-birth duplicates are rejected for review; no merging/deletion. Search is case-insensitive names, exact/prefix UUID and contact text with explicit selection; pages are 20 (max 100), stable name/ID order. Stale profile version edits fail.
Consultation: patient, authenticated responsible clinician, clinical timestamp (default now), OPEN/CLOSED state. A single note aggregate per consultation supports draft saves, finalization and linked reasoned amendments with every saved revision retained. Plain text, explicit Save; no autosave claim. Finalized records never silently overwrite. Closing an encounter requires a finalized note. UTC storage; browser-local display explicitly labelled with timezone.
Documents: distinct prescription and certificate feature ownership, using a common versioned document mechanism. DRAFT → ISSUED; edits to issued documents require a reasoned amendment producing a new issued version. Only author may change/issue; issuing captures patient/provider identity at that version. Requests use actor-scoped idempotency keys and content fingerprints; changed reuse fails. History/reprint can select older versions.
Prescription items: medication name, strength, dose, route, frequency, duration, quantity and repeats (0–12), all plain entered text except bounded integer repeats; directions required. No drug catalogue, decision support, entitlement verification or legal assertion.
Certificate: title, statement, start/end dates with end >= start; no inferred diagnosis or fitness claim. Templates and field constraints are configurable MVP configuration. All outputs visibly say **DEMO — NOT FOR CLINICAL USE**, include version/issue date/patient/issuer and generic clinic label; no simulated legal signature or licence credential.

## Scheduling

Required patient and clinician, start/end instants, duration 5 minutes–8 hours. BOOKED → CHECKED_IN or CANCELLED; reschedule only BOOKED, cancellation only BOOKED with reason. No deletion, reminders, walk-ins or availability calendar. Reject provider OR patient overlapping active bookings at the database boundary, including concurrent attempts. Adjacent bookings are allowed. Check-in confirms patient ID, allows repeated retry without duplicate arrival, no reversal in this MVP. Reschedule/cancel use expected version and idempotency key. Date/provider/patient filters supported.

## Persistence, audit and printing

PostgreSQL/Prisma adapters, additive migrations and foreign keys. Explicit transactions include clinical change, immutable version, idempotency receipt and audit. Optimistic concurrency rejects stale writes; scheduling exclusion constraints enforce races. Audit/version/history tables reject UPDATE/DELETE via database triggers. Application exposes no deletion endpoints. Actor/action/subject/time/outcome/version/correlation only, no clinical body/password/token in audit/logs. Read/search/print events record action/subject without query text or sensitive content. Audit failures roll back mutations. Transaction failure and denied actions use independent minimal failure audit where possible.
Local backups use pg_dump, restore into a separate empty database only; verify a synthetic round trip. No expiry deletion jobs or retention durations. No durable rendered artifact cache: protected preview renders a selected issued snapshot to escaped HTML, with print CSS and visible provenance. Browser print request/cancel/after-dialog outcome is recorded without claiming paper printed. PDF export is browser Print to PDF. Native support and official layouts remain future validation.

## MVP acceptance versus production

The v0.1 requirements/history remain intact. v0.2-MVP acceptance applies the above concrete defaults to all task criteria and requires actual persistent UI/API workflows plus denial/concurrency/audit/amendment/print tests. Mark a task Completed (MVP) only after its evidence passes; completion is not production readiness. FIND-001–007 remain Open for production policy/validation; no jurisdictional compliance finding is falsely resolved. TASK-001/015 already completed remain preserved.

## Search refinement — 2026-09-11

The implemented MVP identifier search requires the complete UUID; partial identifier matching is deferred. Name tokens match given/family names case-insensitively, and contact text remains searchable. This narrows the earlier proposed exact/prefix default while retaining its decision history.

## v0.3 development SaaS — 2026-09-11

Owner authorizes ordered TASK-020–023, synthetic data only. Practice owns records/subscription; users can hold different membership roles across practices. Default practice preserves v0.2 data. Administrators manage membership/branding/templates/subscription; clinician-only documents/notes and role-specific exports remain enforced. No platform admin implicit access.
Branding: name/contact/address, optional small PNG/JPEG data-URL logo (no remote image fetching or SVG), predefined accessible accent colors. Templates: plain-text heading/body/footer with allowlisted tokens, STANDARD/COMPACT layouts and optional patient address; required clinical identity/medication content/demo marker cannot be hidden. Missing referenced values block issue; age computed at issue in UTC calendar dates. Published versions and issued snapshots retained.
Plans: SOLO 1 clinician, TEAM 5 clinicians. New practice 14-day trial; active remains active until simulated transition, past-due 7-day grace; expiry becomes restricted at access time. Seeded default practice starts TEAM active for compatibility. Restricted preserves authorized read/print/export, blocks new record writes. Simulated plan/state changes only; no money. Export is scoped JSON: clinician clinical+demographic records, reception/admin demographic+schedule; admin also audit/config, never clinical content by billing privilege. No offline sync, purge or data sharing.

Solo doctor refinement: practice creators receive an explicit membership management grant. A clinician creator retains the clinician role and uses one clinician seat; ordinary administrators still cannot access clinical content. Server revalidates this grant and retains at least one active practice manager. Global session/login audit is kept in an internal practice with no memberships, outside clinic exports.

## v0.4 onboarding — 2026-09-12

Owner authorizes TASK-025 before TASK-024. Local synthetic registration/verification, optional initial practice, staff invites, reset and TOTP/recovery codes. Verification 24 hours, reset 30 minutes, invites 7 days; passwords 12–128 characters, bounded names/email, generic account responses and persistent rate counters. Local-only captured messages; no SMTP. MFA optional enrollment for development; enabled users must satisfy it. Canonical database name mcclinic replaces new ehr_mvp/ehr_dev defaults; old records/databases are preserved via safe rename, not reset. ADR-007 records provisional security defaults; production findings stay Open.

# Packaged local runtime — owner-approved TASK-027, 2026-09-14

The synthetic MVP can additionally run as separate built-web and API containers with an isolated persistent PostgreSQL mcclinic instance. Only web publishes a loopback host port; existing local startup remains supported. New secrets are generated only if absent, local mailbox/MFA state survives restart, and migration/seed commands are explicit. LocalStack is optional future AWS adapter testing and is not required or installed. Public staging/production values fail closed pending separate approval and secret/delivery controls. FIND-013 security advisories remain unresolved; local packaging completion does not establish production readiness. See PACKAGED_RUNBOOK.md and ADR-010.

## Release preparation defaults — owner-approved sequence, verified locally 2026-09-20

TASK-035 and TASK-029 local work retains synthetic-only scope. Owner explicitly chose “Prepare locally; no AWS spending yet”. No AWS apply, external identity mail, live billing or real data is authorized. Runtime separation and opt-in durable delivery/cookie/key-version controls are local implementation progress, not production policy resolution. See IDENTITY_READINESS.md and TASK-029 acceptance for modes, tests and remaining live-provider gates. TASK-028 is prepared locally next; TASK-030 deployed evidence and TASK-031 launch acceptance cannot be inferred from local tests.

## Synthetic staging preparation — TASK-028 continuation, 2026-09-20

ADR-015 adds a separate HTTPS/cookie-only staging composition root without relaxing local packaged guards. Explicit verified DB CA; migration/runtime database roles; retained private encrypted EFS synthetic sink; sealed read-only operator retrieval. App stack defaults to zero tasks, no KMS network activation and zero shared caching. Parameters do not constitute authorization. All work is locally prepared only; no cloud account action or external message. Migration image findings, account-specific IAM/KMS/RDS/EFS verification, updated cost/anomaly/operator alert decisions and deployed TASK-029/030 evidence remain release blockers. See infrastructure/aws/STAGING_RELEASE_RUNBOOK.md and TASK-028 acceptance. No automatic record deletion or retention purge.
