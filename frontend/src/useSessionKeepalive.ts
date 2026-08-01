import { useEffect } from "react";

export function useSessionKeepalive(url: string, intervalMilliseconds: number) {
  useEffect(() => {
    const interval = Math.max(0, intervalMilliseconds || 0);
    if (!url || interval <= 0) return;
    const keepalive = () => {
      void fetch(url, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      }).catch(() => undefined);
    };
    keepalive();
    const timer = window.setInterval(keepalive, interval);
    const renewWhenVisible = () => {
      if (document.visibilityState === "visible") keepalive();
    };
    document.addEventListener("visibilitychange", renewWhenVisible);
    window.addEventListener("focus", keepalive);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", renewWhenVisible);
      window.removeEventListener("focus", keepalive);
    };
  }, [intervalMilliseconds, url]);
}
