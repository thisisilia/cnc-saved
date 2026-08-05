import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AI_REVIEW } from '../../data/sell';
import { color, font, radius, spacing } from '../../theme/tokens';
import AppIcon from '../icons/AppIcon';

/**
 * The canned "AI" read on a written description. A centred alert — not a bottom
 * sheet — dismissed with "Got it". Rendered as an in-frame overlay (not a native
 * Modal) so on web it stays inside the letterboxed phone frame.
 */
export default function AIReviewAlert({ visible, onClose }) {
  if (!visible) return null;
  return (
    <View style={styles.scrim}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss" />
      <View style={styles.card}>
        <View style={styles.head}>
          <AppIcon name="sparkles" size={24} color={color.icon.successBold} />
          <Text style={styles.title}>{AI_REVIEW.title}</Text>
        </View>
        <Text style={styles.body}>{AI_REVIEW.body}</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Got it"
        >
          <Text style={styles.buttonLabel}>Got it</Text>
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
    backgroundColor: color.background.neutralWhite,
    borderRadius: radius.xl,
    padding: spacing[5],
    gap: spacing[3],
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  title: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  body: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
    marginTop: spacing[1],
  },
  pressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    ...font.bodyEmphasized,
    color: color.text.inverseBold,
  },
});
