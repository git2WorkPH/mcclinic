import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Button, Card, styles, useLoad } from '../ui';

export function AuditPanel({ request }: { request: Api }) {
  const [offset, setOffset] = useState(0);
  const log = useLoad(
    () => request(G.AuditTrailDocument, { offset, limit: 50 }),
    [request, offset],
  );

  return (
    <Card title="Audit trail">
      <Text style={styles.muted}>
        Append-only event metadata. Clinical content, passwords and tokens are
        excluded.
      </Text>
      {Boolean(log.error) && (
        <Text role="alert" style={styles.error}>
          {log.error}
        </Text>
      )}
      {log.value?.auditEvents.map((event) => (
        <View key={event.id} style={styles.item}>
          <Text style={styles.subheading}>
            {event.action} · {event.outcome}
          </Text>
          <Text style={styles.muted}>
            {event.recordedAt} · actor {event.actorId ?? 'unauthenticated'} ·
            subject {event.subjectId}
          </Text>
        </View>
      ))}
      <View style={styles.row}>
        <Button
          secondary
          disabled={!offset}
          onPress={() => setOffset(Math.max(0, offset - 50))}
        >
          Previous events
        </Button>
        <Button
          secondary
          disabled={(log.value?.auditEvents.length ?? 0) < 50}
          onPress={() => setOffset(offset + 50)}
        >
          Next events
        </Button>
      </View>
    </Card>
  );
}
