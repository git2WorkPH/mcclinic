import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Button, Card, Feedback, Field, styles, useAction } from '../ui';

type Props = {
  request: Api;
  onLogin: (value: G.SignInMutation['login']) => void;
};

export function LoginPanel({ request, onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
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
        <Field
          label="Authenticator or recovery code"
          value={code}
          onChange={setCode}
        />
        <Button
          disabled={action.busy}
          onPress={() =>
            void action.run(async () => {
              onLogin(
                (await request(G.SignInDocument, { username, password, code }))
                  .login,
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
