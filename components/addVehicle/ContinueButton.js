import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';

/** Step's primary action. Disabled until the step's input is valid. */
export default function ContinueButton({ label = 'Continue', disabled, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.disabled : styles.enabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        <Text style={[styles.label, disabled ? styles.labelDisabled : styles.labelEnabled]}>
          {label}
        </Text>
        <Feather
          name="arrow-right"
          size={24}
          color={disabled ? color.text.neutralBoldDisabled : color.text.inverseBold}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: radius.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  enabled: {
    backgroundColor: color.background.brandPrimaryRegular,
  },
  disabled: {
    backgroundColor: color.background.neutralSubtle,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...font.bodyLgEmphasized,
    textAlign: 'center',
  },
  labelEnabled: {
    color: color.text.inverseBold,
  },
  labelDisabled: {
    color: color.text.neutralBoldDisabled,
  },
});
