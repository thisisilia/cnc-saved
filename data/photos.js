/**
 * Placeholder content for PRD step 5 — photos & videos.
 *
 * The guidance thumbnails reuse the existing car shots; no category artwork was
 * exported. Picking and capture are stubbed the same way as the history step.
 */

const shots = {
  exterior: require('../assets/cars/mini-cooper-hero.jpg'),
  interior: require('../assets/cars/porsche-911-carrera.jpg'),
  wheels: require('../assets/cars/porsche-992-gt3rs.jpg'),
  details: require('../assets/cars/bmw-m4.jpg'),
  engine: require('../assets/cars/mclaren-720s.jpg'),
};

export const PHOTOS_INTRO =
  "Here's what to include. Don't worry if you don't have everything you need now, you can add more later.";

/** What a good set of vehicle photographs covers. */
export const PHOTO_GUIDANCE = [
  {
    id: 'exterior',
    title: 'Exterior',
    description:
      'All four corners, both sides and the front and rear. Make sure you have the whole car in every shot.',
    image: shots.exterior,
  },
  {
    id: 'interior',
    title: 'Interior',
    description:
      'Seats, dash, steering wheel, gear stick, door cards, boot lining, headlining and carpets.',
    image: shots.interior,
  },
  {
    id: 'wheels',
    title: 'Wheels & suspension',
    description:
      'All wheels and show the condition of the tyres. Show as much detail as possible of the suspension.',
    image: shots.wheels,
  },
  {
    id: 'details',
    title: 'Details',
    description:
      'Highlight special details like badges and brightwork. Also show details of any damage - honesty sells!',
    image: shots.details,
  },
  {
    id: 'engine',
    title: 'Engine bay',
    description: 'Show the engine and bay from a few angles, show mechanical details and inner panels.',
    image: shots.engine,
  },
];

/** What makes a good shoot. Shown from the info icon on the Photos & video hub. */
export const PHOTO_TIPS_INTRO =
  "It's easy to take great photos and video of your vehicle, you just need:";

export const PHOTO_TIPS = [
  { id: 'clean', icon: 'sparkles', title: 'A clean, tidy car', description: 'Show it at its very best' },
  {
    id: 'space',
    icon: 'rotate-reverse',
    title: 'Space to walk around',
    description: 'Carparks are ideal for this',
  },
  {
    id: 'daylight',
    icon: 'cloud-sun',
    title: 'Daylight',
    description:
      "You don't need full sun, just make sure there is plenty of light to capture all the details.",
  },
  {
    id: 'plenty',
    icon: 'images',
    title: 'Take plenty!',
    description:
      'Buyers like as much detail as possible, show all angles, inside and out, and any areas of interest',
  },
  {
    id: 'time',
    icon: 'timer',
    title: '15 minutes',
    description: 'It should take no more than 15 minutes to get all the photos you need',
  },
];

/** How to shoot a walkaround video (1148-9117). */
export const VIDEO_INTRO_STEPS = [
  {
    id: 'engine-on',
    icon: 'fire',
    title: 'Fire it up before you start',
    description: "Make sure the engine is running before you begin. That's the soundtrack sorted.",
  },
  {
    id: 'lap',
    icon: 'rotate-reverse',
    title: 'Start with a slow lap around the car',
    description:
      'Capture all sides from different angles, then move in closer to show key details such as wheels, badges, lights, and trim.',
  },
  {
    id: 'interior',
    icon: 'gauge-low',
    title: "Open the driver's door and film the interior",
    description: 'Include the dashboard, seats, headlining, carpets and key features.',
  },
  {
    id: 'bonnet',
    icon: 'engine',
    title: 'Pop the bonnet',
    description:
      'Give a clear view of the engine, and where possible show the condition of the bay and inner panels.',
  },
];

/** The still shown as the example clip and, once "recorded", the captured video. */
export const VIDEO_STILL = shots.exterior;

/** Stands in for a recorded walkaround clip; capture is UI-only. */
export function makeVideo() {
  return { items: [{ id: 'video-1', image: VIDEO_STILL }], duration: '3:47' };
}

/** The two things this step collects; the video is optional, per the comp. */
export const PHOTOS_VIDEO_STEPS = [
  { id: 'photographs', label: 'Photographs', icon: 'image', required: true },
  { id: 'video', label: 'Walkaround video', icon: 'video', required: false, badge: 'OPTIONAL' },
];

/**
 * Stands in for the device camera roll.
 *
 * Real access needs expo-image-picker plus permission handling; the picker UI is
 * built against this fixed set so the selection behaviour is real even though
 * the library is not.
 */
export const GALLERY = Array.from({ length: 24 }, (_, i) => {
  const pool = Object.values(shots);
  return { id: `roll-${i + 1}`, image: pool[i % pool.length] };
});

let photoSeq = 0;

/** Wraps camera-roll entries as photos owned by the draft. */
export function makePhotos(source) {
  const items = typeof source === 'number' ? GALLERY.slice(0, source) : source;
  return items.map((item) => {
    photoSeq += 1;
    return { id: `photo-${photoSeq}`, image: item.image };
  });
}
