import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';
import AppIcon from './icons/AppIcon';
import Sparkline from './Sparkline';

/** Combined performance of every owned vehicle. Opens the Performance sheet. */
export default function PortfolioCard({ portfolio, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${portfolio.label}, ${portfolio.totalValue}, up ${portfolio.delta}`}
    >
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.label}>{portfolio.label}</Text>
          <Feather name="chevron-right" size={16} color={color.text.neutralBold} />
        </View>

        <View style={styles.valueBlock}>
          <Text style={styles.total}>{portfolio.totalValue}</Text>
          <View style={styles.deltaRow}>
            <AppIcon name="arrow-up-right" size={14} color={color.icon.successBold} />
            <Text style={styles.deltaStrong}>{portfolio.delta}</Text>
            <Text style={styles.deltaStrong}>{portfolio.deltaValue}</Text>
            <Text style={styles.deltaCaption}>{portfolio.deltaCaption}</Text>
          </View>
        </View>
      </View>

      <Sparkline width={120} height={60} />
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
    gap: spacing[1],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  label: {
    ...font.bodyMdEmphasized,
    color: color.text.neutralBold,
  },
  count: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  valueBlock: {
    gap: spacing[1],
  },
  total: {
    ...font.bodyLgEmphasized,
    color: color.text.neutralBold,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  delta: {
    ...font.bodyXsRegular,
    color: color.text.successBold,
  },
  deltaStrong: {
    ...font.bodyXsEmphasized,
    color: color.text.successBold,
  },
  deltaCaption: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
});
