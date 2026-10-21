import { useEffect, useRef } from "react";
import { installSessionGuard } from "./sessionGuard";
import { flushLocalWrites } from "./storage";

export function useSessionKeepalive(url: string, _intervalMilliseconds: number, onSessionExpired?: () => void) {
  const handler = useRef(onSessionExpired); handler.current = onSessionExpired;
  useEffect(() => {
    if (!url) return;
    return installSessionGuard({ statusUrl: url, onExpired: () => handler.current?.(), beforeRedirect: flushLocalWrites });
  }, [url]);
}
