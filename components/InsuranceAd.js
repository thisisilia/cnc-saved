/**
 * The Car & Classic Insurance promo.
 *
 * The creative is a single 361x310 export from Figma: its headline is set in
 * a licensed display face and sits on a dotted purple field, neither of which
 * survives being rebuilt in views.
 *
 * The call to action is a real button laid over the one drawn into that
 * artwork, sized as a fraction of the card so it tracks the image at any
 * width. It was a transparent hit target until the label had to change —
 * baked-in text cannot be re-worded, translated, or scaled with the type
 * settings. The artwork still carries the old label underneath; the export
 * wants regenerating without its button when the designer next touches it.
 *
 * Ported from the auction page. Only its dependencies changed: this app's own
 * Button and AppIcon, whose spacing and radius tokens are the same scale.
 */

import { Image, StyleSheet, View } from 'react-native';
import AppIcon from './icons/AppIcon';
import Button from './vehicle/Button';
import { color, radius, spacing } from '../theme/tokens';

const CARD_WIDTH = 361;
const CARD_HEIGHT = 310;
// The button drawn into the artwork — 329x48 at (16, 246).
const CTA = {
  left: `${(16 / CARD_WIDTH) * 100}%`,
  top: `${(246 / CARD_HEIGHT) * 100}%`,
  width: `${(329 / CARD_WIDTH) * 100}%`,
  height: `${(48 / CARD_HEIGHT) * 100}%`,
};

export default function InsuranceAd({ ctaLabel = 'Find out more', onGetQuote }) {
  return (
    <View style={styles.card}>
      <Image
        source={require('../assets/ad-insurance.png')}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
        accessibilityLabel="Classic car insurance. For car people. By car people. Online specialist insurance, for the cars we love."
      />
      <View style={styles.cta}>
        <Button
          label={ctaLabel}
          variant="primary"
          style={styles.ctaButton}
          onPress={onGetQuote}
          trailing={
            <AppIcon name="arrow-right" size={20} color={color.background.neutralWhite} />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing[4],
    aspectRatio: CARD_WIDTH / CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cta: {
    position: 'absolute',
    ...CTA,
  },
  // Fills the box so it covers the drawn button underneath completely.
  ctaButton: {
    flex: 1,
    height: '100%',
    borderRadius: radius.xl,
  },
});
