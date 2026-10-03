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
import { PracticeInvitationPanel } from './OnboardingPanel';
type Brand = {
  systemName: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  color: string;
};
type Definition = {
  heading: string;
  body: string;
  footer: string;
  layout: 'STANDARD' | 'COMPACT';
  includeAddress: boolean;
};
type Settings = {
  id: string;
  name: string;
  version: number;
  branding: Partial<Brand>;
  subscription: {
    plan: string;
    state: string;
    effectiveState: string;
    version: number;
    seatLimit: number;
  };
  members: {
    userId: string;
    role: string;
    active: boolean;
    version: number;
    user: { username: string; name: string };
  }[];
};
type Template = {
  kind: string;
  definition: Definition;
  version: number;
  publishedVersion: number | null;
};
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
      ) as Settings,
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
        <SettingsEditor
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
function SettingsEditor({
  request,
  settings,
  changed,
  section,
  setSection,
}: {
  request: Api;
  settings: Settings;
  changed: () => void;
  section: string;
  setSection: (value: string) => void;
}) {
  const [brand, setBrand] = useState<Brand>({
    systemName: settings.name,
    address: '',
    phone: '',
    email: '',
    logo: '',
    color: '#17675a',
    ...settings.branding,
  });
  const [username, setUsername] = useState(''),
    [role, setRole] = useState('CLINICIAN'),
    [active, setActive] = useState(true);
  const [plan, setPlan] = useState(settings.subscription.plan),
    [state, setState] = useState(settings.subscription.state);
  const action = useAction();
  return (
    <View style={styles.section}>
      <View style={styles.divider} />
      <Text role="heading" style={styles.heading}>
        Practice administration
      </Text>
      <View style={styles.tabs}>
        {['Branding', 'Members', 'Templates', 'Subscription'].map((value) => (
          <Button
            key={value}
            secondary={section !== value}
            onPress={() => setSection(value)}
          >
            {value}
          </Button>
        ))}
      </View>
      {section === 'Branding' && (
        <Card title="Practice branding">
          {(['systemName', 'address', 'phone', 'email'] as const).map((k) => (
            <Field
              key={k}
              label={'Brand ' + k}
              value={brand[k]}
              onChange={(v) => setBrand({ ...brand, [k]: v })}
            />
          ))}
          <Text>PNG/JPEG logo, maximum 100 KB</Text>
          <input
            aria-label="Clinic logo upload"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size <= 100000) {
                const r = new FileReader();
                r.onload = () => setBrand({ ...brand, logo: String(r.result) });
                r.readAsDataURL(file);
              }
            }}
          />
          <View style={styles.row}>
            {['#17675a', '#194d80', '#653f78'].map((c) => (
              <Button
                key={c}
                secondary={brand.color !== c}
                onPress={() => setBrand({ ...brand, color: c })}
              >
                Theme {c}
              </Button>
            ))}
          </View>
          <Button
            onPress={() =>
              void action.run(async () => {
                await request(G.SaveBrandingDocument, {
                  expected: settings.version,
                  input: JSON.stringify(brand),
                });
                changed();
              }, JSON.stringify(brand))
            }
          >
            Save branding
          </Button>
        </Card>
      )}
      {section === 'Members' && (
        <Card title="Practice memberships">
          <Text>
            Existing synthetic accounts only. Membership roles apply only in
            this practice.
          </Text>
          {settings.members.map((m) => (
            <Text key={m.userId}>
              {m.user.username} · {m.role} · {m.active ? 'active' : 'inactive'}{' '}
              · v{m.version}
            </Text>
          ))}
          <Field
            label="Member username"
            value={username}
            onChange={setUsername}
          />
          <View style={styles.row}>
            {['CLINICIAN', 'RECEPTION', 'ADMINISTRATOR'].map((r) => (
              <Button key={r} secondary={role !== r} onPress={() => setRole(r)}>
                {r}
              </Button>
            ))}
            <Button secondary onPress={() => setActive(!active)}>
              Membership {active ? 'active' : 'inactive'}
            </Button>
          </View>
          <Button
            onPress={() =>
              void action.run(async () => {
                await request(G.SetPracticeMemberDocument, {
                  input: JSON.stringify({
                    username,
                    role,
                    active,
                    expected:
                      settings.members.find((m) => m.user.username === username)
                        ?.version ?? 0,
                  }),
                });
                changed();
              }, JSON.stringify({ username, role, active }))
            }
          >
            Save membership
          </Button>
          <View style={styles.divider} />
          <PracticeInvitationPanel request={request} />
        </Card>
      )}
      {section === 'Templates' && <TemplateEditor request={request} />}
      {section === 'Subscription' && (
        <Card title="Development subscription">
          <Text>
            Simulation only — no payment or real charge. Clinician seats:{' '}
            {settings.subscription.seatLimit}.
          </Text>
          <View style={styles.row}>
            {['SOLO', 'TEAM'].map((p) => (
              <Button key={p} secondary={plan !== p} onPress={() => setPlan(p)}>
                {p}
              </Button>
            ))}
          </View>
          <View style={styles.row}>
            {['TRIAL', 'ACTIVE', 'PAST_DUE', 'RESTRICTED'].map((s) => (
              <Button
                key={s}
                secondary={state !== s}
                onPress={() => setState(s)}
              >
                {s}
              </Button>
            ))}
          </View>
          <Button
            onPress={() =>
              void action.run(async () => {
                await request(G.SimulateSubscriptionDocument, {
                  expected: settings.subscription.version,
                  plan,
                  state,
                });
                changed();
              }, plan + state)
            }
          >
            Apply simulated subscription
          </Button>
        </Card>
      )}
      <Feedback state={action} />
    </View>
  );
}
function TemplateEditor({ request }: { request: Api }) {
  const [kind, setKind] = useState('PRESCRIPTION'),
    [refresh, setRefresh] = useState(0);
  const data = useLoad(
    async () =>
      JSON.parse(
        (await request(G.PracticeTemplatesDocument, {})).practiceTemplates,
      ) as Template[],
    [request, refresh],
  );
  if (!data.value) return <Text>{data.error || 'Loading templates…'}</Text>;
  return (
    <Card title="Document templates">
      <View style={styles.row}>
        {['PRESCRIPTION', 'CERTIFICATE'].map((k) => (
          <Button key={k} secondary={kind !== k} onPress={() => setKind(k)}>
            {k} template
          </Button>
        ))}
      </View>
      <TemplateForm
        key={kind + ':' + refresh}
        request={request}
        kind={kind}
        existing={data.value.find((t) => t.kind === kind)}
        changed={() => setRefresh((n) => n + 1)}
      />
    </Card>
  );
}
function TemplateForm({
  request,
  kind,
  existing,
  changed,
}: {
  request: Api;
  kind: string;
  existing: Template | undefined;
  changed: () => void;
}) {
  const [definition, setDefinition] = useState<Definition>(
    existing?.definition ?? {
      heading: '{{clinic.name}}',
      body: '',
      footer: '',
      layout: 'STANDARD',
      includeAddress: false,
    },
  );
  const preview = useLoad(
    async () =>
      (
        await request(G.TemplatePreviewDocument, {
          definition: JSON.stringify(definition),
          kind,
        })
      ).previewPracticeTemplate,
    [request, definition],
  );
  const action = useAction();
  return (
    <View>
      <Text>
        Draft v{existing?.version ?? 0}; published v
        {existing?.publishedVersion ?? 'none'}. Required identity, medication
        rows and demo marker are always included.
      </Text>
      <Text>
        Fields: patient.fullName, patient.birthDate, patient.ageAtIssue,
        patient.address, clinic.name, clinic.address, clinic.phone,
        clinic.email, doctor.fullName, document.issueDate. Wrap fields in double
        braces.
      </Text>
      {(['heading', 'body', 'footer'] as const).map((k) => (
        <Field
          key={k}
          label={'Template ' + k}
          value={definition[k]}
          onChange={(v) => setDefinition({ ...definition, [k]: v })}
          multiline
        />
      ))}
      <View style={styles.row}>
        <Button
          secondary
          onPress={() =>
            setDefinition({
              ...definition,
              layout: definition.layout === 'STANDARD' ? 'COMPACT' : 'STANDARD',
            })
          }
        >
          Layout {definition.layout}
        </Button>
        <Button
          secondary
          onPress={() =>
            setDefinition({
              ...definition,
              includeAddress: !definition.includeAddress,
            })
          }
        >
          Patient address {definition.includeAddress ? 'included' : 'optional'}
        </Button>
      </View>
      {Boolean(preview.error) && <Text role="alert">{preview.error}</Text>}
      {preview.value && (
        <iframe
          title="Template live preview"
          sandbox=""
          srcDoc={preview.value}
          style={{ width: '100%', height: 230, border: '1px solid #ccc' }}
        />
      )}
      <View style={styles.row}>
        {[false, true].map((publish) => (
          <Button
            key={String(publish)}
            onPress={() =>
              void action.run(async () => {
                await request(G.SaveTemplateDocument, {
                  kind,
                  expected: existing?.version ?? 0,
                  definition: JSON.stringify(definition),
                  publish,
                });
                changed();
              }, JSON.stringify({ definition, publish }))
            }
          >
            {publish ? 'Publish template' : 'Save template draft'}
          </Button>
        ))}
      </View>
      <Feedback state={action} />
    </View>
  );
}
