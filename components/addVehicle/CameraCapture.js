import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, font, radius, spacing } from '../../theme/tokens';

/**
 * Camera capture, shared by the document and photograph steps.
 *
 * Presentation only: the viewfinder is a still, and the shutter returns a
 * canned shot. Real capture needs expo-camera plus permission handling, and the
 * OCR behind the document step is server-side — neither is wired up here.
 *
 * The scan brackets are a document affordance; photographs pass showFrame={false}.
 */
export default function CameraCapture({
  preview,
  onCapture,
  onDone,
  hint = 'Centre document in the frame',
  captureLabel = 'Capture document',
  showFrame = true,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={styles.viewfinder}>
        {/* 100% of a sized parent — absoluteFill leaves the Image at its own
            aspect on web, letterboxing the viewfinder. */}
        <Image source={preview} style={styles.preview} resizeMode="cover" />

        {/* Scan frame: four brackets rather than a full rectangle. */}
        <View style={styles.frame} pointerEvents="none">
          {showFrame && (
            <>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </>
          )}
          {Boolean(hint) && <Text style={styles.hint}>{hint}</Text>}
        </View>
      </View>

      <View style={[styles.controls, { paddingBottom: insets.bottom || spacing[5] }]}>
        <Pressable
          style={styles.done}
          onPress={onDone}
          accessibilityRole="button"
          accessibilityLabel="Done capturing"
        >
          <Text style={styles.doneLabel}>Done</Text>
        </Pressable>

        <Pressable
          style={styles.shutter}
          onPress={onCapture}
          accessibilityRole="button"
          accessibilityLabel={captureLabel}
        >
          <View style={styles.shutterInner} />
        </Pressable>

        {/* Balances the shutter against Done so it sits centred. */}
        <View style={styles.spacer} />
      </View>
    </View>
  );
}

const BRACKET = 28;
const BRACKET_WIDTH = 3;

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  viewfinder: {
    flex: 1,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  frame: {
    ...StyleSheet.absoluteFillObject,
    margin: spacing[5],
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing[6],
  },
  corner: {
    position: 'absolute',
    width: BRACKET,
    height: BRACKET,
    borderColor: color.background.brandPrimaryRegular,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: BRACKET_WIDTH,
    borderLeftWidth: BRACKET_WIDTH,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: BRACKET_WIDTH,
    borderRightWidth: BRACKET_WIDTH,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BRACKET_WIDTH,
    borderLeftWidth: BRACKET_WIDTH,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: BRACKET_WIDTH,
    borderRightWidth: BRACKET_WIDTH,
  },
  hint: {
    ...font.bodySmEmphasized,
    color: color.background.brandPrimaryRegular,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    backgroundColor: '#000000',
  },
  done: {
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  doneLabel: {
    ...font.calloutEmphasized,
    color: color.text.inverseBold,
  },
  shutter: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ffffff',
  },
  spacer: {
    minWidth: 72,
  },
});
