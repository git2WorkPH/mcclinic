import { onboardingUseCases } from "./modules/onboarding/application/onboarding.js";
import { onboardingStore } from "./modules/onboarding/infrastructure/store.js";
import type { Delivery } from "./modules/onboarding/infrastructure/mailbox.js";
export type { Delivery } from "./modules/onboarding/infrastructure/mailbox.js";
import {
  persistence,
  type Database,
} from "./infrastructure/prisma/database.js";
import { identityUseCases } from "./modules/identity/application/identity.js";
import { localIdentity } from "./modules/identity/infrastructure/local-identity.js";
import { patientUseCases } from "./modules/patient/application/patients.js";
import { consultationUseCases } from "./modules/consultation/application/consultations.js";
import { documentUseCases } from "./clinical-document/application/documents.js";
import { htmlRenderer } from "./clinical-document/infrastructure/html-renderer.js";
import { appointmentUseCases } from "./modules/appointment/application/appointments.js";
import {
  historyUseCases,
  type HistoryEntry,
} from "./modules/history/application/history.js";
import { validatePrescription } from "./modules/prescription/application/validation.js";
import { validateCertificate } from "./modules/medical-certificate/application/validation.js";
import { authorize, type Actor } from "./application/context.js";
import type { PrescriptionContent } from "./modules/prescription/domain/prescription.js";
import type { CertificateContent } from "./modules/medical-certificate/domain/certificate.js";
export function composeMvp(database: Database, delivery?: Delivery) {
  const db = persistence(database),
    clock = { now: () => new Date().toISOString() };
  const patients = patientUseCases(db, clock),
    consultations = consultationUseCases(db);
  const documents = documentUseCases(
    db,
    (kind, content) =>
      kind === "PRESCRIPTION"
        ? validatePrescription(content as PrescriptionContent)
        : validateCertificate(content as CertificateContent),
    htmlRenderer,
  );
  const history = historyUseCases({
    async entries(actor, patientId) {
      const [encounters, docs] = await Promise.all([
        consultations.list(actor, patientId),
        documents.list(actor, patientId),
      ]);
      const entries: HistoryEntry[] = [];
      for (const encounter of encounters) {
        entries.push({
          id: "encounter:" + encounter.id,
          type: "CONSULTATION",
          occurredAt: encounter.occurredAt,
          recordedAt: encounter.occurredAt,
          summary: encounter.state,
          version: encounter.version,
          sourceId: encounter.id,
        });
        for (const note of await consultations.revisions(actor, encounter.id))
          entries.push({
            id: "note:" + note.id,
            type: "NOTE",
            occurredAt: encounter.occurredAt,
            recordedAt: note.recordedAt,
            summary: note.text,
            version: note.version,
            sourceId: encounter.id,
          });
      }
      for (const doc of docs)
        for (const revision of await documents.revisions(actor, doc.id))
          entries.push({
            id: "document:" + revision.id,
            type: doc.kind,
            occurredAt: revision.recordedAt,
            recordedAt: revision.recordedAt,
            summary: `${revision.state}${revision.reason ? " · " + revision.reason : ""}`,
            version: revision.version,
            sourceId: doc.id,
          });
      return entries;
    },
  });
  return {
    onboarding: onboardingUseCases(onboardingStore(database, delivery)),
    identity: identityUseCases(localIdentity(database)),
    patients,
    consultations,
    documents,
    appointments: appointmentUseCases(db, clock),
    history,
    directory(actor: Actor | null) {
      const a = authorize(actor, "directory");
      return db.read(a, "directory.read", "providers", (u) => u.directory());
    },
    audits(actor: Actor | null, offset: number, limit: number) {
      const a = authorize(actor, "audit");
      return db.read(a, "audit.read", "audit", (u) =>
        u.auditPage(offset, limit),
      );
    },
  };
}
export type MvpServices = ReturnType<typeof composeMvp>;
