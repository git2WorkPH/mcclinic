import { captureTemplate } from '../../modules/templates/infrastructure/snapshot.js';
import { effectiveState } from '../../modules/subscription/application/policy.js';
import { scoped, verifyMembership, clinicianDirectory, DEFAULT_PRACTICE } from '../../modules/practice/infrastructure/scope.js';
import { PrismaClient, Prisma } from "./generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { createHash, randomUUID } from "node:crypto";
import {
  AppError,
  conflict,
  type Actor,
  type Role,
} from "../../application/context.js";
import type {
  Persistence,
  UnitOfWork,
  Audit,
} from "../../application/ports.js";
import type { Patient, Page } from "../../modules/patient/domain/patient.js";
import type {
  Consultation,
  NoteRevision,
} from "../../modules/consultation/domain/consultation.js";
import type {
  ClinicalDocument,
  DocumentRevision,
} from "../../clinical-document/domain/document.js";
import type { Appointment } from "../../modules/appointment/domain/appointment.js";
export function createDatabase(url: string) {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url, max: 10 }),
  });
}
export type Database = ReturnType<typeof createDatabase>;
type Tx = Prisma.TransactionClient;
export function plain<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
function json(value: unknown): Prisma.InputJsonValue {
  return plain<Prisma.InputJsonValue>(value);
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value && typeof value === "object")
    return (
      "{" +
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => JSON.stringify(k) + ":" + canonical(v))
        .join(",") +
      "}"
    );
  return JSON.stringify(value) ?? "null";
}
const identityKey = (p: {
  givenName: string;
  familyName: string;
  birthDate: string;
}) =>
  [
    p.givenName.trim().toLowerCase(),
    p.familyName.trim().toLowerCase(),
    p.birthDate,
  ].join("|");
function translate(error: unknown): never {
  if (error instanceof AppError) throw error;
  const value = error as { code?: string; message?: string };
  if (
    ["P2002", "P2003", "P2004", "P2025", "P2034"].includes(value.code ?? "") ||
    /23P01|exclusion constraint|duplicate key|conflicting key/i.test(
      value.message ?? "",
    )
  )
    throw new AppError(
      "CONFLICT",
      "Duplicate, overlapping, stale or inconsistent record. Review and retry.",
    );
  throw error;
}
export function unitOfWork(raw: Tx, practiceId: string = DEFAULT_PRACTICE): UnitOfWork {
  const tx=scoped(raw,practiceId);
  return {
    patients: {
      async get(id) {
        return plain<Patient | null>(
          await tx.patient.findUnique({ where: { id } }),
        );
      },
      async search(query, offset, limit) {
        const where: Prisma.PatientWhereInput = query
          ? {
              OR: [
                {
                  AND: query
                    .trim()
                    .split(/\s+/)
                    .map((token) => ({
                      OR: [
                        { givenName: { contains: token, mode: "insensitive" } },
                        {
                          familyName: { contains: token, mode: "insensitive" },
                        },
                      ],
                    })),
                },
                { givenName: { contains: query, mode: "insensitive" } },
                { familyName: { contains: query, mode: "insensitive" } },
                { phone: { contains: query } },
                { email: { contains: query, mode: "insensitive" } },
                ...(/^[0-9a-f-]{36}$/i.test(query) ? [{ id: query }] : []),
              ],
            }
          : {};
        const [items, total] = await Promise.all([
          tx.patient.findMany({
            where,
            orderBy: [
              { familyName: "asc" },
              { givenName: "asc" },
              { id: "asc" },
            ],
            skip: offset,
            take: limit,
          }),
          tx.patient.count({ where }),
        ]);
        return plain<Page<Patient>>({ items, total, offset });
      },
      async create(input) {
        return plain<Patient>(
          await tx.patient.create({
            data: { ...input, identityKey: identityKey(input) },
          }),
        );
      },
      async update(id, expected, input) {
        const changed = await tx.patient.updateMany({
          where: { id, version: expected },
          data: {
            ...input,
            identityKey: identityKey(input),
            version: { increment: 1 },
          },
        });
        if (changed.count !== 1) conflict();
        return plain<Patient>(
          await tx.patient.findUniqueOrThrow({ where: { id } }),
        );
      },
    },
    consultations: {
      async get(id) {
        return plain<Consultation | null>(
          await tx.consultation.findUnique({ where: { id } }),
        );
      },
      async list(patientId) {
        return plain<Consultation[]>(
          await tx.consultation.findMany({
            where: { patientId },
            orderBy: [{ occurredAt: "desc" }, { id: "asc" }],
          }),
        );
      },
      async create(patientId, providerId, occurredAt) {
        return plain<Consultation>(
          await tx.consultation.create({
            data: { patientId, providerId, occurredAt: new Date(occurredAt) },
          }),
        );
      },
      async saveNote(id, expected, text, state, reason, authorId) {
        const changed = await tx.consultation.updateMany({
          where: { id, noteVersion: expected },
          data: {
            noteText: text,
            noteState: state,
            noteVersion: { increment: 1 },
            version: { increment: 1 },
          },
        });
        if (changed.count !== 1) conflict();
        await tx.noteRevision.create({
          data: {
            consultationId: id,
            version: expected + 1,
            text,
            state,
            reason,
            authorId,
            previousVersion: expected || null,
          },
        });
        return plain<Consultation>(
          await tx.consultation.findUniqueOrThrow({ where: { id } }),
        );
      },
      async close(id, expected) {
        const changed = await tx.consultation.updateMany({
          where: {
            id,
            version: expected,
            state: "OPEN",
            noteState: "FINALIZED",
          },
          data: { state: "CLOSED", version: { increment: 1 } },
        });
        if (changed.count !== 1) conflict();
        return plain<Consultation>(
          await tx.consultation.findUniqueOrThrow({ where: { id } }),
        );
      },
      async revisions(consultationId) {
        return plain<NoteRevision[]>(
          await tx.noteRevision.findMany({
            where: { consultationId },
            orderBy: { version: "desc" },
          }),
        );
      },
    },
    documents: {
      async get(id) {
        return plain<ClinicalDocument | null>(
          await tx.clinicalDocument.findUnique({ where: { id } }),
        );
      },
      async list(patientId) {
        return plain<ClinicalDocument[]>(
          await tx.clinicalDocument.findMany({
            where: { patientId },
            orderBy: [{ createdAt: "desc" }, { id: "asc" }],
          }),
        );
      },
      async create(input) {
        const result = await tx.clinicalDocument.create({
          data: { ...input, content: json(input.content) },
        });
        await tx.documentRevision.create({
          data: {
            documentId: result.id,
            version: 1,
            state: "DRAFT",
            content: json(input.content),
            patientSnapshot: {
              id: input.patientId,
              name: "Draft identity; captured when issued",
              birthDate: "",
            },
            issuerSnapshot: {
              id: input.authorId,
              name: "Draft issuer; captured when issued",
            },
            templateVersion: "demo-v1",
            authorId: input.authorId,
            reason: "Created",
            previousVersion: null,
          },
        });
        return plain<ClinicalDocument>(result);
      },
      async revise(id, expected, content, state, revision) {
        const changed = await tx.clinicalDocument.updateMany({
          where: { id, version: expected },
          data: { content: json(content), state, version: { increment: 1 } },
        });
        if (changed.count !== 1) conflict();
        const current=await tx.clinicalDocument.findUniqueOrThrow({where:{id}});
        const recordedAt=new Date().toISOString();
        const captured=state==='ISSUED'?await captureTemplate(raw,practiceId,current.kind as 'PRESCRIPTION'|'CERTIFICATE',{...revision,id:'pending',documentId:id,version:expected+1,recordedAt}):{};
        await tx.documentRevision.create({
          data: {
            ...revision,
            ...captured,
            recordedAt: new Date(recordedAt),
            content: json(content),
            patientSnapshot: json(revision.patientSnapshot),
            issuerSnapshot: json(revision.issuerSnapshot),
            documentId: id,
            version: expected + 1,
          },
        });
        return plain<ClinicalDocument>(
          await tx.clinicalDocument.findUniqueOrThrow({ where: { id } }),
        );
      },
      async revisions(documentId) {
        return plain<DocumentRevision[]>(
          await tx.documentRevision.findMany({
            where: { documentId },
            orderBy: { version: "desc" },
          }),
        );
      },
    },
    appointments: {
      async get(id) {
        return plain<Appointment | null>(
          await tx.appointment.findUnique({ where: { id } }),
        );
      },
      async list(filter) {
        return plain<Appointment[]>(
          await tx.appointment.findMany({
            where: {
              startsAt: { gte: new Date(filter.from), lt: new Date(filter.to) },
              ...(filter.providerId ? { providerId: filter.providerId } : {}),
              ...(filter.patientId ? { patientId: filter.patientId } : {}),
            },
            orderBy: [{ startsAt: "asc" }, { id: "asc" }],
          }),
        );
      },
      async create(input, actorId) {
        const result = await tx.appointment.create({
          data: {
            ...input,
            startsAt: new Date(input.startsAt),
            endsAt: new Date(input.endsAt),
          },
        });
        await tx.appointmentChange.create({
          data: {
            appointmentId: result.id,
            version: 1,
            snapshot: json(result),
            actorId,
          },
        });
        return plain<Appointment>(result);
      },
      async change(id, expected, patch, actorId) {
        const changed = await tx.appointment.updateMany({
          where: { id, version: expected },
          data: {
            ...patch,
            ...(patch.startsAt ? { startsAt: new Date(patch.startsAt) } : {}),
            ...(patch.endsAt ? { endsAt: new Date(patch.endsAt) } : {}),
            ...(patch.checkedInAt
              ? { checkedInAt: new Date(patch.checkedInAt) }
              : {}),
            version: { increment: 1 },
          },
        });
        if (changed.count !== 1) conflict();
        const result = await tx.appointment.findUniqueOrThrow({
          where: { id },
        });
        await tx.appointmentChange.create({
          data: {
            appointmentId: id,
            version: result.version,
            snapshot: json(result),
            actorId,
          },
        });
        return plain<Appointment>(result);
      },
      async history(appointmentId) {
        return plain<
          {
            version: number;
            snapshot: Appointment;
            actorId: string;
            recordedAt: string;
          }[]
        >(
          await tx.appointmentChange.findMany({
            where: { appointmentId },
            orderBy: { version: "desc" },
          }),
        );
      },
    },
    references: {
      async patient(id) {
        return plain<Patient | null>(
          await tx.patient.findUnique({ where: { id } }),
        );
      },
      async clinician(id) {
        return (await clinicianDirectory(raw,practiceId,id))[0] ?? null;
      },
      async encounter(id) {
        return plain<Consultation | null>(
          await tx.consultation.findUnique({ where: { id } }),
        );
      },
    },
    async directory() { return (await clinicianDirectory(raw,practiceId)).map(v=>({...v,role:v.role as Role})); },
    async audit(event) {
      await tx.auditEvent.create({ data: event });
    },
    async auditPage(offset, limit) {
      return plain<Audit[]>(
        await tx.auditEvent.findMany({
          orderBy: [{ recordedAt: "desc" }, { id: "asc" }],
          skip: offset,
          take: limit,
        }),
      );
    },
  };
}
export function persistence(database: Database): Persistence {
  return {
    async read(actor: Actor, action, subject, run) {
      return database.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${actor.practiceId ?? DEFAULT_PRACTICE}, 0))::text`;
        const practiceId=await verifyMembership(tx,actor);
        const u = unitOfWork(tx,practiceId);
        const result = await run(u);
        await u.audit({
          actorId: actor.id,
          action,
          subjectId: Array.isArray(result) && result.length === 0 ? "empty-result" : subject,
          outcome: "SUCCESS",
          correlationId: randomUUID(),
        });
        return result;
      });
    },
    async write(actor, key, command, action, run) {
      const fingerprint = createHash("sha256")
        .update(canonical({ action, command }))
        .digest("hex");
      try {
        return await database.$transaction(
          async (raw) => {
            await raw.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${actor.practiceId ?? DEFAULT_PRACTICE}, 0))::text`;
            const practiceId=await verifyMembership(raw,actor);
            const tx=scoped(raw,practiceId);
            if(!action.startsWith('document.print.')){
              const sub=await raw.practiceSubscription.findUniqueOrThrow({where:{practiceId}});
              if(effectiveState(sub)==='RESTRICTED')throw new AppError('FORBIDDEN','Subscription restricted: reads, prints and authorized exports remain available.');
            }
            const receiptKey=practiceId===DEFAULT_PRACTICE?key:practiceId+":"+key;
            // Serialize identical actor/key retries; different commands still use optimistic constraints.
            await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${actor.id + ":" + key}, 0))::text`;
            const previous = await tx.commandReceipt.findUnique({
              where: { actorId_key: { actorId: actor.id, key:receiptKey } },
            });
            if (previous) {
              if (previous.fingerprint !== fingerprint)
                throw new AppError(
                  "CONFLICT",
                  "This request key was already used for different content.",
                );
              return plain(previous.result);
            }
            const u = unitOfWork(raw,practiceId);
            const result = await run(u);
            const meta = result as { id?: string; version?: number };
            await u.audit({
              actorId: actor.id,
              action,
              subjectId: meta.id ?? "record",
              outcome: "SUCCESS",
              ...(meta.version !== undefined ? { version: meta.version } : {}),
              correlationId: key,
            });
            await tx.commandReceipt.create({
              data: {
                actorId: actor.id,
                key:receiptKey,
                fingerprint,
                result: json(result),
              },
            });
            return result;
          },
          { timeout: 15000, maxWait: 10000 },
        );
      } catch (error) {
        translate(error);
      }
    },
  };
}
