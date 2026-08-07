import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, fontFamily, font, radius, spacing } from '../../theme/tokens';
import CircleInfo from '../icons/CircleInfo';

/**
 * Insurance eligibility card (Figma 1292-21285): a white, purple-outlined pill
 * with the customer avatar, the eligibility line and the annual-from price.
 * Tapping it starts the quote.
 */
export default function InsuranceSection({ insurance, onQuote }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onQuote}
      accessibilityRole="button"
      accessibilityLabel={`${insurance.eligibleLabel} ${insurance.amount} ${insurance.period}`}
    >
      <Image
        source={require('../../assets/insurance-logo.png')}
        style={styles.avatar}
        resizeMode="contain"
      />

      <View style={styles.text}>
        <Text style={styles.eligible}>
          {insurance.eligibleLabel}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.amount}>{insurance.amount}</Text>
          <Text style={styles.period}>{insurance.period}</Text>
          <Feather name="arrow-right" size={20} color={color.text.brandPrimaryRegular} />
        </View>
      </View>

      <View style={styles.info}>
        <CircleInfo size={20} color={color.icon.neutralRegular} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: '#7468f8',
    backgroundColor: color.background.neutralWhite,
  },
  pressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 48,
    height: 48,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  info: {
    alignSelf: 'flex-start',
  },
  eligible: {
    ...font.bodySmRegular,
    fontFamily: fontFamily.brandSemibold,
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 20,
    color: color.text.neutralBold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  amount: {
    ...font.title3Emphasized,
    color: color.text.brandPrimaryRegular,
  },
  period: {
    ...font.bodySmRegular,
    color: color.text.brandPrimaryRegular,
  },
});
