/**
 * Placeholder content for the vehicle history step (PRD step 4).
 *
 * The real flow uploads documents, OCRs them server-side and returns a
 * chronological timeline. Here the documents are the four scans already in the
 * repo, and `analyseDocuments` fakes the round trip.
 */

const docs = {
  service: require('../assets/docs/service-2005.jpg'),
  transfer: require('../assets/docs/transfer-2008.jpg'),
  invoice: require('../assets/docs/service-2015.jpg'),
  bodywork: require('../assets/docs/bodywork-2021.jpg'),
};

/** Sample scans shown on the upload sheet. */
export const SAMPLE_DOCUMENTS = [docs.invoice, docs.transfer, docs.service];

export const UPLOAD_COPY = {
  title: 'Upload your history documents',
  body:
    "Upload service records, MOTs, ownership papers and maintenance invoices. We'll turn your documents into a clear timeline of the vehicle's history, making it easier for buyers to understand its journey.",
  emphasis:
    'Well-documented vehicles inspire confidence, attract greater buyer interest, and can command significantly higher prices.',
};

/**
 * What the analysis returns, oldest first — the PRD's "chronological vehicle
 * history timeline". `mot` marks entries the "Show MOT events" toggle filters.
 */
export const TIMELINE_ENTRIES = [
  {
    id: 'h-2005',
    date: '30th July 2005',
    category: 'Event type',
    description: 'Service stamp: oil change & brake replacement.',
    image: docs.service,
    showOnListing: true,
    hasPersonalInfo: true,
  },
  {
    id: 'h-2008',
    date: '23rd October 2008',
    description: 'Ownership transfer, 2nd owner registered.',
    image: docs.transfer,
    showOnListing: true,
    hasPersonalInfo: true,
  },
  {
    id: 'h-2012-mot',
    date: '4th June 2012',
    category: 'MOT',
    description: 'MOT passed with no advisories. 38,120 miles.',
    mot: true,
  },
  {
    id: 'h-2015',
    date: '12th August 2015',
    category: 'Event type',
    description: 'Major service: clutch and suspension overhaul.',
    image: docs.invoice,
  },
  {
    id: 'h-2019-mot',
    date: '19th May 2019',
    category: 'MOT',
    description: 'MOT passed. Advisory: front tyres wearing evenly.',
    mot: true,
  },
  {
    id: 'h-2021',
    date: '17th September 2021',
    category: 'Bodywork',
    description: 'New front wing fitted. Full professional respray to original midnight blue colour',
    image: docs.bodywork,
    showOnListing: true,
  },
];

/** How many documents the fake analysis still has to chew through. */
export const ANALYSIS_TOTAL = 6;

let uploadSeq = 0;

/**
 * Stands in for picking or capturing documents. `hasPersonalInfo` would come
 * from server-side detection; here every third scan is flagged so the warning
 * state is reachable.
 */
export function makeUploads(count = 9) {
  const pool = [docs.invoice, docs.transfer, docs.service, docs.bodywork];
  return Array.from({ length: count }, (_, i) => {
    uploadSeq += 1;
    return {
      id: `upload-${uploadSeq}`,
      image: pool[i % pool.length],
      showOnListing: true,
      hasPersonalInfo: i % 3 === 0,
    };
  });
}

/** Resolves with the timeline, standing in for the OCR + timeline service. */
export function analyseDocuments() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TIMELINE_ENTRIES), 1800);
  });
}
