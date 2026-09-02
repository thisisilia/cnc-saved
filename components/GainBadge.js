import { StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';
import AppIcon from './icons/AppIcon';

/**
 * Green value-gain badge — "↗ 5%" on a light green pill. Shared across the
 * garage list, saved garage card and vehicle rows so gains read the same
 * everywhere. `profit` (e.g. "+ £4,000") is shown next to it when supplied.
 */
// Gain green — per spec.
export const GAIN_GREEN = 'hsla(154, 76%, 33%, 1)';

export default function GainBadge({ value, profit, size = 10 }) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <AppIcon name="arrow-up-right" size={size} color={color.text.inverseBold} />
        <Text style={styles.value}>{value}</Text>
      </View>
      {profit ? <Text style={styles.profit}>{profit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 2,
    paddingRight: 4,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: GAIN_GREEN,
  },
  value: {
    ...font.caption2Emphasized,
    color: color.text.inverseBold,
  },
  profit: {
    ...font.bodyXsEmphasized,
    color: GAIN_GREEN,
  },
});
