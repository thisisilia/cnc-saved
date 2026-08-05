import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ListingCard from '../components/listings/ListingCard';
import PriceTrendCard from '../components/listings/PriceTrendCard';
import ConfirmSheet from '../components/ConfirmSheet';
import NavHeader from '../components/NavHeader';
import MarketComparables from '../components/vehicle/MarketComparables';
import { searchCollections } from '../data/searches';
import { useSavedLists } from '../state/savedLists';
import { color, spacing } from '../theme/tokens';

const COLUMNS = 2;

function chunk(items, size) {
  const rows = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/**
 * A single saved search.
 *
 * Presents the market for the searched model the same way a vehicle does — a
 * price-trend summary and the comparables carousel — then the matching cars.
 */
export default function SearchCollectionScreen({ navigation, route }) {
  const collection = useMemo(
    () => searchCollections.find((c) => c.id === route.params?.id) ?? searchCollections[0],
    [route.params?.id]
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { removeSearch } = useSavedLists();

  return (
    <View style={styles.screen}>
      <NavHeader
        title={collection.title}
        subtitle={collection.meta.join(' · ')}
        onBack={() => navigation.goBack()}
        actions={[
          {
            key: 'delete',
            icon: 'trash-2',
            tone: 'danger',
            label: 'Delete search',
            onPress: () => setConfirmDelete(true),
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PriceTrendCard
          trend={collection.priceTrend}
          onPress={() =>
            navigation.navigate('Performance', {
              title: 'Price trends',
              portfolio: {
                totalValue: collection.priceTrend.value,
                delta: collection.priceTrend.delta,
                deltaValue: collection.priceTrend.deltaValue,
              },
            })
          }
        />

        <MarketComparables comparables={collection.comparables} tone="subtle" />

        {chunk(collection.listings, COLUMNS).map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
            {Array.from({ length: COLUMNS - row.length }, (_, j) => (
              <View key={`spacer-${j}`} style={styles.spacer} />
            ))}
          </View>
        ))}
      </ScrollView>

      <ConfirmSheet
        visible={confirmDelete}
        title="Delete this saved search?"
        message={`${collection.title} will be removed from your saved searches. You will stop seeing new matches for it. This cannot be undone.`}
        confirmLabel="Delete search"
        onConfirm={() => {
          setConfirmDelete(false);
          removeSearch(collection.id);
          navigation.goBack();
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background.neutralWhite,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
    gap: spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  spacer: {
    flex: 1,
  },
});
