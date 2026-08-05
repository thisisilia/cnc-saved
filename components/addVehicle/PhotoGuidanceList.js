import { Image, StyleSheet, Text, View } from 'react-native';
import { PHOTOS_INTRO, PHOTO_GUIDANCE } from '../../data/photos';
import { color, font, radius, spacing } from '../../theme/tokens';

/**
 * What to shoot, illustrated. Shared by the Photographs screen (shown until the
 * first photo is added) and its info sheet, which carry the same content at
 * different thumbnail sizes.
 */
export default function PhotoGuidanceList({ thumbWidth = 117, thumbHeight = 82 }) {
  return (
    <>
      <Text style={styles.intro}>{PHOTOS_INTRO}</Text>
      {PHOTO_GUIDANCE.map((item) => (
        <View key={item.id} style={styles.guide}>
          {/* The image fills a sized cell: an Image given flex sizes to its own
              artwork on web and blows out the row. */}
          <View style={[styles.thumbCell, { width: thumbWidth, height: thumbHeight }]}>
            <Image source={item.image} style={styles.thumb} resizeMode="cover" />
          </View>
          <View style={styles.body}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.description}</Text>
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...font.bodyRegular,
    color: color.text.neutralBold,
  },
  guide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  thumbCell: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  text: {
    ...font.subheadlineRegular,
    color: color.text.neutralRegular,
  },
});
