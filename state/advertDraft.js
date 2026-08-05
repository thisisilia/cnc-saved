import { createContext, useContext, useMemo, useState } from 'react';

/**
 * The "Create an advert" flow's per-vehicle working data.
 *
 * History and photos are read from the vehicle itself (they reuse the existing
 * edit flows); this only holds what the advert flow collects on its own — the
 * written description and the asking price. Not persisted; a reload clears it.
 */
const AdvertContext = createContext(null);

export function AdvertDraftProvider({ children }) {
  const [drafts, setDrafts] = useState({});

  const value = useMemo(
    () => ({
      getAdvert: (id) => drafts[id] ?? null,
      setAdvert: (id, patch) =>
        setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } })),
    }),
    [drafts]
  );

  return <AdvertContext.Provider value={value}>{children}</AdvertContext.Provider>;
}

export function useAdvertDraft(id) {
  const context = useContext(AdvertContext);
  if (!context) {
    throw new Error('useAdvertDraft must be used inside AdvertDraftProvider');
  }
  const advert = context.getAdvert(id) ?? {};
  return {
    description: advert.description ?? '',
    price: advert.price ?? null,
    currency: advert.currency ?? 'GBP',
    setDescription: (description) => context.setAdvert(id, { description }),
    setPrice: (price, currency) => context.setAdvert(id, { price, currency }),
  };
}
