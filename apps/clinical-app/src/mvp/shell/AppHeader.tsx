import { Text, View } from 'react-native';
import { Button, styles } from '../ui';
import type { Viewer } from '../types';

type Props = {
  actor: Viewer | null;
  brand: { name: string; color: string } | null;
  logoutError: string;
  onSignOut: () => void;
};

export function AppHeader({ actor, brand, logoutError, onSignOut }: Props) {
  return (
    <>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          DEVELOPMENT MVP · SYNTHETIC DATA ONLY · NOT FOR CLINICAL USE
        </Text>
      </View>
      <View
        style={[styles.header, brand ? { backgroundColor: brand.color } : {}]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>{brand?.name ?? 'Moncal Clinical'}</Text>
            <Text style={styles.headerText}>A clear view of your clinic</Text>
          </View>
          {actor && (
            <View style={styles.row}>
              <Text style={styles.headerText}>
                {actor.name} · {actor.role.toLowerCase()}
              </Text>
              <Button secondary onPress={onSignOut}>
                Sign out
              </Button>
            </View>
          )}
        </View>
      </View>
      {Boolean(logoutError) && (
        <Text accessibilityRole="alert">{logoutError}</Text>
      )}
    </>
  );
}
