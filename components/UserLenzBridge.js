import { useEffect } from "react";

// Render <UserLenzBridge /> once near your app root (e.g. inside App.jsx).
//
// On the web build the same <script> is also injected into index.html at build
// time (scripts/inject-userlenz.mjs) so the snippet is present in the page
// source and picked up by snippet detectors. This component checks for that tag
// first and bails if it's already there, so the bridge never loads or
// initialises twice. When it isn't present (native, or any host without the
// static tag) this component loads it.
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
        allowedOrigins: ["https://userlenz-demo.web.app", "https://cnc-inky.vercel.app"],
      });
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return null;
}
