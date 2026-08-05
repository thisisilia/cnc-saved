/**
 * Placeholder data for the Add to My Garage flow (PRD step 1 — Vehicle
 * information).
 *
 * In production the UK path calls a registration lookup and the non-UK path
 * calls a make/model catalogue; both are stubbed here so the flow can be driven
 * end to end.
 */

/**
 * Make/model catalogue for the non-UK search. Logos resolve from `make` via the
 * generated logo map, so no image needs naming here.
 */
export const VEHICLE_CATALOGUE = [
  { id: 'rover', make: 'Rover', label: 'Rover' },
  { id: 'rover-mini', make: 'Rover', label: 'Rover Mini' },
  { id: 'rover-200', make: 'Rover', label: 'Rover 200' },
  { id: 'rover-mini-cooper', make: 'Rover', label: 'Rover Mini Cooper' },
  { id: 'rover-400-vitesse', make: 'Rover', label: 'Rover 400 Vitesse' },
  { id: 'rover-metro', make: 'Rover', label: 'Rover Metro' },
  { id: 'mini-cooper', make: 'MINI', label: 'MINI Cooper' },
  { id: 'porsche-911', make: 'Porsche', label: 'Porsche 911' },
  { id: 'porsche-992-gt3-rs', make: 'Porsche', label: 'Porsche 992 GT3 RS' },
  { id: 'porsche-944', make: 'Porsche', label: 'Porsche 944' },
  { id: 'bmw-630i', make: 'BMW', label: 'BMW 630i' },
  { id: 'bmw-m3-e30', make: 'BMW', label: 'BMW M3 E30' },
  { id: 'jaguar-e-type', make: 'Jaguar', label: 'Jaguar E-Type' },
  { id: 'triumph-spitfire', make: 'Triumph', label: 'Triumph Spitfire' },
  { id: 'ford-escort', make: 'Ford', label: 'Ford Escort' },
  { id: 'ducati-monster', make: 'Ducati', label: 'Ducati Monster' },
];

export function searchCatalogue(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return VEHICLE_CATALOGUE.filter((entry) => entry.label.toLowerCase().includes(q));
}

/**
 * Stands in for the UK registration lookup. Any registration resolves to this
 * vehicle; the real lookup returns the DVLA record for the plate entered.
 */
/**
 * DVLA-style lookup. Everything the lookup can resolve comes back in `fields`
 * so the "Your vehicle" form opens pre-filled; anything a real lookup would not
 * return (here: nothing) is simply absent and left for manual entry.
 */
export function lookupRegistration(registration) {
  const plate = registration.toUpperCase();
  return {
    registration: plate,
    make: 'Rover',
    title: '2000 Rover Mini Cooper',
    specLine: 'Blue • Manual • 4 gears • 1,400cc',
    fields: {
      registration: plate,
      generation: 'Mk IV',
      variant: 'Cooper',
      bodyType: 'Saloon',
      year: '2000',
      engine: '1400',
      colour: 'Midnight blue',
      transmission: 'Manual',
      gears: '4 speed',
      fuel: 'Petrol',
      steering: 'Right hand drive',
    },
  };
}

export const MILEAGE_UNITS = [
  { value: 'miles', label: 'Miles' },
  { value: 'km', label: 'Kilometers' },
];

/**
 * Options behind each select. In production these come from the model
 * catalogue — variants especially depend on the chosen make and model.
 */
export const FIELD_OPTIONS = {
  variant: ['Cooper', 'Cooper S', 'Cooper Sport', 'Mayfair', 'Works', 'Base'],
  bodyType: ['Saloon', 'Coupe', 'Convertible', 'Estate', 'Hatchback'],
  generation: ['Mk I', 'Mk II', 'Mk III', 'Mk IV'],
};

/**
 * Short, fixed choices shown as inline radio cards rather than pickers — few
 * enough options that hiding them behind a tap costs more than it saves.
 */
export const GEAR_OPTIONS = ['3 speed', '4 speed', '5 speed', '6 speed', '7 speed', '8 speed'];

export const RADIO_GROUPS = [
  { id: 'fuel', label: 'Fuel type', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
  {
    id: 'transmission',
    label: 'Transmission type',
    options: ['Manual', 'Automatic', 'Semi-automatic', 'Not applicable'],
  },
  { id: 'gears', label: 'Gear count', options: GEAR_OPTIONS },
  { id: 'steering', label: 'Steering position', options: ['Left hand drive', 'Right hand drive'] },
];

/** Colours offered per make, so the picker only lists plausible options. */
export const COLOUR_OPTIONS = [
  'Black', 'White', 'Silver', 'Arctic grey', 'Midnight blue', 'British racing green',
  'Red', 'Arctic silver', 'Yellow', 'Orange',
];

/**
 * Fields the non-UK path collects manually, per the PRD's step 1 list.
 *
 * `keyboardType` matters: registrations and colours want the full keyboard,
 * while years, engine sizes and odometer readings are digits only.
 */
export const MANUAL_FIELDS = [
  { id: 'registration', label: 'Vehicle registration', type: 'text', autoCapitalize: 'characters' },
  { id: 'generation', label: 'Generation', type: 'select', options: FIELD_OPTIONS.generation },
  { id: 'variant', label: 'Variant', type: 'select', options: FIELD_OPTIONS.variant },
  { id: 'bodyType', label: 'Body type', type: 'select', options: FIELD_OPTIONS.bodyType },
  { id: 'year', label: 'Year of manufacture', type: 'text', keyboardType: 'number-pad' },
  { id: 'engine', label: 'Engine capacity in CC', type: 'text', keyboardType: 'number-pad' },
  { id: 'colour', label: 'Colour', type: 'text' },
];

/**
 * Vehicle condition, per the PRD's step 3 wording. The estimated value on the
 * Add vehicle page keys off this plus the details entered earlier.
 */
export const CONDITIONS = [
  {
    id: 'concours',
    label: 'Concours',
    glyph: 'trophy-icon',
    description: 'One of the very best examples of its kind in the world',
    /** Multiplier applied to the base estimate — placeholder pricing model. */
    factor: 1.35,
  },
  {
    id: 'excellent',
    label: 'Excellent',
    glyph: 'seal-icon',
    description: 'Like new inside and out or very close to it',
    factor: 1.15,
  },
  {
    id: 'good',
    label: 'Good',
    glyph: 'shield-icon',
    description: 'Looks good from a distance but shows age and minor flaws up close',
    factor: 1,
  },
  {
    id: 'fair',
    label: 'Fair',
    glyph: 'square-icon',
    description: 'Obvious flaws and wear and tear visible even from a distance',
    factor: 0.78,
  },
];

/** Base valuation band before condition is applied. Real pricing is server-side. */
const BASE_ESTIMATE = { low: 15900, high: 20750 };

const money = (value) => `£${Math.round(value).toLocaleString('en-GB')}`;

/**
 * Estimated value band. Derived from the condition and whether an odometer
 * reading was given — a vehicle with unknown mileage is valued more cautiously.
 */
export function estimateValue({ conditionId, mileage, notApplicable }) {
  const condition = CONDITIONS.find((c) => c.id === conditionId) ?? CONDITIONS[2];
  const confidence = notApplicable || !mileage ? 0.92 : 1;
  const low = BASE_ESTIMATE.low * condition.factor * confidence;
  const high = BASE_ESTIMATE.high * condition.factor;
  return { low, high, label: `${money(low)} - ${money(high)}` };
}

/**
 * Checklist on the Add vehicle page. History is optional, so it is excluded
 * from the completion percentage.
 */
export const ADD_VEHICLE_STEPS = [
  { id: 'purchase', label: 'Purchase information', required: true },
  { id: 'history', label: 'History', required: false, badge: 'OPTIONAL' },
  { id: 'photos', label: 'Photos & video', required: true },
];

/**
 * Share of the profile complete. Vehicle information and condition are already
 * done by the time this page appears, so they count toward the total.
 *
 * The comp shows a static 80%; this reports the real figure.
 */
export function completionPercent(completed = {}) {
  const required = ADD_VEHICLE_STEPS.filter((step) => step.required);
  const total = required.length + 2; // + vehicle information, + condition
  const done = 2 + required.filter((step) => completed[step.id]).length;
  return Math.round((done / total) * 100);
}

/** Currencies the purchase price can be entered in. */
export const CURRENCIES = [
  { code: 'GBP', symbol: '£' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
];

/** Purchase sources, per the PRD's step 2 list. */
export const PURCHASE_SOURCES = ['Dealer', 'Private seller', 'Auction', 'Importer', 'Other'];
