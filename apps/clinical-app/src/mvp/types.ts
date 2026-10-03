import type * as G from '@ehr/graphql-contract/operations';

export type Viewer = NonNullable<G.ViewerQuery['me']>;
export type WorkspaceSection =
  | 'Overview'
  | 'Patients'
  | 'Appointments'
  | 'Practice'
  | 'My account'
  | 'Audit';
