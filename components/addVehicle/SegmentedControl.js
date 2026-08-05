import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';

/** Pill segmented control — the Miles / Kilometres unit switch in the comp. */
export default function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[styles.segment, active && styles.segmentActive]}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
          >
            <Text style={active ? styles.labelActive : styles.label}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    flexShrink: 0,
  },
  segment: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
  },
  segmentActive: {
    backgroundColor: color.background.brandPrimaryRegular,
  },
  label: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  labelActive: {
    ...font.bodySmEmphasized,
    color: color.text.inverseBold,
  },
});
