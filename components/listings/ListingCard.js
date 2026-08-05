import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, fontFamily, radius, spacing } from '../../theme/tokens';
import Checkbox from '../Checkbox';
import Flag from './Flag';
import LoveButton from './LoveButton';

const IMAGE_HEIGHT = 123;

/**
 * A bookmarked car. In select mode the heart is replaced by a checkbox and the
 * whole card toggles selection instead of opening the listing.
 *
 * Overlays follow the design-system card: the make logo (or, for auctions, a
 * status pill) top-left, the love/select control top-right, a country flag
 * bottom-left, and a `footBadge` ("Reserve met") or `sold` SOLD pill
 * bottom-right. `live` prefixes the top pill with a dot.
 */
export default function ListingCard({ listing, selecting, selected, onPress, onToggleSaved }) {
  const { topBadge, footBadge, sold, live } = listing;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={listing.name}
      accessibilityState={selecting ? { checked: selected } : undefined}
    >
      <View style={styles.imageFrame}>
        <Image source={listing.image} style={styles.image} resizeMode="cover" />

        {topBadge ? (
          <View style={styles.topBadge}>
            {live ? <View style={styles.liveDot} /> : null}
            <Text style={styles.topBadgeLabel} numberOfLines={1}>
              {topBadge}
            </Text>
          </View>
        ) : listing.dealer ? (
          // Dealer logo (Figma 1299-21874) — only listings sold via a dealer show one.
          <Image
            source={require('../../assets/dealer-logo.png')}
            style={styles.dealerLogo}
            resizeMode="cover"
          />
        ) : null}

        <View style={styles.corner}>
          {selecting ? (
            <Checkbox checked={selected} rounded onChange={() => onPress()} accessibilityLabel={`Select ${listing.name}`} />
          ) : (
            <LoveButton
              saved={listing.saved}
              onPress={onToggleSaved}
              accessibilityLabel={listing.saved ? `Unsave ${listing.name}` : `Save ${listing.name}`}
            />
          )}
        </View>

        <View style={styles.flag}>
          <Flag code={listing.flag} width={14} />
        </View>

        {sold ? (
          <View style={styles.soldBadge}>
            <Text style={styles.soldLabel}>SOLD</Text>
          </View>
        ) : footBadge ? (
          <View style={styles.footBadge}>
            <Text style={styles.footBadgeLabel}>{footBadge}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.meta}>
        <Text style={styles.name} numberOfLines={1}>
          {listing.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{listing.price}</Text>
          <Text style={styles.asking}>{listing.askingLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  imageFrame: {
    height: IMAGE_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dealerLogo: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: color.background.neutralWhite,
  },
  corner: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
  },
  flag: {
    position: 'absolute',
    bottom: spacing[2],
    left: spacing[2],
  },
  topBadge: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: color.overlay.neutralBold,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'hsla(207, 82%, 53%, 1)',
  },
  topBadgeLabel: {
    ...font.labelSm,
    color: color.text.inverseBold,
    textTransform: 'none',
    letterSpacing: 0,
  },
  soldBadge: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
    backgroundColor: color.background.neutralWhite,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  soldLabel: {
    ...font.labelSm,
    fontFamily: fontFamily.brandBold,
    fontWeight: 'normal',
    color: color.text.dangerBold,
  },
  footBadge: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
    backgroundColor: 'hsla(138, 63%, 97%, 1)',
    borderWidth: 1,
    borderColor: 'hsla(135, 59%, 49%, 1)',
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  footBadgeLabel: {
    ...font.labelSm,
    color: color.text.neutralBold,
    textTransform: 'none',
    letterSpacing: 0,
  },
  meta: {
    paddingTop: spacing[1],
    paddingHorizontal: spacing[1],
    gap: spacing[1],
  },
  name: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  price: {
    ...font.bodyXsEmphasized,
    color: color.text.neutralBold,
  },
  asking: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
});
