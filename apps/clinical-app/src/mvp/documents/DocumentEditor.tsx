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
} from '../ui';
import {
  emptyCertificate,
  emptyMedication,
  emptyPrescription,
} from './documentDefaults';

export function DocumentEditor({
  request,
  patientId,
  kind,
  existing,
  encounters,
  onSaved,
  onClose,
}: {
  request: Api;
  patientId: string;
  kind: string;
  existing: G.DocumentFieldsFragment | null;
  encounters: G.EncounterFieldsFragment[];
  onSaved: () => void;
  onClose: () => void;
}) {
  const [rx, setRx] = useState<G.PrescriptionInput>(() =>
    existing && kind === 'PRESCRIPTION'
      ? (JSON.parse(existing.contentJson) as G.PrescriptionInput)
      : emptyPrescription(),
  );
  const [certificate, setCertificate] = useState<G.CertificateInput>(() =>
    existing && kind === 'CERTIFICATE'
      ? (JSON.parse(existing.contentJson) as G.CertificateInput)
      : emptyCertificate(),
  );
  const [encounterId, setEncounterId] = useState(
      existing?.consultationId ?? '',
    ),
    [reason, setReason] = useState('');
  const action = useAction();
  function save(issue: boolean) {
    void action.run(async (key) => {
      if (kind === 'PRESCRIPTION') {
        if (existing)
          await request(G.RevisePrescriptionDocument, {
            key,
            id: existing.id,
            expected: existing.version,
            content: rx,
            issue,
            reason,
          });
        else
          await request(G.NewPrescriptionDocument, {
            key,
            patientId,
            consultationId: encounterId || null,
            content: rx,
          });
      } else {
        if (existing)
          await request(G.ReviseCertificateDocument, {
            key,
            id: existing.id,
            expected: existing.version,
            content: certificate,
            issue,
            reason,
          });
        else
          await request(G.NewCertificateDocument, {
            key,
            patientId,
            consultationId: encounterId || null,
            content: certificate,
          });
      }
      onSaved();
    }, JSON.stringify({ existing, rx, certificate, issue, reason, encounterId }));
  }
  return (
    <Card
      title={`${existing ? 'Edit' : 'Create'} ${kind === 'PRESCRIPTION' ? 'prescription' : 'certificate'}`}
    >
      {!existing && (
        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Link to consultation (optional)</Text>
          <View style={styles.row}>
            <Button
              secondary={Boolean(encounterId)}
              onPress={() => setEncounterId('')}
            >
              No consultation
            </Button>
            {encounters.map((e) => (
              <Button
                key={e.id}
                secondary={encounterId !== e.id}
                onPress={() => setEncounterId(e.id)}
              >
                {formatTime(e.occurredAt)}
              </Button>
            ))}
          </View>
        </View>
      )}
      {kind === 'PRESCRIPTION' ? (
        <>
          {rx.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.subheading}>Medication {index + 1}</Text>
              <View style={styles.row}>
                {(
                  [
                    'medication',
                    'strength',
                    'dose',
                    'route',
                    'frequency',
                    'duration',
                    'quantity',
                  ] as const
                ).map((field) => (
                  <Field
                    key={field}
                    label={`${field[0]?.toUpperCase()}${field.slice(1)} ${index + 1}`}
                    value={item[field]}
                    onChange={(value) =>
                      setRx({
                        ...rx,
                        items: rx.items.map((row, i) =>
                          i === index ? { ...row, [field]: value } : row,
                        ),
                      })
                    }
                  />
                ))}
                <Field
                  label={`Repeats ${index + 1}`}
                  value={String(item.repeats)}
                  onChange={(value) =>
                    setRx({
                      ...rx,
                      items: rx.items.map((row, i) =>
                        i === index ? { ...row, repeats: Number(value) } : row,
                      ),
                    })
                  }
                />
              </View>
            </View>
          ))}
          <Button
            secondary
            onPress={() =>
              setRx({ ...rx, items: [...rx.items, emptyMedication()] })
            }
            disabled={rx.items.length >= 30}
          >
            Add medication
          </Button>
          <Field
            label="Prescription directions"
            value={rx.directions}
            onChange={(directions) => setRx({ ...rx, directions })}
            multiline
          />
        </>
      ) : (
        <>
          <Field
            label="Certificate title"
            value={certificate.title}
            onChange={(title) => setCertificate({ ...certificate, title })}
          />
          <Field
            label="Certificate statement"
            value={certificate.statement}
            onChange={(statement) =>
              setCertificate({ ...certificate, statement })
            }
            multiline
          />
          <View style={styles.row}>
            <Field
              label="Certificate start date"
              value={certificate.startsOn}
              onChange={(startsOn) =>
                setCertificate({ ...certificate, startsOn })
              }
            />
            <Field
              label="Certificate end date"
              value={certificate.endsOn}
              onChange={(endsOn) => setCertificate({ ...certificate, endsOn })}
            />
          </View>
        </>
      )}
      {existing?.state === 'ISSUED' && (
        <Field
          label="Document amendment reason"
          value={reason}
          onChange={setReason}
        />
      )}
      <View style={styles.row}>
        {existing?.state !== 'ISSUED' && (
          <Button secondary disabled={action.busy} onPress={() => save(false)}>
            {existing ? 'Save document draft' : 'Create document draft'}
          </Button>
        )}
        {existing && (
          <Button disabled={action.busy} onPress={() => save(true)}>
            {existing.state === 'ISSUED'
              ? 'Issue demo amendment'
              : 'Issue demo document'}
          </Button>
        )}
        <Button secondary onPress={onClose}>
          Close editor
        </Button>
      </View>
      <Feedback state={action} />
      <Text style={styles.muted}>
        Create and review a draft before issuance. Issued versions remain
        available after amendment.
      </Text>
    </Card>
  );
}
