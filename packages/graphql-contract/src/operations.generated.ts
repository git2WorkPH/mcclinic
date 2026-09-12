/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as SchemaTypes from './server.generated.js';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AccountRegistrationInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  practiceName: Scalars['String']['input'];
};

export type Appointment = {
  __typename?: 'Appointment';
  cancellationReason: Scalars['String']['output'];
  checkedInAt?: Maybe<Scalars['String']['output']>;
  checkedInBy?: Maybe<Scalars['ID']['output']>;
  endsAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  patientId: Scalars['ID']['output'];
  providerId: Scalars['ID']['output'];
  startsAt: Scalars['String']['output'];
  state: Scalars['String']['output'];
  timeZone: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type AppointmentChange = {
  __typename?: 'AppointmentChange';
  actorId: Scalars['ID']['output'];
  recordedAt: Scalars['String']['output'];
  snapshotJson: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type AppointmentInput = {
  endsAt: Scalars['String']['input'];
  patientId: Scalars['ID']['input'];
  providerId: Scalars['ID']['input'];
  startsAt: Scalars['String']['input'];
  timeZone: Scalars['String']['input'];
};

export type AuditEvent = {
  __typename?: 'AuditEvent';
  action: Scalars['String']['output'];
  actorId?: Maybe<Scalars['ID']['output']>;
  correlationId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  outcome: Scalars['String']['output'];
  recordedAt: Scalars['String']['output'];
  subjectId: Scalars['String']['output'];
  version?: Maybe<Scalars['Int']['output']>;
};

export type CertificateInput = {
  endsOn: Scalars['String']['input'];
  startsOn: Scalars['String']['input'];
  statement: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type ClinicalDocument = {
  __typename?: 'ClinicalDocument';
  authorId: Scalars['ID']['output'];
  consultationId?: Maybe<Scalars['ID']['output']>;
  contentJson: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kind: Scalars['String']['output'];
  patientId: Scalars['ID']['output'];
  state: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type Consultation = {
  __typename?: 'Consultation';
  id: Scalars['ID']['output'];
  noteState: Scalars['String']['output'];
  noteText: Scalars['String']['output'];
  noteVersion: Scalars['Int']['output'];
  occurredAt: Scalars['String']['output'];
  patientId: Scalars['ID']['output'];
  providerId: Scalars['ID']['output'];
  state: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type DocumentRevision = {
  __typename?: 'DocumentRevision';
  authorId: Scalars['ID']['output'];
  contentJson: Scalars['String']['output'];
  documentId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  issuerName: Scalars['String']['output'];
  patientName: Scalars['String']['output'];
  previousVersion?: Maybe<Scalars['Int']['output']>;
  reason: Scalars['String']['output'];
  recordedAt: Scalars['String']['output'];
  state: Scalars['String']['output'];
  templateVersion: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type HistoryEntry = {
  __typename?: 'HistoryEntry';
  id: Scalars['ID']['output'];
  occurredAt: Scalars['String']['output'];
  recordedAt: Scalars['String']['output'];
  sourceId: Scalars['ID']['output'];
  summary: Scalars['String']['output'];
  type: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type HistoryPage = {
  __typename?: 'HistoryPage';
  items: Array<HistoryEntry>;
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type LoginPayload = {
  __typename?: 'LoginPayload';
  actor: Viewer;
  token: Scalars['String']['output'];
};

export type MedicationInput = {
  dose: Scalars['String']['input'];
  duration: Scalars['String']['input'];
  frequency: Scalars['String']['input'];
  medication: Scalars['String']['input'];
  quantity: Scalars['String']['input'];
  repeats: Scalars['Int']['input'];
  route: Scalars['String']['input'];
  strength: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptPracticeInvitation: Scalars['Boolean']['output'];
  bookAppointment: Appointment;
  cancelAppointment: Appointment;
  checkIn: Appointment;
  closeConsultation: Consultation;
  confirmAccountMfa: Scalars['String']['output'];
  createCertificate: ClinicalDocument;
  createPractice: Scalars['String']['output'];
  createPrescription: ClinicalDocument;
  disableAccountMfa: Scalars['Boolean']['output'];
  invitePracticeMember: Scalars['Boolean']['output'];
  login: LoginPayload;
  logout: Scalars['Boolean']['output'];
  recordPrint: PrintReceipt;
  registerAccount: Scalars['Boolean']['output'];
  registerPatient: Patient;
  requestPasswordReset: Scalars['Boolean']['output'];
  rescheduleAppointment: Appointment;
  resendAccountVerification: Scalars['Boolean']['output'];
  resetAccountPassword: Scalars['Boolean']['output'];
  reviseCertificate: ClinicalDocument;
  revisePrescription: ClinicalDocument;
  saveNote: Consultation;
  savePracticeBranding: Scalars['String']['output'];
  savePracticeTemplate: Scalars['String']['output'];
  setPracticeMember: Scalars['String']['output'];
  simulateSubscription: Scalars['String']['output'];
  startAccountMfa: Scalars['String']['output'];
  startConsultation: Consultation;
  updatePatient: Patient;
  verifyAccount: Scalars['Boolean']['output'];
};


export type MutationAcceptPracticeInvitationArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationBookAppointmentArgs = {
  input: AppointmentInput;
  key: Scalars['String']['input'];
};


export type MutationCancelAppointmentArgs = {
  expected: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  key: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationCheckInArgs = {
  expected: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  key: Scalars['String']['input'];
  patientId: Scalars['ID']['input'];
};


export type MutationCloseConsultationArgs = {
  expected: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  key: Scalars['String']['input'];
};


export type MutationConfirmAccountMfaArgs = {
  code: Scalars['String']['input'];
};


export type MutationCreateCertificateArgs = {
  consultationId?: InputMaybe<Scalars['ID']['input']>;
  content: CertificateInput;
  key: Scalars['String']['input'];
  patientId: Scalars['ID']['input'];
};


export type MutationCreatePracticeArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreatePrescriptionArgs = {
  consultationId?: InputMaybe<Scalars['ID']['input']>;
  content: PrescriptionInput;
  key: Scalars['String']['input'];
  patientId: Scalars['ID']['input'];
};


export type MutationDisableAccountMfaArgs = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationInvitePracticeMemberArgs = {
  email: Scalars['String']['input'];
  role: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRecordPrintArgs = {
  id: Scalars['ID']['input'];
  key: Scalars['String']['input'];
  outcome: Scalars['String']['input'];
  version: Scalars['Int']['input'];
};


export type MutationRegisterAccountArgs = {
  input: AccountRegistrationInput;
};


export type MutationRegisterPatientArgs = {
  input: PatientInput;
  key: Scalars['String']['input'];
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type MutationRescheduleAppointmentArgs = {
  endsAt: Scalars['String']['input'];
  expected: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  key: Scalars['String']['input'];
  startsAt: Scalars['String']['input'];
  timeZone: Scalars['String']['input'];
};


export type MutationResendAccountVerificationArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetAccountPasswordArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationReviseCertificateArgs = {
  content: CertificateInput;
  expected: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  issue: Scalars['Boolean']['input'];
  key: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRevisePrescriptionArgs = {
  content: PrescriptionInput;
  expected: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  issue: Scalars['Boolean']['input'];
  key: Scalars['String']['input'];
  reason: Scalars['String']['input'];
};


export type MutationSaveNoteArgs = {
  expected: Scalars['Int']['input'];
  finalize: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
  key: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type MutationSavePracticeBrandingArgs = {
  expected: Scalars['Int']['input'];
  input: Scalars['String']['input'];
};


export type MutationSavePracticeTemplateArgs = {
  definition: Scalars['String']['input'];
  expected: Scalars['Int']['input'];
  kind: Scalars['String']['input'];
  publish: Scalars['Boolean']['input'];
};


export type MutationSetPracticeMemberArgs = {
  input: Scalars['String']['input'];
};


export type MutationSimulateSubscriptionArgs = {
  expected: Scalars['Int']['input'];
  plan: Scalars['String']['input'];
  state: Scalars['String']['input'];
};


export type MutationStartAccountMfaArgs = {
  password: Scalars['String']['input'];
};


export type MutationStartConsultationArgs = {
  key: Scalars['String']['input'];
  occurredAt: Scalars['String']['input'];
  patientId: Scalars['ID']['input'];
};


export type MutationUpdatePatientArgs = {
  expected: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  input: PatientInput;
  key: Scalars['String']['input'];
};


export type MutationVerifyAccountArgs = {
  token: Scalars['String']['input'];
};

export type NoteRevision = {
  __typename?: 'NoteRevision';
  authorId: Scalars['ID']['output'];
  consultationId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  previousVersion?: Maybe<Scalars['Int']['output']>;
  reason: Scalars['String']['output'];
  recordedAt: Scalars['String']['output'];
  state: Scalars['String']['output'];
  text: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type Patient = {
  __typename?: 'Patient';
  address: Scalars['String']['output'];
  birthDate: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  familyName: Scalars['String']['output'];
  givenName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  phone: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type PatientInput = {
  address: Scalars['String']['input'];
  birthDate: Scalars['String']['input'];
  email: Scalars['String']['input'];
  familyName: Scalars['String']['input'];
  givenName: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type PatientPage = {
  __typename?: 'PatientPage';
  items: Array<Patient>;
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PrescriptionInput = {
  directions: Scalars['String']['input'];
  items: Array<MedicationInput>;
};

export type PrintReceipt = {
  __typename?: 'PrintReceipt';
  id: Scalars['ID']['output'];
  version: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  accountMfaEnabled: Scalars['Boolean']['output'];
  appointmentHistory: Array<AppointmentChange>;
  appointments: Array<Appointment>;
  auditEvents: Array<AuditEvent>;
  consultations: Array<Consultation>;
  documentRevisions: Array<DocumentRevision>;
  documents: Array<ClinicalDocument>;
  history: HistoryPage;
  me?: Maybe<Viewer>;
  noteRevisions: Array<NoteRevision>;
  patient: Patient;
  patients: PatientPage;
  practiceExport: Scalars['String']['output'];
  practiceSettings: Scalars['String']['output'];
  practiceTemplates: Scalars['String']['output'];
  practices: Scalars['String']['output'];
  previewDocument: Scalars['String']['output'];
  previewPracticeTemplate: Scalars['String']['output'];
  providers: Array<Viewer>;
  systemStatus: SystemStatus;
};


export type QueryAppointmentHistoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAppointmentsArgs = {
  from: Scalars['String']['input'];
  patientId?: InputMaybe<Scalars['ID']['input']>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
  to: Scalars['String']['input'];
};


export type QueryAuditEventsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryConsultationsArgs = {
  patientId: Scalars['ID']['input'];
};


export type QueryDocumentRevisionsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDocumentsArgs = {
  patientId: Scalars['ID']['input'];
};


export type QueryHistoryArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  patientId: Scalars['ID']['input'];
};


export type QueryNoteRevisionsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPatientArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPatientsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  query?: Scalars['String']['input'];
};


export type QueryPreviewDocumentArgs = {
  id: Scalars['ID']['input'];
  version: Scalars['Int']['input'];
};


export type QueryPreviewPracticeTemplateArgs = {
  definition: Scalars['String']['input'];
  kind?: InputMaybe<Scalars['String']['input']>;
};

export type SystemStatus = {
  __typename?: 'SystemStatus';
  service: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type Viewer = {
  __typename?: 'Viewer';
  canManage?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type PatientFieldsFragment = { id: string, givenName: string, familyName: string, birthDate: string, phone: string, email: string, address: string, version: number, createdAt: string };

export type EncounterFieldsFragment = { id: string, patientId: string, providerId: string, occurredAt: string, state: string, version: number, noteState: string, noteVersion: number, noteText: string };

export type DocumentFieldsFragment = { id: string, kind: string, patientId: string, consultationId: string | null, authorId: string, state: string, version: number, contentJson: string, createdAt: string };

export type AppointmentFieldsFragment = { id: string, patientId: string, providerId: string, startsAt: string, endsAt: string, timeZone: string, state: string, version: number, checkedInAt: string | null, checkedInBy: string | null, cancellationReason: string };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { me: { id: string, name: string, role: string, canManage: boolean | null } | null };

export type SignInMutationVariables = Exact<{
  username: string;
  password: string;
  code?: string | null | undefined;
}>;


export type SignInMutation = { login: { token: string, actor: { id: string, name: string, role: string } } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { logout: boolean };

export type ProvidersQueryVariables = Exact<{ [key: string]: never; }>;


export type ProvidersQuery = { providers: Array<{ id: string, name: string, role: string }> };

export type PatientSearchQueryVariables = Exact<{
  query: string;
  offset: number;
  limit: number;
}>;


export type PatientSearchQuery = { patients: { total: number, offset: number, items: Array<{ id: string, givenName: string, familyName: string, birthDate: string, phone: string, email: string, address: string, version: number, createdAt: string }> } };

export type PatientRecordQueryVariables = Exact<{
  id: string;
}>;


export type PatientRecordQuery = { patient: { id: string, givenName: string, familyName: string, birthDate: string, phone: string, email: string, address: string, version: number, createdAt: string } };

export type RegisterPatientMutationVariables = Exact<{
  key: string;
  input: SchemaTypes.PatientInput;
}>;


export type RegisterPatientMutation = { registerPatient: { id: string, givenName: string, familyName: string, birthDate: string, phone: string, email: string, address: string, version: number, createdAt: string } };

export type UpdateProfileMutationVariables = Exact<{
  key: string;
  id: string;
  expected: number;
  input: SchemaTypes.PatientInput;
}>;


export type UpdateProfileMutation = { updatePatient: { id: string, givenName: string, familyName: string, birthDate: string, phone: string, email: string, address: string, version: number, createdAt: string } };

export type ClinicalRecordsQueryVariables = Exact<{
  patientId: string;
}>;


export type ClinicalRecordsQuery = { consultations: Array<{ id: string, patientId: string, providerId: string, occurredAt: string, state: string, version: number, noteState: string, noteVersion: number, noteText: string }>, documents: Array<{ id: string, kind: string, patientId: string, consultationId: string | null, authorId: string, state: string, version: number, contentJson: string, createdAt: string }> };

export type StartEncounterMutationVariables = Exact<{
  key: string;
  patientId: string;
  occurredAt: string;
}>;


export type StartEncounterMutation = { startConsultation: { id: string, patientId: string, providerId: string, occurredAt: string, state: string, version: number, noteState: string, noteVersion: number, noteText: string } };

export type SaveClinicalNoteMutationVariables = Exact<{
  key: string;
  id: string;
  expected: number;
  text: string;
  finalize: boolean;
  reason: string;
}>;


export type SaveClinicalNoteMutation = { saveNote: { id: string, patientId: string, providerId: string, occurredAt: string, state: string, version: number, noteState: string, noteVersion: number, noteText: string } };

export type CloseEncounterMutationVariables = Exact<{
  key: string;
  id: string;
  expected: number;
}>;


export type CloseEncounterMutation = { closeConsultation: { id: string, patientId: string, providerId: string, occurredAt: string, state: string, version: number, noteState: string, noteVersion: number, noteText: string } };

export type NoteVersionsQueryVariables = Exact<{
  id: string;
}>;


export type NoteVersionsQuery = { noteRevisions: Array<{ id: string, version: number, text: string, state: string, reason: string, recordedAt: string, authorId: string, previousVersion: number | null }> };

export type NewPrescriptionMutationVariables = Exact<{
  key: string;
  patientId: string;
  consultationId?: string | null | undefined;
  content: SchemaTypes.PrescriptionInput;
}>;


export type NewPrescriptionMutation = { createPrescription: { id: string, kind: string, patientId: string, consultationId: string | null, authorId: string, state: string, version: number, contentJson: string, createdAt: string } };

export type NewCertificateMutationVariables = Exact<{
  key: string;
  patientId: string;
  consultationId?: string | null | undefined;
  content: SchemaTypes.CertificateInput;
}>;


export type NewCertificateMutation = { createCertificate: { id: string, kind: string, patientId: string, consultationId: string | null, authorId: string, state: string, version: number, contentJson: string, createdAt: string } };

export type RevisePrescriptionMutationVariables = Exact<{
  key: string;
  id: string;
  expected: number;
  content: SchemaTypes.PrescriptionInput;
  issue: boolean;
  reason: string;
}>;


export type RevisePrescriptionMutation = { revisePrescription: { id: string, kind: string, patientId: string, consultationId: string | null, authorId: string, state: string, version: number, contentJson: string, createdAt: string } };

export type ReviseCertificateMutationVariables = Exact<{
  key: string;
  id: string;
  expected: number;
  content: SchemaTypes.CertificateInput;
  issue: boolean;
  reason: string;
}>;


export type ReviseCertificateMutation = { reviseCertificate: { id: string, kind: string, patientId: string, consultationId: string | null, authorId: string, state: string, version: number, contentJson: string, createdAt: string } };

export type DocumentVersionsQueryVariables = Exact<{
  id: string;
}>;


export type DocumentVersionsQuery = { documentRevisions: Array<{ id: string, documentId: string, version: number, state: string, contentJson: string, patientName: string, issuerName: string, templateVersion: string, authorId: string, reason: string, previousVersion: number | null, recordedAt: string }> };

export type PreviewClinicalDocumentQueryVariables = Exact<{
  id: string;
  version: number;
}>;


export type PreviewClinicalDocumentQuery = { previewDocument: string };

export type PrintEventMutationVariables = Exact<{
  key: string;
  id: string;
  version: number;
  outcome: string;
}>;


export type PrintEventMutation = { recordPrint: { id: string, version: number } };

export type ScheduleQueryVariables = Exact<{
  from: string;
  to: string;
  providerId?: string | null | undefined;
  patientId?: string | null | undefined;
}>;


export type ScheduleQuery = { appointments: Array<{ id: string, patientId: string, providerId: string, startsAt: string, endsAt: string, timeZone: string, state: string, version: number, checkedInAt: string | null, checkedInBy: string | null, cancellationReason: string }> };

export type BookVisitMutationVariables = Exact<{
  key: string;
  input: SchemaTypes.AppointmentInput;
}>;


export type BookVisitMutation = { bookAppointment: { id: string, patientId: string, providerId: string, startsAt: string, endsAt: string, timeZone: string, state: string, version: number, checkedInAt: string | null, checkedInBy: string | null, cancellationReason: string } };

export type RescheduleVisitMutationVariables = Exact<{
  key: string;
  id: string;
  expected: number;
  startsAt: string;
  endsAt: string;
  timeZone: string;
}>;


export type RescheduleVisitMutation = { rescheduleAppointment: { id: string, patientId: string, providerId: string, startsAt: string, endsAt: string, timeZone: string, state: string, version: number, checkedInAt: string | null, checkedInBy: string | null, cancellationReason: string } };

export type CancelVisitMutationVariables = Exact<{
  key: string;
  id: string;
  expected: number;
  reason: string;
}>;


export type CancelVisitMutation = { cancelAppointment: { id: string, patientId: string, providerId: string, startsAt: string, endsAt: string, timeZone: string, state: string, version: number, checkedInAt: string | null, checkedInBy: string | null, cancellationReason: string } };

export type CheckInVisitMutationVariables = Exact<{
  key: string;
  id: string;
  expected: number;
  patientId: string;
}>;


export type CheckInVisitMutation = { checkIn: { id: string, patientId: string, providerId: string, startsAt: string, endsAt: string, timeZone: string, state: string, version: number, checkedInAt: string | null, checkedInBy: string | null, cancellationReason: string } };

export type VisitHistoryQueryVariables = Exact<{
  id: string;
}>;


export type VisitHistoryQuery = { appointmentHistory: Array<{ version: number, snapshotJson: string, actorId: string, recordedAt: string }> };

export type PatientTimelineQueryVariables = Exact<{
  patientId: string;
  offset: number;
  limit: number;
}>;


export type PatientTimelineQuery = { history: { total: number, offset: number, items: Array<{ id: string, type: string, occurredAt: string, recordedAt: string, summary: string, version: number, sourceId: string }> } };

export type AuditTrailQueryVariables = Exact<{
  offset: number;
  limit: number;
}>;


export type AuditTrailQuery = { auditEvents: Array<{ id: string, actorId: string | null, action: string, subjectId: string, outcome: string, version: number | null, correlationId: string, recordedAt: string }> };

export type RegisterAccountMutationVariables = Exact<{
  input: SchemaTypes.AccountRegistrationInput;
}>;


export type RegisterAccountMutation = { registerAccount: boolean };

export type ResendVerificationMutationVariables = Exact<{
  email: string;
}>;


export type ResendVerificationMutation = { resendAccountVerification: boolean };

export type VerifyAccountMutationVariables = Exact<{
  token: string;
}>;


export type VerifyAccountMutation = { verifyAccount: boolean };

export type RequestPasswordResetMutationVariables = Exact<{
  email: string;
}>;


export type RequestPasswordResetMutation = { requestPasswordReset: boolean };

export type ResetAccountPasswordMutationVariables = Exact<{
  token: string;
  password: string;
  code?: string | null | undefined;
}>;


export type ResetAccountPasswordMutation = { resetAccountPassword: boolean };

export type InvitePracticeMemberMutationVariables = Exact<{
  email: string;
  role: string;
}>;


export type InvitePracticeMemberMutation = { invitePracticeMember: boolean };

export type AcceptPracticeInvitationMutationVariables = Exact<{
  token: string;
  password: string;
  code?: string | null | undefined;
}>;


export type AcceptPracticeInvitationMutation = { acceptPracticeInvitation: boolean };

export type StartAccountMfaMutationVariables = Exact<{
  password: string;
}>;


export type StartAccountMfaMutation = { startAccountMfa: string };

export type ConfirmAccountMfaMutationVariables = Exact<{
  code: string;
}>;


export type ConfirmAccountMfaMutation = { confirmAccountMfa: string };

export type DisableAccountMfaMutationVariables = Exact<{
  password: string;
  code: string;
}>;


export type DisableAccountMfaMutation = { disableAccountMfa: boolean };

export type AccountSecurityQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountSecurityQuery = { accountMfaEnabled: boolean };

export type PracticesQueryVariables = Exact<{ [key: string]: never; }>;


export type PracticesQuery = { practices: string };

export type PracticeSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type PracticeSettingsQuery = { practiceSettings: string };

export type PracticeTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type PracticeTemplatesQuery = { practiceTemplates: string };

export type PracticeExportQueryVariables = Exact<{ [key: string]: never; }>;


export type PracticeExportQuery = { practiceExport: string };

export type TemplatePreviewQueryVariables = Exact<{
  definition: string;
  kind?: string | null | undefined;
}>;


export type TemplatePreviewQuery = { previewPracticeTemplate: string };

export type CreatePracticeMutationVariables = Exact<{
  name: string;
}>;


export type CreatePracticeMutation = { createPractice: string };

export type SetPracticeMemberMutationVariables = Exact<{
  input: string;
}>;


export type SetPracticeMemberMutation = { setPracticeMember: string };

export type SaveBrandingMutationVariables = Exact<{
  expected: number;
  input: string;
}>;


export type SaveBrandingMutation = { savePracticeBranding: string };

export type SaveTemplateMutationVariables = Exact<{
  kind: string;
  expected: number;
  definition: string;
  publish: boolean;
}>;


export type SaveTemplateMutation = { savePracticeTemplate: string };

export type SimulateSubscriptionMutationVariables = Exact<{
  expected: number;
  plan: string;
  state: string;
}>;


export type SimulateSubscriptionMutation = { simulateSubscription: string };

export type SystemStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type SystemStatusQuery = { systemStatus: { service: string, status: string } };

export const PatientFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Patient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PatientFieldsFragment, unknown>;
export const EncounterFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EncounterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Consultation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"noteState"}},{"kind":"Field","name":{"kind":"Name","value":"noteVersion"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}}]}}]} as unknown as DocumentNode<EncounterFieldsFragment, unknown>;
export const DocumentFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ClinicalDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"consultationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"contentJson"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<DocumentFieldsFragment, unknown>;
export const AppointmentFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInBy"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}}]}}]} as unknown as DocumentNode<AppointmentFieldsFragment, unknown>;
export const ViewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"canManage"}}]}}]}}]} as unknown as DocumentNode<ViewerQuery, ViewerQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const ProvidersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<ProvidersQuery, ProvidersQueryVariables>;
export const PatientSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PatientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Patient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PatientSearchQuery, PatientSearchQueryVariables>;
export const PatientRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PatientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Patient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<PatientRecordQuery, PatientRecordQueryVariables>;
export const RegisterPatientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterPatient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PatientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerPatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PatientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Patient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<RegisterPatientMutation, RegisterPatientMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PatientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PatientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PatientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Patient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const ClinicalRecordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClinicalRecords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consultations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EncounterFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EncounterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Consultation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"noteState"}},{"kind":"Field","name":{"kind":"Name","value":"noteVersion"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ClinicalDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"consultationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"contentJson"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ClinicalRecordsQuery, ClinicalRecordsQueryVariables>;
export const StartEncounterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartEncounter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"occurredAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startConsultation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"occurredAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"occurredAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EncounterFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EncounterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Consultation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"noteState"}},{"kind":"Field","name":{"kind":"Name","value":"noteVersion"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}}]}}]} as unknown as DocumentNode<StartEncounterMutation, StartEncounterMutationVariables>;
export const SaveClinicalNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveClinicalNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"finalize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"finalize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"finalize"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EncounterFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EncounterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Consultation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"noteState"}},{"kind":"Field","name":{"kind":"Name","value":"noteVersion"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}}]}}]} as unknown as DocumentNode<SaveClinicalNoteMutation, SaveClinicalNoteMutationVariables>;
export const CloseEncounterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CloseEncounter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closeConsultation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EncounterFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EncounterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Consultation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"noteState"}},{"kind":"Field","name":{"kind":"Name","value":"noteVersion"}},{"kind":"Field","name":{"kind":"Name","value":"noteText"}}]}}]} as unknown as DocumentNode<CloseEncounterMutation, CloseEncounterMutationVariables>;
export const NoteVersionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NoteVersions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noteRevisions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"recordedAt"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"previousVersion"}}]}}]}}]} as unknown as DocumentNode<NoteVersionsQuery, NoteVersionsQueryVariables>;
export const NewPrescriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewPrescription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"consultationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PrescriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPrescription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"consultationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"consultationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ClinicalDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"consultationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"contentJson"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<NewPrescriptionMutation, NewPrescriptionMutationVariables>;
export const NewCertificateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewCertificate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"consultationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CertificateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCertificate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"consultationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"consultationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ClinicalDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"consultationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"contentJson"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<NewCertificateMutation, NewCertificateMutationVariables>;
export const RevisePrescriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevisePrescription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PrescriptionInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"issue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revisePrescription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"issue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"issue"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ClinicalDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"consultationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"contentJson"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<RevisePrescriptionMutation, RevisePrescriptionMutationVariables>;
export const ReviseCertificateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviseCertificate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CertificateInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"issue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviseCertificate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"issue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"issue"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DocumentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DocumentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ClinicalDocument"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"consultationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"contentJson"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ReviseCertificateMutation, ReviseCertificateMutationVariables>;
export const DocumentVersionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DocumentVersions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentRevisions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"contentJson"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"issuerName"}},{"kind":"Field","name":{"kind":"Name","value":"templateVersion"}},{"kind":"Field","name":{"kind":"Name","value":"authorId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"previousVersion"}},{"kind":"Field","name":{"kind":"Name","value":"recordedAt"}}]}}]}}]} as unknown as DocumentNode<DocumentVersionsQuery, DocumentVersionsQueryVariables>;
export const PreviewClinicalDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewClinicalDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}}]}]}}]} as unknown as DocumentNode<PreviewClinicalDocumentQuery, PreviewClinicalDocumentQueryVariables>;
export const PrintEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PrintEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"outcome"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordPrint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}},{"kind":"Argument","name":{"kind":"Name","value":"outcome"},"value":{"kind":"Variable","name":{"kind":"Name","value":"outcome"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}}]}}]} as unknown as DocumentNode<PrintEventMutation, PrintEventMutationVariables>;
export const ScheduleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Schedule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"providerId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appointments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"providerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"providerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInBy"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}}]}}]} as unknown as DocumentNode<ScheduleQuery, ScheduleQueryVariables>;
export const BookVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BookVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AppointmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInBy"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}}]}}]} as unknown as DocumentNode<BookVisitMutation, BookVisitMutationVariables>;
export const RescheduleVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RescheduleVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startsAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endsAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeZone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rescheduleAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"startsAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startsAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"endsAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endsAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeZone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeZone"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInBy"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}}]}}]} as unknown as DocumentNode<RescheduleVisitMutation, RescheduleVisitMutationVariables>;
export const CancelVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelAppointment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInBy"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}}]}}]} as unknown as DocumentNode<CancelVisitMutation, CancelVisitMutationVariables>;
export const CheckInVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckInVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AppointmentFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AppointmentFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Appointment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"providerId"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInAt"}},{"kind":"Field","name":{"kind":"Name","value":"checkedInBy"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}}]}}]} as unknown as DocumentNode<CheckInVisitMutation, CheckInVisitMutationVariables>;
export const VisitHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appointmentHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotJson"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"recordedAt"}}]}}]}}]} as unknown as DocumentNode<VisitHistoryQuery, VisitHistoryQueryVariables>;
export const PatientTimelineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatientTimeline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"history"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"recordedAt"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}}]}}]}}]} as unknown as DocumentNode<PatientTimelineQuery, PatientTimelineQueryVariables>;
export const AuditTrailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditTrail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subjectId"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"correlationId"}},{"kind":"Field","name":{"kind":"Name","value":"recordedAt"}}]}}]}}]} as unknown as DocumentNode<AuditTrailQuery, AuditTrailQueryVariables>;
export const RegisterAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountRegistrationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RegisterAccountMutation, RegisterAccountMutationVariables>;
export const ResendVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendAccountVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ResendVerificationMutation, ResendVerificationMutationVariables>;
export const VerifyAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<VerifyAccountMutation, VerifyAccountMutationVariables>;
export const RequestPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResetAccountPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetAccountPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetAccountPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<ResetAccountPasswordMutation, ResetAccountPasswordMutationVariables>;
export const InvitePracticeMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InvitePracticeMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitePracticeMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}]}]}}]} as unknown as DocumentNode<InvitePracticeMemberMutation, InvitePracticeMemberMutationVariables>;
export const AcceptPracticeInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptPracticeInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptPracticeInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<AcceptPracticeInvitationMutation, AcceptPracticeInvitationMutationVariables>;
export const StartAccountMfaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartAccountMfa"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startAccountMfa"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<StartAccountMfaMutation, StartAccountMfaMutationVariables>;
export const ConfirmAccountMfaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmAccountMfa"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmAccountMfa"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<ConfirmAccountMfaMutation, ConfirmAccountMfaMutationVariables>;
export const DisableAccountMfaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisableAccountMfa"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAccountMfa"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<DisableAccountMfaMutation, DisableAccountMfaMutationVariables>;
export const AccountSecurityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountSecurity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountMfaEnabled"}}]}}]} as unknown as DocumentNode<AccountSecurityQuery, AccountSecurityQueryVariables>;
export const PracticesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Practices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practices"}}]}}]} as unknown as DocumentNode<PracticesQuery, PracticesQueryVariables>;
export const PracticeSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PracticeSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practiceSettings"}}]}}]} as unknown as DocumentNode<PracticeSettingsQuery, PracticeSettingsQueryVariables>;
export const PracticeTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PracticeTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practiceTemplates"}}]}}]} as unknown as DocumentNode<PracticeTemplatesQuery, PracticeTemplatesQueryVariables>;
export const PracticeExportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PracticeExport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"practiceExport"}}]}}]} as unknown as DocumentNode<PracticeExportQuery, PracticeExportQueryVariables>;
export const TemplatePreviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplatePreview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"definition"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewPracticeTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"definition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"definition"}}},{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}}]}]}}]} as unknown as DocumentNode<TemplatePreviewQuery, TemplatePreviewQueryVariables>;
export const CreatePracticeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePractice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPractice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<CreatePracticeMutation, CreatePracticeMutationVariables>;
export const SetPracticeMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetPracticeMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setPracticeMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SetPracticeMemberMutation, SetPracticeMemberMutationVariables>;
export const SaveBrandingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveBranding"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savePracticeBranding"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SaveBrandingMutation, SaveBrandingMutationVariables>;
export const SaveTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"definition"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publish"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savePracticeTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}},{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"definition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"definition"}}},{"kind":"Argument","name":{"kind":"Name","value":"publish"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publish"}}}]}]}}]} as unknown as DocumentNode<SaveTemplateMutation, SaveTemplateMutationVariables>;
export const SimulateSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SimulateSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expected"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plan"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"simulateSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"expected"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expected"}}},{"kind":"Argument","name":{"kind":"Name","value":"plan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plan"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}]}]}}]} as unknown as DocumentNode<SimulateSubscriptionMutation, SimulateSubscriptionMutationVariables>;
export const SystemStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SystemStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<SystemStatusQuery, SystemStatusQueryVariables>;