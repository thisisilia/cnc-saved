import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { PURCHASE_BLURB, SAVED_CARD, money } from '../../data/sell';
import { getVehicleDetails } from '../../data/vehicleDetails';
import { color, font, radius, spacing } from '../../theme/tokens';
import ApplePayMark from './ApplePayMark';
import BottomSheet from '../BottomSheet';

/** Review-and-pay sheet shown after a paid package is chosen. */
export default function PurchaseConfirmSheet({ visible, vehicleId, pkg, onClose, onContinue }) {
  const vehicle = getVehicleDetails(vehicleId);
  const cover = (vehicle.photos && vehicle.photos[0]) || vehicle.heroImage;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.title}>Payment</Text>

        <View style={styles.vehicleRow}>
          {cover ? <Image source={cover} style={styles.thumb} resizeMode="cover" /> : <View style={styles.thumb} />}
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
        </View>

        <Text style={styles.blurb}>{PURCHASE_BLURB}</Text>

        <Text style={styles.summaryLabel}>Package summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryItem}>{pkg.name} 30 day boost</Text>
          <Text style={styles.summaryAmount}>{money(pkg.amount)}</Text>
        </View>

        <View style={styles.cardRow}>
          <ApplePayMark height={26} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardNumber}>{SAVED_CARD.number}</Text>
            <Text style={styles.cardExpiry}>{SAVED_CARD.expires}</Text>
          </View>
          <Pressable onPress={() => {}} accessibilityRole="button" accessibilityLabel="Edit payment method" hitSlop={8}>
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>

        <Pressable style={styles.continue} onPress={onContinue} accessibilityRole="button" accessibilityLabel="Continue payment">
          <Text style={styles.continueLabel}>Continue</Text>
          <Feather name="arrow-right" size={18} color={color.text.inverseBold} />
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    gap: spacing[4],
  },
  title: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  thumb: {
    width: 120,
    height: 84,
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralRegular,
  },
  vehicleName: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  blurb: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
  summaryLabel: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -spacing[2],
  },
  summaryItem: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
  summaryAmount: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    ...font.subheadlineRegular,
    fontWeight: '600',
    color: color.text.neutralBold,
  },
  cardExpiry: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  edit: {
    ...font.subheadlineRegular,
    fontWeight: '600',
    color: color.text.brandPrimaryRegular,
  },
  continue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 52,
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
    marginTop: spacing[2],
  },
  continueLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
});
