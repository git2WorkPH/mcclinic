export type Role = "CLINICIAN" | "RECEPTION" | "ADMINISTRATOR";
export interface Actor {
  id: string;
  name: string;
  role: Role;
}
export type Permission =
  | "patient"
  | "schedule"
  | "clinical"
  | "audit"
  | "directory";
const grants: Record<Role, readonly Permission[]> = {
  CLINICIAN: ["patient", "schedule", "clinical", "directory"],
  RECEPTION: ["patient", "schedule", "directory"],
  ADMINISTRATOR: ["patient", "schedule", "directory", "audit"],
};
export class AppError extends Error {
  constructor(
    public code:
      | "UNAUTHENTICATED"
      | "FORBIDDEN"
      | "VALIDATION"
      | "CONFLICT"
      | "NOT_FOUND",
    message: string,
  ) {
    super(message);
  }
}
export function authorize(actor: Actor | null, permission: Permission): Actor {
  if (!actor) throw new AppError("UNAUTHENTICATED", "Sign in to continue.");
  if (!grants[actor.role]?.includes(permission))
    throw new AppError(
      "FORBIDDEN",
      "You do not have permission for this action.",
    );
  return actor;
}
export function requireOwner(actor: Actor, ownerId: string) {
  if (actor.id !== ownerId)
    throw new AppError(
      "FORBIDDEN",
      "Only the responsible clinician may change this record.",
    );
}
export function requireValue<T>(value: T | null): T {
  if (value === null) throw new AppError("NOT_FOUND", "Record not found.");
  return value;
}
export function conflict() {
  throw new AppError("CONFLICT", "The record changed. Reload before saving.");
}
export function validDate(value: string) {
  const date = new Date(value + "T00:00:00Z");
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(date.valueOf()) &&
    date.toISOString().slice(0, 10) === value
  );
}
