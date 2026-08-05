import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../theme/tokens';
import BottomSheet from './BottomSheet';

/**
 * Destructive confirmation (Figma 1197-6351).
 *
 * A centred icon, the question, and what will actually be lost — then two full
 * width pills on the same neutral surface. The destructive one is distinguished
 * by its red label rather than a red fill, so neither reads as the safe default
 * and the choice stays deliberate.
 */
export default function ConfirmSheet({
  visible,
  icon = 'trash-2',
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <Feather name={icon} size={28} color={color.icon.dangerBold} />

        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
          >
            <Text style={[styles.buttonLabel, styles.destructive]}>{confirmLabel}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
          >
            <Text style={styles.buttonLabel}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  copy: {
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    ...font.title3Emphasized,
    color: color.text.neutralBold,
    textAlign: 'center',
  },
  message: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing[3],
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralRegular,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonLabel: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  destructive: {
    color: color.icon.dangerBold,
  },
});
