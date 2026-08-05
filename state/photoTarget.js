import { getVehicleDetails } from '../data/vehicleDetails';
import { useAddVehicleDraft } from './addVehicleDraft';
import { useVehicleEdits } from './vehicleEdits';

/**
 * Where the photos & video flow reads and writes.
 *
 * The same screens serve two callers: the add flow (no id — writes to the draft)
 * and editing a saved vehicle from the Edit details hub (an id — writes to that
 * vehicle's edits so its detail page updates). The draft keeps photos as
 * `{ items: [{ id, image }] }`; a saved vehicle keeps a plain image array, so
 * this adapts between the two shapes.
 */
export function usePhotoTarget(id) {
  const draft = useAddVehicleDraft();
  const { getEdits, saveEdits } = useVehicleEdits();

  if (!id) {
    return {
      photos: draft.photos,
      setPhotos: draft.setPhotos,
      video: draft.video,
      setVideo: draft.setVideo,
    };
  }

  const edits = getEdits(id) ?? {};
  const sources = edits.photos ?? getVehicleDetails(id).photos ?? [];

  return {
    photos: { items: sources.map((image, i) => ({ id: `p-${i}`, image })) },
    setPhotos: ({ items }) => saveEdits(id, { photos: items.map((it) => it.image) }),
    video: edits.video ?? null,
    setVideo: (video) => saveEdits(id, { video }),
  };
}

/**
 * Where the history flow reads and writes — the draft during add, or a saved
 * vehicle's service history when editing from the Edit details hub. The entry
 * shape is the same on both sides, so this only swaps the backing store.
 */
export function useHistoryTarget(id) {
  const draft = useAddVehicleDraft();
  const { getEdits, saveEdits } = useVehicleEdits();

  if (!id) {
    return { history: draft.history, setHistory: draft.setHistory };
  }

  const edits = getEdits(id) ?? {};
  const entries = edits.serviceHistory ?? getVehicleDetails(id).serviceHistory ?? [];

  return {
    history: { entries },
    setHistory: ({ entries: next }) => saveEdits(id, { serviceHistory: next }),
  };
}
