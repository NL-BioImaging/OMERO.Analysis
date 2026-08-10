import { useEffect, useRef } from "react";

export function useSessionKeepalive(
  url: string,
  intervalMilliseconds: number,
  onSessionExpired?: () => void
) {
  const expiredHandler = useRef(onSessionExpired);
  expiredHandler.current = onSessionExpired;
  useEffect(() => {
    const interval = Math.max(0, intervalMilliseconds || 0);
    if (!url || interval <= 0) return;
    const keepalive = async () => {
      const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store"
      }).catch(() => undefined);
      if (response && (
        response.status === 401 || response.status === 403 || response.redirected
      )) {
        expiredHandler.current?.();
      }
    };
    void keepalive();
    const timer = window.setInterval(keepalive, interval);
    const renewWhenVisible = () => {
      if (document.visibilityState === "visible") void keepalive();
    };
    document.addEventListener("visibilitychange", renewWhenVisible);
    const renewOnFocus = () => void keepalive();
    window.addEventListener("focus", renewOnFocus);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", renewWhenVisible);
      window.removeEventListener("focus", renewOnFocus);
    };
  }, [intervalMilliseconds, url]);
}
