import { z } from "zod";
export const id = z.uuid();
export const key = z.string().min(8).max(120);
export const expected = z.number().int().min(0);
export const instant = z.iso.datetime({ offset: true });
const text = z.string().trim().min(1).max(500);
export const patient = z
  .object({
    givenName: text.max(100),
    familyName: text.max(100),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    phone: z.string().trim().max(50),
    email: z.union([z.literal(""), z.email()]),
    address: z.string().trim().max(1000),
  })
  .strict();
export const prescription = z
  .object({
    items: z
      .array(
        z
          .object({
            medication: text,
            strength: text,
            dose: text,
            route: text,
            frequency: text,
            duration: text,
            quantity: text,
            repeats: z.number().int().min(0).max(12),
          })
          .strict(),
      )
      .min(1)
      .max(30),
    directions: z.string().trim().min(1).max(20000),
  })
  .strict();
export const certificate = z
  .object({
    title: text,
    statement: z.string().trim().min(1).max(20000),
    startsOn: z.string(),
    endsOn: z.string(),
  })
  .strict();
export const appointment = z
  .object({
    patientId: id,
    providerId: id,
    startsAt: instant,
    endsAt: instant,
    timeZone: text,
  })
  .strict();
export const pagination = z.object({
  offset: z.number().int().min(0).max(100000),
  limit: z.number().int().min(1).max(100),
});
export const note = z.string().trim().min(1).max(50000);
export const reason = z.string().trim().max(2000);
