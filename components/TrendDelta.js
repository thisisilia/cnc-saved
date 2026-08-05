import { StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../theme/tokens';
import AppIcon from './icons/AppIcon';

/** Green "↗ 5%" pair used next to prices and in the garage header. */
export default function TrendDelta({ value, size = 12, muted = false }) {
  const tint = muted ? color.text.neutralBoldDisabled : undefined;
  return (
    <View style={styles.row}>
      <AppIcon name="arrow-up-right" size={size} color={tint ?? color.icon.successBold} />
      <Text style={[styles.value, tint && { color: tint }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  value: {
    ...font.bodyXsEmphasized,
    color: color.text.successBold,
  },
});
