import { createContext, useContext, useMemo, useState } from 'react';

/**
 * The vehicle being added, shared across the steps that build it.
 *
 * The steps used to hand this object back and forth through route params. That
 * silently dropped the draft when navigating to a screen already in the stack —
 * the page rendered with no plate, no logo and a valuation computed from
 * defaults. Each new step made the chain longer and the failure likelier, so
 * the draft lives here instead and screens read what they need.
 *
 * It is deliberately not persisted: an abandoned draft should not resurface.
 */
const AddVehicleDraftContext = createContext(null);

const EMPTY = { draft: null, purchase: null, history: null, photos: null, video: null };

export function AddVehicleDraftProvider({ children }) {
  const [state, setState] = useState(EMPTY);

  const value = useMemo(
    () => ({
      ...state,

      /** Begins a new vehicle, clearing any half-finished one. */
      startDraft: (draft) => setState({ ...EMPTY, draft }),

      setPurchase: (purchase) => setState((prev) => ({ ...prev, purchase })),
      setHistory: (history) => setState((prev) => ({ ...prev, history })),
      setPhotos: (photos) => setState((prev) => ({ ...prev, photos })),
      setVideo: (video) => setState((prev) => ({ ...prev, video })),
      reset: () => setState(EMPTY),
    }),
    [state]
  );

  return <AddVehicleDraftContext.Provider value={value}>{children}</AddVehicleDraftContext.Provider>;
}

export function useAddVehicleDraft() {
  const context = useContext(AddVehicleDraftContext);
  if (!context) {
    throw new Error('useAddVehicleDraft must be used inside AddVehicleDraftProvider');
  }
  return context;
}
