/**
 * Walkaround videos, one per owned vehicle. Hosted on Cloudflare Stream — the
 * poster is Stream's generated thumbnail and `embedUrl` is the iframe player.
 * The detail page shows the poster until tapped, then swaps in the player.
 */
const CF = 'https://customer-hi7k8cx3t7a664ji.cloudflarestream.com';

// `seconds` is the clip length (from Cloudflare's manifest), shown on the
// Photos & video hub as m:ss.
function stream(videoId, seconds) {
  const poster = `${CF}/${videoId}/thumbnails/thumbnail.jpg`;
  return {
    videoId,
    poster,
    seconds,
    embedUrl: `${CF}/${videoId}/iframe?poster=${encodeURIComponent(poster)}`,
  };
}

/** Seconds → "m:ss" (e.g. 86 → "1:26"). */
export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '';
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const VEHICLE_VIDEOS = {
  mini: stream('987d5cf4a3b4784444e174a5f3d53bf4', 60),
  gt3rs: stream('1a4d4dba3b9fc562a9d28497f5ebbff5', 18),
  carrera: stream('f9b528180aafb551779688e2e546ec0e', 86),
  gryaris: stream('137502e9d894e83b8c43beac0b4e2f0f', 124),
};

export function getVehicleVideo(id) {
  return VEHICLE_VIDEOS[id] ?? null;
}
