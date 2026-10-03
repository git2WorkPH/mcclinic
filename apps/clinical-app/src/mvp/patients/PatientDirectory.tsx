import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Button, Card, Field, styles, useLoad } from '../ui';
import type { Viewer } from '../types';
import { PatientWorkspace } from '../PatientWorkspace';
import { PatientRegistration } from './PatientRegistration';

type Props = { request: Api; actor: Viewer };

export function PatientDirectory({ request, actor }: Props) {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [register, setRegister] = useState(false);
  const records = useLoad(
    () =>
      request(G.PatientSearchDocument, { query: search, offset, limit: 20 }),
    [request, search, offset, refresh],
  );

  return (
    <View style={styles.columns}>
      <View style={styles.sidebar}>
        <Card title="Patients">
          <Field label="Search patients" value={query} onChange={setQuery} />
          <View style={styles.row}>
            <Button
              onPress={() => {
                setSearch(query);
                setOffset(0);
                setRefresh(refresh + 1);
              }}
            >
              Search
            </Button>
            <Button
              secondary
              onPress={() => {
                setRegister(true);
                setPatientId(null);
              }}
            >
              Register patient
            </Button>
          </View>
          {Boolean(records.error) && (
            <Text role="alert" style={styles.error}>
              {records.error}
            </Text>
          )}
          {records.value?.patients.items.map((patient) => (
            <View key={patient.id} style={styles.item}>
              <Button
                secondary
                onPress={() => {
                  setPatientId(patient.id);
                  setRegister(false);
                }}
              >
                {patient.givenName} {patient.familyName}
              </Button>
              <Text style={styles.muted}>
                Born {patient.birthDate} · {patient.id.slice(0, 8)}
              </Text>
            </View>
          ))}
          {records.value?.patients.total === 0 && (
            <Text style={styles.muted}>
              No patients found. Register a synthetic patient to begin.
            </Text>
          )}
          <Text style={styles.muted}>
            {records.value?.patients.total ?? 0} results
          </Text>
          <View style={styles.row}>
            <Button
              secondary
              disabled={offset === 0}
              onPress={() => setOffset(Math.max(0, offset - 20))}
            >
              Previous patients
            </Button>
            <Button
              secondary
              disabled={
                !records.value || offset + 20 >= records.value.patients.total
              }
              onPress={() => setOffset(offset + 20)}
            >
              Next patients
            </Button>
          </View>
        </Card>
      </View>
      <View style={styles.main}>
        {register ? (
          <PatientRegistration
            request={request}
            onCreated={(id) => {
              setRegister(false);
              setPatientId(id);
              setRefresh(refresh + 1);
            }}
          />
        ) : patientId ? (
          <PatientWorkspace
            key={patientId}
            request={request}
            patientId={patientId}
            actor={actor}
            onChanged={() => setRefresh(refresh + 1)}
          />
        ) : (
          <Card title="Your patient workspace">
            <Text style={styles.text}>
              Select a patient to review their record, or register a new
              synthetic patient.
            </Text>
            <Text style={styles.muted}>
              Patient identity stays visible as you move between notes,
              documents and appointments.
            </Text>
          </Card>
        )}
      </View>
    </View>
  );
}
