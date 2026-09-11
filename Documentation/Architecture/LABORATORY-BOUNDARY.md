# Future laboratory module boundary
TASK-015 · REQ-FOUND-009 v0.1 · ADR-005
This is an internal design sketch, not an implemented API, schema, vendor contract or clinical workflow.

## Ownership and dependency direction
A future laboratory module owns request/result lifecycle, provider adapters and delivery reconciliation. Patient owns identity; consultation owns encounter attribution. Laboratory application code calls inward-defined ports. Composition connects these to authorized public application interfaces of patient and consultation. No module accesses another module's Prisma model/table.

Conceptual interfaces, to refine only when future lab requirements are approved:

```typescript
// Design example only; not a runtime package or interoperability standard.
interface ClinicalReferenceLookup {
  resolvePatient(context: ActorContext, patientId: PatientId): Promise<PatientReference>;
  resolveEncounter(context: ActorContext, encounterId: EncounterId): Promise<EncounterReference>;
}
interface LaboratoryDelivery {
  submit(context: DeliveryContext, request: ApprovedRequestSnapshot): Promise<DeliveryReceipt>;
}
```

`ActorContext`, identifiers, snapshot fields and receipts are placeholders for future approved contracts. PatientReference returns the minimum approved identity fields and a stable internal identifier/version. EncounterReference establishes patient/provider association with authorization. LaboratoryDelivery is implemented by a vendor-specific infrastructure adapter; vendor identifiers, protocol payloads and credentials never become patient/consultation domain dependencies.

## Request scenario walkthrough
1. An authorized future actor selects patient and encounter; lookups verify access and that the encounter belongs to that patient. Denial yields no outbound request.
2. The future lab use case creates an attributable snapshot under its own approved lifecycle, audit catalogue and transaction rules. Clinical test selection, consent and ordering entitlement are unresolved future requirements.
3. If delivery crosses transaction boundaries, persist an outbox record with clinical/audit state atomically. Sending occurs after commit; no best-effort send inside a database transaction.
4. Map stable internal identities to the chosen provider's identities in the adapter-owned mapping. Missing/ambiguous mappings go to reconciliation; never guess a patient match.
5. Use provider-supported idempotency and a stable delivery correlation ID. An acknowledgement means only what the approved provider protocol states; a transport timeout is not proof of failure or success.
6. Retry only according to an approved policy; unknown delivery outcome is reconciled before creating a duplicate order. Credentials come from an approved secret store, with no credential/clinical payload logging.

## Result scenario walkthrough
1. A future inbound adapter authenticates the sender and validates the protocol payload before mapping to an internal contract.
2. Match provider request/patient references through the explicit mapping. Unknown or ambiguous patient/order identity is quarantined for authorized reconciliation; no automatic reassignment.
3. Deduplicate with the provider's delivery/result version identifiers. Result corrections retain previous provenance according to future approved clinical rules.
4. Persist result/version and required audit atomically within laboratory ownership. Patient history can later consume an authorized summary interface; it does not acquire result write ownership.
5. Provider review, alerts and acknowledgement semantics remain separate future requirements, not implied by receiving data.

## Review evidence and unresolved obligations
- REQ-FOUND-009 AC-01: both scenarios keep identity/encounter access behind explicit application interfaces and vendor code in adapters.
- AC-02: identity mapping, credentials, idempotency, acknowledgements, retries, reconciliation, authorization and audit ownership are addressed above as future obligations.
- AC-03: this task adds only this design document and traceability records. No lab runtime files, fields, endpoint, SDK, request or result workflow exist.
- Future decisions: clinical request fields/tests, vendor/protocol/version, legal/consent policy, retention, entitlement, delivery guarantees, reconciliation ownership and result review workflow. No claim of FHIR/HL7/provider compatibility.
