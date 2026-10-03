import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from './client';
import { DocumentEditor } from './documents/DocumentEditor';
import { DocumentVersions } from './documents/DocumentVersions';
import { DocumentPreview } from './documents/DocumentPreview';
import { Button, Card, formatTime, styles, useLoad } from './ui';
export function DocumentPanel({
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
    [editing, setEditing] = useState<G.DocumentFieldsFragment | null>(null),
    [newKind, setNewKind] = useState(''),
    [preview, setPreview] = useState<{ id: string; version: number } | null>(
      null,
    );
  const result = useLoad(
    () => request(G.ClinicalRecordsDocument, { patientId }),
    [request, patientId, refresh],
  );
  return (
    <>
      <Card title="Clinical documents">
        <Text style={styles.muted}>
          Generic demo documents. Every printed version is marked NOT FOR
          CLINICAL USE.
        </Text>
        <View style={styles.row}>
          <Button
            onPress={() => {
              setEditing(null);
              setNewKind('PRESCRIPTION');
            }}
          >
            New prescription
          </Button>
          <Button
            onPress={() => {
              setEditing(null);
              setNewKind('CERTIFICATE');
            }}
          >
            New certificate
          </Button>
        </View>
        {Boolean(result.error) && (
          <Text role="alert" style={styles.error}>
            {result.error}
          </Text>
        )}
        {result.value?.documents
          .filter((d) => !sourceId || d.id === sourceId)
          .map((d) => (
            <View key={d.id} style={styles.item}>
              <Text style={styles.subheading}>
                {d.kind === 'PRESCRIPTION'
                  ? 'Prescription'
                  : 'Medical certificate'}{' '}
                · v{d.version}
              </Text>
              <Text style={styles.badge}>
                {d.state} · {formatTime(d.createdAt)}
              </Text>
              <View style={styles.row}>
                {d.authorId === actorId && (
                  <Button
                    secondary
                    onPress={() => {
                      setEditing(d);
                      setNewKind(d.kind);
                    }}
                  >
                    Edit{' '}
                    {d.kind === 'PRESCRIPTION' ? 'prescription' : 'certificate'}{' '}
                    v{d.version}
                  </Button>
                )}
                {d.state === 'ISSUED' && (
                  <Button
                    onPress={() => setPreview({ id: d.id, version: d.version })}
                  >
                    Preview{' '}
                    {d.kind === 'PRESCRIPTION' ? 'prescription' : 'certificate'}{' '}
                    v{d.version}
                  </Button>
                )}
              </View>
              <DocumentVersions
                request={request}
                document={d}
                onPreview={(version) => setPreview({ id: d.id, version })}
              />
            </View>
          ))}
      </Card>
      {Boolean(newKind) && (
        <DocumentEditor
          key={editing ? `${editing.id}:${editing.version}` : newKind}
          request={request}
          patientId={patientId}
          kind={newKind}
          existing={editing}
          encounters={result.value?.consultations ?? []}
          onSaved={() => {
            setNewKind('');
            setEditing(null);
            setRefresh(refresh + 1);
          }}
          onClose={() => setNewKind('')}
        />
      )}{' '}
      {preview && (
        <DocumentPreview
          key={`${preview.id}:${preview.version}`}
          request={request}
          id={preview.id}
          version={preview.version}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
