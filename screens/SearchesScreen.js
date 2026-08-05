import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchCard from '../components/listings/SearchCard';
import NavHeader from '../components/NavHeader';
import Button from '../components/vehicle/Button';
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
 * Saved → Searches: the user's saved searches.
 *
 * Mirrors the Listings collection page, but a saved search is already specific,
 * so there is no "all" aggregate — just the grid of searches.
 */
export default function SearchesScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { visibleSearches } = useSavedLists();
  const all = visibleSearches(searchCollections);
  const shown = route.params?.single ? all.slice(0, 1) : all;

  return (
    <View style={styles.screen}>
      <NavHeader title="Searches" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {chunk(shown, COLUMNS).map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((collection) => (
              <SearchCard
                key={collection.id}
                collection={collection}
                onPress={() => navigation.navigate('SearchCollection', { id: collection.id })}
              />
            ))}
            {Array.from({ length: COLUMNS - row.length }, (_, j) => (
              <View key={`spacer-${j}`} style={styles.spacer} />
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
        <Button
          label="Add Saved Search"
          onPress={() => {}}
          leading={<Feather name="plus" size={20} color={color.text.inverseBold} />}
          style={styles.addButton}
        />
      </View>
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
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  addButton: {
    borderRadius: 16,
    minHeight: 48,
  },
});
