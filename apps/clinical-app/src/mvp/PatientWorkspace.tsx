import { useState } from "react";
import { Text, View } from "react-native";
import * as G from "@ehr/graphql-contract/operations";
import type { Api } from "./client";
import {
  Button,
  Card,
  Feedback,
  Field,
  formatTime,
  styles,
  useAction,
  useLoad,
} from "./ui";
import { PatientForm } from "./MvpApp";
import { DocumentPanel } from "./DocumentPanel";
import { SchedulePanel } from "./SchedulePanel";
export function PatientWorkspace({
  request,
  patientId,
  actor,
  onChanged,
}: {
  request: Api;
  patientId: string;
  actor: NonNullable<G.ViewerQuery["me"]>;
  onChanged: () => void;
}) {
  const [tab, setTab] = useState("Profile"),
    [refresh, setRefresh] = useState(0);
  const [sourceId, setSourceId] = useState<string | undefined>();
  const profile = useLoad(
    () => request(G.PatientRecordDocument, { id: patientId }),
    [request, patientId, refresh],
  );
  const action = useAction();
  if (profile.error)
    return (
      <Text role="alert" style={styles.error}>
        {profile.error}
      </Text>
    );
  if (!profile.value) return <Text>Loading patient…</Text>;
  const p = profile.value.patient;
  function changed() {
    setRefresh(refresh + 1);
    onChanged();
  }
  const initial: G.PatientInput = {
    givenName: p.givenName,
    familyName: p.familyName,
    birthDate: p.birthDate,
    phone: p.phone,
    email: p.email,
    address: p.address,
  };
  return (
    <>
      <Card>
        <Text role="heading" style={styles.heading}>
          {p.givenName} {p.familyName}
        </Text>
        <Text style={styles.text}>
          DOB {p.birthDate} · {p.phone || "No phone"}
        </Text>
        <Text style={styles.muted}>
          Patient ID {p.id} · Profile version {p.version}
        </Text>
        <View style={styles.tabs}>
          {[
            "Profile",
            ...(actor.role === "CLINICIAN"
              ? ["Consultations", "Documents", "History"]
              : []),
            "Appointments",
          ].map((t) => (
            <Button key={t} secondary={tab !== t} onPress={() => { setSourceId(undefined); setTab(t); }}>
              {t}
            </Button>
          ))}
        </View>
      </Card>
      {tab === "Profile" ? (
        <Card title="Patient profile">
          <PatientForm
            key={p.version}
            initial={initial}
            busy={action.busy}
            onSave={(input) =>
              void action.run(
                async (key) => {
                  await request(G.UpdateProfileDocument, {
                    key,
                    id: p.id,
                    expected: p.version,
                    input,
                  });
                  changed();
                },
                JSON.stringify({ version: p.version, input }),
              )
            }
          />
          <Feedback state={action} />
          <Button secondary onPress={changed}>
            Reload profile
          </Button>
        </Card>
      ) : tab === "Consultations" ? (
        <Consultations
          request={request}
          patientId={patientId}
          actorId={actor.id}
          sourceId={sourceId}
        />
      ) : tab === "Documents" ? (
        <DocumentPanel
          request={request}
          patientId={patientId}
          actorId={actor.id}
          sourceId={sourceId}
        />
      ) : tab === "History" ? (
        <HistoryPanel request={request} patientId={patientId} onSource={(id, type) => { setSourceId(id); setTab(type === "CONSULTATION" || type === "NOTE" ? "Consultations" : "Documents"); }} />
      ) : (
        <SchedulePanel request={request} patientId={patientId} />
      )}
    </>
  );
}
function Consultations({
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
          }, "start:" + patientId)
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
      {records.value?.consultations.filter(e => !sourceId || e.id === sourceId).map((e) => (
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
    [reason, setReason] = useState(""),
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
        Encounter {e.id} · clinical time shown in{" "}
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
          {e.noteState === "FINALIZED" && (
            <Field
              label="Note amendment reason"
              value={reason}
              onChange={setReason}
            />
          )}
          <View style={styles.row}>
            {e.noteState === "DRAFT" && (
              <Button
                secondary
                disabled={action.busy}
                onPress={() => save(false)}
              >
                Save draft note
              </Button>
            )}
            <Button disabled={action.busy} onPress={() => save(true)}>
              {e.noteState === "FINALIZED"
                ? "Save note amendment"
                : "Finalize note"}
            </Button>
            {e.state === "OPEN" && e.noteState === "FINALIZED" && (
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
                  }, "close:" + e.id)
                }
              >
                Close consultation
              </Button>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.text}>{e.noteText || "No note recorded."}</Text>
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
            {v.reason || "Initial entry"} · {formatTime(v.recordedAt)} · author{" "}
            {v.authorId}
          </Text>
        </View>
      ))}
    </View>
  );
}
function HistoryPanel({
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
        provenance. Times shown in{" "}
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
            Clinical: {formatTime(e.occurredAt)} · Recorded:{" "}
            {formatTime(e.recordedAt)}
          </Text>
          <Text selectable style={styles.muted}>
            Source {e.sourceId}
          </Text>
          <Button secondary onPress={() => onSource(e.sourceId, e.type)}>Open source record</Button>
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
