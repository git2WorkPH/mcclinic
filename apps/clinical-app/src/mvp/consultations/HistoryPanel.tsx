import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Button, Card, formatTime, styles, useLoad } from '../ui';

export function HistoryPanel({
  request,
  patientId,
  onSource,
}: {
  request: Api;
  patientId: string;
  onSource: (id: string, type: string) => void;
}) {
  const [offset, setOffset] = useState(0);
  const result = useLoad(
    () => request(G.PatientTimelineDocument, { patientId, offset, limit: 20 }),
    [request, patientId, offset],
  );
  return (
    <Card title="Patient history">
      <Text style={styles.muted}>
        Clinical time is listed first; recorded time preserves amendment
        provenance. Times shown in{' '}
        {Intl.DateTimeFormat().resolvedOptions().timeZone}.
      </Text>
      {Boolean(result.error) && (
        <Text role="alert" style={styles.error}>
          {result.error}
        </Text>
      )}
      {result.value?.history.items.map((e) => (
        <View key={e.id} style={styles.item}>
          <Text style={styles.subheading}>
            {e.type} · version {e.version}
          </Text>
          <Text style={styles.text}>{e.summary}</Text>
          <Text style={styles.muted}>
            Clinical: {formatTime(e.occurredAt)} · Recorded:{' '}
            {formatTime(e.recordedAt)}
          </Text>
          <Text selectable style={styles.muted}>
            Source {e.sourceId}
          </Text>
          <Button secondary onPress={() => onSource(e.sourceId, e.type)}>
            Open source record
          </Button>
        </View>
      ))}
      {result.value?.history.total === 0 && (
        <Text>No clinical history yet.</Text>
      )}
      <View style={styles.row}>
        <Button
          secondary
          disabled={!offset}
          onPress={() => setOffset(Math.max(0, offset - 20))}
        >
          Previous history
        </Button>
        <Button
          secondary
          disabled={!result.value || offset + 20 >= result.value.history.total}
          onPress={() => setOffset(offset + 20)}
        >
          Next history
        </Button>
      </View>
    </Card>
  );
}
