/** Placeholder content matching the Figma comps; swap for API data later. */

import { garage } from './saved';

export const ownedVehicles = garage.vehicles;

export const portfolio = {
  label: 'Overall performance',
  count: `${ownedVehicles.length} lists`,
  totalValue: '£12,000,000',
  delta: '5%',
  deltaValue: '+ £14,000',
  deltaCaption: 'vs last month',
  sinceLabel: 'since purchase',
  sinceDate: 'Jan 2024',
};

/**
 * Ownership reminders, ordered by urgency: entries with an action need
 * attention and sort above informational ones, per the garage spec.
 *
 * `vehicleId` ties each reminder to its vehicle, so a vehicle's own page can
 * show only its reminders while the garage shows the lot.
 */
export const reminders = [
  {
    id: 'insurance-mini',
    vehicleId: 'mini',
    icon: 'shield-heart',
    summary: 'Insurance renewal in 18d',
    vehicle: '2000 Rover Mini Cooper',
    title: 'Insurance renewal for 2000 Rover Mini Cooper',
    description: 'Your car insurance expires in 06 Dec 2027. Renew now to stay protected.',
    action: 'Renew Now',
  },
  {
    id: 'mileage-gt3rs',
    vehicleId: 'gt3rs',
    icon: 'gauge-max',
    summary: 'Mileage update due',
    vehicle: '2023 Porsche 992 GT3 RS',
    title: 'Time to update mileage for 2023 Porsche 992 GT3 RS',
    description:
      "Time for your check-in. Update your vehicle's records with the current odometer reading.",
    action: 'Update Mileage',
  },
  {
    id: 'tax-gt3rs',
    vehicleId: 'gt3rs',
    icon: 'file-invoice-dollar',
    summary: 'Vehicle tax due',
    vehicle: '2023 Porsche 992 GT3 RS',
    title: 'Vehicle tax due for 2023 Porsche 992 GT3 RS',
    description: 'Your vehicle tax is due on 06 Dec 2027. Renew it before the due date to avoid penalties.',
  },
  {
    id: 'tax-carrera',
    vehicleId: 'carrera',
    icon: 'file-invoice-dollar',
    summary: 'Vehicle tax due',
    vehicle: '2006 Porsche 911 Carrera 4 S Tiptronic S',
    title: 'Vehicle tax due for 2006 Porsche 911 Carrera 4 S Tiptronic S',
    description:
      'Your vehicle tax expires on 20 Dec 2027. Renew it before the due date to avoid penalties.',
  },
  {
    id: 'mot-carrera',
    vehicleId: 'carrera',
    icon: 'file-certificate',
    summary: 'MOT expires in 1 month',
    vehicle: '2006 Porsche 911 Carrera 4 S Tiptronic S',
    title: 'MOT expires for 2006 Porsche 911 Carrera 4 S Tiptronic S',
    description: 'Your MOT expires on 12 Aug 2027. Book your inspection early.',
  },
  {
    id: 'mileage-mini',
    vehicleId: 'mini',
    icon: 'gauge-max',
    summary: 'Time for scheduled maintenance',
    vehicle: '2000 Rover Mini Cooper',
    title: 'Time for scheduled maintenance for 2000 Rover Mini Cooper',
    description:
      'Your vehicle has reached 50,000 miles. It may be time for scheduled maintenance.',
  },
  {
    id: 'oil-gt3rs',
    vehicleId: 'gt3rs',
    icon: 'oil-can-drip',
    summary: 'Oil change recommended',
    vehicle: '2023 Porsche 992 GT3 RS',
    title: 'Oil change recommended for 2023 Porsche 992 GT3 RS',
    description: "Based on your mileage, it's time for your next oil change.",
  },
  {
    id: 'service-carrera',
    vehicleId: 'carrera',
    icon: 'screwdriver-wrench',
    summary: 'Service due soon',
    vehicle: '2006 Porsche 911 Carrera 4 S Tiptronic S',
    title: 'Service due soon for 2006 Porsche 911 Carrera 4 S Tiptronic S',
    description: 'Your next vehicle service is due soon.',
  },
];

/**
 * The garage summary card cycles through the most urgent reminders. The comp
 * shows these three specific lines stacked inside an "Animation" component.
 */
export const summaryReminders = [
  'Insurance renewal in 18d',
  'MOT expires in 1 month',
  'Service due soon',
];

export const previouslyOwned = [
  {
    id: 'mini-sold',
    name: '2000 Rover Mini Cooper',
    soldPrice: '£28,000',
    soldOn: '15 Mar 2025',
    image: require('../assets/cars/mini-cooper.jpg'),
  },
  {
    id: 'gt3rs-sold',
    name: '2023 Porsche 992 GT3 RS',
    soldPrice: '£30,000',
    soldOn: '20 Mar 2025',
    image: require('../assets/cars/porsche-992-gt3rs.jpg'),
  },
  {
    id: 'carrera-sold',
    name: '2006 Porsche 911 Carrera 4 S Tiptronic S',
    soldPrice: '£30,000',
    soldOn: '20 Mar 2025',
    image: require('../assets/cars/porsche-911-carrera.jpg'),
  },
];
