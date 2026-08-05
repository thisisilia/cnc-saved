import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, radius, spacing } from '../../theme/tokens';

// Dark-green tooltip with a lighter-green CTA (attached coachmark design).
const BG = 'hsla(154, 87%, 15%, 1)';
const BUTTON = '#3d8f63';

/**
 * Coachmark anchored beneath the "Add vehicle to your garage" card — a pointer
 * touches the card above and the card explains why to start the setup. Positioned
 * by the caller via `style` (absolute, below the card).
 */
export default function Coachmark({ onStart, onSkip, style }) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.pointer} />
      <View style={styles.body}>
        <Text style={styles.title}>Track your own vehicle</Text>
        <Text style={styles.description}>
          Add information here for easy access in future and share with your beauty with the world
        </Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Start adding your vehicle"
        >
          <Text style={styles.buttonLabel}>Start adding your vehicle</Text>
        </Pressable>

        <Pressable
          style={styles.skip}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip"
          hitSlop={8}
        >
          <Text style={styles.skipLabel}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: BG,
  },
  body: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radius.lg,
    backgroundColor: BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: color.text.inverseBold,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: BUTTON,
    marginTop: spacing[1],
  },
  pressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: color.text.inverseBold,
  },
  skip: {
    paddingVertical: spacing[1],
  },
  skipLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: color.text.inverseBold,
  },
});
