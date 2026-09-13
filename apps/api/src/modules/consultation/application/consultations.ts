import {
  authorize,
  requireOwner,
  requireValue,
  AppError,
  type Actor,
} from "../../../application/context.js";
import type { Persistence } from "../../../application/ports.js";
export function consultationUseCases(db: Persistence) {
  return {
    list(actor: Actor | null, patientId: string) {
      const a = authorize(actor, "clinical");
      return db.read(a, "consultation.list", patientId, (u) =>
        u.consultations.list(patientId),
      );
    },
    revisions(actor: Actor | null, id: string) {
      const a = authorize(actor, "clinical");
      return db.read(a, "note.revisions", id, (u) =>
        u.consultations.revisions(id),
      );
    },
    create(
      actor: Actor | null,
      key: string,
      patientId: string,
      occurredAt: string,
    ) {
      const a = authorize(actor, "clinical");
      return db.write(
        a,
        key,
        { patientId, occurredAt },
        "consultation.create",
        async (u) => {
          requireValue(await u.references.patient(patientId));
          return u.consultations.create(patientId, a.id, occurredAt);
        },
      );
    },
    saveNote(
      actor: Actor | null,
      key: string,
      id: string,
      expected: number,
      text: string,
      finalize: boolean,
      reason: string,
    ) {
      const a = authorize(actor, "clinical");
      if (!text.trim())
        throw new AppError("VALIDATION", "Note text is required.");
      return db.write(
        a,
        key,
        { id, expected, text, finalize, reason },
        "note.save",
        async (u) => {
          const encounter = requireValue(await u.consultations.get(id));
          requireOwner(a, encounter.providerId);
          if (
            encounter.noteState === "FINALIZED" &&
            (!reason.trim() || !finalize)
          )
            throw new AppError(
              "VALIDATION",
              "A finalized note requires a reasoned finalized amendment.",
            );
          return u.consultations.saveNote(
            id,
            expected,
            text,
            finalize ? "FINALIZED" : "DRAFT",
            reason,
            a.id,
          );
        },
      );
    },
    close(actor: Actor | null, key: string, id: string, expected: number) {
      const a = authorize(actor, "clinical");
      return db.write(
        a,
        key,
        { id, expected },
        "consultation.close",
        async (u) => {
          const encounter = requireValue(await u.consultations.get(id));
          requireOwner(a, encounter.providerId);
          if (encounter.noteState !== "FINALIZED" || encounter.state !== "OPEN")
            throw new AppError(
              "VALIDATION",
              "Only an open consultation with a finalized note can be closed.",
            );
          return u.consultations.close(id, expected);
        },
      );
    },
  };
}
