import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Button, formatTime, styles, useLoad } from '../ui';

export function DocumentVersions({
  request,
  document: d,
  onPreview,
}: {
  request: Api;
  document: G.DocumentFieldsFragment;
  onPreview: (version: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const result = useLoad(
    () =>
      open
        ? request(G.DocumentVersionsDocument, { id: d.id })
        : Promise.resolve(null),
    [request, d.id, d.version, open],
  );
  return (
    <>
      <Button secondary onPress={() => setOpen(!open)}>
        Document version history
      </Button>
      {open && Boolean(result.error) && (
        <Text role="alert" style={styles.error}>
          {result.error}
        </Text>
      )}
      {open &&
        result.value?.documentRevisions.map((v) => (
          <View key={v.id} style={styles.item}>
            <Text style={styles.muted}>
              Version {v.version} · {v.state} · {v.reason || 'Initial issuance'}{' '}
              · {formatTime(v.recordedAt)}
            </Text>
            {v.state === 'ISSUED' && (
              <Button secondary onPress={() => onPreview(v.version)}>
                Preview historical v{v.version}
              </Button>
            )}
          </View>
        ))}
    </>
  );
}
