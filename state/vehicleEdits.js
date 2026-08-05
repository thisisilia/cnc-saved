import { createContext, useContext, useMemo, useState } from 'react';

/**
 * Edits made to an owned vehicle from the Edit vehicle page.
 *
 * The detail page's content is static placeholder data, so edits are held here
 * as a per-vehicle patch and merged over it on read. Only the sections the edit
 * page owns are patched — photos, car info, purchase, MOT and service history.
 * Not persisted; a reload returns to the seed data.
 */
const VehicleEditsContext = createContext(null);

const PATCHABLE = ['photos', 'carInfo', 'purchase', 'mot', 'serviceHistory'];

export function VehicleEditsProvider({ children }) {
  const [edits, setEdits] = useState({});

  const value = useMemo(
    () => ({
      edits,
      getEdits: (id) => edits[id] ?? null,
      saveEdits: (id, patch) => setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } })),
    }),
    [edits]
  );

  return <VehicleEditsContext.Provider value={value}>{children}</VehicleEditsContext.Provider>;
}

export function useVehicleEdits() {
  const context = useContext(VehicleEditsContext);
  if (!context) {
    throw new Error('useVehicleEdits must be used inside VehicleEditsProvider');
  }
  return context;
}

/** Overlay a saved patch on top of the vehicle's static detail. */
export function applyVehicleEdits(vehicle, patch) {
  if (!patch) return vehicle;
  const merged = { ...vehicle };
  PATCHABLE.forEach((key) => {
    if (patch[key] !== undefined) merged[key] = patch[key];
  });
  return merged;
}
