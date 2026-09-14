import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from './client';
import { Button, Card, Field, Feedback, styles, useAction } from './ui';
import { useOnboarding } from '../features/onboarding/useOnboarding';
import { onboardingGateway } from '../features/onboarding/gateway';
import { onboardingBrowser } from '../features/onboarding/browser';
import type { Mode } from '../features/onboarding/contracts';
export function OnboardingPanel({ request }: { request: Api }) {
  const {
    open,
    mode,
    setMode,
    email,
    setEmail,
    name,
    setName,
    password,
    setPassword,
    practiceName,
    setPracticeName,
    token,
    setToken,
    code,
    setCode,
    message,
    setMessage,
    action,
    togglePanel,
    actions,
  } = useOnboarding(onboardingGateway(request), onboardingBrowser);
  return (
    <View style={[styles.body, { maxWidth: 650 }]}>
      <Button
        secondary
        accessibilityState={{ expanded: open }}
        onPress={togglePanel}
      >
        Account onboarding and recovery
      </Button>
      {open && (
        <View nativeID="account-onboarding-panel">
          <Text accessibilityRole="status" style={styles.success}>
            Account options opened. Choose registration, verification, recovery,
            or invitation acceptance below.
          </Text>
          <Card title={mode}>
            <Text style={styles.muted}>
              Synthetic accounts only. Messages are captured in the operator’s
              local mailbox; no email is sent.
            </Text>
            <View style={styles.tabs}>
              {(
                [
                  'Register',
                  'Verify email',
                  'Recover password',
                  'Accept invitation',
                ] as Mode[]
              ).map((m) => (
                <Button
                  key={m}
                  secondary={m !== mode}
                  onPress={() => {
                    setMode(m);
                    setMessage('');
                  }}
                >
                  {m}
                </Button>
              ))}
            </View>
            {(mode === 'Register' ||
              mode === 'Verify email' ||
              mode === 'Recover password') && (
              <Field label="Account email" value={email} onChange={setEmail} />
            )}
            {mode === 'Register' && (
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
            {mode !== 'Verify email' && (
              <Field
                label={
                  mode === 'Register'
                    ? 'Choose password (12–128 characters)'
                    : mode === 'Recover password'
                      ? 'New password (12–128 characters)'
                      : 'Your account password'
                }
                value={password}
                onChange={setPassword}
                password
              />
            )}
            {mode !== 'Register' && (
              <Field label="Link token" value={token} onChange={setToken} />
            )}
            {(mode === 'Recover password' || mode === 'Accept invitation') && (
              <Field
                label="Authenticator or recovery code (if enabled)"
                value={code}
                onChange={setCode}
              />
            )}
            {mode === 'Register' && (
              <Button disabled={action.busy} onPress={() => actions.register()}>
                Create account
              </Button>
            )}
            {mode === 'Verify email' && (
              <>
                <Button disabled={action.busy} onPress={() => actions.verify()}>
                  Verify account
                </Button>
                <Button
                  secondary
                  disabled={action.busy}
                  onPress={() => actions.resend()}
                >
                  Resend verification
                </Button>
              </>
            )}
            {mode === 'Recover password' && (
              <>
                <Button
                  secondary
                  disabled={action.busy}
                  onPress={() => actions.requestReset()}
                >
                  Request reset link
                </Button>
                <Button disabled={action.busy} onPress={() => actions.reset()}>
                  Reset password
                </Button>
              </>
            )}
            {mode === 'Accept invitation' && (
              <>
                <Text style={styles.text}>
                  First register and verify the invited email. Then enter the
                  invitation token and that account’s password.
                </Text>
                <Button disabled={action.busy} onPress={() => actions.accept()}>
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
        </View>
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
    [password, setPassword] = useState(''),
    [code, setCode] = useState(''),
    [secret, setSecret] = useState(''),
    [codes, setCodes] = useState<string[]>([]),
    [email, setEmail] = useState(''),
    [role, setRole] = useState('RECEPTION'),
    [message, setMessage] = useState('');
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
                {codes.join('\n')}
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
                          ? 'MFA is enabled.'
                          : 'MFA is not enabled.',
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
                        'Enter this secret in your authenticator, then confirm its code within 10 minutes.',
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
                        setSecret('');
                        setPassword('');
                        setCode('');
                        setMessage(
                          'MFA enabled. All prior sessions are revoked.',
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
                    {['RECEPTION', 'CLINICIAN', 'ADMINISTRATOR'].map((r) => (
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
                          'Invitation captured in the local mailbox. It expires in seven days.',
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
