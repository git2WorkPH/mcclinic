import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from './client';
import {
  Button,
  Card,
  Feedback,
  Field,
  iso,
  styles,
  useAction,
  useLoad,
} from './ui';
import { AppointmentRow } from './appointments/AppointmentRow';
import { localInput } from './appointments/scheduling';

export function SchedulePanel({
  request,
  patientId,
}: {
  request: Api;
  patientId?: string;
}) {
  const [refresh, setRefresh] = useState(0),
    [from, setFrom] = useState(localInput(new Date()).slice(0, 10)),
    [to, setTo] = useState(
      localInput(new Date(Date.now() + 86400000)).slice(0, 10),
    ),
    [filterProvider, setFilterProvider] = useState('');
  const [patient, setPatient] = useState(patientId ?? ''),
    [patientQuery, setPatientQuery] = useState(''),
    [provider, setProvider] = useState(''),
    [start, setStart] = useState(localInput(new Date(Date.now() + 3600000))),
    [end, setEnd] = useState(localInput(new Date(Date.now() + 5400000)));
  const providers = useLoad(() => request(G.ProvidersDocument, {}), [request]);
  const candidates = useLoad(
    () =>
      patientId
        ? Promise.resolve(null)
        : request(G.PatientSearchDocument, {
            query: patientQuery,
            offset: 0,
            limit: 20,
          }),
    [request, patientQuery, patientId],
  );
  useEffect(() => {
    if (!provider && providers.value?.providers[0])
      setProvider(providers.value.providers[0].id);
  }, [provider, providers.value]);
  const schedule = useLoad(
    async () =>
      request(G.ScheduleDocument, {
        from: iso(from + 'T00:00'),
        to: iso(to + 'T00:00'),
        ...(patientId ? { patientId } : {}),
        ...(filterProvider ? { providerId: filterProvider } : {}),
      }),
    [request, patientId, from, to, filterProvider, refresh],
  );
  const action = useAction();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <>
      <Card title="Appointments">
        <Text style={styles.muted}>
          All input/display times use {timeZone}. Provider and patient overlaps
          are prevented. No walk-ins or reminders in this MVP.
        </Text>
        <View style={styles.row}>
          <Field label="Schedule from date" value={from} onChange={setFrom} />
          <Field
            label="Schedule to date (exclusive)"
            value={to}
            onChange={setTo}
          />
          <Button secondary onPress={() => setRefresh(refresh + 1)}>
            Refresh appointments
          </Button>
        </View>
        <View style={styles.row}>
          <Button
            secondary={Boolean(filterProvider)}
            onPress={() => setFilterProvider('')}
          >
            All providers
          </Button>
          {providers.value?.providers.map((p) => (
            <Button
              key={p.id}
              secondary={filterProvider !== p.id}
              onPress={() => setFilterProvider(p.id)}
            >
              {p.name}
            </Button>
          ))}
        </View>
        {Boolean(schedule.error) && (
          <Text role="alert" style={styles.error}>
            {schedule.error}
          </Text>
        )}
        {schedule.value?.appointments.length === 0 && (
          <Text style={styles.muted}>No appointments in this date range.</Text>
        )}
        {schedule.value?.appointments.map((a) => (
          <AppointmentRow
            key={`${a.id}:${a.version}`}
            request={request}
            appointment={a}
            providerName={
              providers.value?.providers.find((p) => p.id === a.providerId)
                ?.name ?? a.providerId
            }
            onChanged={() => setRefresh(refresh + 1)}
          />
        ))}
      </Card>
      <Card title="Book appointment">
        {!patientId && (
          <>
            <Field
              label="Find patient for booking"
              value={patientQuery}
              onChange={setPatientQuery}
            />
            <View style={styles.row}>
              {candidates.value?.patients.items.map((p) => (
                <Button
                  key={p.id}
                  secondary={patient !== p.id}
                  onPress={() => setPatient(p.id)}
                >
                  {p.givenName} {p.familyName} · {p.birthDate}
                </Button>
              ))}
            </View>
          </>
        )}
        <Text style={styles.muted}>
          Patient: {patient || 'Select a patient'}
        </Text>
        <Text style={styles.label}>Booking provider</Text>
        <View style={styles.row}>
          {providers.value?.providers.map((p) => (
            <Button
              key={p.id}
              secondary={provider !== p.id}
              onPress={() => setProvider(p.id)}
            >
              {p.name}
            </Button>
          ))}
        </View>
        <View style={styles.row}>
          <Field
            label="Appointment start (local)"
            value={start}
            onChange={setStart}
          />
          <Field
            label="Appointment end (local)"
            value={end}
            onChange={setEnd}
          />
        </View>
        <Button
          disabled={action.busy || !patient || !provider}
          onPress={() =>
            void action.run(async (key) => {
              const input = {
                patientId: patient,
                providerId: provider,
                startsAt: iso(start),
                endsAt: iso(end),
                timeZone,
              };
              await request(G.BookVisitDocument, { key, input });
              setFrom(start.slice(0, 10));
              setTo(
                localInput(
                  new Date(new Date(start).valueOf() + 86400000),
                ).slice(0, 10),
              );
              setRefresh(refresh + 1);
            }, JSON.stringify({ patient, provider, start, end }))
          }
        >
          Book appointment
        </Button>
        <Feedback state={action} />
      </Card>
    </>
  );
}
