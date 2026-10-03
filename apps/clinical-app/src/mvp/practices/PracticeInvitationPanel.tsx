import { useState } from 'react';
import { Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Button, Field, Feedback, styles, useAction } from '../ui';

export function PracticeInvitationPanel({ request }: { request: Api }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('RECEPTION');
  const [message, setMessage] = useState('');
  const action = useAction();

  return (
    <View style={styles.section}>
      <Text style={styles.subheading}>Invite a practice member</Text>
      <Text style={styles.muted}>
        Invitations are limited to this practice and expire after seven days.
      </Text>
      <Field label="Invited email" value={email} onChange={setEmail} />
      <View style={styles.tabs}>
        {['RECEPTION', 'CLINICIAN', 'ADMINISTRATOR'].map((value) => (
          <Button
            key={value}
            secondary={role !== value}
            onPress={() => setRole(value)}
          >
            {value}
          </Button>
        ))}
      </View>
      <Button
        disabled={action.busy}
        onPress={() =>
          void action.run(async () => {
            await request(G.InvitePracticeMemberDocument, { email, role });
            setEmail('');
            setMessage(
              'Invitation captured in the local mailbox. It expires in seven days.',
            );
          }, `invite:${email}:${role}`)
        }
      >
        Send local invitation
      </Button>
      <Feedback state={action} />
      {Boolean(message) && (
        <Text accessibilityRole="status" style={styles.success}>
          {message}
        </Text>
      )}
    </View>
  );
}
