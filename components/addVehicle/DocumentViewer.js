import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, font, radius, spacing } from '../../theme/tokens';
import Toggle from '../Toggle';

const DANGER = '#e5484d';

/**
 * A single uploaded document, full screen.
 *
 * "Show on listing" controls whether the scan is published with the vehicle.
 * It defaults on: this is the owner's own vehicle, so nothing is hidden unless
 * they choose to. Turning it off veils the image, matching the comp.
 *
 * The personal-information warning is shown whenever the document is flagged;
 * detection itself is server-side.
 */
export default function DocumentViewer({ visible, document, onClose, onDelete, onToggleShow }) {
  const insets = useSafeAreaInsets();

  if (!visible || !document) return null;

  const shown = document.showOnListing !== false;

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top || spacing[5] }]}>
        <Pressable
          style={styles.close}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close document"
          hitSlop={8}
        >
          <Feather name="x" size={20} color={color.text.inverseBold} />
        </Pressable>
      </View>

      <View style={styles.stage}>
        <Image source={document.image} style={styles.image} resizeMode="contain" />
        {!shown && (
          <View style={styles.veil} pointerEvents="none">
            <Feather name="eye-off" size={64} color="rgba(255,255,255,0.75)" />
          </View>
        )}
      </View>

      <View style={[styles.panel, { paddingBottom: insets.bottom || spacing[5] }]}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Show on listing</Text>
          <Toggle
            value={shown}
            onValueChange={onToggleShow}
            accessibilityLabel="Show on listing"
          />
        </View>

        {document.hasPersonalInfo && (
          <View style={styles.warning}>
            <Feather name="alert-triangle" size={16} color={DANGER} />
            <Text style={styles.warningText}>
              System detected personal information on this image. For your safety we recommend
              not showing it on your listing.
            </Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.delete, pressed && styles.pressed]}
          onPress={() => onDelete(document)}
          accessibilityRole="button"
          accessibilityLabel="Delete image"
        >
          <Feather name="trash-2" size={18} color={DANGER} />
          <Text style={styles.deleteLabel}>Delete image</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  top: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panel: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    gap: spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  rowLabel: {
    ...font.calloutEmphasized,
    color: color.text.inverseBold,
  },
  warning: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  warningText: {
    ...font.bodySmRegular,
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 52,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  pressed: {
    opacity: 0.6,
  },
  deleteLabel: {
    ...font.calloutEmphasized,
    color: DANGER,
  },
});
