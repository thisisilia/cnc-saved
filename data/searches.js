/**
 * Placeholder content for Saved → Searches (PRD section 4, Saved Searches).
 *
 * A saved search is a query the user follows — make, or make + model, or
 * make + model + variant. Its detail page reuses the same market presentation
 * as a vehicle: a price-trend summary, the market-trend comparables carousel,
 * and the list of matching cars.
 *
 * Photography reuses the existing car assets — no search-specific images were
 * exported — so entries share shots with the listings data.
 */

const photos = {
  gt3rs: require('../assets/cars/porsche-992-gt3rs.jpg'),
  carrera: require('../assets/cars/porsche-911-carrera.jpg'),
  m4: require('../assets/cars/bmw-m4.jpg'),
  mclaren: require('../assets/cars/mclaren-720s.jpg'),
};

const listing = (id, name, price, image, make) => ({
  id,
  name,
  price,
  askingLabel: 'Asking price',
  image,
  make,
  saved: true,
});

const GT3RS_LISTINGS = Array.from({ length: 6 }, (_, i) =>
  listing(`s-gt3rs-${i + 1}`, '2023 Porsche 992 GT3 RS', '£18,000', photos.gt3rs, 'Porsche')
);

const CARRERA_LISTINGS = [
  listing('s-carrera-1', '2009 Porsche 911 Carrera', '£38,500', photos.carrera, 'Porsche'),
  listing('s-carrera-2', '2009 Porsche 911 Carrera', '£41,000', photos.carrera, 'Porsche'),
  listing('s-carrera-3', '2009 Porsche 911 Carrera', '£39,750', photos.carrera, 'Porsche'),
  listing('s-carrera-4', '2009 Porsche 911 Carrera', '£43,200', photos.carrera, 'Porsche'),
];

const LONG_NAME = '2019 McLaren 720S Performance Coupé Luxury Edition';
const LONG_LISTINGS = [
  listing('s-long-1', LONG_NAME, '£142,000', photos.mclaren, 'McLaren'),
  listing('s-long-2', LONG_NAME, '£148,500', photos.mclaren, 'McLaren'),
  listing('s-long-3', LONG_NAME, '£139,900', photos.mclaren, 'McLaren'),
];

/**
 * `title` follows the make / model / variant the user searched. `meta` reads as
 * "N lists · <filter> · <region>" per the comp.
 */
export const searchCollections = [
  {
    id: 'gt3rs',
    title: 'Porsche 992 GT3 RS',
    meta: ['38 lists', 'min. 25,000 miles', 'UK'],
    priceTrend: { value: '£12,000,000', delta: '5%', deltaValue: '+ £14,000' },
    comparables: [
      {
        id: 'recent',
        kind: 'sale',
        label: 'Most recent sell',
        name: '2023 Porsche 992 GT3 RS',
        value: '£70,889',
        delta: '5%',
        deltaCaption: 'vs last month',
        image: photos.gt3rs,
      },
      {
        id: 'for-sale',
        kind: 'listings',
        label: 'Currently for sale',
        value: '38',
        meta: ['Live now', 'From £62,000'],
        delta: '5%',
        deltaCaption: 'vs last month',
        images: [photos.gt3rs, photos.gt3rs, photos.gt3rs, photos.gt3rs],
      },
    ],
    listings: GT3RS_LISTINGS,
  },
  {
    id: 'carrera',
    title: '2009 Porsche 911 Carrera',
    meta: ['12 lists', 'min. 40,000 miles', 'UK'],
    priceTrend: { value: '£1,480,000', delta: '3%', deltaValue: '+ £6,200' },
    comparables: [
      {
        id: 'recent',
        kind: 'sale',
        label: 'Most recent sell',
        name: '2009 Porsche 911 Carrera',
        value: '£41,750',
        delta: '3%',
        deltaCaption: 'vs last month',
        image: photos.carrera,
      },
      {
        id: 'for-sale',
        kind: 'listings',
        label: 'Currently for sale',
        value: '12',
        meta: ['Live now', 'From £36,500'],
        delta: '3%',
        deltaCaption: 'vs last month',
        images: [photos.carrera, photos.carrera, photos.carrera, photos.carrera],
      },
    ],
    listings: CARRERA_LISTINGS,
  },
  {
    // Deliberately long to exercise the header title marquee rule.
    id: 'long',
    title: LONG_NAME,
    meta: ['9 lists', 'min. 5,000 miles', 'UK'],
    priceTrend: { value: '£1,290,000', delta: '4%', deltaValue: '+ £9,400' },
    comparables: [
      {
        id: 'recent',
        kind: 'sale',
        label: 'Most recent sell',
        name: LONG_NAME,
        value: '£139,900',
        delta: '4%',
        deltaCaption: 'vs last month',
        image: photos.mclaren,
      },
      {
        id: 'for-sale',
        kind: 'listings',
        label: 'Currently for sale',
        value: '9',
        meta: ['Live now', 'From £132,000'],
        delta: '4%',
        deltaCaption: 'vs last month',
        images: [photos.mclaren, photos.mclaren, photos.mclaren, photos.mclaren],
      },
    ],
    listings: LONG_LISTINGS,
  },
];

/** The 2x2 mosaic on a search card. */
export function searchCover(collection) {
  return collection.listings.slice(0, 4).map((l) => l.image);
}
