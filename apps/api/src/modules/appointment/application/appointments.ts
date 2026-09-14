import {
  authorize,
  requireValue,
  AppError,
  type Actor,
} from '../../../application/context.js';
import type { Persistence, Runtime } from '../../../application/ports.js';
import type { AppointmentInput } from '../domain/appointment.js';
export function validateSchedule(input: AppointmentInput) {
  const duration = Date.parse(input.endsAt) - Date.parse(input.startsAt);
  if (!Number.isFinite(duration) || duration < 300000 || duration > 28800000)
    throw new AppError(
      'VALIDATION',
      'Appointment duration must be 5 minutes to 8 hours.',
    );
  try {
    new Intl.DateTimeFormat('en', { timeZone: input.timeZone });
  } catch {
    throw new AppError('VALIDATION', 'Choose a valid timezone.');
  }
}
export function appointmentUseCases(db: Persistence, clock: Runtime) {
  return {
    list(
      actor: Actor | null,
      filter: {
        from: string;
        to: string;
        providerId?: string;
        patientId?: string;
      },
    ) {
      const a = authorize(actor, 'schedule');
      return db.read(a, 'appointment.list', 'schedule', (u) =>
        u.appointments.list(filter),
      );
    },
    history(actor: Actor | null, id: string) {
      const a = authorize(actor, 'schedule');
      return db.read(a, 'appointment.history', id, (u) =>
        u.appointments.history(id),
      );
    },
    create(actor: Actor | null, key: string, input: AppointmentInput) {
      const a = authorize(actor, 'schedule');
      validateSchedule(input);
      return db.write(a, key, input, 'appointment.create', async (u) => {
        requireValue(await u.references.patient(input.patientId));
        requireValue(await u.references.clinician(input.providerId));
        return u.appointments.create(input, a.id);
      });
    },
    reschedule(
      actor: Actor | null,
      key: string,
      id: string,
      expected: number,
      startsAt: string,
      endsAt: string,
      timeZone: string,
    ) {
      const a = authorize(actor, 'schedule');
      return db.write(
        a,
        key,
        { id, expected, startsAt, endsAt, timeZone },
        'appointment.reschedule',
        async (u) => {
          const current = requireValue(await u.appointments.get(id));
          if (current.state !== 'BOOKED')
            throw new AppError(
              'VALIDATION',
              'Only booked appointments may be rescheduled.',
            );
          validateSchedule({ ...current, startsAt, endsAt, timeZone });
          return u.appointments.change(
            id,
            expected,
            { startsAt, endsAt, timeZone },
            a.id,
          );
        },
      );
    },
    cancel(
      actor: Actor | null,
      key: string,
      id: string,
      expected: number,
      reason: string,
    ) {
      const a = authorize(actor, 'schedule');
      if (!reason.trim())
        throw new AppError('VALIDATION', 'Cancellation reason is required.');
      return db.write(
        a,
        key,
        { id, expected, reason },
        'appointment.cancel',
        async (u) => {
          const current = requireValue(await u.appointments.get(id));
          if (current.state !== 'BOOKED')
            throw new AppError(
              'VALIDATION',
              'Only booked appointments may be cancelled.',
            );
          return u.appointments.change(
            id,
            expected,
            { state: 'CANCELLED', cancellationReason: reason },
            a.id,
          );
        },
      );
    },
    checkIn(
      actor: Actor | null,
      key: string,
      id: string,
      expected: number,
      patientId: string,
    ) {
      const a = authorize(actor, 'schedule');
      return db.write(
        a,
        key,
        { id, expected, patientId },
        'appointment.check-in',
        async (u) => {
          const current = requireValue(await u.appointments.get(id));
          if (current.patientId !== patientId)
            throw new AppError(
              'VALIDATION',
              'Confirm the correct patient before check-in.',
            );
          if (current.state === 'CHECKED_IN') return current;
          if (current.state !== 'BOOKED')
            throw new AppError(
              'VALIDATION',
              'Only booked appointments can be checked in.',
            );
          return u.appointments.change(
            id,
            expected,
            {
              state: 'CHECKED_IN',
              checkedInAt: clock.now(),
              checkedInBy: a.id,
            },
            a.id,
          );
        },
      );
    },
  };
}
