import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, spacing } from '../../theme/tokens';
import ListingCard from '../listings/ListingCard';

// Wide enough that the second card is cut at roughly three-quarters, signalling
// the row scrolls rather than reading as a fixed pair.
const CARD_WIDTH = 190;

/**
 * A titled, horizontally-scrolling row of vehicle cards — "Recently sold" and
 * "Similar vehicle for sale" on the market/valuation pages. Capped at four
 * cards; the row breaks out of the page padding so a peeking card is cut at the
 * screen edge rather than clipped early.
 */
export default function ComparableSection({ title, items, onSeeAll }) {
  if (!items?.length) return null;
  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          style={styles.seeAll}
          onPress={onSeeAll}
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
        >
          <Text style={styles.seeAllLabel}>See all</Text>
          <Feather name="chevron-right" size={16} color={color.icon.neutralBold} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.strip}
      >
        {items.slice(0, 4).map((item) => (
          <View key={item.id} style={styles.card}>
            <ListingCard listing={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing[3],
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...font.bodyEmphasized,
    color: color.text.neutralBold,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  seeAllLabel: {
    ...font.bodySmRegular,
    color: color.text.neutralBold,
  },
  scroll: {
    marginHorizontal: -spacing[4],
  },
  strip: {
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  card: {
    width: CARD_WIDTH,
  },
});
