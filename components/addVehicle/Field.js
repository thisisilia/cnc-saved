import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { borderWidth, color, font, radius, spacing } from '../../theme/tokens';

/**
 * Free-text field with a floating label: the label sits in the placeholder
 * position and only lifts to a small caption above the value while the field
 * is focused (clicked) — including when the field is already filled. On blur
 * the value shows on its own again.
 *
 * `keyboardType` comes from the field definition so numeric fields (year,
 * engine size, odometer) raise the number pad while the rest get the default
 * keyboard.
 */
export function TextField({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  accessibilityLabel,
  editable = true,
}) {
  const numeric = keyboardType === 'number-pad' || keyboardType === 'numeric';
  const [focused, setFocused] = useState(false);
  const floating = focused;

  return (
    <View style={[styles.textField, !editable && styles.fieldDisabled]}>
      {floating ? <Text style={styles.floatLabel}>{label}</Text> : null}
      <TextInput
        style={[styles.input, !editable && styles.inputDisabled]}
        value={value}
        // Digits-only fields reject anything else, so a hardware or
        // suggestion-bar keystroke can't slip letters into a year.
        onChangeText={(text) => onChangeText(numeric ? text.replace(/[^0-9]/g, '') : text)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={floating ? '' : label}
        placeholderTextColor={color.text.neutralRegular}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        editable={editable}
        accessibilityLabel={accessibilityLabel ?? label}
      />
    </View>
  );
}

/** Select field. Opens an OptionSheet; the chevron marks it as a picker. */
export function SelectField({ label, value, onPress }) {
  return (
    <Pressable
      style={styles.field}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}: ${value}` : label}
    >
      <Text style={[styles.value, !value && styles.placeholder]}>{value || label}</Text>
      <Feather name="chevron-down" size={20} color={color.icon.neutralBold} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minHeight: 52,
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  textField: {
    justifyContent: 'center',
    gap: 2,
    minHeight: 52,
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: color.border.neutralSubtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  floatLabel: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  input: {
    minWidth: 0,
    padding: 0,
    ...font.calloutRegular,
    color: color.text.neutralBold,
    outlineStyle: 'none',
  },
  fieldDisabled: {
    backgroundColor: color.background.neutralSubtle,
  },
  inputDisabled: {
    color: color.text.neutralRegular,
  },
  value: {
    flex: 1,
    ...font.calloutRegular,
    color: color.text.neutralBold,
  },
  placeholder: {
    color: color.text.neutralRegular,
  },
});
