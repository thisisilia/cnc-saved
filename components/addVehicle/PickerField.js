import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { borderWidth, color, font, radius, spacing } from '../../theme/tokens';
import DatePickerSheet from '../DatePickerSheet';

/**
 * A date/year field styled like {@link TextField} but opening the iOS wheel
 * picker instead of the keyboard. The floating label shows once a value is set;
 * an empty field shows the label in the placeholder position.
 */
export default function PickerField({
  label,
  value,
  onChange,
  mode = 'date',
  accessibilityLabel,
  onOpenChange,
  // When provided, the field does NOT render its own sheet — it asks the parent
  // to open one at the screen root instead. This is required inside a ScrollView
  // (whose overflow would otherwise clip the sheet's full-screen scrim).
  onRequestOpen,
}) {
  const [open, setOpen] = useState(false);
  const setOpenState = (next) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  const press = () => {
    if (onRequestOpen) {
      onRequestOpen({ mode, value, onConfirm: onChange });
    } else {
      setOpenState(true);
    }
  };
  return (
    <>
      <Pressable
        style={styles.field}
        onPress={press}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
      >
        {value ? <Text style={styles.floatLabel}>{label}</Text> : null}
        <Text style={[styles.value, !value && styles.placeholder]}>{value || label}</Text>
      </Pressable>
      {!onRequestOpen && (
        <DatePickerSheet
          visible={open}
          mode={mode}
          value={value}
          onClose={() => setOpenState(false)}
          onConfirm={onChange}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
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
  value: {
    ...font.calloutRegular,
    color: color.text.neutralBold,
  },
  placeholder: {
    color: color.text.neutralRegular,
  },
});
