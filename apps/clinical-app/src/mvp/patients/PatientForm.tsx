import { useState } from 'react';
import { View } from 'react-native';
import type * as G from '@ehr/graphql-contract/operations';
import { Button, Field, styles } from '../ui';

const emptyPatient: G.PatientInput = {
  givenName: '',
  familyName: '',
  birthDate: '',
  phone: '',
  email: '',
  address: '',
};

type Props = {
  initial?: G.PatientInput;
  onSave: (input: G.PatientInput) => void;
  busy: boolean;
};

export function PatientForm({ initial = emptyPatient, onSave, busy }: Props) {
  const [input, setInput] = useState(initial);

  return (
    <>
      <View style={styles.row}>
        {(
          [
            ['givenName', 'Given name'],
            ['familyName', 'Family name'],
            ['birthDate', 'Birth date (YYYY-MM-DD)'],
            ['phone', 'Phone'],
            ['email', 'Email'],
            ['address', 'Address'],
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
