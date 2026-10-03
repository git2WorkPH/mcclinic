import { View } from 'react-native';
import type { Api } from '../client';
import { SchedulePanel } from '../SchedulePanel';
import { styles } from '../ui';
import type { Viewer, WorkspaceSection } from '../types';
import { AuditPanel } from './AuditPanel';
import { PatientDirectory } from '../patients/PatientDirectory';

type Props = {
  request: Api;
  actor: Viewer;
  section: WorkspaceSection;
};

export function WorkspaceRouter({ request, actor, section }: Props) {
  return (
    <View style={styles.section}>
      {section === 'Audit' ? (
        <AuditPanel request={request} />
      ) : section === 'Appointments' ? (
        <SchedulePanel request={request} />
      ) : (
        <PatientDirectory request={request} actor={actor} />
      )}
    </View>
  );
}
