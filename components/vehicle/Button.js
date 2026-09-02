import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderWidth, color, font, radius, spacing } from '../../theme/tokens';

/**
 * Design-system button.
 *
 * primary   — filled brand green (Sell my car)
 * secondary — filled neutral (Get expert valuation)
 * outline   — white with a 2px brand border (Edit details, Add service record)
 */
export default function Button({ label, variant = 'primary', onPress, leading, trailing, style, disabled }) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
    >
      <View style={styles.content}>
        {leading}
        <Text style={[styles.label, styles[`${variant}Label`]]} numberOfLines={1}>
          {label}
        </Text>
        {trailing}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2.5],
    borderRadius: radius.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  primary: {
    backgroundColor: color.background.brandPrimaryRegular,
  },
  primaryLabel: {
    color: color.background.neutralWhite,
  },
  secondary: {
    backgroundColor: color.background.neutralRegular,
  },
  secondaryLabel: {
    color: color.text.neutralBold,
  },
  outline: {
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.md,
    borderColor: color.border.brandPrimaryRegular,
  },
  outlineLabel: {
    color: color.text.brandPrimaryBold,
  },
  label: {
    ...font.bodyMdEmphasized,
    textAlign: 'center',
    // Never wrap: a hugging button should grow, not break its label in two.
    flexShrink: 0,
  },
});
