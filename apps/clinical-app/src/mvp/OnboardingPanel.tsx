import { Text, View } from 'react-native';
import type { Api } from './client';
import { Button, Card, Field, Feedback, styles } from './ui';
import { useOnboarding } from '../features/onboarding/useOnboarding';
import { onboardingGateway } from '../features/onboarding/gateway';
import { onboardingBrowser } from '../features/onboarding/browser';
import type { Mode } from '../features/onboarding/contracts';

export { AccountSecurityPanel } from './auth/AccountSecurityPanel';
export { PracticeInvitationPanel } from './practices/PracticeInvitationPanel';

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
