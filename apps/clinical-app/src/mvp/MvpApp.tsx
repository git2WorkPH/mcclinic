import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as G from "@ehr/graphql-contract/operations";
import { api, type Api } from "./client";
import {
  Button,
  Card,
  Feedback,
  Field,
  styles,
  useAction,
  useLoad,
} from "./ui";
import { PatientWorkspace } from "./PatientWorkspace";
import { SchedulePanel } from "./SchedulePanel";
type Viewer = NonNullable<G.ViewerQuery["me"]>;
export function MvpApp() {
  const [token, setToken] = useState(
      () => sessionStorage.getItem("ehr-mvp-session") ?? "",
    ),
    [actor, setActor] = useState<Viewer | null>(null),
    [checking, setChecking] = useState(Boolean(token));
  const [logoutError, setLogoutError] = useState("");
  const request = useMemo(() => api(token), [token]);
  useEffect(() => {
    let active = true;
    if (!token) {
      setChecking(false);
      return;
    }
    setChecking(true);
    void request(G.ViewerDocument, {})
      .then((v) => {
        if (active) {
          setActor(v.me);
          if (!v.me) {
            sessionStorage.removeItem("ehr-mvp-session");
            setToken("");
          }
        }
      })
      .catch(() => {
        if (active) {
          setActor(null);
          sessionStorage.removeItem("ehr-mvp-session");
          setToken("");
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [token, request]);
  function signedIn(value: G.SignInMutation["login"]) {
    sessionStorage.setItem("ehr-mvp-session", value.token);
    setActor(value.actor);
    setToken(value.token);
  }
  return (
    <ScrollView style={styles.page}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          DEVELOPMENT MVP · SYNTHETIC DATA ONLY · NOT FOR CLINICAL USE
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.brand}>Clinic EHR</Text>
        <Text style={styles.headerText}>A clear view of your clinic</Text>
        {actor && (
          <View style={styles.row}>
            <Text style={styles.headerText}>
              {actor.name} · {actor.role.toLowerCase()}
            </Text>
            <Button
              secondary
              onPress={() => {
                setLogoutError("");
                void request(G.SignOutDocument, {}).then(() => {
                  sessionStorage.removeItem("ehr-mvp-session");
                  setToken("");
                  setActor(null);
                }).catch(() => setLogoutError("Sign out failed. Please retry to revoke your session."));
              }}
            >
              Sign out
            </Button>
          </View>
        )}
      </View>
      {Boolean(logoutError) && <Text accessibilityRole="alert">{logoutError}</Text>}
      {checking ? (
        <View style={styles.body}>
          <Text>Checking session…</Text>
        </View>
      ) : actor ? (
        <Workspace request={request} actor={actor} />
      ) : (
        <Login request={request} onLogin={signedIn} />
      )}
    </ScrollView>
  );
}
function Login({
  request,
  onLogin,
}: {
  request: Api;
  onLogin: (value: G.SignInMutation["login"]) => void;
}) {
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState("");
  const action = useAction();
  return (
    <View style={[styles.body, styles.login]}>
      <Card title="Welcome back">
        <Text style={styles.text}>Sign in to the local demo clinic.</Text>
        <Field label="Username" value={username} onChange={setUsername} />
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          password
        />
        <Button
          disabled={action.busy}
          onPress={() =>
            void action.run(async () => {
              onLogin(
                (await request(G.SignInDocument, { username, password })).login,
              );
            })
          }
        >
          Sign in
        </Button>
        <Feedback state={action} />
        <Text style={styles.muted}>
          Use an account provisioned by the local seed command: clinician,
          reception or admin. Your operator supplies the demo password.
        </Text>
      </Card>
    </View>
  );
}
function Workspace({ request, actor }: { request: Api; actor: Viewer }) {
  const [section, setSection] = useState("Patients"),
    [patientId, setPatientId] = useState<string | null>(null),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState(""),
    [offset, setOffset] = useState(0),
    [refresh, setRefresh] = useState(0),
    [register, setRegister] = useState(false);
  const records = useLoad(
    () =>
      request(G.PatientSearchDocument, { query: search, offset, limit: 20 }),
    [request, search, offset, refresh],
  );
  return (
    <View style={styles.body}>
      <View style={styles.tabs}>
        {[
          "Patients",
          "Appointments",
          ...(actor.role === "ADMINISTRATOR" ? ["Audit"] : []),
        ].map((name) => (
          <Button
            key={name}
            secondary={section !== name}
            onPress={() => setSection(name)}
          >
            {name}
          </Button>
        ))}
      </View>
      {section === "Audit" ? (
        <AuditPanel request={request} />
      ) : section === "Appointments" ? (
        <SchedulePanel request={request} />
      ) : (
        <View style={styles.columns}>
          <View style={styles.sidebar}>
            <Card title="Patients">
              <Field
                label="Search patients"
                value={query}
                onChange={setQuery}
              />
              <View style={styles.row}>
                <Button
                  onPress={() => {
                    setSearch(query);
                    setOffset(0);
                    setRefresh(refresh + 1);
                  }}
                >
                  Search
                </Button>
                <Button
                  secondary
                  onPress={() => {
                    setRegister(true);
                    setPatientId(null);
                  }}
                >
                  Register patient
                </Button>
              </View>
              {Boolean(records.error) && (
                <Text role="alert" style={styles.error}>
                  {records.error}
                </Text>
              )}
              {records.value?.patients.items.map((p) => (
                <View key={p.id} style={styles.item}>
                  <Button
                    secondary
                    onPress={() => {
                      setPatientId(p.id);
                      setRegister(false);
                    }}
                  >
                    {p.givenName} {p.familyName}
                  </Button>
                  <Text style={styles.muted}>
                    Born {p.birthDate} · {p.id.slice(0, 8)}
                  </Text>
                </View>
              ))}
              {records.value?.patients.total === 0 && (
                <Text style={styles.muted}>
                  No patients found. Register a synthetic patient to begin.
                </Text>
              )}
              <Text style={styles.muted}>
                {records.value?.patients.total ?? 0} results
              </Text>
              <View style={styles.row}>
                <Button
                  secondary
                  disabled={offset === 0}
                  onPress={() => setOffset(Math.max(0, offset - 20))}
                >
                  Previous patients
                </Button>
                <Button
                  secondary
                  disabled={
                    !records.value ||
                    offset + 20 >= records.value.patients.total
                  }
                  onPress={() => setOffset(offset + 20)}
                >
                  Next patients
                </Button>
              </View>
            </Card>
          </View>
          <View style={styles.main}>
            {register ? (
              <Registration
                request={request}
                onCreated={(id) => {
                  setRegister(false);
                  setPatientId(id);
                  setRefresh(refresh + 1);
                }}
              />
            ) : patientId ? (
              <PatientWorkspace
                key={patientId}
                request={request}
                patientId={patientId}
                actor={actor}
                onChanged={() => setRefresh(refresh + 1)}
              />
            ) : (
              <Card title="Your patient workspace">
                <Text style={styles.text}>
                  Select a patient to review their record, or register a new
                  synthetic patient.
                </Text>
                <Text style={styles.muted}>
                  Patient identity stays visible as you move between notes,
                  documents and appointments.
                </Text>
              </Card>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
const emptyPatient: G.PatientInput = {
  givenName: "",
  familyName: "",
  birthDate: "",
  phone: "",
  email: "",
  address: "",
};
export function PatientForm({
  initial = emptyPatient,
  onSave,
  busy,
}: {
  initial?: G.PatientInput;
  onSave: (input: G.PatientInput) => void;
  busy: boolean;
}) {
  const [input, setInput] = useState(initial);
  return (
    <>
      <View style={styles.row}>
        {(
          [
            ["givenName", "Given name"],
            ["familyName", "Family name"],
            ["birthDate", "Birth date (YYYY-MM-DD)"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["address", "Address"],
          ] as const
        ).map(([field, label]) => (
          <Field
            key={field}
            label={label}
            value={input[field]}
            onChange={(value) => setInput({ ...input, [field]: value })}
          />
        ))}
      </View>
      <Button disabled={busy} onPress={() => onSave(input)}>
        Save patient
      </Button>
    </>
  );
}
function Registration({
  request,
  onCreated,
}: {
  request: Api;
  onCreated: (id: string) => void;
}) {
  const action = useAction();
  return (
    <Card title="Register patient">
      <Text style={styles.muted}>
        Synthetic records only. Exact name and birth-date duplicates require
        review.
      </Text>
      <PatientForm
        busy={action.busy}
        onSave={(input) =>
          void action.run(async (key) => {
            onCreated(
              (await request(G.RegisterPatientDocument, { key, input }))
                .registerPatient.id,
            );
          }, JSON.stringify(input))
        }
      />
      <Feedback state={action} />
    </Card>
  );
}
function AuditPanel({ request }: { request: Api }) {
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
      {log.value?.auditEvents.map((e) => (
        <View key={e.id} style={styles.item}>
          <Text style={styles.subheading}>
            {e.action} · {e.outcome}
          </Text>
          <Text style={styles.muted}>
            {e.recordedAt} · actor {e.actorId ?? "unauthenticated"} · subject{" "}
            {e.subjectId}
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
