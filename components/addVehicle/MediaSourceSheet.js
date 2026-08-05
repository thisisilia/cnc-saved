import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';

function Source({ icon, label, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.source, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Feather name={icon} size={24} color={color.icon.brandPrimaryRegular} />
      <Text style={styles.sourceLabel}>{label}</Text>
    </Pressable>
  );
}

/**
 * Pick a source for photos or video — library or camera.
 *
 * The history step has its own sheet because it also carries the explainer and
 * a "no documents" escape; this is the plain two-way choice.
 */
export default function MediaSourceSheet({ visible, title, onClose, onPickLibrary, onOpenCamera }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.sources}>
          <Source icon="image" label="Photos" onPress={onPickLibrary} />
          <Source icon="camera" label="Camera" onPress={onOpenCamera} />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  sources: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  source: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralSubtle,
  },
  sourceLabel: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  pressed: {
    opacity: 0.6,
  },
});
