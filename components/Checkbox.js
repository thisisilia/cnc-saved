import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { borderWidth, color, radius, size } from '../theme/tokens';

/**
 * Selection control, per the "Checkboxes" and "Radios" components in Figma.
 * They share every state and differ only in shape and marker, so one component
 * covers both: `shape="radio"` swaps the square for a circle and the tick for a
 * dot. Use this anywhere a checkbox or radio is needed.
 *
 * `rounded` gives a checkbox a circular outline while keeping its tick — the
 * shape used for selecting cards, which reads as a checkbox, not a radio.
 *
 * Figma also documents Hover and Focus states. Hover is desktop-web only and
 * Focus needs keyboard navigation, so neither is wired up here — the tokens are
 * in place if this ever ships to desktop.
 */
export default function Checkbox({
  checked,
  onChange,
  shape = 'checkbox',
  rounded = false,
  disabled = false,
  accessibilityLabel,
}) {
  const radio = shape === 'radio';

  return (
    <Pressable
      onPress={disabled ? undefined : () => onChange(!checked)}
      disabled={disabled}
      role={radio ? 'radio' : 'checkbox'}
      accessibilityState={{ checked, disabled }}
      aria-checked={checked}
      aria-disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={[
        styles.base,
        radio || rounded ? styles.radio : styles.checkbox,
        checked && !disabled && styles.checked,
        !checked && !disabled && styles.unchecked,
        disabled && styles.disabled,
      ]}
    >
      {checked &&
        (radio ? (
          <View
            style={[
              styles.dot,
              { backgroundColor: disabled ? color.text.neutralBoldDisabled : color.text.inverseBold },
            ]}
          />
        ) : (
          <Feather
            name="check"
            size={20}
            color={disabled ? color.text.neutralBoldDisabled : color.text.inverseBold}
          />
        ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: size[6],
    height: size[6],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkbox: {
    borderRadius: radius.sm,
  },
  radio: {
    borderRadius: radius.full,
  },
  unchecked: {
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralRegular,
  },
  checked: {
    backgroundColor: color.background.brandPrimaryRegular,
  },
  disabled: {
    backgroundColor: color.background.neutralRegular,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralBoldDisabled,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
