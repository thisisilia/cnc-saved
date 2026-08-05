import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SAMPLE_DOCUMENTS, UPLOAD_COPY } from '../../data/history';
import { color, font, radius, spacing } from '../../theme/tokens';
import BottomSheet from '../BottomSheet';

function SourceButton({ icon, label, onPress }) {
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
 * Explains the history step and offers the upload sources.
 *
 * Also the "add more" entry point: reopening it from the timeline is how the
 * user adds further documents.
 */
export default function HistoryUploadSheet({
  visible,
  onClose,
  onPickPhotos,
  onOpenCamera,
  onSkip,
  infoOnly = false,
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.title}>{UPLOAD_COPY.title}</Text>
        <Text style={styles.copy}>{UPLOAD_COPY.body}</Text>
        <Text style={styles.emphasis}>{UPLOAD_COPY.emphasis}</Text>

        {/* One tall scan beside two stacked, as in the comp. */}
        {/* Each image fills a flex box rather than flexing itself: an Image
            given flex sizes to its own artwork on web and blows out the row. */}
        <View style={styles.samples}>
          <View style={styles.sampleCell}>
            <Image source={SAMPLE_DOCUMENTS[0]} style={styles.sampleImage} resizeMode="cover" />
          </View>
          <View style={styles.sampleColumn}>
            <View style={styles.sampleCell}>
              <Image source={SAMPLE_DOCUMENTS[1]} style={styles.sampleImage} resizeMode="cover" />
            </View>
            <View style={styles.sampleCell}>
              <Image source={SAMPLE_DOCUMENTS[2]} style={styles.sampleImage} resizeMode="cover" />
            </View>
          </View>
        </View>

        {/* Opened from the info icon, the sheet is purely the explainer — the
            upload sources and skip only belong in the add-documents flow. */}
        {!infoOnly && (
          <>
            <View style={styles.sources}>
              <SourceButton icon="image" label="Photos" onPress={onPickPhotos} />
              <SourceButton icon="camera" label="Camera" onPress={onOpenCamera} />
            </View>

            <Pressable
              style={({ pressed }) => [styles.skip, pressed && styles.pressed]}
              onPress={onSkip}
              accessibilityRole="button"
              accessibilityLabel="I don't have any documents"
            >
              <Text style={styles.skipLabel}>I don&apos;t have any documents</Text>
            </Pressable>
          </>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    gap: spacing[3],
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  copy: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
  emphasis: {
    ...font.subheadlineRegular,
    fontWeight: '600',
    color: color.text.neutralBold,
  },
  samples: {
    flexDirection: 'row',
    gap: spacing[2],
    height: 220,
  },
  sampleCell: {
    flex: 1,
    minWidth: 0,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  sampleImage: {
    width: '100%',
    height: '100%',
  },
  sampleColumn: {
    flex: 1,
    minWidth: 0,
    gap: spacing[2],
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
  skip: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: radius.lg,
    backgroundColor: color.background.neutralSubtle,
  },
  skipLabel: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
});
