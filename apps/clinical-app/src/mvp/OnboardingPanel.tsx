import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as G from "@ehr/graphql-contract/operations";
import type { Api } from "./client";
import { Button, Card, Field, Feedback, styles, useAction } from "./ui";
type Mode =
  | "Register"
  | "Verify email"
  | "Recover password"
  | "Accept invitation";
function link() {
  const values = new URLSearchParams(window.location.hash.slice(1));
  return {
    mode: (values.has("verify")
      ? "Verify email"
      : values.has("reset")
        ? "Recover password"
        : values.has("invite")
          ? "Accept invitation"
          : "Register") as Mode,
    token:
      values.get("verify") ?? values.get("reset") ?? values.get("invite") ?? "",
  };
}
export function OnboardingPanel({ request }: { request: Api }) {
  const [initial] = useState(link);
  const [open, setOpen] = useState(Boolean(initial.token)),
    [mode, setMode] = useState<Mode>(initial.mode),
    [email, setEmail] = useState(""),
    [name, setName] = useState(""),
    [password, setPassword] = useState(""),
    [practiceName, setPracticeName] = useState(""),
    [token, setToken] = useState(initial.token),
    [code, setCode] = useState(""),
    [message, setMessage] = useState("");
  const action = useAction();
  useEffect(() => {
    const consumeLink = () => {
      const value = link();
      if (!value.token) return;
      setMode(value.mode);
      setToken(value.token);
      setOpen(true);
      setMessage("");
      history.replaceState(null, "", location.pathname + location.search);
    };
    consumeLink();
    window.addEventListener("hashchange", consumeLink);
    return () => window.removeEventListener("hashchange", consumeLink);
  }, []);
  const run = (fn: () => Promise<unknown>, success: string) => {
    setMessage("");
    void action.run(async () => {
      await fn();
      setMessage(success);
    });
  };
  return (
    <View style={[styles.body, { maxWidth: 650 }]}>
      <Button secondary onPress={() => setOpen(!open)}>
        Account onboarding and recovery
      </Button>
      {open && (
        <Card title={mode}>
          <Text style={styles.muted}>
            Synthetic accounts only. Messages are captured in the operator’s
            local mailbox; no email is sent.
          </Text>
          <View style={styles.tabs}>
            {(
              [
                "Register",
                "Verify email",
                "Recover password",
                "Accept invitation",
              ] as Mode[]
            ).map((m) => (
              <Button
                key={m}
                secondary={m !== mode}
                onPress={() => {
                  setMode(m);
                  setMessage("");
                }}
              >
                {m}
              </Button>
            ))}
          </View>
          {(mode === "Register" ||
            mode === "Verify email" ||
            mode === "Recover password") && (
            <Field label="Account email" value={email} onChange={setEmail} />
          )}
          {mode === "Register" && (
            <>
              <Field
                label="Your display name"
                value={name}
                onChange={setName}
              />
              <Field
                label="New practice name (leave empty when joining a practice)"
                value={practiceName}
                onChange={setPracticeName}
              />
            </>
          )}
          {mode !== "Verify email" && (
            <Field
              label={
                mode === "Register"
                  ? "Choose password (12–128 characters)"
                  : mode === "Recover password"
                    ? "New password (12–128 characters)"
                    : "Your account password"
              }
              value={password}
              onChange={setPassword}
              password
            />
          )}
          {mode !== "Register" && (
            <Field label="Link token" value={token} onChange={setToken} />
          )}
          {(mode === "Recover password" || mode === "Accept invitation") && (
            <Field
              label="Authenticator or recovery code (if enabled)"
              value={code}
              onChange={setCode}
            />
          )}
          {mode === "Register" && (
            <Button
              disabled={action.busy}
              onPress={() =>
                run(
                  () =>
                    request(G.RegisterAccountDocument, {
                      input: { email, name, password, practiceName },
                    }),
                  "If eligible, a verification link is in the local mailbox. Verify before signing in.",
                )
              }
            >
              Create account
            </Button>
          )}
          {mode === "Verify email" && (
            <>
              <Button
                disabled={action.busy}
                onPress={() =>
                  run(
                    () => request(G.VerifyAccountDocument, { token }),
                    "Email verified. Sign in above, or accept your invitation if joining a practice.",
                  )
                }
              >
                Verify account
              </Button>
              <Button
                secondary
                disabled={action.busy}
                onPress={() =>
                  run(
                    () => request(G.ResendVerificationDocument, { email }),
                    "If eligible, a verification link is in the local mailbox.",
                  )
                }
              >
                Resend verification
              </Button>
            </>
          )}
          {mode === "Recover password" && (
            <>
              <Button
                secondary
                disabled={action.busy}
                onPress={() =>
                  run(
                    () => request(G.RequestPasswordResetDocument, { email }),
                    "If eligible, a reset link is in the local mailbox.",
                  )
                }
              >
                Request reset link
              </Button>
              <Button
                disabled={action.busy}
                onPress={() =>
                  run(
                    () =>
                      request(G.ResetAccountPasswordDocument, {
                        token,
                        password,
                        code,
                      }),
                    "Password changed and sessions revoked. Sign in again.",
                  )
                }
              >
                Reset password
              </Button>
            </>
          )}
          {mode === "Accept invitation" && (
            <>
              <Text style={styles.text}>
                First register and verify the invited email. Then enter the
                invitation token and that account’s password.
              </Text>
              <Button
                disabled={action.busy}
                onPress={() =>
                  run(
                    () =>
                      request(G.AcceptPracticeInvitationDocument, {
                        token,
                        password,
                        code,
                      }),
                    "Invitation accepted. Sign in, then switch to the practice.",
                  )
                }
              >
                Join practice
              </Button>
            </>
          )}
          <Feedback state={action} />
          {Boolean(message) && (
            <Text accessibilityRole="status" style={styles.success}>
              {message}
            </Text>
          )}
        </Card>
      )}
    </View>
  );
}
export function AccountSecurityPanel({
  request,
  manager,
  onReauthenticate,
}: {
  request: Api;
  manager: boolean;
  onReauthenticate: () => void;
}) {
  const [open, setOpen] = useState(false),
    [password, setPassword] = useState(""),
    [code, setCode] = useState(""),
    [secret, setSecret] = useState(""),
    [codes, setCodes] = useState<string[]>([]),
    [email, setEmail] = useState(""),
    [role, setRole] = useState("RECEPTION"),
    [message, setMessage] = useState("");
  const action = useAction();
  return (
    <View style={styles.body}>
      <Button secondary onPress={() => setOpen(!open)}>
        Account security and invitations
      </Button>
      {open && (
        <Card title="Account security">
          <Text style={styles.text}>
            Use an authenticator app with a manually entered secret. MFA changes
            revoke all sessions. Keep recovery codes privately; they are shown
            once.
          </Text>
          {codes.length > 0 ? (
            <>
              <Text selectable testID="recovery-codes">
                {codes.join("\n")}
              </Text>
              <Button onPress={onReauthenticate}>
                I saved my codes — sign in again
              </Button>
            </>
          ) : (
            <>
              <Field
                label="Current account password"
                value={password}
                onChange={setPassword}
                password
              />
              <Field label="Security code" value={code} onChange={setCode} />
              <View style={styles.row}>
                <Button
                  secondary
                  disabled={action.busy}
                  onPress={() =>
                    void action.run(async () => {
                      const v = await request(G.AccountSecurityDocument, {});
                      setMessage(
                        v.accountMfaEnabled
                          ? "MFA is enabled."
                          : "MFA is not enabled.",
                      );
                    })
                  }
                >
                  Check MFA status
                </Button>
                <Button
                  disabled={action.busy}
                  onPress={() =>
                    void action.run(async () => {
                      const v = JSON.parse(
                        (await request(G.StartAccountMfaDocument, { password }))
                          .startAccountMfa,
                      ) as { secret: string };
                      setSecret(v.secret);
                      setMessage(
                        "Enter this secret in your authenticator, then confirm its code within 10 minutes.",
                      );
                    })
                  }
                >
                  Set up authenticator
                </Button>
                <Button
                  secondary
                  disabled={action.busy}
                  onPress={() =>
                    void action.run(async () => {
                      await request(G.DisableAccountMfaDocument, {
                        password,
                        code,
                      });
                      onReauthenticate();
                    })
                  }
                >
                  Disable MFA
                </Button>
              </View>
              {Boolean(secret) && (
                <>
                  <Text selectable testID="mfa-secret">
                    {secret}
                  </Text>
                  <Button
                    disabled={action.busy}
                    onPress={() =>
                      void action.run(async () => {
                        const v = await request(G.ConfirmAccountMfaDocument, {
                          code,
                        });
                        setCodes(JSON.parse(v.confirmAccountMfa));
                        setSecret("");
                        setPassword("");
                        setCode("");
                        setMessage(
                          "MFA enabled. All prior sessions are revoked.",
                        );
                      })
                    }
                  >
                    Confirm authenticator
                  </Button>
                </>
              )}
              {manager && (
                <>
                  <Text style={styles.subheading}>
                    Invite a practice member
                  </Text>
                  <Field
                    label="Invited email"
                    value={email}
                    onChange={setEmail}
                  />
                  <View style={styles.tabs}>
                    {["RECEPTION", "CLINICIAN", "ADMINISTRATOR"].map((r) => (
                      <Button
                        key={r}
                        secondary={role !== r}
                        onPress={() => setRole(r)}
                      >
                        {r}
                      </Button>
                    ))}
                  </View>
                  <Button
                    disabled={action.busy}
                    onPress={() =>
                      void action.run(async () => {
                        await request(G.InvitePracticeMemberDocument, {
                          email,
                          role,
                        });
                        setMessage(
                          "Invitation captured in the local mailbox. It expires in seven days.",
                        );
                      })
                    }
                  >
                    Send local invitation
                  </Button>
                </>
              )}
            </>
          )}
          <Feedback state={action} />
          {Boolean(message) && (
            <Text accessibilityRole="status">{message}</Text>
          )}
        </Card>
      )}
    </View>
  );
}
