import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CollectionCard from '../components/listings/CollectionCard';
import NavHeader from '../components/NavHeader';
import Button from '../components/vehicle/Button';
import { collections } from '../data/listings';
import { useSavedLists } from '../state/savedLists';
import { color, spacing } from '../theme/tokens';

const COLUMNS = 2;

function chunk(items, size) {
  const rows = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/** Saved → Listings: the user's collections of bookmarked cars. */
export default function ListingsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { visibleCollections } = useSavedLists();
  const all = visibleCollections(collections);
  const shown = route.params?.single ? all.slice(0, 1) : all;

  return (
    <View style={styles.screen}>
      <NavHeader title="Listings" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {chunk(shown, COLUMNS).map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onPress={() => navigation.navigate('Collection', { id: collection.id })}
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
          label="Add Listings"
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
