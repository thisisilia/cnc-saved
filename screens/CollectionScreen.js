import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConfirmSheet from '../components/ConfirmSheet';
import CollectionActionsSheet from '../components/listings/CollectionActionsSheet';
import ListingCard from '../components/listings/ListingCard';
import RenameCollectionSheet from '../components/listings/RenameCollectionSheet';
import NavHeader from '../components/NavHeader';
import Button from '../components/vehicle/Button';
import { collectionListings, collections } from '../data/listings';
import { useSavedLists } from '../state/savedLists';
import { color, spacing } from '../theme/tokens';

const COLUMNS = 2;

function chunk(items, size) {
  const rows = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/**
 * A single collection of bookmarked cars.
 *
 * "Select" turns the grid into a multi-select for bulk actions. No comp exists
 * for that state — only the button that enters it — so the checkboxes and the
 * action bar below are inferred from the described actions (add to a new
 * collection, or unsave).
 */
export default function CollectionScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const collection = useMemo(
    () => collections.find((c) => c.id === route.params?.id) ?? collections[0],
    [route.params?.id]
  );

  const [name, setName] = useState(collection.name);
  const [listings, setListings] = useState(() => collectionListings(collection));
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sheet, setSheet] = useState(null);
  const { removeCollection } = useSavedLists();

  const toggleSelected = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const exitSelect = () => {
    setSelecting(false);
    setSelected([]);
  };

  const unsaveSelected = () => {
    setListings((prev) => prev.filter((l) => !selected.includes(l.id)));
    exitSelect();
  };

  const actions = selecting
    ? [{ key: 'cancel', text: 'Cancel', label: 'Cancel selection', onPress: exitSelect }]
    : [
        { key: 'select', text: 'Select', label: 'Select listings', onPress: () => setSelecting(true) },
        { key: 'more', icon: 'more-horizontal', label: 'Collection options', onPress: () => setSheet('actions') },
      ];

  return (
    <View style={styles.screen}>
      <NavHeader
        title={name}
        subtitle={`${listings.length} listings`}
        onBack={() => navigation.goBack()}
        actions={actions}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {chunk(listings, COLUMNS).map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                selecting={selecting}
                selected={selected.includes(item.id)}
                onPress={() => (selecting ? toggleSelected(item.id) : undefined)}
                onToggleSaved={() => setListings((prev) => prev.filter((l) => l.id !== item.id))}
              />
            ))}
            {Array.from({ length: COLUMNS - row.length }, (_, j) => (
              <View key={`spacer-${j}`} style={styles.spacer} />
            ))}
          </View>
        ))}
      </ScrollView>

      {selecting && (
        <View style={[styles.footer, { paddingBottom: insets.bottom || spacing[4] }]}>
          <Button
            label={`Add to collection${selected.length ? ` (${selected.length})` : ''}`}
            onPress={() => {}}
            style={[styles.footerButton, !selected.length && styles.disabled]}
          />
          <Button
            label="Unsave"
            variant="outline"
            onPress={selected.length ? unsaveSelected : undefined}
            style={[styles.footerButton, !selected.length && styles.disabled]}
          />
        </View>
      )}

      <CollectionActionsSheet
        visible={sheet === 'actions'}
        collection={collection}
        onClose={() => setSheet(null)}
        onRename={() => setSheet('rename')}
        onDelete={() => setSheet('confirmDelete')}
      />

      <ConfirmSheet
        visible={sheet === 'confirmDelete'}
        title="Delete this collection?"
        message={`${name} will be removed from your saved listings. The ${listings.length} ${
          listings.length === 1 ? 'car' : 'cars'
        } inside stay saved under All saved listings. This cannot be undone.`}
        confirmLabel="Delete collection"
        onConfirm={() => {
          setSheet(null);
          removeCollection(collection.id);
          navigation.goBack();
        }}
        onClose={() => setSheet(null)}
      />

      <RenameCollectionSheet
        visible={sheet === 'rename'}
        collection={{ ...collection, name }}
        onClose={() => setSheet(null)}
        onRename={(next) => {
          setName(next);
          setSheet(null);
        }}
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
  footer: {
    flexDirection: 'row',
    gap: spacing[3],
    backgroundColor: color.background.neutralWhite,
    borderTopWidth: 1,
    borderTopColor: color.border.neutralSubtle,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  footerButton: {
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
