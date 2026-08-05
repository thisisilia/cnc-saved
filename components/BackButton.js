import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { color, size, spacing } from '../theme/tokens';

/**
 * Bare chevron back control, matching the app's page headers (NavHeader) and the
 * vehicle detail page — a size-10 touch target around a size-6 chevron.
 */
export default function BackButton({ onPress, style }) {
  return (
    <Pressable
      style={[styles.back, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={8}
    >
      <Feather name="chevron-left" size={size[6]} color={color.text.neutralBold} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    width: size[10],
    height: size[10],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing[2],
  },
});
