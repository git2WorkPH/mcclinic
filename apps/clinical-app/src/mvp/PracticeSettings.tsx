import { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from './client';
import {
  Card,
  Button,
  Field,
  Feedback,
  useAction,
  useLoad,
  styles,
} from './ui';
import { PracticeAdministration } from './practices/PracticeAdministration';
import type { PracticeSettings } from './practices/practiceTypes';
export function PracticeBar({
  request,
  actor,
  expanded,
  onSwitch,
  onBrand,
}: {
  request: Api;
  actor: { role: string; canManage?: boolean | null };
  expanded: boolean;
  onSwitch: (id: string) => void;
  onBrand: (value: { name: string; color: string }) => void;
}) {
  const [refresh, setRefresh] = useState(0),
    [name, setName] = useState(''),
    [adminSection, setAdminSection] = useState('Branding');
  const data = useLoad(
    async () => ({
      practices: JSON.parse(
        (await request(G.PracticesDocument, {})).practices,
      ) as { id: string; name: string; role: string }[],
      settings: JSON.parse(
        (await request(G.PracticeSettingsDocument, {})).practiceSettings,
      ) as PracticeSettings,
    }),
    [request, refresh],
  );
  const action = useAction();
  useEffect(() => {
    if (data.value)
      onBrand({
        name:
          data.value.settings.branding.systemName || data.value.settings.name,
        color: data.value.settings.branding.color || '#123d35',
      });
  }, [data.value, onBrand]);
  const changed = () => setRefresh((n) => n + 1);
  if (!data.value)
    return (
      <Card title="Practice">
        <Text>{data.error || 'Loading practice…'}</Text>
      </Card>
    );
  const { settings, practices } = data.value;
  return (
    <View style={expanded ? styles.card : styles.compactCard}>
      <View style={styles.headerRow}>
        <View style={styles.section}>
          <Text role="heading" style={styles.heading}>
            {settings.branding.systemName || settings.name}
          </Text>
          <View testID="practice-status" style={styles.statusRow}>
            <Text style={styles.statusBadge}>
              {settings.subscription.effectiveState}
            </Text>
            <Text style={styles.statusBadge}>{settings.subscription.plan}</Text>
            <Text style={styles.statusBadge}>
              {actor.role.toLowerCase()}
              {actor.canManage ? ' · manager' : ''}
            </Text>
          </View>
        </View>
        {Boolean(settings.branding.logo) && (
          <Image
            accessibilityLabel="Practice logo"
            source={{ uri: settings.branding.logo }}
            resizeMode="contain"
            style={{ width: 96, height: 54 }}
          />
        )}
      </View>
      {Boolean(
        settings.branding.address ||
        settings.branding.phone ||
        settings.branding.email,
      ) && (
        <Text style={styles.muted}>
          {[
            settings.branding.address,
            settings.branding.phone,
            settings.branding.email,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      )}
      <View style={styles.row}>
        {practices.map((p) => (
          <Button
            key={p.id}
            secondary={p.id !== settings.id}
            disabled={p.id === settings.id}
            onPress={() => onSwitch(p.id)}
          >
            {p.id === settings.id
              ? `Current practice · ${p.name}`
              : `Switch to ${p.name}`}
          </Button>
        ))}
      </View>
      {expanded && (
        <>
          <View style={styles.divider} />
          <Text style={styles.subheading}>Practice actions</Text>
          <View style={styles.row}>
            <Field label="New practice name" value={name} onChange={setName} />
            <Button
              onPress={() =>
                void action.run(async () => {
                  const p = JSON.parse(
                    (await request(G.CreatePracticeDocument, { name }))
                      .createPractice,
                  );
                  onSwitch(p.id);
                }, 'practice:' + name)
              }
            >
              Create practice
            </Button>
            <Button
              secondary
              onPress={() =>
                void action.run(async () => {
                  const exported = (await request(G.PracticeExportDocument, {}))
                    .practiceExport;
                  const blob = new Blob([exported], {
                      type: 'application/json',
                    }),
                    url = URL.createObjectURL(blob),
                    a = document.createElement('a');
                  a.href = url;
                  a.download = 'practice-export.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }, 'export')
              }
            >
              Export authorized records
            </Button>
          </View>
        </>
      )}
      <Feedback state={action} />
      {settings.subscription.effectiveState === 'RESTRICTED' && (
        <Text>
          Read, print and authorized export remain available. New clinical
          writes are restricted.
        </Text>
      )}
      {expanded && (actor.role === 'ADMINISTRATOR' || actor.canManage) && (
        <PracticeAdministration
          key={
            settings.version +
            ':' +
            settings.subscription.version +
            ':' +
            refresh
          }
          request={request}
          settings={settings}
          changed={changed}
          section={adminSection}
          setSection={setAdminSection}
        />
      )}
    </View>
  );
}
