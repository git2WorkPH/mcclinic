import type { Actor } from "./context.js";
import type {
  Patient,
  PatientInput,
  Page,
} from "../modules/patient/domain/patient.js";
import type {
  Consultation,
  NoteRevision,
} from "../modules/consultation/domain/consultation.js";
import type {
  ClinicalDocument,
  DocumentRevision,
  DocumentKind,
  DocumentContent,
} from "../clinical-document/domain/document.js";
import type {
  Appointment,
  AppointmentInput,
} from "../modules/appointment/domain/appointment.js";
export interface PatientRepository {
  get(id: string): Promise<Patient | null>;
  search(query: string, offset: number, limit: number): Promise<Page<Patient>>;
  create(input: PatientInput): Promise<Patient>;
  update(id: string, expected: number, input: PatientInput): Promise<Patient>;
}
export interface ConsultationRepository {
  get(id: string): Promise<Consultation | null>;
  list(patientId: string): Promise<Consultation[]>;
  create(
    patientId: string,
    providerId: string,
    occurredAt: string,
  ): Promise<Consultation>;
  saveNote(
    id: string,
    expected: number,
    text: string,
    state: string,
    reason: string,
    actorId: string,
  ): Promise<Consultation>;
  close(id: string, expected: number): Promise<Consultation>;
  revisions(id: string): Promise<NoteRevision[]>;
}
export interface DocumentRepository {
  get(id: string): Promise<ClinicalDocument | null>;
  list(patientId: string): Promise<ClinicalDocument[]>;
  create(input: {
    kind: DocumentKind;
    patientId: string;
    consultationId: string | null;
    authorId: string;
    content: DocumentContent;
  }): Promise<ClinicalDocument>;
  revise(
    id: string,
    expected: number,
    content: DocumentContent,
    state: string,
    revision: Omit<
      DocumentRevision,
      "id" | "documentId" | "version" | "recordedAt" | "issueSnapshot" | "renderedHtml"
    >,
  ): Promise<ClinicalDocument>;
  revisions(id: string): Promise<DocumentRevision[]>;
}
export interface AppointmentRepository {
  get(id: string): Promise<Appointment | null>;
  list(filter: {
    from: string;
    to: string;
    providerId?: string;
    patientId?: string;
  }): Promise<Appointment[]>;
  create(input: AppointmentInput, actorId: string): Promise<Appointment>;
  change(
    id: string,
    expected: number,
    patch: Partial<Appointment>,
    actorId: string,
  ): Promise<Appointment>;
  history(
    id: string,
  ): Promise<
    {
      version: number;
      snapshot: Appointment;
      actorId: string;
      recordedAt: string;
    }[]
  >;
}
export interface Audit {
  id: string;
  actorId: string | null;
  action: string;
  subjectId: string;
  outcome: string;
  version: number | null;
  correlationId: string;
  recordedAt: string;
}
export interface UnitOfWork {
  patients: PatientRepository;
  consultations: ConsultationRepository;
  documents: DocumentRepository;
  appointments: AppointmentRepository;
  references: {
    patient(id: string): Promise<Patient | null>;
    clinician(id: string): Promise<Actor | null>;
    encounter(id: string): Promise<Consultation | null>;
  };
  directory(): Promise<Actor[]>;
  audit(event: {
    actorId: string | null;
    action: string;
    subjectId: string;
    outcome: string;
    version?: number;
    correlationId: string;
  }): Promise<void>;
  auditPage(offset: number, limit: number): Promise<Audit[]>;
}
export interface Persistence {
  read<T>(
    actor: Actor,
    action: string,
    subject: string,
    run: (unit: UnitOfWork) => Promise<T>,
  ): Promise<T>;
  write<T>(
    actor: Actor,
    key: string,
    command: unknown,
    action: string,
    run: (unit: UnitOfWork) => Promise<T>,
  ): Promise<T>;
}
export interface Runtime {
  now(): string;
}
