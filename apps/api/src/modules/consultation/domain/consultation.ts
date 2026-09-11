export interface Consultation { id: string; patientId: string; providerId: string; occurredAt: string; state: string; version: number; noteState: string; noteVersion: number; noteText: string }
export interface NoteRevision { id: string; consultationId: string; version: number; text: string; state: string; authorId: string; reason: string; previousVersion: number | null; recordedAt: string }
