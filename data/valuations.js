/**
 * Placeholder content for Saved → Valuations (PRD section 6).
 *
 * A valuation is an automatically-logged record of a value check — the car is
 * not necessarily owned. The list shows each check with its value and an expiry;
 * opening one shows the estimate, the market demand, and comparable cars.
 *
 * Photography and market figures reuse the existing assets and mirror the
 * vehicle detail market section; no valuation-specific data was exported.
 */

const photos = {
  gt3rs: require('../assets/cars/porsche-992-gt3rs.jpg'),
  m4: require('../assets/cars/bmw-m4.jpg'),
  challenger: require('../assets/cars/dodge-challenger.jpg'),
  carrera: require('../assets/cars/porsche-911-carrera.jpg'),
};

/**
 * Rows on the Valuations page. `category` picks the faint watermark (car vs
 * motorcycle); `expired` greys the row out per the comp.
 */
export const valuationEntries = [
  {
    id: 'gt3rs',
    title: '2023 Porsche 992',
    value: '£245,000',
    delta: '5%',
    expires: 'Expires : 15/07/2026',
    make: 'Porsche',
    category: 'car',
  },
  {
    id: 'bmw',
    title: '2007 BMW A5 Coupe',
    value: '£12,500',
    delta: '5%',
    expires: 'Expires : 15/07/2026',
    make: 'BMW',
    category: 'car',
  },
  {
    id: 'ducati',
    title: '2007 Ducati 899 Panigale',
    value: '£8,500',
    delta: '5%',
    expires: 'Expires : 15/07/2026',
    make: 'Ducati',
    category: 'motorcycle',
  },
  {
    id: 'audi',
    title: '2007 Audi A5 Coupe',
    value: '£9,000',
    delta: '5%',
    expires: 'Expired',
    expired: true,
    make: 'Audi',
    category: 'car',
  },
];

const listing = (id, name, price, label, image, make, extra = {}) => ({
  id,
  name,
  price,
  askingLabel: label,
  image,
  make,
  saved: true,
  ...extra,
});

/** A rising price history for the demand chart (y-axis £0–£100k). */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const AXIS_MAX = 100000;
const HISTORY = [
  62400, 63100, 62800, 64500, 66200, 65800, 68100, 70400, 69800, 72600, 74100, 73800, 76900, 79200,
  81400, 80748,
].map((value, i, arr) => ({
  label: MONTHS[Math.min(Math.floor((i / arr.length) * MONTHS.length), MONTHS.length - 1)],
  value,
}));

/** Individual-sale scatter for the "Show individual sales" toggle. */
const SALES = [
  68748, 92300, 74100, 256748, 81200, 70400, 88900, 76500, 63200, 84700, 79100, 95400,
].map((value, i, arr) => {
  const t = i / arr.length;
  return {
    id: `sale-${i}`,
    t,
    value,
    name: '2023 Porsche 992 GT3 RS',
    date: `${MONTHS[Math.min(Math.floor(t * MONTHS.length), MONTHS.length - 1)]} ${1 + i * 2}, 2026`,
    image: photos.gt3rs,
  };
});

const SIMILAR = [
  listing('sim-1', '2023 Porsche 992 GT3 RS', '£18,000', 'Asking price', photos.gt3rs, 'Porsche'),
  listing('sim-2', '2023 Porsche 992 GT3 RS', '£18,000', 'Asking price', photos.gt3rs, 'Porsche'),
  listing('sim-3', '2023 Porsche 992 GT3 RS', '£18,000', '12 bids', photos.gt3rs, 'Porsche', {
    topBadge: '1d 12h 21m',
    live: true,
    footBadge: 'Reserve met',
  }),
  listing('sim-4', '2023 Porsche 992 GT3 RS', '£18,000', '12 bids', photos.gt3rs, 'Porsche', {
    topBadge: '1d 12h 21m',
    live: true,
    footBadge: 'Reserve met',
  }),
];

const RECENTLY_SOLD = Array.from({ length: 4 }, (_, i) =>
  listing(`sold-${i + 1}`, '2023 Porsche 992 GT3 RS', '£18,000', 'Sold', photos.gt3rs, 'Porsche', {
    sold: true,
    topBadge: 'Auction ended',
  })
);

/** The estimate card's condition scale, shared across the placeholder details. */
const GRADES = [
  { id: 'fair', label: 'Fair', price: '£60,700' },
  { id: 'good', label: 'Good', price: '£70,700' },
  { id: 'excellent', label: 'Excellent', price: '£75,700', active: true },
  { id: 'concours', label: 'Concours', price: '£80,000' },
];

/** PRD step 2 — how long the user has owned the vehicle. */
export const OWNERSHIP_OPTIONS = [
  "I don't own the vehicle",
  'Less than a month',
  'Less than a year',
  'Less than 5 years',
  'More than 5 years',
];

/** The one ownership answer that means the user is only valuing, not owning. */
export const NOT_OWNED = OWNERSHIP_OPTIONS[0];

/**
 * Fields the search path collects by hand before a valuation. Make and model
 * come from the catalogue selection; the rest are entered here.
 */
export const VALUATION_FIELDS = [
  { id: 'year', label: 'Year of manufacture', type: 'text', keyboardType: 'number-pad' },
  { id: 'variant', label: 'Variant', type: 'select', options: ['Cooper', 'Cooper S', 'Cooper Sport', 'Mayfair', 'Works', 'Base'] },
  { id: 'bodyType', label: 'Body type', type: 'select', options: ['Saloon', 'Coupe', 'Convertible', 'Estate', 'Hatchback'] },
];

/** Headline estimate per condition — matches the comp's Excellent = £77,500. */
const ESTIMATE_BY_CONDITION = {
  fair: '£60,700',
  good: '£70,700',
  excellent: '£77,500',
  concours: '£80,000',
};

/**
 * The estimate shown after the condition step: a value plus the condition scale
 * with the chosen grade marked active.
 */
export function buildEstimate(conditionId) {
  const id = ESTIMATE_BY_CONDITION[conditionId] ? conditionId : 'excellent';
  const grade = GRADES.find((g) => g.id === id) ?? GRADES[2];
  return {
    value: ESTIMATE_BY_CONDITION[id],
    grade: grade.label,
    grades: GRADES.map((g) => ({ ...g, active: g.id === id })),
    expires: 'Latest valuation : 15/07/2026',
  };
}

/**
 * Full detail for one valuation. The market, similar and sold blocks are shared
 * placeholders; the estimate header follows the entry.
 */
export function getValuationDetail(id, titleOverride) {
  const entry = valuationEntries.find((e) => e.id === id) ?? valuationEntries[0];

  const expired = Boolean(entry.expired);
  const title = titleOverride ?? entry.title;

  return {
    id: entry.id,
    title,
    expired,
    valuation: {
      value: '£77,500',
      grade: 'Excellent',
      grades: GRADES,
      expires: expired ? 'Expired' : 'Latest valuation : 15/07/2026',
      updated: 'Latest valuation : 15/07/2026',
      // Monthly log, the 15th of each month, January → July 2026. Condition
      // eases from Excellent (most recent) down to Good.
      history: [
        { id: 'jul', value: '£77,500', grade: 'Excellent', date: '15 July 2026' },
        { id: 'jun', value: '£76,100', grade: 'Excellent', date: '15 June 2026' },
        { id: 'may', value: '£74,600', grade: 'Excellent', date: '15 May 2026' },
        { id: 'apr', value: '£73,200', grade: 'Good', date: '15 April 2026' },
        { id: 'mar', value: '£71,500', grade: 'Good', date: '15 March 2026' },
        { id: 'feb', value: '£70,100', grade: 'Good', date: '15 February 2026' },
        { id: 'jan', value: '£68,500', grade: 'Good', date: '15 January 2026' },
      ],
      blurb:
        'Get a personalised quote from our experts, from valuation to sale, start to finish.',
    },
    market: {
      title: `Market for ${title}`,
      blurb: 'How demand looks right now, based on similar cars listed and sold in the last 30 days.',
      averageLabel: 'Average price',
      averageValue: '£80,748',
      history: HISTORY,
      baseline: 62400,
      axisMax: AXIS_MAX,
      sales: SALES,
      // The full metric strip, as on the vehicle detail page.
      metrics: [
        { id: 'highest', label: 'Highest sale price', value: '£256,748', footnote: 'Sold in Oct 2025' },
        { id: 'lowest', label: 'Lowest sale price', value: '£68,748', footnote: 'Sold in Jan 2026' },
        { id: 'sold', label: 'Sold per month', value: '20', delta: '5%', deltaCaption: 'vs last month', chart: true },
        { id: 'saves', label: 'Saves per listing', value: '21', delta: '5%', deltaCaption: 'vs last month', chart: true },
      ],
    },
    similar: SIMILAR,
    recentlySold: RECENTLY_SOLD,
  };
}
