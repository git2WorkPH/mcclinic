# Project Scope

## In scope — Initial product

### Patient management

- Register a new patient.
- View patient profile.
- Update permitted patient demographic/contact information.
- Search for a patient.
- Browse a patient's clinical history.
- Associate appointments, encounters, prescriptions, certificates, and future clinical records with the patient.

### Consultation / Clinical encounter

- Start a consultation/encounter for a patient.
- Record consultation notes.
- Record consultation date/time.
- Associate the consultation with the responsible healthcare provider.
- View previous consultations.
- Browse patient history chronologically.
- Preserve historical clinical records appropriately.

Detailed clinical coding, diagnosis structures, observations, vitals, templates, and specialty-specific forms require separate requirements before implementation.

### Prescription

- Create a prescription for a patient.
- Associate a prescription with an encounter where applicable.
- Record medication details and directions.
- Record prescribing provider.
- Record issue date/time.
- View previous prescriptions.
- Produce a print-ready prescription.
- Print or export the prescription using the supported platform workflow.

Medication databases, drug-interaction checking, electronic prescribing networks, controlled-drug workflows, and pharmacy transmission are not automatically included.

### Medical certificate

- Create a medical certificate.
- Associate the certificate with a patient.
- Associate it with a consultation where applicable.
- Record issuing healthcare provider.
- Record issue date.
- Record certificate-specific dates/details.
- View previously issued certificates.
- Produce a print-ready certificate.
- Print or export the certificate using the supported platform workflow.

Jurisdiction-specific wording and regulatory requirements must be defined separately.

### Appointment booking

- Create an appointment.
- Select patient.
- Select provider where applicable.
- Record appointment date/time.
- Record relevant appointment status.
- Reschedule an appointment.
- Cancel an appointment.
- Browse appointments by relevant date/provider/patient views.

### Check-in

- Identify an arriving patient.
- Find the associated appointment.
- Mark the patient as checked in.
- Record check-in time.
- Make check-in status available to authorized clinic users.

### Authentication and authorization

- Authenticate application users.
- Support clinic staff roles and permissions.
- Restrict clinical functionality according to authorization.
- Enforce authorization on the backend.
- Maintain appropriate session security.

### Auditability

Provide an architectural foundation for auditing clinically meaningful and security-sensitive actions.

The exact audit event catalogue will be defined as requirements are refined.

### Shared/common packages

Provide reusable TypeScript packages for appropriate capabilities shared by frontend and backend.

Potential shared areas:

- domain concepts;
- identifiers/value objects;
- validation;
- error contracts;
- common utilities;
- GraphQL contracts;
- test helpers.

Framework-specific or infrastructure-specific concerns must remain within their owning application/layer.

### Developer platform

- TypeScript
- React Native
- GraphQL
- Express
- PostgreSQL
- Prisma
- pnpm
- Oxlint
- Docker
- Clean Architecture
- Monorepo structure

### Testing

Every feature must include appropriate verification based on its requirements.

Requirements-driven implementation must review existing tests and classify them as:

- KEEP
- ADD
- UPDATE
- SPLIT
- REMOVE

Tests may only be removed when removal is explicitly justified and approved.

## Out of scope — Initial product

Unless promoted through an approved requirement, the following are not part of the initial release:

- patient-facing portal;
- patient-facing mobile application;
- telehealth/video consultation;
- billing;
- payment processing;
- insurance claims;
- Medicare/private-health claiming integrations;
- pharmacy integration;
- electronic prescription transmission;
- medication interaction database;
- medication inventory;
- stock management;
- clinical decision support;
- AI-generated diagnosis;
- AI-generated prescriptions;
- AI-generated medical certificates;
- laboratory-result ingestion;
- laboratory-provider integration;
- radiology/imaging integration;
- DICOM/PACS;
- hospital admission/discharge workflows;
- inpatient bed management;
- nursing workflows;
- operating-theatre workflows;
- referral network integration;
- secure external clinical messaging;
- government healthcare integrations;
- accounting integration;
- payroll;
- multi-tenant SaaS behavior unless separately approved;
- offline-first synchronization unless separately approved.

## Future possibilities

### Laboratory requests

Potential future capabilities:

- create a pathology/laboratory request;
- associate request with patient and consultation;
- select requested tests;
- print laboratory request;
- electronically send request;
- receive laboratory results;
- associate results with patient;
- alert provider when results are received;
- mark results as reviewed;
- support external laboratory providers.

The initial architecture must not prevent future introduction of these capabilities.

### Additional clinical documents

Potential future documents:

- referrals;
- specialist letters;
- pathology requests;
- radiology requests;
- care plans;
- work-capacity certificates;
- other jurisdiction-specific forms.

### Additional scheduling

Potential future capabilities:

- recurring appointments;
- wait lists;
- reminders;
- SMS/email notifications;
- online patient booking;
- provider availability;
- room/resource scheduling;
- walk-in queue management.

### Clinical interoperability

Potential future standards/integrations:

- FHIR;
- HL7;
- external EHR systems;
- pathology/laboratory systems;
- pharmacy systems;
- national healthcare infrastructure.

Each requires its own requirements and architecture assessment.

### Reporting

Potential future:

- operational clinic reports;
- provider activity reports;
- patient population reporting;
- clinical quality reporting;
- audit reporting.

## Scope rule

Work outside approved scope must become a finding, requirement, or proposed task.

It must not be silently implemented.

Future possibilities do not constitute implementation approval.

A technology being mentioned in this scope does not authorize unrelated capabilities associated with that technology.

Removal of an existing capability, behavior, test, API field, persisted field, or supported workflow requires explicit approval and a change-justification record.
