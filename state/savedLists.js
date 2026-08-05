import { createContext, useContext, useMemo, useState } from 'react';

/**
 * Listings collections and saved searches the user has deleted.
 *
 * Both lists come from static placeholder data, so a deletion is tracked by id
 * and filtered on read rather than spliced out of the source. Not persisted; a
 * reload restores the seed lists.
 */
const SavedListsContext = createContext(null);

export function SavedListsProvider({ children }) {
  const [removed, setRemoved] = useState({ collections: [], searches: [] });

  const value = useMemo(
    () => ({
      isCollectionRemoved: (id) => removed.collections.includes(id),
      isSearchRemoved: (id) => removed.searches.includes(id),
      visibleCollections: (all) => all.filter((c) => !removed.collections.includes(c.id)),
      visibleSearches: (all) => all.filter((s) => !removed.searches.includes(s.id)),
      removeCollection: (id) =>
        setRemoved((prev) =>
          prev.collections.includes(id)
            ? prev
            : { ...prev, collections: [...prev.collections, id] }
        ),
      removeSearch: (id) =>
        setRemoved((prev) =>
          prev.searches.includes(id) ? prev : { ...prev, searches: [...prev.searches, id] }
        ),
    }),
    [removed]
  );

  return <SavedListsContext.Provider value={value}>{children}</SavedListsContext.Provider>;
}

export function useSavedLists() {
  const context = useContext(SavedListsContext);
  if (!context) {
    throw new Error('useSavedLists must be used inside SavedListsProvider');
  }
  return context;
}
