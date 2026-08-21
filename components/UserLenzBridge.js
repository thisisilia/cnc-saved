import { useEffect } from "react";

// Render <UserLenzBridge /> once near your app root (App.js).
//
// The same <script> is injected into index.html at build time
// (scripts/inject-userlenz.mjs) so it loads and fires BRIDGE_READY as early as
// possible — before the UserLenz tool's detection check gives up. This component
// only loads the bridge if that static tag isn't already present (native, or any
// host without the injection), so it never loads or initialises twice.
export function UserLenzBridge() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (document.querySelector('script[src*="bridge.min.js"]')) return undefined;

    const script = document.createElement("script");
    script.src = "https://api-en72htyjgq-uc.a.run.app/bridge.min.js";
    script.defer = true;
    script.onload = () => {
      window.UserLenzBridge.init({
        source: "userlenz-replay-bridge",
        allowedOrigins: ["*"],
      });
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return null;
}
