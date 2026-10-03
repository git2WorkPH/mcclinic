import { Text, View } from 'react-native';
import { Button, Card, styles } from '../ui';
import type { Viewer, WorkspaceSection } from '../types';

type Props = {
  actor: Viewer;
  onNavigate: (section: WorkspaceSection) => void;
};

export function RoleOverview({ actor, onNavigate }: Props) {
  const manager = actor.role === 'ADMINISTRATOR' || Boolean(actor.canManage);
  const title =
    actor.role === 'CLINICIAN'
      ? 'Clinical workspace'
      : actor.role === 'RECEPTION'
        ? 'Reception workspace'
        : 'Practice operations';

  return (
    <View style={styles.columns}>
      <View style={styles.main}>
        <Card title={title}>
          <Text style={styles.text}>
            {actor.role === 'CLINICIAN'
              ? 'Find a patient, review their history, document a consultation, or prepare a clinical document.'
              : actor.role === 'RECEPTION'
                ? 'Find or register a patient, manage appointments, and record arrivals.'
                : 'Review practice configuration, membership, subscription state, and audit activity.'}
          </Text>
          <View style={styles.row}>
            <Button onPress={() => onNavigate('Patients')}>
              Open patients
            </Button>
            <Button secondary onPress={() => onNavigate('Appointments')}>
              Open appointments
            </Button>
            {manager && (
              <Button secondary onPress={() => onNavigate('Practice')}>
                Open practice administration
              </Button>
            )}
            {actor.role === 'ADMINISTRATOR' && (
              <Button secondary onPress={() => onNavigate('Audit')}>
                Open audit trail
              </Button>
            )}
          </View>
        </Card>
      </View>
      <View style={styles.sidebar}>
        <Card title="Your access">
          <Text style={styles.text}>{actor.role.toLowerCase()}</Text>
          <Text style={styles.muted}>
            {manager
              ? 'You can manage this practice.'
              : 'Practice administration is hidden for this membership.'}
          </Text>
        </Card>
      </View>
    </View>
  );
}
