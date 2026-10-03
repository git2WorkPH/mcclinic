import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Button, Card, Field, Feedback, styles, useAction } from '../ui';

type Props = { request: Api; onReauthenticate: () => void };

export function AccountSecurityPanel({ request, onReauthenticate }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState('');
  const [codes, setCodes] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const action = useAction();

  return (
    <View style={styles.section}>
      <Button secondary onPress={() => setOpen(!open)}>
        {open ? 'Close account security' : 'Manage account security'}
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
                      const value = await request(
                        G.AccountSecurityDocument,
                        {},
                      );
                      setMessage(
                        value.accountMfaEnabled
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
                      const value = JSON.parse(
                        (await request(G.StartAccountMfaDocument, { password }))
                          .startAccountMfa,
                      ) as { secret: string };
                      setSecret(value.secret);
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
                        const value = await request(
                          G.ConfirmAccountMfaDocument,
                          { code },
                        );
                        setCodes(JSON.parse(value.confirmAccountMfa));
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
