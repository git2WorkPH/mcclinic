import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import {
  Button,
  Feedback,
  Field,
  formatTime,
  iso,
  styles,
  useAction,
  useLoad,
} from '../ui';
import { localInput } from './scheduling';

type Props = {
  request: Api;
  appointment: G.AppointmentFieldsFragment;
  providerName: string;
  onChanged: () => void;
};

export function AppointmentRow({
  request,
  appointment,
  providerName,
  onChanged,
}: Props) {
  const [mode, setMode] = useState('');
  const [start, setStart] = useState(
    localInput(new Date(appointment.startsAt)),
  );
  const [end, setEnd] = useState(localInput(new Date(appointment.endsAt)));
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const action = useAction();
  const patient = useLoad(
    () => request(G.PatientRecordDocument, { id: appointment.patientId }),
    [request, appointment.patientId],
  );
  const past = useLoad(
    () =>
      mode === 'history'
        ? request(G.VisitHistoryDocument, { id: appointment.id })
        : Promise.resolve(null),
    [request, appointment.id, mode],
  );

  return (
    <View style={styles.item}>
      <Text style={styles.subheading}>
        {patient.value
          ? `${patient.value.patient.givenName} ${patient.value.patient.familyName}`
          : appointment.patientId}{' '}
        · {formatTime(appointment.startsAt)}
      </Text>
      <Text style={styles.text}>
        {providerName} · until {formatTime(appointment.endsAt)}
      </Text>
      <Text style={styles.badge}>
        {appointment.state} · version {appointment.version}
      </Text>
      {appointment.checkedInAt && (
        <Text style={styles.muted}>
          Arrived {formatTime(appointment.checkedInAt)}
        </Text>
      )}
      {Boolean(appointment.cancellationReason) && (
        <Text style={styles.muted}>
          Cancelled: {appointment.cancellationReason}
        </Text>
      )}
      <View style={styles.row}>
        {appointment.state === 'BOOKED' && (
          <>
            <Button
              secondary
              onPress={() => setMode(mode === 'reschedule' ? '' : 'reschedule')}
            >
              Reschedule appointment
            </Button>
            <Button
              secondary
              onPress={() => setMode(mode === 'cancel' ? '' : 'cancel')}
            >
              Cancel appointment
            </Button>
            <Button
              onPress={() => setMode(mode === 'checkin' ? '' : 'checkin')}
            >
              Check in patient
            </Button>
          </>
        )}
        <Button
          secondary
          onPress={() => setMode(mode === 'history' ? '' : 'history')}
        >
          Appointment history
        </Button>
      </View>
      {mode === 'reschedule' && (
        <>
          <View style={styles.row}>
            <Field
              label="Reschedule start (local)"
              value={start}
              onChange={setStart}
            />
            <Field
              label="Reschedule end (local)"
              value={end}
              onChange={setEnd}
            />
          </View>
          <Button
            disabled={action.busy}
            onPress={() =>
              void action.run(
                async (key) => {
                  await request(G.RescheduleVisitDocument, {
                    key,
                    id: appointment.id,
                    expected: appointment.version,
                    startsAt: iso(start),
                    endsAt: iso(end),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  });
                  onChanged();
                },
                JSON.stringify({ id: appointment.id, start, end }),
              )
            }
          >
            Save reschedule
          </Button>
        </>
      )}
      {mode === 'cancel' && (
        <>
          <Field
            label="Cancellation reason"
            value={reason}
            onChange={setReason}
          />
          <Button
            disabled={action.busy}
            onPress={() =>
              void action.run(
                async (key) => {
                  await request(G.CancelVisitDocument, {
                    key,
                    id: appointment.id,
                    expected: appointment.version,
                    reason,
                  });
                  onChanged();
                },
                JSON.stringify({ id: appointment.id, reason }),
              )
            }
          >
            Confirm cancellation
          </Button>
        </>
      )}
      {mode === 'checkin' && (
        <>
          <Text style={styles.text}>
            Confirm arriving patient: {patient.value?.patient.givenName}{' '}
            {patient.value?.patient.familyName}, DOB{' '}
            {patient.value?.patient.birthDate}.
          </Text>
          <Button
            secondary={!confirmed}
            onPress={() => setConfirmed(!confirmed)}
          >
            {confirmed ? 'Identity confirmed' : 'Confirm patient identity'}
          </Button>
          <Button
            disabled={action.busy || !confirmed}
            onPress={() =>
              void action.run(async (key) => {
                await request(G.CheckInVisitDocument, {
                  key,
                  id: appointment.id,
                  expected: appointment.version,
                  patientId: appointment.patientId,
                });
                onChanged();
              }, 'checkin:' + appointment.id)
            }
          >
            Record arrival
          </Button>
        </>
      )}
      {mode === 'history' &&
        past.value?.appointmentHistory.map((history) => (
          <View key={history.version} style={styles.item}>
            <Text style={styles.muted}>
              Version {history.version} · {formatTime(history.recordedAt)} ·
              actor {history.actorId}
            </Text>
            <Text style={styles.text}>
              {(() => {
                const snapshot = JSON.parse(
                  history.snapshotJson,
                ) as G.AppointmentFieldsFragment;
                return `${snapshot.state} · ${formatTime(snapshot.startsAt)} to ${formatTime(snapshot.endsAt)}${snapshot.cancellationReason ? ' · ' + snapshot.cancellationReason : ''}`;
              })()}
            </Text>
          </View>
        ))}
      <Feedback state={action} />
    </View>
  );
}
