import { useEffect } from 'react';

/**
 * Loads the UserLenz replay bridge script (web only). Render once near the app
 * root. No-op on native, where there is no `document`.
 */
export default function UserLenzBridge() {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const script = document.createElement('script');
    script.src = 'https://api-en72htyjgq-uc.a.run.app/bridge.min.js';
    script.defer = true;
    script.onload = () => {
      window.UserLenzBridge?.init({
        source: 'userlenz-replay-bridge',
        allowedOrigins: ['https://userlenz-demo.web.app'],
      });
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return null;
}
