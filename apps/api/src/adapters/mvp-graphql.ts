import {onboardingUseCases} from '../modules/onboarding/application/onboarding.js';
import {onboardingStore} from '../modules/onboarding/infrastructure/store.js';
import type {Delivery} from '../modules/onboarding/infrastructure/mailbox.js';
import { validateTemplate } from "../modules/templates/application/template.js";
import { simulatedSubscription } from "../modules/subscription/application/policy.js";
import { practiceUseCases } from "../modules/practice/application/practices.js";
import { practiceServices } from "../modules/practice/infrastructure/practices.js";
import { createSchema, createYoga, createGraphQLError } from "graphql-yoga";
import { GraphQLError } from "graphql";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { Express } from "express";
import type { Resolvers } from "../../../../packages/graphql-contract/src/server.generated.js";
import type { Database } from "../infrastructure/prisma/database.js";
import { AppError, type Actor } from "../application/context.js";
import { composeMvp } from "../mvp-composition.js";
import { getSystemStatus } from "../modules/system/application/get-system-status.js";
import * as v from "./mvp-validation.js";
import type {
  ClinicalDocument,
  DocumentRevision,
} from "../clinical-document/domain/document.js";
interface Context {
  actor: Actor | null;
  token: string;
  clientKey: string;
}
const doc = (d: ClinicalDocument) => ({
  ...d,
  contentJson: JSON.stringify(d.content),
});
const revision = (d: DocumentRevision) => ({
  ...d,
  contentJson: JSON.stringify(d.content),
  patientName: d.patientSnapshot.name,
  issuerName: d.issuerSnapshot.name,
});
export function installMvpGraphql(app: Express, database: Database, delivery?:Delivery) {
  const services = composeMvp(database);
  const onboarding=onboardingUseCases(onboardingStore(database,delivery));
  const practices = practiceUseCases(practiceServices(database), {
    validateTemplate,
    simulatedSubscription,
  });
  const brandInput = z
    .object({
      systemName: z.string(),
      address: z.string(),
      phone: z.string(),
      email: z.string(),
      logo: z.string(),
      color: z.string(),
    })
    .strict();
  const templateInput = z
    .object({
      heading: z.string(),
      body: z.string(),
      footer: z.string(),
      layout: z.enum(["STANDARD", "COMPACT"]),
      includeAddress: z.boolean(),
    })
    .strict();
  const parse = (input: string) => {
    try {
      return JSON.parse(z.string().max(180000).parse(input));
    } catch {
      throw new AppError("VALIDATION", "Invalid settings JSON.");
    }
  };
  const attempts = new Map<string, { count: number; until: number }>();
  async function safe<T>(
    ctx: Context,
    action: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const code =
        error instanceof AppError
          ? error.code
          : error instanceof z.ZodError
            ? "VALIDATION"
            : "INTERNAL_SERVER_ERROR";
      try {
        await database.auditEvent.create({
          data: {
            practiceId:
              ctx.actor?.practiceId ?? "00000000-0000-4000-8000-000000000002",
            actorId: ctx.actor?.id ?? null,
            action,
            subjectId: "request",
            outcome:
              code === "FORBIDDEN" || code === "UNAUTHENTICATED"
                ? "DENIED"
                : "FAILED",
            correlationId: randomUUID(),
          },
        });
      } catch {
        /* Do not expose database/log payloads; original mutation remains rolled back. */
      }
      const publicError: GraphQLError = createGraphQLError(
        error instanceof AppError
          ? error.message
          : code === "VALIDATION"
            ? "Check the supplied fields."
            : "The request could not be completed.",
        { extensions: { code } },
      );
      throw publicError;
    }
  }
  const resolvers: Resolvers<Context> = {
    Query: {
      accountMfaEnabled: (_p,_a,c)=>safe(c,"account.security",()=>onboarding.status(c.actor)),
      practices: (_p, _a, c) =>
        safe(c, "practice.list", async () =>
          JSON.stringify(await practices.list(c.actor)),
        ),
      practiceSettings: (_p, _a, c) =>
        safe(c, "practice.settings", async () =>
          JSON.stringify(await practices.settings(c.actor)),
        ),
      practiceTemplates: (_p, _a, c) =>
        safe(c, "template.list", async () =>
          JSON.stringify(await practices.templates(c.actor)),
        ),
      practiceExport: (_p, _a, c) =>
        safe(c, "practice.export", async () =>
          JSON.stringify(await practices.export(c.actor)),
        ),
      previewPracticeTemplate: (_p, a, c) =>
        safe(c, "template.preview", () =>
          practices.previewTemplate(
            c.actor,
            templateInput.parse(parse(a.definition)),
            a.kind ?? undefined,
          ),
        ),
      systemStatus: () => getSystemStatus(),
      me: (_p, _a, c) => c.actor,
      providers: (_p, _a, c) =>
        safe(c, "directory.read", () => services.directory(c.actor)),
      patients: (_p, a, c) =>
        safe(c, "patient.search", () => {
          v.pagination.parse(a);
          return services.patients.search(
            c.actor,
            z.string().trim().max(200).parse(a.query),
            a.offset,
            a.limit,
          );
        }),
      patient: (_p, a, c) =>
        safe(c, "patient.read", () =>
          services.patients.get(c.actor, v.id.parse(a.id)),
        ),
      consultations: (_p, a, c) =>
        safe(c, "consultation.list", () =>
          services.consultations.list(c.actor, v.id.parse(a.patientId)),
        ),
      noteRevisions: (_p, a, c) =>
        safe(c, "note.revisions", () =>
          services.consultations.revisions(c.actor, v.id.parse(a.id)),
        ),
      documents: (_p, a, c) =>
        safe(c, "document.list", async () =>
          (await services.documents.list(c.actor, v.id.parse(a.patientId))).map(
            doc,
          ),
        ),
      documentRevisions: (_p, a, c) =>
        safe(c, "document.revisions", async () =>
          (await services.documents.revisions(c.actor, v.id.parse(a.id))).map(
            revision,
          ),
        ),
      previewDocument: (_p, a, c) =>
        safe(c, "document.preview", () =>
          services.documents.preview(
            c.actor,
            v.id.parse(a.id),
            v.expected.parse(a.version),
          ),
        ),
      appointments: (_p, a, c) =>
        safe(c, "appointment.list", () => {
          const from = v.instant.parse(a.from),
            to = v.instant.parse(a.to);
          if (Date.parse(to) <= Date.parse(from))
            throw new AppError(
              "VALIDATION",
              "End date must follow start date.",
            );
          return services.appointments.list(c.actor, {
            from,
            to,
            ...(a.providerId ? { providerId: v.id.parse(a.providerId) } : {}),
            ...(a.patientId ? { patientId: v.id.parse(a.patientId) } : {}),
          });
        }),
      appointmentHistory: (_p, a, c) =>
        safe(c, "appointment.history", async () =>
          (await services.appointments.history(c.actor, v.id.parse(a.id))).map(
            (x) => ({ ...x, snapshotJson: JSON.stringify(x.snapshot) }),
          ),
        ),
      history: (_p, a, c) =>
        safe(c, "history.read", () => {
          v.pagination.parse(a);
          return services.history.list(
            c.actor,
            v.id.parse(a.patientId),
            a.offset,
            a.limit,
          );
        }),
      auditEvents: (_p, a, c) =>
        safe(c, "audit.read", () => {
          v.pagination.parse(a);
          return services.audits(c.actor, a.offset, a.limit);
        }),
    },
    Mutation: {
      registerAccount:(_p,a,c)=>safe(c,'account.register',async()=>{await onboarding.register(a.input);return true;}),
      resendAccountVerification:(_p,a,c)=>safe(c,'account.verify.request',async()=>{await onboarding.resend(a.email);return true;}),
      verifyAccount:(_p,a,c)=>safe(c,'account.verify',async()=>{await onboarding.verify(a.token);return true;}),
      requestPasswordReset:(_p,a,c)=>safe(c,'account.reset.request',async()=>{await onboarding.resetRequest(a.email);return true;}),
      resetAccountPassword:(_p,a,c)=>safe(c,'account.password.reset',async()=>{await onboarding.reset(a.token,a.password,z.string().max(64).parse(a.code??''));return true;}),
      invitePracticeMember:(_p,a,c)=>safe(c,'membership.invite',async()=>{await onboarding.invite(c.actor,a.email,a.role);return true;}),
      acceptPracticeInvitation:(_p,a,c)=>safe(c,'membership.accept',async()=>{await onboarding.accept(a.token,a.password,z.string().max(64).parse(a.code??''));return true;}),
      startAccountMfa:(_p,a,c)=>safe(c,'account.mfa.enroll',async()=>JSON.stringify(await onboarding.startMfa(c.actor,z.string().max(256).parse(a.password)))),
      confirmAccountMfa:(_p,a,c)=>safe(c,'account.mfa.enabled',async()=>JSON.stringify(await onboarding.confirmMfa(c.actor,z.string().max(64).parse(a.code)))),
      disableAccountMfa:(_p,a,c)=>safe(c,'account.mfa.disabled',async()=>{await onboarding.disableMfa(c.actor,z.string().max(256).parse(a.password),z.string().max(64).parse(a.code));return true;}),

      createPractice: (_p, a, c) =>
        safe(c, "practice.create", async () =>
          JSON.stringify(
            await practices.create(
              c.actor,
              z.string().trim().min(1).max(100).parse(a.name),
            ),
          ),
        ),
      setPracticeMember: (_p, a, c) =>
        safe(c, "practice.member", async () =>
          JSON.stringify(
            await practices.member(
              c.actor,
              z
                .object({
                  username: z.string().min(1).max(100),
                  role: z.enum(["CLINICIAN", "RECEPTION", "ADMINISTRATOR"]),
                  active: z.boolean(),
                  expected: v.expected,
                })
                .strict()
                .parse(parse(a.input)),
            ),
          ),
        ),
      savePracticeBranding: (_p, a, c) =>
        safe(c, "practice.brand", async () =>
          JSON.stringify(
            await practices.brand(
              c.actor,
              v.expected.parse(a.expected),
              brandInput.parse(parse(a.input)),
            ),
          ),
        ),
      savePracticeTemplate: (_p, a, c) =>
        safe(c, "template.save", async () =>
          JSON.stringify(
            await practices.saveTemplate(
              c.actor,
              a.kind,
              v.expected.parse(a.expected),
              templateInput.parse(parse(a.definition)),
              a.publish,
            ),
          ),
        ),
      simulateSubscription: (_p, a, c) =>
        safe(c, "subscription.simulate", async () =>
          JSON.stringify(
            await practices.subscription(
              c.actor,
              v.expected.parse(a.expected),
              a.plan,
              a.state,
            ),
          ),
        ),
      login: (_p, a, c) =>
        safe(c, "session.login", async () => {
          const username = z.string().trim().min(1).max(100).parse(a.username),
            password = z.string().min(1).max(256).parse(a.password);
          const limitKey = c.clientKey + ":" + username.toLowerCase(),
            now = Date.now();
          if (attempts.size > 1000)
            for (const [k, val] of attempts)
              if (val.until < now) attempts.delete(k);
          const current = attempts.get(limitKey);
          if (current && current.until > now && current.count >= 10)
            throw new AppError(
              "UNAUTHENTICATED",
              "Too many attempts. Try again in 15 minutes.",
            );
          attempts.set(limitKey, {
            count: current && current.until > now ? current.count + 1 : 1,
            until:
              current && current.until > now ? current.until : now + 900000,
          });
          const result = await services.identity.login(username, password, z.string().max(64).parse(a.code??""));
          attempts.delete(limitKey);
          return result;
        }),
      logout: (_p, _a, c) =>
        safe(c, "session.logout", async () => {
          await services.identity.logout(c.token);
          return true;
        }),
      registerPatient: (_p, a, c) =>
        safe(c, "patient.create", () =>
          services.patients.create(
            c.actor,
            v.key.parse(a.key),
            v.patient.parse(a.input),
          ),
        ),
      updatePatient: (_p, a, c) =>
        safe(c, "patient.update", () =>
          services.patients.update(
            c.actor,
            v.key.parse(a.key),
            v.id.parse(a.id),
            v.expected.parse(a.expected),
            v.patient.parse(a.input),
          ),
        ),
      startConsultation: (_p, a, c) =>
        safe(c, "consultation.create", () =>
          services.consultations.create(
            c.actor,
            v.key.parse(a.key),
            v.id.parse(a.patientId),
            v.instant.parse(a.occurredAt),
          ),
        ),
      saveNote: (_p, a, c) =>
        safe(c, "note.save", () =>
          services.consultations.saveNote(
            c.actor,
            v.key.parse(a.key),
            v.id.parse(a.id),
            v.expected.parse(a.expected),
            v.note.parse(a.text),
            a.finalize,
            v.reason.parse(a.reason),
          ),
        ),
      closeConsultation: (_p, a, c) =>
        safe(c, "consultation.close", () =>
          services.consultations.close(
            c.actor,
            v.key.parse(a.key),
            v.id.parse(a.id),
            v.expected.parse(a.expected),
          ),
        ),
      createPrescription: (_p, a, c) =>
        safe(c, "prescription.create", async () =>
          doc(
            await services.documents.create(
              c.actor,
              v.key.parse(a.key),
              "PRESCRIPTION",
              v.id.parse(a.patientId),
              a.consultationId ? v.id.parse(a.consultationId) : null,
              v.prescription.parse(a.content),
            ),
          ),
        ),
      createCertificate: (_p, a, c) =>
        safe(c, "certificate.create", async () =>
          doc(
            await services.documents.create(
              c.actor,
              v.key.parse(a.key),
              "CERTIFICATE",
              v.id.parse(a.patientId),
              a.consultationId ? v.id.parse(a.consultationId) : null,
              v.certificate.parse(a.content),
            ),
          ),
        ),
      revisePrescription: (_p, a, c) =>
        safe(c, "prescription.revise", async () =>
          doc(
            await services.documents.revise(
              c.actor,
              v.key.parse(a.key),
              v.id.parse(a.id),
              v.expected.parse(a.expected),
              v.prescription.parse(a.content),
              a.issue,
              v.reason.parse(a.reason),
            ),
          ),
        ),
      reviseCertificate: (_p, a, c) =>
        safe(c, "certificate.revise", async () =>
          doc(
            await services.documents.revise(
              c.actor,
              v.key.parse(a.key),
              v.id.parse(a.id),
              v.expected.parse(a.expected),
              v.certificate.parse(a.content),
              a.issue,
              v.reason.parse(a.reason),
            ),
          ),
        ),
      recordPrint: (_p, a, c) =>
        safe(c, "document.print", () =>
          services.documents.printEvent(
            c.actor,
            v.key.parse(a.key),
            v.id.parse(a.id),
            v.expected.parse(a.version),
            z
              .enum(["REQUESTED", "DIALOG_CLOSED", "CANCELLED", "FAILED"])
              .parse(a.outcome),
          ),
        ),
      bookAppointment: (_p, a, c) =>
        safe(c, "appointment.create", () =>
          services.appointments.create(
            c.actor,
            v.key.parse(a.key),
            v.appointment.parse(a.input),
          ),
        ),
      rescheduleAppointment: (_p, a, c) =>
        safe(c, "appointment.reschedule", () =>
          services.appointments.reschedule(
            c.actor,
            v.key.parse(a.key),
            v.id.parse(a.id),
            v.expected.parse(a.expected),
            v.instant.parse(a.startsAt),
            v.instant.parse(a.endsAt),
            z.string().max(100).parse(a.timeZone),
          ),
        ),
      cancelAppointment: (_p, a, c) =>
        safe(c, "appointment.cancel", () =>
          services.appointments.cancel(
            c.actor,
            v.key.parse(a.key),
            v.id.parse(a.id),
            v.expected.parse(a.expected),
            v.reason.parse(a.reason),
          ),
        ),
      checkIn: (_p, a, c) =>
        safe(c, "appointment.check-in", () =>
          services.appointments.checkIn(
            c.actor,
            v.key.parse(a.key),
            v.id.parse(a.id),
            v.expected.parse(a.expected),
            v.id.parse(a.patientId),
          ),
        ),
    },
  };
  const schemaText =
    readFileSync(
      new URL(
        "../../../../packages/graphql-contract/schema.graphql",
        import.meta.url,
      ),
      "utf8",
    ) +
    "\n" +
    readFileSync(
      new URL(
        "../../../../packages/graphql-contract/mvp.graphql",
        import.meta.url,
      ),
      "utf8",
    );
  const yoga = createYoga({
    schema: createSchema({ typeDefs: schemaText, resolvers }),
    graphqlEndpoint: "/mvp/graphql",
    graphiql: false,
    logging: false,
    cors: false,
    maskedErrors: true,
    context: async ({ request }): Promise<Context> => {
      const header = request.headers.get("authorization") ?? "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : "";
      return {
        token,
        actor: await practices.actor(
          await services.identity.resolve(token),
          request.headers.get("x-practice-id"),
        ),
        clientKey: "local",
      };
    },
  });
  app.use("/mvp/graphql", yoga);
  app.get("/health/ready", async (_req, res) => {
    try {
      await database.$queryRaw`SELECT 1`;
      res.json({ status: "ready" });
    } catch {
      res.status(503).json({ status: "unavailable" });
    }
  });
}
