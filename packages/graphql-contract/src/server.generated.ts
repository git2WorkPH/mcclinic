import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Appointment = {
  __typename?: "Appointment";
  cancellationReason: Scalars["String"]["output"];
  checkedInAt?: Maybe<Scalars["String"]["output"]>;
  checkedInBy?: Maybe<Scalars["ID"]["output"]>;
  endsAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  patientId: Scalars["ID"]["output"];
  providerId: Scalars["ID"]["output"];
  startsAt: Scalars["String"]["output"];
  state: Scalars["String"]["output"];
  timeZone: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type AppointmentChange = {
  __typename?: "AppointmentChange";
  actorId: Scalars["ID"]["output"];
  recordedAt: Scalars["String"]["output"];
  snapshotJson: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type AppointmentInput = {
  endsAt: Scalars["String"]["input"];
  patientId: Scalars["ID"]["input"];
  providerId: Scalars["ID"]["input"];
  startsAt: Scalars["String"]["input"];
  timeZone: Scalars["String"]["input"];
};

export type AuditEvent = {
  __typename?: "AuditEvent";
  action: Scalars["String"]["output"];
  actorId?: Maybe<Scalars["ID"]["output"]>;
  correlationId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  outcome: Scalars["String"]["output"];
  recordedAt: Scalars["String"]["output"];
  subjectId: Scalars["String"]["output"];
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type CertificateInput = {
  endsOn: Scalars["String"]["input"];
  startsOn: Scalars["String"]["input"];
  statement: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type ClinicalDocument = {
  __typename?: "ClinicalDocument";
  authorId: Scalars["ID"]["output"];
  consultationId?: Maybe<Scalars["ID"]["output"]>;
  contentJson: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  kind: Scalars["String"]["output"];
  patientId: Scalars["ID"]["output"];
  state: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type Consultation = {
  __typename?: "Consultation";
  id: Scalars["ID"]["output"];
  noteState: Scalars["String"]["output"];
  noteText: Scalars["String"]["output"];
  noteVersion: Scalars["Int"]["output"];
  occurredAt: Scalars["String"]["output"];
  patientId: Scalars["ID"]["output"];
  providerId: Scalars["ID"]["output"];
  state: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type DocumentRevision = {
  __typename?: "DocumentRevision";
  authorId: Scalars["ID"]["output"];
  contentJson: Scalars["String"]["output"];
  documentId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  issuerName: Scalars["String"]["output"];
  patientName: Scalars["String"]["output"];
  previousVersion?: Maybe<Scalars["Int"]["output"]>;
  reason: Scalars["String"]["output"];
  recordedAt: Scalars["String"]["output"];
  state: Scalars["String"]["output"];
  templateVersion: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type HistoryEntry = {
  __typename?: "HistoryEntry";
  id: Scalars["ID"]["output"];
  occurredAt: Scalars["String"]["output"];
  recordedAt: Scalars["String"]["output"];
  sourceId: Scalars["ID"]["output"];
  summary: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type HistoryPage = {
  __typename?: "HistoryPage";
  items: Array<HistoryEntry>;
  offset: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
};

export type LoginPayload = {
  __typename?: "LoginPayload";
  actor: Viewer;
  token: Scalars["String"]["output"];
};

export type MedicationInput = {
  dose: Scalars["String"]["input"];
  duration: Scalars["String"]["input"];
  frequency: Scalars["String"]["input"];
  medication: Scalars["String"]["input"];
  quantity: Scalars["String"]["input"];
  repeats: Scalars["Int"]["input"];
  route: Scalars["String"]["input"];
  strength: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  bookAppointment: Appointment;
  cancelAppointment: Appointment;
  checkIn: Appointment;
  closeConsultation: Consultation;
  createCertificate: ClinicalDocument;
  createPrescription: ClinicalDocument;
  login: LoginPayload;
  logout: Scalars["Boolean"]["output"];
  recordPrint: PrintReceipt;
  registerPatient: Patient;
  rescheduleAppointment: Appointment;
  reviseCertificate: ClinicalDocument;
  revisePrescription: ClinicalDocument;
  saveNote: Consultation;
  startConsultation: Consultation;
  updatePatient: Patient;
};

export type MutationBookAppointmentArgs = {
  input: AppointmentInput;
  key: Scalars["String"]["input"];
};

export type MutationCancelAppointmentArgs = {
  expected: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
  key: Scalars["String"]["input"];
  reason: Scalars["String"]["input"];
};

export type MutationCheckInArgs = {
  expected: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
  key: Scalars["String"]["input"];
  patientId: Scalars["ID"]["input"];
};

export type MutationCloseConsultationArgs = {
  expected: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
  key: Scalars["String"]["input"];
};

export type MutationCreateCertificateArgs = {
  consultationId?: InputMaybe<Scalars["ID"]["input"]>;
  content: CertificateInput;
  key: Scalars["String"]["input"];
  patientId: Scalars["ID"]["input"];
};

export type MutationCreatePrescriptionArgs = {
  consultationId?: InputMaybe<Scalars["ID"]["input"]>;
  content: PrescriptionInput;
  key: Scalars["String"]["input"];
  patientId: Scalars["ID"]["input"];
};

export type MutationLoginArgs = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MutationRecordPrintArgs = {
  id: Scalars["ID"]["input"];
  key: Scalars["String"]["input"];
  outcome: Scalars["String"]["input"];
  version: Scalars["Int"]["input"];
};

export type MutationRegisterPatientArgs = {
  input: PatientInput;
  key: Scalars["String"]["input"];
};

export type MutationRescheduleAppointmentArgs = {
  endsAt: Scalars["String"]["input"];
  expected: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
  key: Scalars["String"]["input"];
  startsAt: Scalars["String"]["input"];
  timeZone: Scalars["String"]["input"];
};

export type MutationReviseCertificateArgs = {
  content: CertificateInput;
  expected: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
  issue: Scalars["Boolean"]["input"];
  key: Scalars["String"]["input"];
  reason: Scalars["String"]["input"];
};

export type MutationRevisePrescriptionArgs = {
  content: PrescriptionInput;
  expected: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
  issue: Scalars["Boolean"]["input"];
  key: Scalars["String"]["input"];
  reason: Scalars["String"]["input"];
};

export type MutationSaveNoteArgs = {
  expected: Scalars["Int"]["input"];
  finalize: Scalars["Boolean"]["input"];
  id: Scalars["ID"]["input"];
  key: Scalars["String"]["input"];
  reason: Scalars["String"]["input"];
  text: Scalars["String"]["input"];
};

export type MutationStartConsultationArgs = {
  key: Scalars["String"]["input"];
  occurredAt: Scalars["String"]["input"];
  patientId: Scalars["ID"]["input"];
};

export type MutationUpdatePatientArgs = {
  expected: Scalars["Int"]["input"];
  id: Scalars["ID"]["input"];
  input: PatientInput;
  key: Scalars["String"]["input"];
};

export type NoteRevision = {
  __typename?: "NoteRevision";
  authorId: Scalars["ID"]["output"];
  consultationId: Scalars["ID"]["output"];
  id: Scalars["ID"]["output"];
  previousVersion?: Maybe<Scalars["Int"]["output"]>;
  reason: Scalars["String"]["output"];
  recordedAt: Scalars["String"]["output"];
  state: Scalars["String"]["output"];
  text: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type Patient = {
  __typename?: "Patient";
  address: Scalars["String"]["output"];
  birthDate: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  email: Scalars["String"]["output"];
  familyName: Scalars["String"]["output"];
  givenName: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  phone: Scalars["String"]["output"];
  version: Scalars["Int"]["output"];
};

export type PatientInput = {
  address: Scalars["String"]["input"];
  birthDate: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  familyName: Scalars["String"]["input"];
  givenName: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
};

export type PatientPage = {
  __typename?: "PatientPage";
  items: Array<Patient>;
  offset: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
};

export type PrescriptionInput = {
  directions: Scalars["String"]["input"];
  items: Array<MedicationInput>;
};

export type PrintReceipt = {
  __typename?: "PrintReceipt";
  id: Scalars["ID"]["output"];
  version: Scalars["Int"]["output"];
};

export type Query = {
  __typename?: "Query";
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
  previewDocument: Scalars["String"]["output"];
  providers: Array<Viewer>;
  systemStatus: SystemStatus;
};

export type QueryAppointmentHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryAppointmentsArgs = {
  from: Scalars["String"]["input"];
  patientId?: InputMaybe<Scalars["ID"]["input"]>;
  providerId?: InputMaybe<Scalars["ID"]["input"]>;
  to: Scalars["String"]["input"];
};

export type QueryAuditEventsArgs = {
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
};

export type QueryConsultationsArgs = {
  patientId: Scalars["ID"]["input"];
};

export type QueryDocumentRevisionsArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryDocumentsArgs = {
  patientId: Scalars["ID"]["input"];
};

export type QueryHistoryArgs = {
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  patientId: Scalars["ID"]["input"];
};

export type QueryNoteRevisionsArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPatientArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPatientsArgs = {
  limit?: Scalars["Int"]["input"];
  offset?: Scalars["Int"]["input"];
  query?: Scalars["String"]["input"];
};

export type QueryPreviewDocumentArgs = {
  id: Scalars["ID"]["input"];
  version: Scalars["Int"]["input"];
};

export type SystemStatus = {
  __typename?: "SystemStatus";
  service: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
};

export type Viewer = {
  __typename?: "Viewer";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  role: Scalars["String"]["output"];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Appointment: ResolverTypeWrapper<Appointment>;
  AppointmentChange: ResolverTypeWrapper<AppointmentChange>;
  AppointmentInput: AppointmentInput;
  AuditEvent: ResolverTypeWrapper<AuditEvent>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  CertificateInput: CertificateInput;
  ClinicalDocument: ResolverTypeWrapper<ClinicalDocument>;
  Consultation: ResolverTypeWrapper<Consultation>;
  DocumentRevision: ResolverTypeWrapper<DocumentRevision>;
  HistoryEntry: ResolverTypeWrapper<HistoryEntry>;
  HistoryPage: ResolverTypeWrapper<HistoryPage>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  LoginPayload: ResolverTypeWrapper<LoginPayload>;
  MedicationInput: MedicationInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NoteRevision: ResolverTypeWrapper<NoteRevision>;
  Patient: ResolverTypeWrapper<Patient>;
  PatientInput: PatientInput;
  PatientPage: ResolverTypeWrapper<PatientPage>;
  PrescriptionInput: PrescriptionInput;
  PrintReceipt: ResolverTypeWrapper<PrintReceipt>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  SystemStatus: ResolverTypeWrapper<SystemStatus>;
  Viewer: ResolverTypeWrapper<Viewer>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Appointment: Appointment;
  AppointmentChange: AppointmentChange;
  AppointmentInput: AppointmentInput;
  AuditEvent: AuditEvent;
  Boolean: Scalars["Boolean"]["output"];
  CertificateInput: CertificateInput;
  ClinicalDocument: ClinicalDocument;
  Consultation: Consultation;
  DocumentRevision: DocumentRevision;
  HistoryEntry: HistoryEntry;
  HistoryPage: HistoryPage;
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  LoginPayload: LoginPayload;
  MedicationInput: MedicationInput;
  Mutation: Record<PropertyKey, never>;
  NoteRevision: NoteRevision;
  Patient: Patient;
  PatientInput: PatientInput;
  PatientPage: PatientPage;
  PrescriptionInput: PrescriptionInput;
  PrintReceipt: PrintReceipt;
  Query: Record<PropertyKey, never>;
  String: Scalars["String"]["output"];
  SystemStatus: SystemStatus;
  Viewer: Viewer;
};

export type AppointmentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Appointment"] =
    ResolversParentTypes["Appointment"],
> = {
  cancellationReason?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  checkedInAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  checkedInBy?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  endsAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  patientId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  providerId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  startsAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timeZone?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type AppointmentChangeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["AppointmentChange"] =
    ResolversParentTypes["AppointmentChange"],
> = {
  actorId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  recordedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  snapshotJson?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type AuditEventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["AuditEvent"] =
    ResolversParentTypes["AuditEvent"],
> = {
  action?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  actorId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  correlationId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  outcome?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  recordedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  subjectId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type ClinicalDocumentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["ClinicalDocument"] =
    ResolversParentTypes["ClinicalDocument"],
> = {
  authorId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  consultationId?: Resolver<
    Maybe<ResolversTypes["ID"]>,
    ParentType,
    ContextType
  >;
  contentJson?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  patientId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type ConsultationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Consultation"] =
    ResolversParentTypes["Consultation"],
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  noteState?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  noteText?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  noteVersion?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  occurredAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  patientId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  providerId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type DocumentRevisionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["DocumentRevision"] =
    ResolversParentTypes["DocumentRevision"],
> = {
  authorId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  contentJson?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  documentId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  issuerName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  patientName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  previousVersion?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  reason?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  recordedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  templateVersion?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type HistoryEntryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["HistoryEntry"] =
    ResolversParentTypes["HistoryEntry"],
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  occurredAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  recordedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  sourceId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type HistoryPageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["HistoryPage"] =
    ResolversParentTypes["HistoryPage"],
> = {
  items?: Resolver<
    Array<ResolversTypes["HistoryEntry"]>,
    ParentType,
    ContextType
  >;
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  total?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type LoginPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["LoginPayload"] =
    ResolversParentTypes["LoginPayload"],
> = {
  actor?: Resolver<ResolversTypes["Viewer"], ParentType, ContextType>;
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] =
    ResolversParentTypes["Mutation"],
> = {
  bookAppointment?: Resolver<
    ResolversTypes["Appointment"],
    ParentType,
    ContextType,
    RequireFields<MutationBookAppointmentArgs, "input" | "key">
  >;
  cancelAppointment?: Resolver<
    ResolversTypes["Appointment"],
    ParentType,
    ContextType,
    RequireFields<
      MutationCancelAppointmentArgs,
      "expected" | "id" | "key" | "reason"
    >
  >;
  checkIn?: Resolver<
    ResolversTypes["Appointment"],
    ParentType,
    ContextType,
    RequireFields<MutationCheckInArgs, "expected" | "id" | "key" | "patientId">
  >;
  closeConsultation?: Resolver<
    ResolversTypes["Consultation"],
    ParentType,
    ContextType,
    RequireFields<MutationCloseConsultationArgs, "expected" | "id" | "key">
  >;
  createCertificate?: Resolver<
    ResolversTypes["ClinicalDocument"],
    ParentType,
    ContextType,
    RequireFields<
      MutationCreateCertificateArgs,
      "content" | "key" | "patientId"
    >
  >;
  createPrescription?: Resolver<
    ResolversTypes["ClinicalDocument"],
    ParentType,
    ContextType,
    RequireFields<
      MutationCreatePrescriptionArgs,
      "content" | "key" | "patientId"
    >
  >;
  login?: Resolver<
    ResolversTypes["LoginPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "password" | "username">
  >;
  logout?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  recordPrint?: Resolver<
    ResolversTypes["PrintReceipt"],
    ParentType,
    ContextType,
    RequireFields<MutationRecordPrintArgs, "id" | "key" | "outcome" | "version">
  >;
  registerPatient?: Resolver<
    ResolversTypes["Patient"],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterPatientArgs, "input" | "key">
  >;
  rescheduleAppointment?: Resolver<
    ResolversTypes["Appointment"],
    ParentType,
    ContextType,
    RequireFields<
      MutationRescheduleAppointmentArgs,
      "endsAt" | "expected" | "id" | "key" | "startsAt" | "timeZone"
    >
  >;
  reviseCertificate?: Resolver<
    ResolversTypes["ClinicalDocument"],
    ParentType,
    ContextType,
    RequireFields<
      MutationReviseCertificateArgs,
      "content" | "expected" | "id" | "issue" | "key" | "reason"
    >
  >;
  revisePrescription?: Resolver<
    ResolversTypes["ClinicalDocument"],
    ParentType,
    ContextType,
    RequireFields<
      MutationRevisePrescriptionArgs,
      "content" | "expected" | "id" | "issue" | "key" | "reason"
    >
  >;
  saveNote?: Resolver<
    ResolversTypes["Consultation"],
    ParentType,
    ContextType,
    RequireFields<
      MutationSaveNoteArgs,
      "expected" | "finalize" | "id" | "key" | "reason" | "text"
    >
  >;
  startConsultation?: Resolver<
    ResolversTypes["Consultation"],
    ParentType,
    ContextType,
    RequireFields<
      MutationStartConsultationArgs,
      "key" | "occurredAt" | "patientId"
    >
  >;
  updatePatient?: Resolver<
    ResolversTypes["Patient"],
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdatePatientArgs,
      "expected" | "id" | "input" | "key"
    >
  >;
};

export type NoteRevisionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["NoteRevision"] =
    ResolversParentTypes["NoteRevision"],
> = {
  authorId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  consultationId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  previousVersion?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  reason?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  recordedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  text?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type PatientResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Patient"] =
    ResolversParentTypes["Patient"],
> = {
  address?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  birthDate?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  familyName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  givenName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type PatientPageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["PatientPage"] =
    ResolversParentTypes["PatientPage"],
> = {
  items?: Resolver<Array<ResolversTypes["Patient"]>, ParentType, ContextType>;
  offset?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  total?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type PrintReceiptResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["PrintReceipt"] =
    ResolversParentTypes["PrintReceipt"],
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  version?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] =
    ResolversParentTypes["Query"],
> = {
  appointmentHistory?: Resolver<
    Array<ResolversTypes["AppointmentChange"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAppointmentHistoryArgs, "id">
  >;
  appointments?: Resolver<
    Array<ResolversTypes["Appointment"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAppointmentsArgs, "from" | "to">
  >;
  auditEvents?: Resolver<
    Array<ResolversTypes["AuditEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAuditEventsArgs, "limit" | "offset">
  >;
  consultations?: Resolver<
    Array<ResolversTypes["Consultation"]>,
    ParentType,
    ContextType,
    RequireFields<QueryConsultationsArgs, "patientId">
  >;
  documentRevisions?: Resolver<
    Array<ResolversTypes["DocumentRevision"]>,
    ParentType,
    ContextType,
    RequireFields<QueryDocumentRevisionsArgs, "id">
  >;
  documents?: Resolver<
    Array<ResolversTypes["ClinicalDocument"]>,
    ParentType,
    ContextType,
    RequireFields<QueryDocumentsArgs, "patientId">
  >;
  history?: Resolver<
    ResolversTypes["HistoryPage"],
    ParentType,
    ContextType,
    RequireFields<QueryHistoryArgs, "limit" | "offset" | "patientId">
  >;
  me?: Resolver<Maybe<ResolversTypes["Viewer"]>, ParentType, ContextType>;
  noteRevisions?: Resolver<
    Array<ResolversTypes["NoteRevision"]>,
    ParentType,
    ContextType,
    RequireFields<QueryNoteRevisionsArgs, "id">
  >;
  patient?: Resolver<
    ResolversTypes["Patient"],
    ParentType,
    ContextType,
    RequireFields<QueryPatientArgs, "id">
  >;
  patients?: Resolver<
    ResolversTypes["PatientPage"],
    ParentType,
    ContextType,
    RequireFields<QueryPatientsArgs, "limit" | "offset" | "query">
  >;
  previewDocument?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType,
    RequireFields<QueryPreviewDocumentArgs, "id" | "version">
  >;
  providers?: Resolver<
    Array<ResolversTypes["Viewer"]>,
    ParentType,
    ContextType
  >;
  systemStatus?: Resolver<
    ResolversTypes["SystemStatus"],
    ParentType,
    ContextType
  >;
};

export type SystemStatusResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["SystemStatus"] =
    ResolversParentTypes["SystemStatus"],
> = {
  service?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type ViewerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Viewer"] =
    ResolversParentTypes["Viewer"],
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  role?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Appointment?: AppointmentResolvers<ContextType>;
  AppointmentChange?: AppointmentChangeResolvers<ContextType>;
  AuditEvent?: AuditEventResolvers<ContextType>;
  ClinicalDocument?: ClinicalDocumentResolvers<ContextType>;
  Consultation?: ConsultationResolvers<ContextType>;
  DocumentRevision?: DocumentRevisionResolvers<ContextType>;
  HistoryEntry?: HistoryEntryResolvers<ContextType>;
  HistoryPage?: HistoryPageResolvers<ContextType>;
  LoginPayload?: LoginPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NoteRevision?: NoteRevisionResolvers<ContextType>;
  Patient?: PatientResolvers<ContextType>;
  PatientPage?: PatientPageResolvers<ContextType>;
  PrintReceipt?: PrintReceiptResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SystemStatus?: SystemStatusResolvers<ContextType>;
  Viewer?: ViewerResolvers<ContextType>;
};
