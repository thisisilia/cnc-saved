import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, size, spacing } from '../theme/tokens';
import BottomSheet from './BottomSheet';

// Figma names these car-mirrors / arrow-trend-up / bell; these are the closest
// glyphs in the icon sets already bundled with the app.
export const ADD_VEHICLE_OPTIONS = [
  {
    key: 'garage',
    icon: 'car-outline',
    set: Ionicons,
    title: 'Add vehicle to your garage',
    subtitle: 'Track the value of your vehicles',
  },
  {
    key: 'valuation',
    icon: 'trending-up',
    set: Feather,
    title: 'Valuation',
    subtitle: 'Get a free market valuation',
  },
  {
    key: 'searches',
    icon: 'bell',
    set: Feather,
    title: 'Saved',
    subtitle: 'Get notifications for new listings',
  },
];

function Option({ option, onPress }) {
  const Icon = option.set;
  return (
    <Pressable
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
      onPress={() => onPress(option.key)}
      accessibilityRole="button"
      accessibilityLabel={`${option.title}. ${option.subtitle}`}
    >
      <View style={styles.optionIcon}>
        <Icon name={option.icon} size={20} color={color.icon.brandPrimaryRegular} />
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
      </View>
    </Pressable>
  );
}

/** "Add vehicles" bottom sheet. */
export default function AddVehicleSheet({ visible, onClose, onSelect }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Add vehicles</Text>
        <Pressable onPress={onClose} accessibilityRole="button">
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>

      <View style={styles.options}>
        {ADD_VEHICLE_OPTIONS.map((option) => (
          <Option key={option.key} option={option} onPress={onSelect} />
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    paddingVertical: 24,
  },
  title: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  cancel: {
    ...font.bodySmRegular,
    color: color.text.neutralBold,
  },
  options: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: color.background.neutralSubtle,
    borderWidth: 1,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  optionPressed: {
    opacity: 0.6,
  },
  optionIcon: {
    width: size[8],
    height: size[8],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: color.background.brandPrimarySubtle,
  },
  optionText: {
    flex: 1,
    gap: spacing[1],
  },
  optionTitle: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  optionSubtitle: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
});
