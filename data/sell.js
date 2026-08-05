/**
 * Copy for the sell / create-advert flow.
 *
 * All presentational placeholder content — the auction and self-listing pitches,
 * the description guidance shown behind the info icon, and the canned "AI" review
 * of a written description.
 */

/** The two selling routes on the sell bottom sheet. */
export const AUCTION_PITCH = {
  badge: 'SELL FASTER',
  title: 'Auction to 4 million enthusiasts',
  points: [
    'Sell in just 14 days',
    'Crafted listing with optional professional photography',
    'Hands-off packages - our experts will handle everything',
    'Secure payments',
  ],
  cta: 'Auction your vehicle',
  phone: '+44 333 090 6276',
  rating: '4,6/5',
  ratingLabel: 'Excellent',
};

export const SELF_LISTING_PITCH = {
  title: 'Sell it yourself',
  points: ['Talk and negotiate with buyers directly', 'Free to list', 'Promotional packages available'],
  cta: 'Create an advert',
};

/** The advert steps and how each one's completion is read. */
export const ADVERT_STEPS = [
  { id: 'history', label: 'History' },
  { id: 'photos', label: 'Photos & video' },
  { id: 'description', label: 'Description' },
  { id: 'price', label: 'Price' },
];

/** Shown behind the info icon — what makes a good description. */
export const DESCRIPTION_TIPS_INTRO =
  'A strong description gives buyers confidence, which encourages higher offers and a quicker sale!';

export const DESCRIPTION_TIPS = [
  {
    id: 'history',
    icon: 'file-certificate',
    title: 'What do you know about the history of the car?',
    description:
      'Include when you bought the vehicle, what work has recently been completed, how it has been stored and anything else important.',
  },
  {
    id: 'exterior',
    icon: 'driver-side',
    title: 'Please describe anything about the exterior that a buyer needs to know.',
    description: 'Mention the overall condition, any marks or scrapes, and how things look underneath.',
  },
  {
    id: 'interior',
    icon: 'gauge-low',
    title: 'How would you describe the interior condition?',
    description:
      'Are there any modifications or notable factory extras? Do all the instruments and switchgear work?',
  },
  {
    id: 'mechanical',
    icon: 'engine',
    title: "Please describe the vehicle's mechanical condition.",
    description:
      'Is the engine starting and running correctly? Is it factory-standard or modified? Any known faults?',
  },
  {
    id: 'summary',
    icon: 'shield-heart',
    title: 'Finally, how would you summarise the car?',
    description: 'What is it like to drive? What do you love most about it?',
  },
];

export const DESCRIPTION_INTRO =
  "Describe your classic in detail, the condition it's in, work that has been done and what makes it special.";
export const DESCRIPTION_PLACEHOLDER = 'Start typing, or paste here…';

/** Canned "AI" feedback on the written description. */
export const AI_REVIEW = {
  title:
    "Nice one, that's a solid description! But a  few points about the mechanical condition would make it even better.",
  body: 'Is the engine starting and running correctly? Is it factory-standard or modified? Any known faults?',
};

/** Placeholder seller location shown on the advert preview. */
export const ADVERT_LOCATION = 'Boroughbridge, United Kingdom';

/** Promotional packages offered once the advert is confirmed. */
export const ADVERT_PACKAGES = [
  { id: 'basic', name: 'Basic', description: null, priceLabel: null, amount: 0, badge: null },
  {
    id: 'featured',
    name: 'Featured',
    description: 'Standout above basic adverts',
    priceLabel: '30 day boost for - £29.99',
    amount: 29.99,
    badge: 'BEST VALUE',
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    description: 'Up to 12x more views',
    priceLabel: '30 day boost for - £69.99',
    amount: 69.99,
    badge: 'BIGGEST REACH',
  },
];

export const money = (amount) =>
  `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const PURCHASE_BLURB =
  "We'll place a hold on your card for the stated amount. Once your advert is approved, we'll charge you for your chosen packages.";

/** Stand-in saved card shown on the purchase sheet. */
export const SAVED_CARD = { number: '•••• •••• •••• 4242', expires: 'Expires 04/27' };

/** Details mirrored onto the mock Apple Pay sheet. */
export const APPLE_PAY = {
  card: 'MASTERCARD PLATINUM',
  cardTail: '(•••• 2505)',
  address: ['5 Elemete Croft,', 'Scholes,', 'Leeds', 'LS154BE'],
  contact: 'james.heffernan@carandclassic.com',
  merchant: 'PAY CAR & CLASSIC',
};

export const ADVERT_SUCCESS = {
  title: 'Nice one!',
  body:
    'Your advert has been submitted for review and your boost package added!\nOnce approved, your card will be charged and your boost will be activated for 30 days.',
  footer: 'Good luck with your sale!',
};

export const ADVERT_CONFIRM =
  'I confirm I have the legal authority to sell this vehicle and the information I have supplied is accurate. I have read and accept the Car & Classic User Agreement.';

export const ADVERT_PRIVACY = 'By continuing you accept our Privacy Policy.';

/** Currencies offered on the price step; rate is GBP → currency for display. */
export const CURRENCIES = [
  { id: 'GBP', label: 'GBP £', symbol: '£', rate: 1 },
  { id: 'EUR', label: 'EUR €', symbol: '€', rate: 1.17 },
  { id: 'USD', label: 'USD $', symbol: '$', rate: 1.28 },
];
