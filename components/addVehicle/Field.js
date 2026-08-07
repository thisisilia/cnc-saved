import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { borderWidth, color, font, radius, spacing } from '../../theme/tokens';

// Field states:
//   empty  → placeholder only (no floating label), default placeholder border
//   active → floating label, active border (focused / picker open)
//   filled → floating label, filled border
export const BORDER_EMPTY = color.border.neutralSubtle;
export const BORDER_FILLED = 'hsla(120, 2%, 37%, 1)';
export const BORDER_ACTIVE = '#2693EA';
export const borderFor = (active, filled) =>
  active ? BORDER_ACTIVE : filled ? BORDER_FILLED : BORDER_EMPTY;

/**
 * Free-text field with a floating label. Empty and unfocused, the label sits in
 * the placeholder position; once the field is focused OR has a value, the label
 * lifts to a caption above it. The border turns active (green) while focused.
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
  const floating = focused || !!value;

  return (
    <View
      style={[
        styles.textField,
        { borderColor: borderFor(focused, !!value) },
        !editable && styles.fieldDisabled,
      ]}
    >
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

/**
 * Select field. Opens an OptionSheet; the chevron marks it as a picker. Same
 * three states as {@link TextField} — pass `active` while its sheet is open.
 */
export function SelectField({ label, value, onPress, active = false }) {
  const floating = active || !!value;

  return (
    <Pressable
      style={[styles.field, { borderColor: borderFor(active, !!value) }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}: ${value}` : label}
    >
      {floating ? <Text style={styles.floatLabel}>{label}</Text> : null}
      <View style={styles.selectRow}>
        <Text style={[styles.value, !value && styles.placeholder]}>{value || label}</Text>
        <Feather name="chevron-down" size={20} color={color.icon.neutralBold} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    justifyContent: 'center',
    gap: 2,
    minHeight: 52,
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: BORDER_EMPTY,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  textField: {
    justifyContent: 'center',
    gap: 2,
    minHeight: 52,
    backgroundColor: color.background.neutralWhite,
    borderWidth: borderWidth.xs,
    borderColor: BORDER_EMPTY,
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
    borderWidth: 0,
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
