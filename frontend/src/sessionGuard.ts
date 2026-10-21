type SessionState = "authenticated" | "expired" | "unavailable";
type GuardOptions = { statusUrl: string; onExpired?: () => void; beforeRedirect?: () => Promise<unknown> };
export function safeLoginDestination(loginUrl: string, returnUrl: string, origin: string): string {
  const login = new URL(loginUrl, origin);
  const destination = new URL(returnUrl, origin);
  if (login.origin !== origin || destination.origin !== origin) throw new Error("Login and return destination must be same-origin");
  login.searchParams.set("url", destination.pathname + destination.search + destination.hash);
  return login.href;
}
export function createSessionGuard(options: GuardOptions, fetcher: typeof fetch = fetch,
  redirect = (url: string) => { (window.top || window).location.href = url; }) {
  let pending: Promise<SessionState> | null = null, lastCheck = 0, expired = false;
  const check = (force = false): Promise<SessionState> => {
    if (expired) return Promise.resolve("expired");
    if (pending) return pending;
    if (!force && Date.now() - lastCheck < 2000) return Promise.resolve("authenticated");
    pending = (async (): Promise<SessionState> => {
      try {
        const response = await fetcher(options.statusUrl, { credentials: "same-origin", cache: "no-store", redirect: "error" });
        const body = await response.json();
        if (response.status === 401 && body.authenticated === false) {
          options.onExpired?.();
          await options.beforeRedirect?.();
          expired = true;
          let returnUrl = window.location.href;
          try { returnUrl = window.top?.location.href || returnUrl; } catch { /* Standalone URL remains same-origin. */ }
          redirect(safeLoginDestination(body.login_url || "/webclient/login/", returnUrl, window.location.origin));
          return "expired";
        }
        if (!response.ok || body.authenticated !== true) return "unavailable";
        lastCheck = Date.now();
        return "authenticated";
      } catch { return "unavailable"; }
      finally { pending = null; }
    })();
    return pending;
  };
  return { check };
}

/** One guard per same-origin host window; embedded Analysis reuses the host guard. */
export function installSessionGuard(options: GuardOptions) {
  let root: Window = window;
  try { if (window.top?.location.origin === window.location.origin) root = window.top; } catch { /* separate-origin embedding */ }
  const shared = root as Window & { __oaSessionGuard?: ReturnType<typeof createSessionGuard>; __oaSessionClients?: Set<GuardOptions> };
  shared.__oaSessionClients ||= new Set();
  shared.__oaSessionClients.add(options);
  if (!shared.__oaSessionGuard) shared.__oaSessionGuard = createSessionGuard({
    statusUrl: options.statusUrl,
    onExpired: () => shared.__oaSessionClients?.forEach(client => client.onExpired?.()),
    beforeRedirect: async () => { await Promise.all([...shared.__oaSessionClients || []].map(client => client.beforeRedirect?.())); }
  }, root.fetch.bind(root));
  const guard = shared.__oaSessionGuard;
  const activation = () => { void guard.check(); };
  const focus = () => { void guard.check(true); };
  const visible = () => { if (document.visibilityState === "visible") focus(); };
  document.addEventListener("pointerdown", activation, true);
  document.addEventListener("keydown", activation, true);
  document.addEventListener("visibilitychange", visible);
  window.addEventListener("focus", focus);
  const original = window.fetch;
  const guarded: typeof fetch = async (input, init) => {
    const response = await original(input, init);
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, window.location.href);
    if (url.origin === window.location.origin && url.href !== new URL(options.statusUrl, window.location.href).href &&
        (response.status === 401 || response.status === 403 || response.redirected && /\/login\/?/.test(response.url))) {
      await guard.check(true);
    }
    return response;
  };
  window.fetch = guarded;
  void guard.check(true);
  return () => {
    shared.__oaSessionClients?.delete(options);
    document.removeEventListener("pointerdown", activation, true); document.removeEventListener("keydown", activation, true);
    document.removeEventListener("visibilitychange", visible); window.removeEventListener("focus", focus);
    if (window.fetch === guarded) window.fetch = original;
  };
}
