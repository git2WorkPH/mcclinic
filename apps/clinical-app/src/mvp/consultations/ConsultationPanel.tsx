import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import {
  Button,
  Card,
  Feedback,
  Field,
  formatTime,
  styles,
  useAction,
  useLoad,
} from '../ui';

export function ConsultationPanel({
  request,
  patientId,
  actorId,
  sourceId,
}: {
  request: Api;
  patientId: string;
  actorId: string;
  sourceId?: string | undefined;
}) {
  const [refresh, setRefresh] = useState(0),
    [selected, setSelected] = useState<string | null>(sourceId ?? null);
  const records = useLoad(
    () => request(G.ClinicalRecordsDocument, { patientId }),
    [request, patientId, refresh],
  );
  const action = useAction();
  return (
    <Card title="Consultations">
      <Button
        disabled={action.busy}
        onPress={() =>
          void action.run(async (key) => {
            const created = (
              await request(G.StartEncounterDocument, {
                key,
                patientId,
                occurredAt: new Date().toISOString(),
              })
            ).startConsultation;
            setSelected(created.id);
            setRefresh(refresh + 1);
          }, 'start:' + patientId)
        }
      >
        Start consultation
      </Button>
      <Feedback state={action} />
      {Boolean(records.error) && (
        <Text role="alert" style={styles.error}>
          {records.error}
        </Text>
      )}
      {records.value?.consultations.length === 0 && (
        <Text style={styles.muted}>No consultations yet.</Text>
      )}
      {records.value?.consultations
        .filter((e) => !sourceId || e.id === sourceId)
        .map((e) => (
          <View key={e.id} style={styles.item}>
            <View style={styles.row}>
              <Button
                secondary={selected !== e.id}
                onPress={() => setSelected(e.id)}
              >
                {formatTime(e.occurredAt)}
              </Button>
              <Text style={styles.badge}>
                {e.state} · note {e.noteState} v{e.noteVersion}
              </Text>
            </View>
            {selected === e.id && (
              <NoteEditor
                key={`${e.id}:${e.noteVersion}:${e.version}`}
                request={request}
                encounter={e}
                canEdit={e.providerId === actorId}
                onSaved={() => setRefresh(refresh + 1)}
              />
            )}
          </View>
        ))}
    </Card>
  );
}
function NoteEditor({
  request,
  encounter: e,
  canEdit,
  onSaved,
}: {
  request: Api;
  encounter: G.EncounterFieldsFragment;
  canEdit: boolean;
  onSaved: () => void;
}) {
  const [text, setText] = useState(e.noteText),
    [reason, setReason] = useState(''),
    [showVersions, setShowVersions] = useState(false);
  const action = useAction();
  function save(finalize: boolean) {
    void action.run(
      async (key) => {
        await request(G.SaveClinicalNoteDocument, {
          key,
          id: e.id,
          expected: e.noteVersion,
          text,
          reason,
          finalize,
        });
        onSaved();
      },
      JSON.stringify({
        id: e.id,
        version: e.noteVersion,
        text,
        reason,
        finalize,
      }),
    );
  }
  return (
    <View style={{ gap: 14 }}>
      <Text style={styles.muted}>
        Encounter {e.id} · clinical time shown in{' '}
        {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </Text>
      {canEdit ? (
        <>
          <Field
            label="Consultation note"
            value={text}
            onChange={setText}
            multiline
          />
          {e.noteState === 'FINALIZED' && (
            <Field
              label="Note amendment reason"
              value={reason}
              onChange={setReason}
            />
          )}
          <View style={styles.row}>
            {e.noteState === 'DRAFT' && (
              <Button
                secondary
                disabled={action.busy}
                onPress={() => save(false)}
              >
                Save draft note
              </Button>
            )}
            <Button disabled={action.busy} onPress={() => save(true)}>
              {e.noteState === 'FINALIZED'
                ? 'Save note amendment'
                : 'Finalize note'}
            </Button>
            {e.state === 'OPEN' && e.noteState === 'FINALIZED' && (
              <Button
                secondary
                disabled={action.busy}
                onPress={() =>
                  void action.run(async (key) => {
                    await request(G.CloseEncounterDocument, {
                      key,
                      id: e.id,
                      expected: e.version,
                    });
                    onSaved();
                  }, 'close:' + e.id)
                }
              >
                Close consultation
              </Button>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.text}>{e.noteText || 'No note recorded.'}</Text>
      )}
      <Feedback state={action} />
      <View style={styles.row}>
        <Button secondary onPress={onSaved}>
          Reload consultation
        </Button>
        <Button secondary onPress={() => setShowVersions(!showVersions)}>
          Note version history
        </Button>
      </View>
      {showVersions && <NoteVersions request={request} id={e.id} />}
    </View>
  );
}
function NoteVersions({ request, id }: { request: Api; id: string }) {
  const result = useLoad(
    () => request(G.NoteVersionsDocument, { id }),
    [request, id],
  );
  return (
    <View style={{ gap: 12 }}>
      {Boolean(result.error) && (
        <Text role="alert" style={styles.error}>
          {result.error}
        </Text>
      )}
      {result.value?.noteRevisions.map((v) => (
        <View key={v.id} style={styles.item}>
          <Text style={styles.subheading}>
            Version {v.version} · {v.state}
          </Text>
          <Text style={styles.text}>{v.text}</Text>
          <Text style={styles.muted}>
            {v.reason || 'Initial entry'} · {formatTime(v.recordedAt)} · author{' '}
            {v.authorId}
          </Text>
        </View>
      ))}
    </View>
  );
}
