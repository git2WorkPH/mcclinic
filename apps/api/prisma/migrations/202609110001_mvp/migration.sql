-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "revokedAt" TIMESTAMPTZ,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" UUID NOT NULL,
    "givenName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "identityKey" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "providerId" UUID NOT NULL,
    "occurredAt" TIMESTAMPTZ NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'OPEN',
    "version" INTEGER NOT NULL DEFAULT 1,
    "noteState" TEXT NOT NULL DEFAULT 'DRAFT',
    "noteVersion" INTEGER NOT NULL DEFAULT 0,
    "noteText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteRevision" (
    "id" UUID NOT NULL,
    "consultationId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "previousVersion" INTEGER,
    "recordedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoteRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalDocument" (
    "id" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "patientId" UUID NOT NULL,
    "consultationId" UUID,
    "authorId" UUID NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRevision" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "patientSnapshot" JSONB NOT NULL,
    "issuerSnapshot" JSONB NOT NULL,
    "templateVersion" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "previousVersion" INTEGER,
    "recordedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" UUID NOT NULL,
    "patientId" UUID NOT NULL,
    "providerId" UUID NOT NULL,
    "startsAt" TIMESTAMPTZ NOT NULL,
    "endsAt" TIMESTAMPTZ NOT NULL,
    "timeZone" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'BOOKED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "checkedInAt" TIMESTAMPTZ,
    "checkedInBy" UUID,
    "cancellationReason" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentChange" (
    "id" UUID NOT NULL,
    "appointmentId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "actorId" UUID NOT NULL,
    "recordedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" UUID NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "version" INTEGER,
    "correlationId" TEXT NOT NULL,
    "recordedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandReceipt" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommandReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_identityKey_key" ON "Patient"("identityKey");

-- CreateIndex
CREATE INDEX "Patient_familyName_givenName_id_idx" ON "Patient"("familyName", "givenName", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_id_patientId_key" ON "Consultation"("id", "patientId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteRevision_consultationId_version_key" ON "NoteRevision"("consultationId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentRevision_documentId_version_key" ON "DocumentRevision"("documentId", "version");

-- CreateIndex
CREATE INDEX "Appointment_startsAt_id_idx" ON "Appointment"("startsAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentChange_appointmentId_version_key" ON "AppointmentChange"("appointmentId", "version");

-- CreateIndex
CREATE INDEX "AuditEvent_recordedAt_id_idx" ON "AuditEvent"("recordedAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "CommandReceipt_actorId_key_key" ON "CommandReceipt"("actorId", "key");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteRevision" ADD CONSTRAINT "NoteRevision_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalDocument" ADD CONSTRAINT "ClinicalDocument_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalDocument" ADD CONSTRAINT "ClinicalDocument_consultationId_patientId_fkey" FOREIGN KEY ("consultationId", "patientId") REFERENCES "Consultation"("id", "patientId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalDocument" ADD CONSTRAINT "ClinicalDocument_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRevision" ADD CONSTRAINT "DocumentRevision_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "ClinicalDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChange" ADD CONSTRAINT "AppointmentChange_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- MVP integrity invariants; these create constraints and never remove data.
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE "User" ADD CONSTRAINT "user_role" CHECK ("role" IN ('CLINICIAN','RECEPTION','ADMINISTRATOR'));
ALTER TABLE "Patient" ADD CONSTRAINT "patient_version" CHECK ("version" > 0);
ALTER TABLE "Consultation" ADD CONSTRAINT "consultation_states" CHECK ("state" IN ('OPEN','CLOSED') AND "noteState" IN ('DRAFT','FINALIZED') AND "version">0 AND "noteVersion">=0);
ALTER TABLE "ClinicalDocument" ADD CONSTRAINT "document_states" CHECK ("kind" IN ('PRESCRIPTION','CERTIFICATE') AND "state" IN ('DRAFT','ISSUED') AND "version">0);
ALTER TABLE "Appointment" ADD CONSTRAINT "appointment_states" CHECK ("state" IN ('BOOKED','CHECKED_IN','CANCELLED') AND "endsAt">="startsAt"+interval '5 minutes' AND "endsAt"<="startsAt"+interval '8 hours');
ALTER TABLE "Appointment" ADD CONSTRAINT "provider_no_overlap" EXCLUDE USING gist ("providerId" WITH =, tstzrange("startsAt","endsAt",'[)') WITH &&) WHERE ("state" <> 'CANCELLED');
ALTER TABLE "Appointment" ADD CONSTRAINT "patient_no_overlap" EXCLUDE USING gist ("patientId" WITH =, tstzrange("startsAt","endsAt",'[)') WITH &&) WHERE ("state" <> 'CANCELLED');
CREATE FUNCTION reject_ehr_history_change() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Historical EHR rows are append-only'; END $$;
CREATE TRIGGER audit_immutable BEFORE UPDATE OR DELETE ON "AuditEvent" FOR EACH ROW EXECUTE FUNCTION reject_ehr_history_change();
CREATE TRIGGER notes_immutable BEFORE UPDATE OR DELETE ON "NoteRevision" FOR EACH ROW EXECUTE FUNCTION reject_ehr_history_change();
CREATE TRIGGER documents_immutable BEFORE UPDATE OR DELETE ON "DocumentRevision" FOR EACH ROW EXECUTE FUNCTION reject_ehr_history_change();
CREATE TRIGGER appointment_history_immutable BEFORE UPDATE OR DELETE ON "AppointmentChange" FOR EACH ROW EXECUTE FUNCTION reject_ehr_history_change();
CREATE TRIGGER receipt_immutable BEFORE UPDATE OR DELETE ON "CommandReceipt" FOR EACH ROW EXECUTE FUNCTION reject_ehr_history_change();
