import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import AppIcon from '../icons/AppIcon';
import Sparkline from '../Sparkline';

/**
 * Price-trend summary for a saved search (Figma 1135-22074): a neutral-subtle
 * card with the aggregate value, its delta, and a mini area chart. The whole
 * card is the tap target — it opens the performance sheet, mirroring the
 * portfolio card on My Garage.
 */
export default function PriceTrendCard({ trend, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Price trends, ${trend.value}, up ${trend.delta}`}
    >
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Price trends</Text>
          <Feather name="chevron-right" size={16} color={color.icon.neutralBold} />
        </View>

        <View style={styles.figures}>
          <Text style={styles.value}>{trend.value}</Text>
          <View style={styles.deltaRow}>
            <AppIcon name="arrow-up-right" size={14} color={color.icon.successBold} />
            <Text style={styles.delta}>{trend.delta}</Text>
            <Text style={styles.delta}>{trend.deltaValue}</Text>
          </View>
        </View>
      </View>

      <Sparkline width={120} height={64} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  pressed: {
    opacity: 0.7,
  },
  details: {
    flex: 1,
    minWidth: 0,
    gap: spacing[1],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    ...font.bodyLgEmphasized,
    color: color.text.neutralBold,
  },
  figures: {
    gap: spacing[1],
  },
  value: {
    ...font.bodyLgEmphasized,
    color: color.text.neutralBold,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  delta: {
    ...font.bodyXsEmphasized,
    color: color.text.successBold,
  },
});
