import { View } from 'react-native';
import { Button, styles } from '../ui';
import type { Viewer, WorkspaceSection } from '../types';

type Props = {
  actor: Viewer;
  section: WorkspaceSection;
  onNavigate: (section: WorkspaceSection) => void;
};

export function AppNavigation({ actor, section, onNavigate }: Props) {
  const sections: WorkspaceSection[] = [
    'Overview',
    'Patients',
    'Appointments',
    'Practice',
    'My account',
    ...(actor.role === 'ADMINISTRATOR' ? (['Audit'] as const) : []),
  ];

  return (
    <View accessibilityRole="tablist" style={styles.navigation}>
      {sections.map((name) => (
        <Button
          key={name}
          secondary={section !== name}
          accessibilityState={{ selected: section === name }}
          onPress={() => onNavigate(name)}
        >
          {name === 'Practice' &&
          (actor.role === 'ADMINISTRATOR' || actor.canManage)
            ? 'Practice administration'
            : name}
        </Button>
      ))}
    </View>
  );
}
