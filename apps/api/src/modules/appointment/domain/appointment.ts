export interface AppointmentInput { patientId: string; providerId: string; startsAt: string; endsAt: string; timeZone: string }
export interface Appointment extends AppointmentInput { id: string; state: string; version: number; checkedInAt: string | null; checkedInBy: string | null; cancellationReason: string }
