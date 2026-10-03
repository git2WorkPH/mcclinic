import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Button, Card, Feedback, styles, useAction, useLoad } from '../ui';

export function DocumentPreview({
  request,
  id,
  version,
  onClose,
}: {
  request: Api;
  id: string;
  version: number;
  onClose: () => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null),
    [loaded, setLoaded] = useState(false);
  const result = useLoad(
    () => request(G.PreviewClinicalDocumentDocument, { id, version }),
    [request, id, version],
  );
  const action = useAction();
  async function printDocument() {
    await action.run(
      async (key) => {
        await request(G.PrintEventDocument, {
          key,
          id,
          version,
          outcome: 'REQUESTED',
        });
        const win = frame.current?.contentWindow;
        if (!win) throw new Error('Preview is not ready.');
        try {
          win.focus();
          win.print();
          await request(G.PrintEventDocument, {
            key: crypto.randomUUID(),
            id,
            version,
            outcome: 'DIALOG_CLOSED',
          });
        } catch (error) {
          await request(G.PrintEventDocument, {
            key: crypto.randomUUID(),
            id,
            version,
            outcome: 'FAILED',
          });
          throw error;
        }
      },
      'print:' + id + ':' + version,
    );
  }
  return (
    <Card title={`Print preview · version ${version}`}>
      <Text style={styles.muted}>
        DEMO — NOT FOR CLINICAL USE. Choose your browser’s Print to PDF for
        export. Closing the print dialog does not confirm physical printing.
      </Text>
      {Boolean(result.error) && (
        <Text role="alert" style={styles.error}>
          {result.error}
        </Text>
      )}
      {result.value && (
        <iframe
          ref={frame}
          title="Clinical document preview"
          srcDoc={result.value.previewDocument}
          sandbox="allow-same-origin allow-modals"
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: 650,
            border: '1px solid #ccd9d2',
            background: '#fff',
          }}
        />
      )}
      <View style={styles.row}>
        <Button
          disabled={action.busy || !loaded}
          onPress={() => void printDocument()}
        >
          Print / Save PDF
        </Button>
        <Button
          secondary
          disabled={action.busy}
          onPress={() =>
            void action.run(
              async (key) => {
                await request(G.PrintEventDocument, {
                  key,
                  id,
                  version,
                  outcome: 'CANCELLED',
                });
                onClose();
              },
              'cancel:' + id + ':' + version,
            )
          }
        >
          Cancel preview
        </Button>
      </View>
      <Feedback state={action} />
    </Card>
  );
}
