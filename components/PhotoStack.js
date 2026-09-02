/**
 * The stacked-photo badge — Figma 720:2153.
 *
 * Three 40pt tiles fanned out, the outer two rotated a few degrees and each
 * overlapping the next, with the last carrying the count of everything not
 * shown. It replaces a count pill that only ever said a number: this says the
 * number *and* what the number is of.
 *
 * Ported from the auction page's hero. Sits over a photograph, so it expects a
 * dark-ish ground behind it; place it absolutely in whatever hero it dresses.
 */

import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../theme/tokens';

const TILE = 40;
/** How much of each tile the next one covers, from the comp's -32 margin. */
const OVERLAP = 32;

function Tile({ source, rotate, children }) {
  return (
    <View style={[styles.tile, rotate ? { transform: [{ rotate }] } : null]}>
      {source ? (
        <Image
          source={source}
          style={styles.image}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      ) : null}
      {children}
    </View>
  );
}

export default function PhotoStack({ photos = [], total = 0, onPress }) {
  const [first, second, third] = photos;
  // The fan stands for three of them, so the last tile counts what is left
  // beyond those three.
  const remaining = Math.max(0, total - 3);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View all ${total} photos`}
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <Tile source={first} rotate="-5deg" />
      <Tile source={second} />
      <Tile source={third ?? first} rotate="5deg">
        {/* The brand ground with the photograph showing faintly through, so the
            count reads as "more of these" rather than a plain chip. */}
        <View style={styles.countScrim} />
        <Text style={styles.count}>{`+${remaining}`}</Text>
      </Tile>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing[1],
  },
  tile: {
    width: TILE,
    height: TILE,
    marginRight: -OVERLAP,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: color.border.neutralSubtle,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.background.brandPrimaryBold,
    // Browsers do not antialias an `overflow: hidden` clip on a rotated box, so
    // the tilted tiles came out with stepped edges. Promoting them to their own
    // compositing layer gets the smooth path.
    ...Platform.select({
      web: { willChange: 'transform', backfaceVisibility: 'hidden' },
      default: {},
    }),
    // The comp's drop shadow, so the fan reads as separate cards.
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8.889,
    shadowOffset: { width: 0, height: 2.222 },
    elevation: 3,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  countScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color.background.brandPrimaryBold,
    opacity: 0.7,
  },
  // Caption2/Emphasized, unmodified — it is already 11/13 at 600.
  count: {
    ...font.caption2Emphasized,
    color: color.text.inverseBold,
    textAlign: 'center',
  },
  pressed: { opacity: 0.85 },
});
