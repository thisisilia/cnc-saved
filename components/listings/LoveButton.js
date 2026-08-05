import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

/** iOS system pink — the filled "loved" heart, per the comp. */
const LOVED = '#ff2d55';

/**
 * Save toggle shown over a listing image (1157-20179).
 *
 * A dark translucent puck so the heart reads against any photo; outline when
 * unsaved, filled pink once loved.
 */
export default function LoveButton({ saved, onPress, accessibilityLabel }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: saved }}
      // accessibilityState does not reach the DOM on react-native-web.
      aria-pressed={saved}
    >
      <Ionicons
        name={saved ? 'heart' : 'heart-outline'}
        size={16}
        color={saved ? LOVED : '#ffffff'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(51,51,51,0.4)',
  },
});
