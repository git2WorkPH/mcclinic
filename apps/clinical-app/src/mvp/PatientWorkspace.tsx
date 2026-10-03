import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from './client';
import { Button, Card, Feedback, styles, useAction, useLoad } from './ui';
import { ConsultationPanel } from './consultations/ConsultationPanel';
import { HistoryPanel } from './consultations/HistoryPanel';
import { PatientForm } from './patients/PatientForm';
import { DocumentPanel } from './DocumentPanel';
import { SchedulePanel } from './SchedulePanel';
export function PatientWorkspace({
  request,
  patientId,
  actor,
  onChanged,
}: {
  request: Api;
  patientId: string;
  actor: NonNullable<G.ViewerQuery['me']>;
  onChanged: () => void;
}) {
  const [tab, setTab] = useState('Profile'),
    [refresh, setRefresh] = useState(0);
  const [sourceId, setSourceId] = useState<string | undefined>();
  const profile = useLoad(
    () => request(G.PatientRecordDocument, { id: patientId }),
    [request, patientId, refresh],
  );
  const action = useAction();
  if (profile.error)
    return (
      <Text role="alert" style={styles.error}>
        {profile.error}
      </Text>
    );
  if (!profile.value) return <Text>Loading patient…</Text>;
  const p = profile.value.patient;
  function changed() {
    setRefresh(refresh + 1);
    onChanged();
  }
  const initial: G.PatientInput = {
    givenName: p.givenName,
    familyName: p.familyName,
    birthDate: p.birthDate,
    phone: p.phone,
    email: p.email,
    address: p.address,
  };
  return (
    <>
      <View style={styles.patientContext}>
        <Text role="heading" style={styles.heading}>
          {p.givenName} {p.familyName}
        </Text>
        <Text style={styles.text}>
          DOB {p.birthDate} · {p.phone || 'No phone'}
        </Text>
        <Text style={styles.muted}>
          Patient ID {p.id} · Profile version {p.version}
        </Text>
        <View style={styles.tabs}>
          {[
            'Profile',
            ...(actor.role === 'CLINICIAN'
              ? ['Consultations', 'Documents', 'History']
              : []),
            'Appointments',
          ].map((t) => (
            <Button
              key={t}
              secondary={tab !== t}
              onPress={() => {
                setSourceId(undefined);
                setTab(t);
              }}
            >
              {t}
            </Button>
          ))}
        </View>
      </View>
      {tab === 'Profile' ? (
        <Card title="Patient profile">
          <PatientForm
            key={p.version}
            initial={initial}
            busy={action.busy}
            onSave={(input) =>
              void action.run(
                async (key) => {
                  await request(G.UpdateProfileDocument, {
                    key,
                    id: p.id,
                    expected: p.version,
                    input,
                  });
                  changed();
                },
                JSON.stringify({ version: p.version, input }),
              )
            }
          />
          <Feedback state={action} />
          <Button secondary onPress={changed}>
            Reload profile
          </Button>
        </Card>
      ) : tab === 'Consultations' ? (
        <ConsultationPanel
          request={request}
          patientId={patientId}
          actorId={actor.id}
          sourceId={sourceId}
        />
      ) : tab === 'Documents' ? (
        <DocumentPanel
          request={request}
          patientId={patientId}
          actorId={actor.id}
          sourceId={sourceId}
        />
      ) : tab === 'History' ? (
        <HistoryPanel
          request={request}
          patientId={patientId}
          onSource={(id, type) => {
            setSourceId(id);
            setTab(
              type === 'CONSULTATION' || type === 'NOTE'
                ? 'Consultations'
                : 'Documents',
            );
          }}
        />
      ) : (
        <SchedulePanel request={request} patientId={patientId} />
      )}
    </>
  );
}
