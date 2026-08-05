import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { searchCover } from '../../data/searches';
import { color, font, radius, spacing } from '../../theme/tokens';

const COVER_HEIGHT = 112;
// Seamless 2×2 cover — the tiles touch, no spacing between them.
const COVER_GAP = 0;
const COVER_ROW_HEIGHT = COVER_HEIGHT / 2;

/** Saved-search tile: a 2x2 cover mosaic, the searched title, and its count. */
export default function SearchCard({ collection, onPress }) {
  const cover = searchCover(collection);
  const count = collection.listings.length;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${collection.title}, ${count} listings`}
    >
      <View style={styles.cover}>
        <View style={styles.coverRow}>
          {cover.slice(0, 2).map((image, i) => (
            <Image key={i} source={image} style={styles.tile} resizeMode="cover" />
          ))}
        </View>
        <View style={styles.coverRow}>
          {cover.slice(2, 4).map((image, i) => (
            <Image key={i} source={image} style={styles.tile} resizeMode="cover" />
          ))}
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.name} numberOfLines={2}>
          {collection.title}
        </Text>
        <Text style={styles.count} numberOfLines={1}>
          {count} listings
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing[1],
  },
  pressed: {
    opacity: 0.7,
  },
  cover: {
    height: COVER_HEIGHT,
    gap: COVER_GAP,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: color.background.neutralRegular,
  },
  coverRow: {
    flexDirection: 'row',
    gap: COVER_GAP,
    height: COVER_ROW_HEIGHT,
  },
  // Explicit height: flex sets only the width, so the image's intrinsic height
  // would otherwise win and `cover` zoom to fill it.
  tile: {
    flex: 1,
    height: '100%',
  },
  meta: {
    paddingHorizontal: spacing[1],
  },
  name: {
    ...font.calloutEmphasized,
    color: color.text.neutralBold,
  },
  count: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
});
