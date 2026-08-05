import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import MakeLogo from '../addVehicle/MakeLogo';
import TrendDelta from '../TrendDelta';

/**
 * A logged valuation (Figma 1135-21707): title, value with trend, and an
 * expiry. A brand rule runs down the leading edge and the make's silhouette
 * sits faint behind the content. Expired entries grey out and drop the rule.
 */
export default function ValuationCard({ entry, onPress }) {
  const expired = Boolean(entry.expired);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, expired && styles.cardExpired, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${entry.title}, ${entry.value}, ${entry.expires}`}
    >
      <View style={[styles.accent, expired && styles.accentExpired]} />

      <View style={styles.body}>
        <View style={styles.head}>
          <Text style={[styles.title, expired && styles.textDisabled]} numberOfLines={1}>
            {entry.title}
          </Text>
          <View style={styles.valueRow}>
            <Text style={[styles.value, expired && styles.textDisabled]}>{entry.value}</Text>
            <TrendDelta value={entry.delta} muted={expired} />
          </View>
        </View>
        <Text style={[styles.expires, expired && styles.expired]}>{entry.expires}</Text>
      </View>

      <View style={styles.logo}>
        {/* Plain logo — no chip disc or shadow here, unlike the listing cards.
            Resolve by make across all groups; `category` drives the watermark. */}
        <MakeLogo make={entry.make} size={52} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: color.background.neutralWhite,
    borderWidth: 1,
    borderColor: color.border.neutralSubtle,
    borderRadius: 10,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    overflow: 'hidden',
  },
  cardExpired: {
    borderColor: color.border.neutralBoldDisabled,
  },
  pressed: {
    opacity: 0.7,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: color.background.brandPrimaryBold,
  },
  accentExpired: {
    backgroundColor: color.background.brandPrimarySubtle,
  },
  body: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing[10],
    gap: spacing[3],
  },
  head: {
    gap: spacing[1],
  },
  title: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  value: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  textDisabled: {
    color: color.text.neutralBoldDisabled,
  },
  expires: {
    ...font.labelSm,
    color: color.text.neutralRegular,
  },
  expired: {
    color: color.text.dangerBold,
  },
  logo: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[4],
  },
});
