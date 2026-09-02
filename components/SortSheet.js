import { Pressable, StyleSheet, Text, View } from 'react-native';
import BottomSheet from './BottomSheet';
import { color, font, radius, spacing } from '../theme/tokens';

export const SORT_OPTIONS = [
  { id: 'added', label: 'Date added (newest first)' },
  { id: 'purchased', label: 'Date purchased (newest first)' },
  { id: 'profit', label: 'Profit (high to low)' },
  { id: 'value', label: 'Estimated value (high to low)' },
  { id: 'alpha', label: 'Alphabetical (high to low)' },
];

/** "Sort by" bottom sheet for the My Garage vehicle list (Figma 1322-40714). */
export default function SortSheet({ visible, value, onSelect, onClose }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Sort by</Text>
          <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel="Cancel">
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
        {SORT_OPTIONS.map((opt) => {
          const active = opt.id === value;
          return (
            <Pressable
              key={opt.id}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              onPress={() => {
                onSelect(opt.id);
                onClose();
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <View style={[styles.radio, active && styles.radioActive]}>
                {active ? <View style={styles.radioDot} /> : null}
              </View>
              <Text style={styles.label}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing[3],
  },
  title: {
    fontSize: 20,
    lineHeight: 32.246,
    fontWeight: '600',
    letterSpacing: -0.6,
    color: color.text.neutralBold,
  },
  cancel: {
    ...font.bodyRegular,
    color: color.text.neutralRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  pressed: {
    opacity: 0.6,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: color.border.neutralSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: color.background.brandPrimaryRegular,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.text.inverseBold,
  },
  label: {
    ...font.bodyRegular,
    color: color.text.neutralBold,
  },
});
