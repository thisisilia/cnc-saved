import { useEffect } from "react";

// Render <UserLenzBridge /> once near your app root (e.g. inside App.jsx).
export function UserLenzBridge() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api-en72htyjgq-uc.a.run.app/bridge.min.js";
    script.defer = true;
    script.onload = () => {
      window.UserLenzBridge.init({
        source: "userlenz-replay-bridge",
        allowedOrigins: ["*", "https://userlenz-demo.web.app"],
      });
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return null;
}
