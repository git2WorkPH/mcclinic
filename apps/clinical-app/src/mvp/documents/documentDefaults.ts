import type * as G from '@ehr/graphql-contract/operations';

export const emptyMedication = (): G.MedicationInput => ({
  medication: '',
  strength: '',
  dose: '',
  route: '',
  frequency: '',
  duration: '',
  quantity: '',
  repeats: 0,
});

export const emptyPrescription = (): G.PrescriptionInput => ({
  items: [emptyMedication()],
  directions: '',
});

export const emptyCertificate = (): G.CertificateInput => ({
  title: 'Demo medical certificate',
  statement: '',
  startsOn: new Date().toISOString().slice(0, 10),
  endsOn: new Date().toISOString().slice(0, 10),
});
