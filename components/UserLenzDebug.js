import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

/**
 * TEMPORARY diagnostic. Shows whether the page is inside an iframe, the parent
 * (referrer) URL, whether the bridge loaded, and the origins of any postMessages
 * received — which reveals the exact origin the UserLenz tool talks to us from,
 * so we can set `allowedOrigins` correctly. Remove once detection works.
 */
export default function UserLenzDebug() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
    const origins = new Set();
    const update = () =>
      setInfo({
        iframed: window.top !== window.self,
        referrer: document.referrer || '(none)',
        origin: window.location.origin,
        bridge: typeof window.UserLenzBridge,
        msgs: Array.from(origins),
      });
    const onMsg = (e) => {
      if (e && e.origin) {
        origins.add(e.origin);
        update();
      }
    };
    window.addEventListener('message', onMsg);
    update();
    const timer = setInterval(update, 1000);
    return () => {
      window.removeEventListener('message', onMsg);
      clearInterval(timer);
    };
  }, []);

  if (!info) return null;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Text style={styles.green}>ULZ · iframed: {String(info.iframed)} · bridge: {info.bridge}</Text>
      <Text style={styles.white}>referrer: {info.referrer}</Text>
      <Text style={styles.yellow}>msg origins: {info.msgs.join(', ') || '(none yet)'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    zIndex: 99999,
  },
  green: { color: '#0f0', fontSize: 11 },
  white: { color: '#fff', fontSize: 11 },
  yellow: { color: '#ff0', fontSize: 11 },
});
