import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { AUCTION_PITCH, SELF_LISTING_PITCH } from '../../data/sell';
import { color, font, radius, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';
import AppIcon from '../icons/AppIcon';
import Button from './Button';

const SELL_FASTER_BLUE = '#2f57e6';

function Point({ label, muted }) {
  return (
    <View style={styles.point}>
      <AppIcon
        name="circle-check"
        size={18}
        color={muted ? color.icon.brandPrimaryRegular : color.icon.successBold}
      />
      <Text style={styles.pointLabel}>{label}</Text>
    </View>
  );
}

/**
 * The two ways to sell, offered when "Sell my car" is tapped: a hands-off
 * auction, or a self-managed advert. Only the advert route is wired up.
 */
export default function SellSheet({ visible, onClose, onCreateAdvert, onAuction }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        {/* Auction */}
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{AUCTION_PITCH.badge}</Text>
          </View>
          <Text style={styles.cardTitle}>{AUCTION_PITCH.title}</Text>
          <View style={styles.divider} />
          <View style={styles.points}>
            {AUCTION_PITCH.points.map((p) => (
              <Point key={p} label={p} />
            ))}
          </View>
          <Button label={AUCTION_PITCH.cta} onPress={onAuction} />
          <Text style={styles.call}>
            Or call us on <Text style={styles.phone}>{AUCTION_PITCH.phone}</Text>
          </Text>
          <View style={styles.trustpilot}>
            <Feather name="star" size={16} color={color.icon.successBold} />
            <Text style={styles.trustName}>Trustpilot</Text>
            <Text style={styles.trustScore}>{AUCTION_PITCH.rating}</Text>
            <Text style={styles.trustLabel}>{AUCTION_PITCH.ratingLabel}</Text>
          </View>
        </View>

        {/* Self-listing */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{SELF_LISTING_PITCH.title}</Text>
          <View style={styles.divider} />
          <View style={styles.points}>
            {SELF_LISTING_PITCH.points.map((p) => (
              <Point key={p} label={p} muted />
            ))}
          </View>
          <Button label={SELF_LISTING_PITCH.cta} onPress={onCreateAdvert} />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    gap: spacing[4],
  },
  card: {
    backgroundColor: color.background.neutralSubtle,
    borderRadius: radius.xl,
    padding: spacing[5],
    gap: spacing[3],
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    backgroundColor: SELL_FASTER_BLUE,
  },
  badgeLabel: {
    ...font.labelSm,
    color: color.text.inverseBold,
    letterSpacing: 0.6,
  },
  cardTitle: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
  },
  divider: {
    height: 1,
    backgroundColor: color.border.neutralSubtle,
  },
  points: {
    gap: spacing[2.5],
    marginBottom: spacing[1],
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2.5],
  },
  pointLabel: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
    flex: 1,
  },
  call: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
  phone: {
    color: color.text.neutralBold,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  trustpilot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  trustName: {
    ...font.subheadlineRegular,
    fontWeight: '700',
    color: color.text.neutralBold,
  },
  trustScore: {
    ...font.subheadlineRegular,
    fontWeight: '700',
    color: color.text.neutralBold,
  },
  trustLabel: {
    ...font.subheadlineRegular,
    color: color.text.neutralBold,
  },
});
