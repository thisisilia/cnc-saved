import { createContext, useContext, useMemo, useState } from 'react';
import { ownedVehicles } from '../data/garage';
import { registerAddedVehicle } from '../data/vehicleDetails';

/**
 * The vehicles in My Garage.
 *
 * Seeded from the static garage list; the add-vehicle flow appends to it so a
 * newly added car appears at the top of the grid, per the PRD ("after the final
 * step, the vehicle appears in My Garage"). Not persisted — a reload returns to
 * the seed set.
 */
const GarageContext = createContext(null);

export function GarageProvider({ children }) {
  const [added, setAdded] = useState([]);
  // Seed vehicles cannot be spliced out of the static list, so removals are
  // tracked by id and filtered on read.
  const [removed, setRemoved] = useState([]);

  const value = useMemo(
    () => ({
      vehicles: [...added, ...ownedVehicles].filter((v) => !removed.includes(v.id)),
      addVehicle: (vehicle) => {
        // Also register it for the detail page, so tapping the new card resolves
        // to its own identity rather than falling back to the first vehicle.
        registerAddedVehicle(vehicle);
        setRemoved((prev) => prev.filter((id) => id !== vehicle.id));
        setAdded((prev) => [vehicle, ...prev.filter((v) => v.id !== vehicle.id)]);
      },
      removeVehicle: (id) => {
        setAdded((prev) => prev.filter((v) => v.id !== id));
        setRemoved((prev) => (prev.includes(id) ? prev : [...prev, id]));
      },
    }),
    [added, removed]
  );

  return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>;
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used inside GarageProvider');
  }
  return context;
}
