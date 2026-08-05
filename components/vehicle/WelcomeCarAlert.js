import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';

const AI_ICON = require('../../assets/icons/ai-cnc.png');

/**
 * Shown once a vehicle is added (after the condition step), before its detail
 * page. "Start now" begins adding photos; "Skip for now" opens the car as-is.
 * A centred in-frame overlay, not a native Modal, so it stays in the web frame.
 */
export default function WelcomeCarAlert({ visible, onStart, onSkip }) {
  if (!visible) return null;
  return (
    <View style={styles.scrim}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onSkip} accessibilityLabel="Dismiss" />
      <View style={styles.card}>
        <Image source={AI_ICON} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>Welcome to your car&apos;s space</Text>
        <Text style={styles.body}>
          Add information here for easy access in future and share with your beauty with the world.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Start now"
        >
          <Text style={styles.primaryLabel}>Start now</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip"
        >
          <Text style={styles.secondaryLabel}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 100,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: color.background.neutralWhite,
    borderRadius: radius.xl,
    padding: spacing[5],
    gap: spacing[3],
  },
  icon: {
    width: 48,
    height: 48,
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
    textAlign: 'center',
  },
  body: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
  primary: {
    alignSelf: 'stretch',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
    marginTop: spacing[1],
  },
  primaryLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
  secondary: {
    alignSelf: 'stretch',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: color.background.neutralSubtle,
  },
  secondaryLabel: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  pressed: {
    opacity: 0.8,
  },
});
