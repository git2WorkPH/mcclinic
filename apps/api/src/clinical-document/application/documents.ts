import {
  authorize,
  requireOwner,
  requireValue,
  AppError,
  type Actor,
} from "../../application/context.js";
import type { Persistence } from "../../application/ports.js";
import type {
  DocumentContent,
  DocumentKind,
  DocumentRevision,
} from "../domain/document.js";
export interface DocumentRenderer {
  render(kind: DocumentKind, revision: DocumentRevision): string;
}
export function documentUseCases(
  db: Persistence,
  validate: (kind: DocumentKind, content: DocumentContent) => void,
  renderer: DocumentRenderer,
) {
  return {
    list(actor: Actor | null, patientId: string) {
      const a = authorize(actor, "clinical");
      return db.read(a, "document.list", patientId, (u) =>
        u.documents.list(patientId),
      );
    },
    revisions(actor: Actor | null, id: string) {
      const a = authorize(actor, "clinical");
      return db.read(a, "document.revisions", id, (u) =>
        u.documents.revisions(id),
      );
    },
    create(
      actor: Actor | null,
      key: string,
      kind: DocumentKind,
      patientId: string,
      consultationId: string | null,
      content: DocumentContent,
    ) {
      const a = authorize(actor, "clinical");
      validate(kind, content);
      return db.write(
        a,
        key,
        { kind, patientId, consultationId, content },
        "document.create",
        async (u) => {
          requireValue(await u.references.patient(patientId));
          if (consultationId) {
            const e = requireValue(
              await u.references.encounter(consultationId),
            );
            if (e.patientId !== patientId)
              throw new AppError(
                "VALIDATION",
                "The consultation belongs to another patient.",
              );
          }
          return u.documents.create({
            kind,
            patientId,
            consultationId,
            authorId: a.id,
            content,
          });
        },
      );
    },
    revise(
      actor: Actor | null,
      key: string,
      id: string,
      expected: number,
      content: DocumentContent,
      issue: boolean,
      reason: string,
    ) {
      const a = authorize(actor, "clinical");
      return db.write(
        a,
        key,
        { id, expected, content, issue, reason },
        "document.revise",
        async (u) => {
          const document = requireValue(await u.documents.get(id));
          requireOwner(a, document.authorId);
          if ((document.kind === "PRESCRIPTION" && !("items" in content)) ||
              (document.kind === "CERTIFICATE" && !("statement" in content))) {
            throw new AppError("VALIDATION", "The content type does not match this document.");
          }
          validate(document.kind, content);
          if (document.state === "ISSUED" && (!issue || !reason.trim()))
            throw new AppError(
              "VALIDATION",
              "An issued document requires a reasoned issued amendment.",
            );
          const p = requireValue(
            await u.references.patient(document.patientId),
          );
          return u.documents.revise(
            id,
            expected,
            content,
            issue ? "ISSUED" : "DRAFT",
            {
              content,
              state: issue ? "ISSUED" : "DRAFT",
              patientSnapshot: {
                id: p.id,
                name: `${p.givenName} ${p.familyName}`,
                birthDate: p.birthDate,
              },
              issuerSnapshot: { id: a.id, name: a.name },
              templateVersion: "demo-v1",
              authorId: a.id,
              reason,
              previousVersion: expected,
            },
          );
        },
      );
    },
    preview(actor: Actor | null, id: string, version: number) {
      const a = authorize(actor, "clinical");
      return db.read(a, "document.preview", id, async (u) => {
        const document = requireValue(await u.documents.get(id));
        const revision = requireValue(
          (await u.documents.revisions(id)).find(
            (v) => v.version === version,
          ) ?? null,
        );
        if (revision.state !== "ISSUED")
          throw new AppError(
            "VALIDATION",
            "Only an issued demo version can be printed.",
          );
        return revision.renderedHtml ?? renderer.render(document.kind, revision);
      });
    },
    printEvent(
      actor: Actor | null,
      key: string,
      id: string,
      version: number,
      outcome: string,
    ) {
      const a = authorize(actor, "clinical");
      return db.write(
        a,
        key,
        { id, version, outcome },
        `document.print.${outcome.toLowerCase()}`,
        async (u) => {
          requireValue(await u.documents.get(id));
          const rev = requireValue(
            (await u.documents.revisions(id)).find(
              (v) => v.version === version,
            ) ?? null,
          );
          if (rev.state !== "ISSUED")
            throw new AppError(
              "VALIDATION",
              "Only an issued demo version can be printed.",
            );
          return { id, version };
        },
      );
    },
  };
}
