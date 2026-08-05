import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { collectionCover } from '../../data/listings';
import { color, font, radius, spacing } from '../../theme/tokens';

const COVER_HEIGHT = 100;
// Seamless 2×2 cover — the tiles touch, no spacing between them.
const COVER_GAP = 0;
const COVER_ROW_HEIGHT = COVER_HEIGHT / 2;

/** Collection tile: a 2x2 cover mosaic, a NEW badge, name and count. */
export default function CollectionCard({ collection, onPress }) {
  const cover = collectionCover(collection);
  const count = collection.listingIds.length;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${collection.name}, ${count} listings`}
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

        {collection.newCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{collection.newCount} New</Text>
          </View>
        )}
      </View>

      <View style={styles.meta}>
        <Text style={styles.name}>{collection.name}</Text>
        <Text style={styles.count}>{count} listings</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing[2],
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
  // Height must be explicit: flex only sets the width here, leaving the image's
  // intrinsic height to win and `cover` to zoom to fill it.
  tile: {
    flex: 1,
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: color.background.brandPrimaryRegular,
    borderBottomLeftRadius: radius.md,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  badgeLabel: {
    ...font.caption1Emphasized,
    color: color.text.inverseBold,
  },
  meta: {
    gap: spacing[1],
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
