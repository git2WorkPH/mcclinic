import { useRef, useState } from "react";
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
const emptyItem = (): G.MedicationInput => ({
  medication: "",
  strength: "",
  dose: "",
  route: "",
  frequency: "",
  duration: "",
  quantity: "",
  repeats: 0,
});
const emptyRx = (): G.PrescriptionInput => ({
  items: [emptyItem()],
  directions: "",
});
const emptyCertificate = (): G.CertificateInput => ({
  title: "Demo medical certificate",
  statement: "",
  startsOn: new Date().toISOString().slice(0, 10),
  endsOn: new Date().toISOString().slice(0, 10),
});
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
    [newKind, setNewKind] = useState(""),
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
              setNewKind("PRESCRIPTION");
            }}
          >
            New prescription
          </Button>
          <Button
            onPress={() => {
              setEditing(null);
              setNewKind("CERTIFICATE");
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
        {result.value?.documents.filter(d => !sourceId || d.id === sourceId).map((d) => (
          <View key={d.id} style={styles.item}>
            <Text style={styles.subheading}>
              {d.kind === "PRESCRIPTION"
                ? "Prescription"
                : "Medical certificate"}{" "}
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
                  Edit{" "}
                  {d.kind === "PRESCRIPTION" ? "prescription" : "certificate"} v
                  {d.version}
                </Button>
              )}
              {d.state === "ISSUED" && (
                <Button
                  onPress={() => setPreview({ id: d.id, version: d.version })}
                >
                  Preview{" "}
                  {d.kind === "PRESCRIPTION" ? "prescription" : "certificate"} v
                  {d.version}
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
            setNewKind("");
            setEditing(null);
            setRefresh(refresh + 1);
          }}
          onClose={() => setNewKind("")}
        />
      )}{" "}
      {preview && (
        <Preview
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
function DocumentEditor({
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
    existing && kind === "PRESCRIPTION"
      ? (JSON.parse(existing.contentJson) as G.PrescriptionInput)
      : emptyRx(),
  );
  const [certificate, setCertificate] = useState<G.CertificateInput>(() =>
    existing && kind === "CERTIFICATE"
      ? (JSON.parse(existing.contentJson) as G.CertificateInput)
      : emptyCertificate(),
  );
  const [encounterId, setEncounterId] = useState(
      existing?.consultationId ?? "",
    ),
    [reason, setReason] = useState("");
  const action = useAction();
  function save(issue: boolean) {
    void action.run(async (key) => {
      if (kind === "PRESCRIPTION") {
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
      title={`${existing ? "Edit" : "Create"} ${kind === "PRESCRIPTION" ? "prescription" : "certificate"}`}
    >
      {!existing && (
        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Link to consultation (optional)</Text>
          <View style={styles.row}>
            <Button
              secondary={Boolean(encounterId)}
              onPress={() => setEncounterId("")}
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
      {kind === "PRESCRIPTION" ? (
        <>
          {rx.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.subheading}>Medication {index + 1}</Text>
              <View style={styles.row}>
                {(
                  [
                    "medication",
                    "strength",
                    "dose",
                    "route",
                    "frequency",
                    "duration",
                    "quantity",
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
            onPress={() => setRx({ ...rx, items: [...rx.items, emptyItem()] })}
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
      {existing?.state === "ISSUED" && (
        <Field
          label="Document amendment reason"
          value={reason}
          onChange={setReason}
        />
      )}
      <View style={styles.row}>
        {existing?.state !== "ISSUED" && (
          <Button secondary disabled={action.busy} onPress={() => save(false)}>
            {existing ? "Save document draft" : "Create document draft"}
          </Button>
        )}
        {existing && (
          <Button disabled={action.busy} onPress={() => save(true)}>
            {existing.state === "ISSUED"
              ? "Issue demo amendment"
              : "Issue demo document"}
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
function DocumentVersions({
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
              Version {v.version} · {v.state} · {v.reason || "Initial issuance"}{" "}
              · {formatTime(v.recordedAt)}
            </Text>
            {v.state === "ISSUED" && (
              <Button secondary onPress={() => onPreview(v.version)}>
                Preview historical v{v.version}
              </Button>
            )}
          </View>
        ))}
    </>
  );
}
function Preview({
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
          outcome: "REQUESTED",
        });
        const win = frame.current?.contentWindow;
        if (!win) throw new Error("Preview is not ready.");
        try {
          win.focus();
          win.print();
          await request(G.PrintEventDocument, {
            key: crypto.randomUUID(),
            id,
            version,
            outcome: "DIALOG_CLOSED",
          });
        } catch (error) {
          await request(G.PrintEventDocument, {
            key: crypto.randomUUID(),
            id,
            version,
            outcome: "FAILED",
          });
          throw error;
        }
      },
      "print:" + id + ":" + version,
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
            width: "100%",
            height: 650,
            border: "1px solid #ccd9d2",
            background: "#fff",
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
                  outcome: "CANCELLED",
                });
                onClose();
              },
              "cancel:" + id + ":" + version,
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
