/** Placeholder content matching the Figma comp; swap for API data later. */

export const garage = {
  title: 'My garage',
  subtitle: '3 lists',
  delta: '5%',
  deltaCaption: 'vs last month',
  vehicles: [
    {
      id: 'mini',
      name: '2000 Rover Mini Cooper',
      price: '£22,000',
      delta: '4%',
      image: require('../assets/cars/mini-cooper.jpg'),
    },
    {
      id: 'gt3rs',
      name: '2023 Porsche 992 GT3 RS',
      price: '£245,000',
      delta: '9%',
      image: require('../assets/cars/porsche-992-gt3rs.jpg'),
    },
    {
      id: 'carrera',
      name: '2006 Porsche 911 Carrera 4 S Tiptronic S',
      price: '£34,000',
      delta: '3%',
      image: require('../assets/cars/porsche-911-carrera.jpg'),
    },
  ],
};

export const valuations = {
  title: 'Valuations',
  subtitle: '3 lists',
  items: [
    { id: 'v1', name: '2023 Porsche 992', price: '£70,889', delta: '5%', expiry: 'Expired 08/07/2026' },
    { id: 'v2', name: '2007 BMW 630i', price: '£70,889', delta: '5%', expiry: 'Expired 08/07/2026' },
    { id: 'v3', name: '2006 Porsche 911', price: '£70,889', delta: '5%', expiry: 'Expired 08/07/2026' },
  ],
};

const mosaic = [
  require('../assets/cars/bmw-m4.jpg'),
  require('../assets/cars/mclaren-720s.jpg'),
  require('../assets/cars/koenigsegg-jesko.jpg'),
  require('../assets/cars/dodge-challenger.jpg'),
];

export const listings = {
  title: 'Listings',
  subtitle: '10 saved',
  images: mosaic,
  emptyIcon: 'listings',
  emptyText: 'Monitor specific vehicle listings',
};
export const searches = {
  title: 'Saved',
  subtitle: '8 saved',
  images: mosaic,
  emptyIcon: 'searches',
  emptyText: 'Get notifications for new listings',
};
