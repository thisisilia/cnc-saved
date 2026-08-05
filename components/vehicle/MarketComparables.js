import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, spacing } from '../../theme/tokens';
import TrendDelta from '../TrendDelta';

/** "Most recent sell" — one photo beside the sale detail. */
function SaleComparable({ item, toneStyle }) {
  return (
    <View style={[styles.comparable, toneStyle]}>
      <Image source={item.image} style={styles.comparableImage} resizeMode="cover" />
      <View style={styles.comparableBody}>
        <Text style={styles.comparableLabel}>{item.label}</Text>
        <View style={styles.comparableDetail}>
          <Text style={styles.comparableName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.comparableValue}>{item.value}</Text>
        </View>
        <View style={styles.metricDelta}>
          <TrendDelta value={item.delta} />
          <Text style={styles.metricFootnote}>{item.deltaCaption}</Text>
        </View>
      </View>
    </View>
  );
}

/** "Currently for sale" — a 2x2 mosaic beside the listing count. */
function ListingsComparable({ item, toneStyle }) {
  return (
    <View style={[styles.comparable, toneStyle]}>
      <View style={styles.mosaic}>
        {item.images.slice(0, 4).map((image, i) => (
          <Image key={i} source={image} style={styles.mosaicTile} resizeMode="cover" />
        ))}
      </View>
      <View style={styles.comparableBody}>
        <Text style={styles.comparableLabel}>{item.label}</Text>
        <View style={styles.comparableDetail}>
          <Text style={styles.comparableValue}>{item.value}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metricFootnote}>{item.meta[0]}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metricFootnote}>{item.meta[1]}</Text>
          </View>
        </View>
        <View style={styles.metricDelta}>
          <TrendDelta value={item.delta} />
          <Text style={styles.metricFootnote}>{item.deltaCaption}</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Horizontal carousel of market comparables — a recent sale and what is
 * currently for sale. Shared by the vehicle market section and the saved-search
 * detail, which both present "the market for this model" the same way.
 */
export default function MarketComparables({ comparables, tone = 'regular' }) {
  const toneStyle = tone === 'subtle' ? styles.comparableSubtle : null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.stripScroll}
      contentContainerStyle={styles.strip}
    >
      {comparables.map((item) =>
        item.kind === 'sale' ? (
          <SaleComparable key={item.id} item={item} toneStyle={toneStyle} />
        ) : (
          <ListingsComparable key={item.id} item={item} toneStyle={toneStyle} />
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Run the carousel to the container edge so a peeking card is cut there, not
  // clipped early by the padding of the card/page it sits in.
  stripScroll: {
    marginHorizontal: -spacing[4],
  },
  strip: {
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  metricFootnote: {
    ...font.bodyXsRegular,
    color: color.text.neutralRegular,
  },
  metricDelta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  comparable: {
    width: 320,
    flexDirection: 'row',
    gap: spacing[4],
    padding: spacing[2],
    borderRadius: radius.md,
    backgroundColor: color.background.neutralRegular,
  },
  // On the searches page the strip sits straight on the page rather than inside
  // a section card, so it takes the lighter subtle surface.
  comparableSubtle: {
    backgroundColor: color.background.neutralSubtle,
  },
  comparableImage: {
    width: 100,
    height: 101,
    borderRadius: radius.md,
  },
  mosaic: {
    width: 100,
    height: 101,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  mosaicTile: {
    width: 50,
    height: 50.5,
  },
  comparableBody: {
    flex: 1,
    gap: spacing[1],
  },
  comparableLabel: {
    ...font.bodySmEmphasized,
    color: color.text.neutralBold,
  },
  comparableDetail: {
    gap: spacing[1],
  },
  comparableName: {
    ...font.bodySmRegular,
    color: color.text.neutralRegular,
  },
  comparableValue: {
    ...font.title2Emphasized,
    color: color.text.neutralBold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: color.text.neutralRegular,
  },
});
