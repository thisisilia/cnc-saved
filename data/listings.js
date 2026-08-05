/**
 * Placeholder content for Saved → Listings (PRD section 4, Bookmarked Cars).
 *
 * Listings are bookmarked cars the user does not own, grouped into
 * collections. "All saved listings" is a system collection that spans every
 * other one, so it cannot be renamed or removed.
 *
 * Photography reuses the existing car assets — no listing-specific images were
 * exported — so several entries share a shot.
 */

const photos = {
  gt3rs: require('../assets/cars/porsche-992-gt3rs.jpg'),
  carrera: require('../assets/cars/porsche-911-carrera.jpg'),
  m4: require('../assets/cars/bmw-m4.jpg'),
  mclaren: require('../assets/cars/mclaren-720s.jpg'),
  jesko: require('../assets/cars/koenigsegg-jesko.jpg'),
  challenger: require('../assets/cars/dodge-challenger.jpg'),
};

/**
 * `make` resolves the manufacturer logo from the generated logo map. `dealer`
 * marks cars sold through a dealer — only those show the dealer logo overlay.
 */
const listing = (id, name, price, image, make, dealer = false) => ({
  id,
  name,
  price,
  askingLabel: 'Asking price',
  image,
  make,
  dealer,
  saved: true,
});

const PORSCHE_LISTINGS = [
  listing('gt3rs-1', '2023 Porsche 992 GT3 RS', '£18,000', photos.gt3rs, 'Porsche', true),
  listing('gt3rs-2', '2023 Porsche 992 GT3 RS', '£18,000', photos.gt3rs, 'Porsche'),
  listing('gt3rs-3', '2023 Porsche 992 GT3 RS', '£18,000', photos.gt3rs, 'Porsche', true),
  listing('gt3rs-4', '2023 Porsche 992 GT3 RS', '£18,000', photos.gt3rs, 'Porsche'),
  listing('carrera-1', '2006 Porsche 911 Carrera 4 S', '£42,500', photos.carrera, 'Porsche', true),
  listing('carrera-2', '2006 Porsche 911 Carrera 4 S', '£44,900', photos.carrera, 'Porsche'),
];

const OTHER_LISTINGS = [
  listing('m4-1', '2021 BMW M4 Competition', '£58,000', photos.m4, 'BMW', true),
  listing('mclaren-1', '2019 McLaren 720S', '£142,000', photos.mclaren, 'McLaren'),
  listing('jesko-1', '2022 Koenigsegg Jesko', '£2,800,000', photos.jesko, 'Koenigsegg', true),
  listing('challenger-1', '2018 Dodge Challenger', '£31,500', photos.challenger, 'Dodge'),
];

/**
 * `system: true` marks the aggregate collection. Its contents are derived, so
 * it is excluded from rename and delete.
 */
export const collections = [
  {
    id: 'all',
    name: 'All saved listings',
    system: true,
    newCount: 2,
    listingIds: [...PORSCHE_LISTINGS, ...OTHER_LISTINGS].map((l) => l.id),
  },
  {
    id: 'porsche-911',
    name: '2009 Porsche 911 Carrera',
    newCount: 2,
    listingIds: PORSCHE_LISTINGS.map((l) => l.id),
  },
  {
    id: 'new-collection',
    name: 'New collection',
    newCount: 2,
    listingIds: OTHER_LISTINGS.map((l) => l.id),
  },
];

export const listingsById = Object.fromEntries(
  [...PORSCHE_LISTINGS, ...OTHER_LISTINGS].map((l) => [l.id, l])
);

export function collectionListings(collection) {
  return collection.listingIds.map((id) => listingsById[id]).filter(Boolean);
}

/** The 2x2 mosaic on a collection card. */
export function collectionCover(collection) {
  return collectionListings(collection).slice(0, 4).map((l) => l.image);
}
