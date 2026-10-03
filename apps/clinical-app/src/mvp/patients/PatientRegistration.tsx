import { Text } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import type { Api } from '../client';
import { Card, Feedback, styles, useAction } from '../ui';
import { PatientForm } from './PatientForm';

type Props = {
  request: Api;
  onCreated: (id: string) => void;
};

export function PatientRegistration({ request, onCreated }: Props) {
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
