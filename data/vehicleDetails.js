/**
 * Placeholder content for the Vehicle Details page, matching the Figma comp.
 *
 * Shaped after the PRD's section list (vehicle summary, reminders, valuation,
 * market insights, comparables, purchase details, vehicle information,
 * insurance, MOT, service history) so each block can be swapped for API data
 * independently.
 *
 * One profile per owned vehicle: the comp only details the Mini, but showing
 * its mileage and service history under a Porsche heading reads as a bug, so
 * each vehicle carries its own figures. Only the Mini's numbers come from the
 * comp; the rest are plausible stand-ins. Service documents reuse the same four
 * scans — they are the only ones exported — but each entry's text is its own.
 */

import { ownedVehicles, reminders } from './garage';

const heroes = {
  mini: require('../assets/cars/mini-cooper-hero.jpg'),
  gt3rs: require('../assets/cars/porsche-992-gt3rs.jpg'),
  carrera: require('../assets/cars/porsche-911-carrera.jpg'),
};

const docs = {
  service: require('../assets/docs/service-2005.jpg'),
  transfer: require('../assets/docs/transfer-2008.jpg'),
  invoice: require('../assets/docs/service-2015.jpg'),
  bodywork: require('../assets/docs/bodywork-2021.jpg'),
};

const INSURANCE_COPY = {
  title: 'Insurance',
  startingLabel: 'Starting from',
  blurb: 'Classic car insurance, the modern way.',
  cta: 'Get instant quote',
  // Eligibility card (Figma 1292-21285).
  eligibleLabel: 'Eligible for Car & Classic Insurance from',
  amount: '£200',
  period: 'annually',
};

const VALUATION_COPY = {
  updated: 'Latest valuation : 15/07/2026',
  blurb:
    'Sell your car effortlessly or get a personalised quote from our experts, from valuation to sale, start to finish.',
  sheetBlurb: 'Get a personalised quote from our experts, from valuation to sale, start to finish.',
};

const MARKET_BLURB =
  'How demand looks right now, based on similar cars listed and sold in the last 30 days in the UK.';

const PROFILES = {
  mini: {
    // The comp titles the hero "Rover Mini Cooper" and puts the year in the
    // summary; the garage tiles use the year-prefixed name instead.
    title: 'Rover Mini Cooper',
    summary: '2000 · 25,000 miles',
    valuation: {
      ...VALUATION_COPY,
      value: '£22,000',
      grade: 'Excellent',
      grades: [
        { id: 'fair', label: 'Fair', price: '£17,700' },
        { id: 'good', label: 'Good', price: '£20,500' },
        { id: 'excellent', label: 'Excellent', price: '£22,000', active: true },
        { id: 'concours', label: 'Concours', price: '£23,200' },
      ],
    },
    market: {
      averageValue: '£80,748',
      // 80k / 4 = gridlines at 20/40/60/80k.
      axisMax: 80000,
      trend: { from: 62400, to: 76200 },
      metrics: [
        { id: 'highest', label: 'Highest sale price', value: '£96,500', footnote: 'Sold in Oct 2025' },
        { id: 'lowest', label: 'Lowest sale price', value: '£58,200', footnote: 'Sold in Jan 2026' },
        { id: 'sold', label: 'Sold per month', value: '20', delta: '5%', deltaCaption: 'vs last month', chart: true },
        { id: 'saves', label: 'Saves per listing', value: '21', delta: '5%', deltaCaption: 'vs last month', chart: true },
      ],
    },
    comparables: {
      recentValue: '£70,889',
      listingCount: '6',
      listingMeta: ['Live now', 'From £48,000'],
    },
    reminders: [
      { id: 'mot', label: 'MOT Expiry', value: '12 Aug 2027' },
      { id: 'insurance', label: 'Insurance Expiry', value: '06 Dec 2027' },
      { id: 'tax', label: 'Vehicle Tax', value: '23 July 2027' },
    ],
    purchase: {
      title: 'Purchase details',
      rows: [
        { id: 'price', label: 'Purchase price', value: '£40,000' },
        { id: 'acquired', label: 'Acquired', value: 'Feb 2024' },
        { id: 'source', label: 'Source', value: 'Auction' },
      ],
    },
    carInfo: [
      { id: 'registration', glyph: 'vrn', label: 'W309 JBV' },
      { id: 'year', glyph: 'calendar', label: '2000' },
      { id: 'steering', glyph: 'driver-side', label: 'Right hand drive' },
      { id: 'odometer', glyph: 'dial', label: '25,000 miles' },
      { id: 'transmission', glyph: 'gearbox', label: 'Manual, 4 speed' },
      { id: 'engine', glyph: 'engine', label: '1275cc' },
      { id: 'colour', glyph: 'colour', label: 'Midnight blue' },
      { id: 'fuel', glyph: 'fuel', label: 'Petrol' },
    ],
    insurance: { ...INSURANCE_COPY, startingValue: '£24/mo' },
    mot: {
      title: 'MOT',
      status: 'Valid',
      rows: [
        { id: 'expires', label: 'Expires', value: '12 August 2027' },
        { id: 'last-test', label: 'Last test', value: '12 August 2026' },
        { id: 'mileage', label: 'Mileage at test', value: '24,180 miles' },
      ],
    },
    serviceHistory: [
      { id: 'mot-2025', date: '02 September 2025', mot: true, status: 'Passed', mileage: '48,765 miles' },
      {
        id: 'm-2005',
        date: '30th July 2005',
        category: 'Event type',
        description: 'Service stamp: oil change & brake replacement.',
        image: docs.service,
      },
      {
        id: 'm-2008',
        date: '23rd October 2008',
        description: 'Ownership transfer, 2nd owner registered.',
        image: docs.transfer,
      },
      {
        id: 'm-2015',
        date: '12th August 2015',
        category: 'Event type',
        description: 'Major service: clutch and suspension overhaul.',
        image: docs.invoice,
      },
      {
        id: 'm-2021',
        date: '17th September 2021',
        category: 'Bodywork',
        description:
          'New front wing fitted. Full professional respray to original midnight blue colour',
        image: docs.bodywork,
      },
      {
        id: 'm-2024',
        date: '4th March 2024',
        category: 'Event type',
        description: 'Annual service: fluids, filters and spark plugs replaced.',
        image: docs.invoice,
      },
      { id: 'mot-2023', date: '23 September 2023', mot: true, status: 'Passed', mileage: '40,765 miles' },
    ],
  },

  gt3rs: {
    title: 'Porsche 992 GT3 RS',
    summary: '2023 · 3,200 miles',
    valuation: {
      ...VALUATION_COPY,
      value: '£245,000',
      grade: 'Concours',
      grades: [
        { id: 'fair', label: 'Fair', price: '£203,000' },
        { id: 'good', label: 'Good', price: '£221,000' },
        { id: 'excellent', label: 'Excellent', price: '£236,000' },
        { id: 'concours', label: 'Concours', price: '£245,000', active: true },
      ],
    },
    market: {
      averageValue: '£205,400',
      axisMax: 240000,
      trend: { from: 188000, to: 212000 },
      metrics: [
        { id: 'highest', label: 'Highest sale price', value: '£243,000', footnote: 'Sold in Nov 2025' },
        { id: 'lowest', label: 'Lowest sale price', value: '£176,400', footnote: 'Sold in Feb 2026' },
        { id: 'sold', label: 'Sold per month', value: '8', delta: '3%', deltaCaption: 'vs last month', chart: true },
        { id: 'saves', label: 'Saves per listing', value: '47', delta: '9%', deltaCaption: 'vs last month', chart: true },
      ],
    },
    comparables: {
      recentValue: '£207,500',
      listingCount: '4',
      listingMeta: ['Live now', 'From £192,000'],
    },
    reminders: [
      { id: 'mot', label: 'MOT Expiry', value: 'Not due until 2026' },
      { id: 'insurance', label: 'Insurance Expiry', value: '14 Apr 2027' },
      { id: 'tax', label: 'Vehicle Tax', value: '06 Dec 2027' },
    ],
    purchase: {
      title: 'Purchase details',
      rows: [
        { id: 'price', label: 'Purchase price', value: '£185,000' },
        { id: 'acquired', label: 'Acquired', value: 'Mar 2023' },
        { id: 'source', label: 'Source', value: 'Main dealer' },
      ],
    },
    carInfo: [
      { id: 'registration', glyph: 'vrn', label: 'GT23 RSX' },
      { id: 'year', glyph: 'calendar', label: '2023' },
      { id: 'steering', glyph: 'driver-side', label: 'Left hand drive' },
      { id: 'odometer', glyph: 'dial', label: '3,200 miles' },
      { id: 'transmission', glyph: 'gearbox', label: 'PDK, 7 speed' },
      { id: 'engine', glyph: 'engine', label: '4000cc' },
      { id: 'colour', glyph: 'colour', label: 'Arctic grey' },
      { id: 'fuel', glyph: 'fuel', label: 'Petrol' },
    ],
    insurance: { ...INSURANCE_COPY, startingValue: '£62/mo' },
    mot: {
      title: 'MOT',
      status: 'Not due',
      rows: [
        { id: 'expires', label: 'First test due', value: '09 March 2026' },
        { id: 'last-test', label: 'Last test', value: 'None' },
        { id: 'mileage', label: 'Mileage at registration', value: '12 miles' },
      ],
    },
    serviceHistory: [
      {
        id: 'g-2023-03',
        date: '9th March 2023',
        category: 'Event type',
        description: 'Delivered new from main dealer. PDI completed.',
        image: docs.invoice,
      },
      {
        id: 'g-2023-09',
        date: '2nd September 2023',
        category: 'Event type',
        description: 'Track day preparation: geometry check and brake fluid change.',
        image: docs.service,
      },
      {
        id: 'g-2024-04',
        date: '18th April 2024',
        category: 'Event type',
        description: 'First annual service: oil, filters and inspection.',
        image: docs.invoice,
      },
      {
        id: 'g-2025-05',
        date: '6th May 2025',
        category: 'Bodywork',
        description: 'Paint protection film applied to front end and sills.',
        image: docs.bodywork,
      },
      {
        id: 'g-2026-02',
        date: '11th February 2026',
        category: 'Event type',
        description: 'Second annual service: fluids and Michelin Cup 2 R tyres replaced.',
        image: docs.service,
      },
    ],
  },

  carrera: {
    title: 'Porsche 911 Carrera 4 S',
    summary: '2006 · 48,000 miles',
    valuation: {
      ...VALUATION_COPY,
      value: '£34,000',
      grade: 'Good',
      grades: [
        { id: 'fair', label: 'Fair', price: '£25,000' },
        { id: 'good', label: 'Good', price: '£34,000', active: true },
        { id: 'excellent', label: 'Excellent', price: '£41,400' },
        { id: 'concours', label: 'Concours', price: '£46,400' },
      ],
    },
    market: {
      averageValue: '£44,900',
      axisMax: 60000,
      trend: { from: 38400, to: 47600 },
      metrics: [
        { id: 'highest', label: 'Highest sale price', value: '£61,200', footnote: 'Sold in Sep 2025' },
        { id: 'lowest', label: 'Lowest sale price', value: '£29,800', footnote: 'Sold in Mar 2026' },
        { id: 'sold', label: 'Sold per month', value: '32', delta: '4%', deltaCaption: 'vs last month', chart: true },
        { id: 'saves', label: 'Saves per listing', value: '17', delta: '2%', deltaCaption: 'vs last month', chart: true },
      ],
    },
    comparables: {
      recentValue: '£45,750',
      listingCount: '11',
      listingMeta: ['Live now', 'From £34,500'],
    },
    reminders: [
      { id: 'mot', label: 'MOT Expiry', value: '20 Jun 2027' },
      { id: 'insurance', label: 'Insurance Expiry', value: '02 Nov 2027' },
      { id: 'tax', label: 'Vehicle Tax', value: '20 Dec 2027' },
    ],
    purchase: {
      title: 'Purchase details',
      rows: [
        { id: 'price', label: 'Purchase price', value: '£38,000' },
        { id: 'acquired', label: 'Acquired', value: 'Sep 2022' },
        { id: 'source', label: 'Source', value: 'Private sale' },
      ],
    },
    carInfo: [
      { id: 'registration', glyph: 'vrn', label: 'MEE 3M' },
      { id: 'year', glyph: 'calendar', label: '2006' },
      { id: 'steering', glyph: 'driver-side', label: 'Right hand drive' },
      { id: 'odometer', glyph: 'dial', label: '48,000 miles' },
      { id: 'transmission', glyph: 'gearbox', label: 'Tiptronic S, 5 speed' },
      { id: 'engine', glyph: 'engine', label: '3824cc' },
      { id: 'colour', glyph: 'colour', label: 'Arctic silver' },
      { id: 'fuel', glyph: 'fuel', label: 'Petrol' },
    ],
    insurance: { ...INSURANCE_COPY, startingValue: '£38/mo' },
    mot: {
      title: 'MOT',
      status: 'Valid',
      rows: [
        { id: 'expires', label: 'Expires', value: '20 June 2027' },
        { id: 'last-test', label: 'Last test', value: '20 June 2026' },
        { id: 'mileage', label: 'Mileage at test', value: '46,910 miles' },
      ],
    },
    serviceHistory: [
      {
        id: 'c-2009',
        date: '14th May 2009',
        category: 'Event type',
        description: 'Major service at 20,000 miles: plugs, filters and brake fluid.',
        image: docs.service,
      },
      {
        id: 'c-2013',
        date: '3rd June 2013',
        description: 'Ownership transfer, 2nd owner registered.',
        image: docs.transfer,
      },
      {
        id: 'c-2018',
        date: '27th January 2018',
        category: 'Event type',
        description: 'Tiptronic gearbox fluid service and rear PDK mounts renewed.',
        image: docs.invoice,
      },
      {
        id: 'c-2022',
        date: '9th September 2022',
        category: 'Bodywork',
        description: 'Front bumper refinished in original arctic silver after stone chips.',
        image: docs.bodywork,
      },
      {
        id: 'c-2025',
        date: '21st October 2025',
        category: 'Event type',
        description: 'Annual service: oil, filters and four-wheel alignment.',
        image: docs.invoice,
      },
    ],
  },
};

/** The market chart's y-axis ceiling is declared per vehicle (see PROFILES), so
 * gridlines stay on round numbers whatever the car is worth. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const SALE_COUNT = 150;

function seeded(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Fold a value back inside the bounds instead of clamping. Clamping would stack
 * every outlier into a hard line of bullets along the axis ceiling; reflecting
 * scatters them back into the cloud.
 */
function reflect(value, min, max) {
  let v = value;
  for (let i = 0; i < 4 && (v > max || v < min); i += 1) {
    if (v > max) v = 2 * max - v;
    if (v < min) v = 2 * min - v;
  }
  return Math.min(Math.max(v, min), max);
}

/**
 * A mileage-over-time series for the Mileage card. Four year labels (each
 * covering two points so the axis isn't crowded), climbing to the current
 * reading. Value is what the card headlines.
 */
export function buildMileage(currentMiles) {
  const current = Number(String(currentMiles ?? '').replace(/[^0-9]/g, '')) || 0;
  const start = Math.round((current * 0.45) / 100) * 100;
  const n = 8;
  const points = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return {
      label: String(2010 + Math.floor(i / 2) * 5),
      value: Math.round((start + (current - start) * t) / 100) * 100,
    };
  });
  return {
    value: `${current.toLocaleString('en-GB')} miles`,
    points,
    axisMax: Math.max(Math.ceil(current / 15000) * 15000, 15000),
  };
}

/** Current mileage as a number, from an added card or a profile's odometer. */
function currentMiles(added, profile) {
  if (added) return added.mileageMiles ?? 0;
  const odo = profile.carInfo.find((item) => item.id === 'odometer');
  return Number(String(odo?.label ?? '').replace(/[^0-9]/g, '')) || 0;
}

function buildHistory({ from, to }) {
  const random = seeded(19850101 + from);
  return Array.from({ length: 18 }, (_, i) => {
    const t = i / 17;
    const jitter = (random() - 0.5) * (to - from) * 0.18;
    return {
      label: MONTHS[Math.min(Math.floor(t * MONTHS.length), MONTHS.length - 1)],
      value: Math.round((from + (to - from) * t + jitter) / 100) * 100,
    };
  });
}

function buildSales(vehicle, { from, to }, axisMax) {
  const random = seeded(20260715 + from);
  const floor = Math.round(axisMax * 0.15);
  const ceiling = Math.round(axisMax * 0.975);

  return Array.from({ length: SALE_COUNT }, (_, i) => {
    const t = (i + random() * 0.6) / SALE_COUNT;
    // Two draws sum toward the middle, so the cloud thins out at the extremes.
    const spread = (random() + random() - 1) * (to - from) * 1.9;
    const trend = from + (to - from) * t;
    const value = Math.round(reflect(trend + spread, floor, ceiling) / 100) * 100;

    return {
      id: `${vehicle.id}-sale-${i}`,
      t,
      value,
      name: vehicle.name,
      date: `${MONTHS[Math.min(Math.floor(t * MONTHS.length), MONTHS.length - 1)]} ${
        1 + Math.floor(random() * 27)
      }, 2026`,
      // The comp's thumbnail is the vehicle itself, so reuse its hero shot.
      image: heroes[vehicle.id],
    };
  });
}

const parseMoney = (s) => Number(String(s ?? '').replace(/[^0-9]/g, '')) || 0;
const moneyGBP = (n) => `£${Math.round(n).toLocaleString('en-GB')}`;

/** Round up to a "nice" gridline step (1, 2, 2.5, 3, 4, 5, 6, 8, 10 × 10^k). */
function niceStep(x) {
  const mag = Math.pow(10, Math.floor(Math.log10(Math.max(x, 1))));
  const norm = x / mag;
  const step =
    norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 3 ? 3 : norm <= 4 ? 4 : norm <= 5 ? 5 : norm <= 6 ? 6 : norm <= 8 ? 8 : 10;
  return step * mag;
}

/**
 * Derive the market-trend figures from the vehicle's own valuation so the
 * average price, chart axis and high/low sales reflect its real value. Added
 * cars used to inherit the default profile's numbers, which read as wrong for a
 * car worth a fraction (or multiple) of it. The sold/saves metrics are counts,
 * not money, so they carry through from the profile unchanged.
 */
function buildMarket(valueNum, profileMetrics) {
  const v = valueNum > 0 ? valueNum : 50000;
  const average = Math.round(v * 1.04);
  const step = niceStep(average / 3.2);
  const axisMax = Math.ceil((average * 1.08) / step) * step;
  const highest = v * 1.25;
  const lowest = v * 0.75;
  const metrics = profileMetrics.map((m) =>
    m.id === 'highest'
      ? { ...m, value: moneyGBP(highest) }
      : m.id === 'lowest'
        ? { ...m, value: moneyGBP(lowest) }
        : m
  );
  return {
    averageValue: moneyGBP(average),
    trend: { from: Math.round(v * 0.8), to: Math.round(v) },
    axisMax,
    metrics,
    recentValue: moneyGBP(v * 0.95),
    listingFrom: moneyGBP(v * 0.72),
  };
}

/**
 * The valuation log shown behind the section's chevron: one reading on the 15th
 * of each month from January to July. The five earlier months sit at the
 * vehicle's current (higher) grade and drift gently down; the two most recent
 * drop to "Good", so the fall in grade and value reads together.
 */
function buildValuationHistory(valuation) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const topNum = parseMoney(valuation.value);
  const goodNum =
    parseMoney(valuation.grades?.find((g) => g.id === 'good')?.price) || Math.round(topNum * 0.93);
  return months
    .map((month, i) => {
      const recent = i >= months.length - 2; // June, July
      const num = recent
        ? Math.round(goodNum * (i === months.length - 1 ? 0.99 : 1)) // July a touch lower
        : Math.round(topNum * (1 + (4 - i) * 0.006));
      return {
        id: `vh-${i}`,
        date: `15 ${month} 2026`,
        grade: recent ? 'Good' : valuation.grade,
        value: moneyGBP(num),
      };
    })
    .reverse(); // newest (July) first
}

/**
 * Vehicles added through the flow. They have no market/history profile of their
 * own, so their detail page borrows a default profile for those sections while
 * keeping its own identity and valuation. Registered so a card tapped in My
 * Garage resolves to itself rather than falling back to the first vehicle.
 */
const ADDED = new Map();

export function registerAddedVehicle(card) {
  ADDED.set(card.id, card);
}

/**
 * Everything the Vehicle Details page needs for one vehicle, assembled from its
 * profile plus the garage's shared vehicle and reminder lists.
 *
 * `override` supplies an added vehicle's card directly (for the review page,
 * before it is committed); otherwise an added id is looked up in the registry.
 */
export function getVehicleDetails(id, override) {
  const added = override ?? ADDED.get(id);
  const owned = added ?? ownedVehicles.find((vehicle) => vehicle.id === id) ?? ownedVehicles[0];
  // Added cars have no profile of their own; borrow a default for the sections
  // that need market/history data.
  const profile = added ? PROFILES.mini : PROFILES[owned.id] ?? PROFILES.mini;
  const hero = added ? added.image : heroes[owned.id] ?? owned.image;

  // Added cars borrow the default profile's reminders too, so the notification
  // list and summary aren't blank.
  const vehicleReminders = reminders.filter(
    (reminder) => reminder.vehicleId === (added ? 'mini' : owned.id)
  );
  const title = added ? added.heroTitle ?? added.name : profile.title ?? owned.name;
  const valuationBase =
    added && added.estimate
      ? { ...profile.valuation, value: added.estimate }
      : profile.valuation;
  const valuation = { ...valuationBase, history: buildValuationHistory(valuationBase) };

  // The market trend, axis and high/low are derived from this vehicle's own
  // valuation so they reflect its real value (added cars no longer inherit the
  // default profile's market figures).
  const market = buildMarket(parseMoney(valuation.value), profile.market.metrics);
  const trend = market.trend;
  const axisMax = market.axisMax;
  const history = buildHistory(trend);

  // The sell flow prices against the valuation band: added cars carry the exact
  // band from their estimate; existing cars derive one ±15% around their figure.
  const makeFromName = (n) =>
    String(n ?? '')
      .replace(/^\s*(19|20)\d{2}\s+/, '')
      .trim()
      .split(/\s+/)[0] || null;
  const saleLow = added?.estimateLow ?? Math.round(parseMoney(valuation.value) * 0.85);
  const saleHigh = added?.estimateHigh ?? Math.round(parseMoney(valuation.value) * 1.15);
  const sale = {
    low: saleLow,
    high: saleHigh,
    recommended: Math.round((saleLow + saleHigh) / 2),
    rangeLabel: `${moneyGBP(saleLow)} - ${moneyGBP(saleHigh)}`,
  };

  // Added cars carry their own specs and start with photos, purchase and history
  // empty; existing cars come fully populated from their profile.
  const photos = added ? added.photos ?? [] : [hero];
  const carInfo = added ? added.carInfo ?? profile.carInfo : profile.carInfo;
  const purchase = added ? added.purchase ?? null : profile.purchase;
  // An added car that gave an insurance renewal date shows it on its reminders.
  const detailReminders =
    added && added.insuranceRenewal
      ? profile.reminders.map((r) =>
          r.id === 'insurance' ? { ...r, value: added.insuranceRenewal } : r
        )
      : profile.reminders;
  const serviceHistory = added
    ? added.serviceHistory?.length
      ? added.serviceHistory
      : added.registration
        ? profile.serviceHistory
        : []
    : profile.serviceHistory;

  // The full year-prefixed name (garage tiles / advert title); `title` is the
  // model-only hero heading.
  const name = added ? added.name : owned.name ?? profile.title ?? title;

  return {
    id: owned.id,
    title,
    name,
    summary: added ? added.heroSummary ?? profile.summary : profile.summary,
    photos,
    heroImage: hero,
    mileage: buildMileage(currentMiles(added, profile)),

    // Only this vehicle's reminders — the garage page is where the full list lives.
    notifications: vehicleReminders,
    reminderSummary: vehicleReminders.map((reminder) => reminder.summary),
    reminders: detailReminders,

    valuation,
    sale,
    registration: added?.registration ?? carInfo.find((i) => i.id === 'registration')?.label ?? null,
    // The manufacturer, for the logo. Added cars carry it; seed cars don't, so
    // it's taken from the name (the word after the year), e.g. "2000 Rover Mini
    // Cooper" → "Rover". MakeLogo resolves the badge from this.
    make: (added ? added.make : owned.make) ?? makeFromName(added ? added.name : owned.name),
    logo: added ? added.logo ?? null : owned.logo ?? null,
    market: {
      title: `Market for ${title}`,
      blurb: MARKET_BLURB,
      averageLabel: 'Average price',
      averageValue: market.averageValue,
      metrics: market.metrics,
      history,
      axisMax,
      baseline: trend.from,
      sales: buildSales(owned, trend, axisMax),
    },
    // "Recently sold" and "Similar vehicle for sale" rows for the market section —
    // four cards each, reusing this vehicle's photo/identity. Sold cards carry the
    // auction/SOLD badges; for-sale cards carry the make logo and asking price.
    recentlySold: Array.from({ length: 4 }, (_, i) => ({
      id: `sold-${owned.id}-${i}`,
      name,
      price: market.recentValue,
      askingLabel: 'Sold',
      image: hero,
      flag: 'se',
      topBadge: 'Auction ended',
      sold: true,
    })),
    similar: Array.from({ length: 4 }, (_, i) => ({
      id: `similar-${owned.id}-${i}`,
      name,
      price: market.listingFrom,
      askingLabel: 'Asking price',
      image: hero,
      flag: 'se',
      // Half the comparables are dealer listings, so they carry the dealer logo.
      dealer: i % 2 === 0,
    })),
    purchase,
    carInfo,
    insurance: profile.insurance,
    mot: profile.mot,
    serviceHistory,
  };
}
