/**
 * Portfolio history per viewing period.
 *
 * Placeholder data. In production each period would come from aggregating the
 * latest valuation of every active owned vehicle over that window; the shape
 * here ({ label, value } points + a purchase baseline) is what the chart needs.
 */

export const PERIODS = [
  { key: '1M', label: '1M' },
  { key: '6M', label: '6M' },
  { key: 'YTD', label: 'YTD' },
  { key: '1Y', label: '1Y' },
  { key: 'MAX', label: 'Max' },
];

export const DEFAULT_PERIOD = '6M';

/** Value the portfolio was bought at — the grey baseline in the comp. */
export const PURCHASE_VALUE = 55000;
export const PURCHASE_DATE = 'Jan 2024';

// A gently rising walk, shaped to resemble the comp's line.
function series(points) {
  return points.map(([label, value]) => ({ label, value }));
}

const SIX_MONTHS = series([
  ['Jan', 55800], ['Jan', 56900], ['Jan', 56200], ['Feb', 57600], ['Feb', 57100],
  ['Feb', 58400], ['Feb', 57900], ['Mar', 59300], ['Mar', 58800], ['Mar', 60100],
  ['Mar', 62000], ['Apr', 61200], ['Apr', 60500], ['Apr', 61800], ['Apr', 63100],
  ['May', 62400], ['May', 63800], ['May', 64600], ['May', 63900], ['Jun', 65400],
  ['Jun', 66800], ['Jun', 68200], ['Jun', 67500], ['Jun', 69100],
]);

const ONE_MONTH = series([
  ['1', 65400], ['4', 65900], ['7', 65200], ['10', 66400], ['13', 66900],
  ['16', 66100], ['19', 67300], ['22', 67900], ['25', 68400], ['28', 69100],
]);

const YEAR_TO_DATE = series([
  ['Jan', 55800], ['Feb', 57600], ['Mar', 62000], ['Apr', 61800],
  ['May', 63800], ['Jun', 69100],
]);

const ONE_YEAR = series([
  ['Jul', 51200], ['Aug', 52400], ['Sep', 51800], ['Oct', 53600], ['Nov', 54100],
  ['Dec', 54800], ['Jan', 55800], ['Feb', 57600], ['Mar', 62000], ['Apr', 61800],
  ['May', 63800], ['Jun', 69100],
]);

const MAX = series([
  ['2024', 48000], ['2024', 50200], ['2025', 52400], ['2025', 54800],
  ['2026', 57600], ['2026', 62000], ['2026', 65400], ['2026', 69100],
]);

export const HISTORY = {
  '1M': ONE_MONTH,
  '6M': SIX_MONTHS,
  YTD: YEAR_TO_DATE,
  '1Y': ONE_YEAR,
  MAX,
};

/** The comp's tooltip sits on Mar 2026; index 10 of the 6M series is that peak. */
export const DEFAULT_SELECTION = { '6M': 10 };

export function formatCurrency(value) {
  return `£${Math.round(value).toLocaleString('en-GB')}`;
}

export function formatAxisValue(value) {
  return value === 0 ? '0' : `£${Math.round(value / 1000)}K`;
}
