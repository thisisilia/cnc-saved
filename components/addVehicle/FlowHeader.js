import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, size, spacing } from '../../theme/tokens';

/**
 * Sheet header for the add-vehicle steps: back on the left, centred title.
 *
 * The comp keeps an invisible button on the right purely to centre the title;
 * a spacer does the same job without putting a phantom control in the
 * accessibility tree.
 */
export default function FlowHeader({ title, onBack, onClose, backIcon = 'arrow-left' }) {
  return (
    <View style={styles.header}>
      <Pressable
        style={styles.button}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
      >
        <Feather name={backIcon} size={size[6]} color={color.icon.neutralBold} />
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {onClose ? (
        <Pressable
          style={styles.button}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
        >
          <Feather name="x" size={size[6]} color={color.icon.neutralBold} />
        </Pressable>
      ) : (
        <View style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    alignSelf: 'stretch',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  button: {
    width: size[10],
    height: size[10],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: color.overlay.inverseBold,
  },
  title: {
    ...font.headlineEmphasized,
    color: color.text.neutralBold,
    flex: 1,
    textAlign: 'center',
  },
});
