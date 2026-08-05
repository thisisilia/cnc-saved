import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';
import ProgressRing from './addVehicle/ProgressRing';

/**
 * Resume an unfinished vehicle setup.
 *
 * The PRD asks that leaving the add-vehicle flow keeps progress as a draft the
 * user can return to. This sits inside the My garage card — the draft is a
 * vehicle, so it belongs with them rather than as a banner of its own — and
 * reuses the setup checklist's progress ring so the two read as one journey.
 */
export default function ResumeSetupStrip({ title, percent, onContinue }) {
  return (
    <View style={styles.strip}>
      <ProgressRing percent={percent} size={36} stroke={3} />

      {/* The ring carries how far along it is; these two lines say which
          vehicle and what is unfinished. */}
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.task} numberOfLines={1}>
          Adding to your garage
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.continue, pressed && styles.pressed]}
        onPress={onContinue}
        accessibilityRole="button"
        accessibilityLabel={title ? `Continue setup for ${title}` : 'Continue vehicle setup'}
      >
        <Text style={styles.continueLabel}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // White on the card's subtle surface — the same nesting the valuations card
  // uses for its tiles.
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: color.background.neutralWhite,
    borderRadius: radius.md,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  task: {
    ...font.bodyXsRegular,
    color: color.text.neutralBold,
  },
  continue: {
    justifyContent: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  pressed: {
    opacity: 0.7,
  },
  continueLabel: {
    ...font.bodyXsEmphasized,
    color: color.text.inverseBold,
  },
});
