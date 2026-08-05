/**
 * Turns a completed add-vehicle draft into the card committed to My Garage.
 *
 * Unlike the old review step, the car is saved the moment condition is done, so
 * the sections it hasn't collected yet — photos, purchase, history — are left
 * genuinely empty. The vehicle detail page reads that emptiness and shows the
 * "add" prompts; the edit flows fill them in later.
 */
import { CURRENCIES, estimateValue } from './addVehicle';

const FALLBACK_IMAGE = require('../assets/cars/mini-cooper-hero.jpg');

function slug(value) {
  return (value || 'vehicle')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const digits = (value) => Number(String(value ?? '').replace(/[^0-9]/g, '')) || 0;

/** The car-info grid, from whatever the flow resolved or the user entered. */
function buildCarInfo(draft) {
  const miles = digits(draft.mileage);
  const mileageLabel = miles ? `${miles.toLocaleString('en-GB')} ${draft.unit || 'miles'}` : null;
  const transmission = [draft.transmission, draft.gears].filter(Boolean).join(', ');

  return [
    draft.registration && { id: 'registration', glyph: 'vrn', label: draft.registration },
    draft.year && { id: 'year', glyph: 'calendar', label: String(draft.year) },
    draft.steering && { id: 'steering', glyph: 'driver-side', label: draft.steering },
    mileageLabel && { id: 'odometer', glyph: 'dial', label: mileageLabel },
    transmission && { id: 'transmission', glyph: 'gearbox', label: transmission },
    draft.engine && { id: 'engine', glyph: 'engine', label: `${digits(draft.engine)}cc` },
    draft.colour && { id: 'colour', glyph: 'colour', label: draft.colour },
    draft.fuel && { id: 'fuel', glyph: 'fuel', label: draft.fuel },
  ].filter(Boolean);
}

/**
 * Flatten a "value my car" result into the draft shape buildVehicleCard reads,
 * so an owned valuation can be committed to the garage like an added vehicle.
 */
export function draftFromValuation(result = {}) {
  return {
    ...(result.vehicle ?? {}),
    ...(result.fields ?? {}),
    conditionId: result.conditionId,
    mileage: result.mileage,
    unit: result.unit,
    notApplicable: result.notApplicable,
  };
}

export function buildVehicleCard(draft = {}) {
  const name =
    draft.title || [draft.year, draft.make].filter(Boolean).join(' ') || 'New vehicle';
  const estimate = estimateValue({
    conditionId: draft.conditionId,
    mileage: draft.mileage,
    notApplicable: draft.notApplicable,
  });
  // A single figure for the valuation, not a range — the midpoint of the band.
  const point = `£${Math.round((estimate.low + estimate.high) / 2).toLocaleString('en-GB')}`;

  // The detail hero shows the model without the year, with the year and mileage
  // on the summary line beneath it; the garage tiles keep the year-prefixed name.
  const year = draft.year || String(name).match(/\b(19|20)\d{2}\b/)?.[0] || null;
  const heroTitle = String(name).replace(/^\s*(19|20)\d{2}\s+/, '').trim() || name;
  const miles = digits(draft.mileage);
  const heroSummary =
    [year, miles ? `${miles.toLocaleString('en-GB')} ${draft.unit || 'miles'}` : null]
      .filter(Boolean)
      .join(' · ') || null;

  // Purchase details, collected in the flow before condition, so the detail page
  // opens with them filled rather than showing the "add purchase" prompt.
  const p = draft.purchase ?? {};
  const symbol = CURRENCIES.find((c) => c.code === p.currency)?.symbol ?? '£';
  const purchase =
    p.price || p.source
      ? {
          title: 'Purchase details',
          rows: [
            p.price && {
              id: 'price',
              label: 'Purchase price',
              value: `${symbol}${digits(p.price).toLocaleString('en-GB')}`,
            },
            p.year && { id: 'acquired', label: 'Acquired', value: p.year },
            p.source && { id: 'source', label: 'Source', value: p.source },
          ].filter(Boolean),
        }
      : null;

  return {
    id: `${slug(draft.registration || name)}-added`,
    name,
    heroTitle,
    heroSummary,
    price: point,
    estimate: point,
    // The band behind the single figure — the sell flow shows it as a range and
    // recommends the midpoint as an asking price.
    estimateLow: Math.round(estimate.low),
    estimateHigh: Math.round(estimate.high),
    delta: '5%',
    make: draft.make,
    logo: draft.logo,
    image: FALLBACK_IMAGE,
    // A UK registration lookup returns the history; a manual/non-UK search does
    // not, so this marks which added cars come with it pre-filled.
    registration: draft.registration ?? null,
    // Its own specs; the sections still to collect are explicitly empty.
    carInfo: buildCarInfo(draft),
    mileageMiles: digits(draft.mileage),
    photos: [],
    purchase,
    insuranceRenewal: draft.insuranceRenewal || p.insuranceRenewal || null,
    serviceHistory: [],
  };
}
