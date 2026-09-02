import { Image, Pressable, StyleSheet } from 'react-native';
import { radius } from '../../theme/tokens';

/**
 * Car & Classic insurance promo (Figma 1322-25341) — the purple "Classic Car
 * Insurance. For car people. By car people." banner, ending in a green
 * "Get a quote in minutes" button. Shipped as one artwork export (display type
 * and dotted field don't rebuild cleanly in views); tapping it starts the quote.
 */
export default function InsuranceSection({ insurance, onQuote }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onQuote}
      accessibilityRole="button"
      accessibilityLabel="Classic car insurance — get a quote in minutes"
    >
      <Image
        source={require('../../assets/insurance-banner.png')}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 361 / 310,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
