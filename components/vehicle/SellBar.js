import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, font, radius, spacing } from '../../theme/tokens';

/**
 * Fixed bottom action. Per the PRD this stays visible for the whole page so the
 * selling journey can start from anywhere.
 *
 * Not the shared Button: the comp gives this one its own metrics (48px tall,
 * 16px radius, 18px label) and pairs it side-by-side with the prompt.
 */
export default function SellBar({ onSell }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || spacing[8] }]}>
      <Text style={styles.prompt}>4 million enthusiasts are waiting</Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={onSell}
        accessibilityRole="button"
        accessibilityLabel="Sell this car"
      >
        <Text style={styles.label}>Sell this car</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
    backgroundColor: color.background.neutralWhite,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  prompt: {
    ...font.bodyMdEmphasized,
    color: color.text.neutralBold,
    flex: 1,
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: radius.xl,
    backgroundColor: color.background.brandPrimaryRegular,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...font.bodyLgEmphasized,
    color: color.text.inverseBold,
    textAlign: 'center',
  },
});
