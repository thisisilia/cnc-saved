import { StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../../theme/tokens';

/** Label on the left, value (with optional leading icon) right-aligned. */
export default function DetailRow({ label, value, leading }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueGroup}>
        {leading}
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  label: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  value: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
    textAlign: 'right',
  },
});
