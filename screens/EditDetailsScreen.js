import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import NavHeader from '../components/NavHeader';
import { color, font, radius, spacing } from '../theme/tokens';

/**
 * Edit details hub (Figma 1205-12394).
 *
 * One row per editable part of a vehicle. Each opens the same focused editor,
 * scoped to its section — reusing the flows already built for adding that
 * information rather than a second set of forms.
 */
const ROWS = [
  { key: 'photos', icon: 'image', label: 'Photos & video' },
  { key: 'details', icon: 'file-text', label: 'Vehicle details' },
  { key: 'purchase', icon: 'credit-card', label: 'Purchase details' },
  { key: 'history', icon: 'tool', label: 'Vehicle history' },
];

export default function EditDetailsScreen({ navigation, route }) {
  const id = route.params?.id;

  return (
    <View style={styles.screen}>
      <NavHeader title="Edit details" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ROWS.map((row) => (
          <Pressable
            key={row.key}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => {
              if (row.key === 'photos') navigation.navigate('PhotosVideo', { id });
              else if (row.key === 'history') navigation.navigate('History', { id });
              else navigation.navigate('EditVehicle', { id, section: row.key });
            }}
            accessibilityRole="button"
            accessibilityLabel={row.label}
          >
            <Feather name={row.icon} size={20} color={color.icon.brandPrimaryRegular} />
            <Text style={styles.label}>{row.label}</Text>
            <Feather name="chevron-right" size={20} color={color.icon.neutralBold} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minHeight: 56,
    paddingHorizontal: spacing[4],
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralSubtle,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
});
