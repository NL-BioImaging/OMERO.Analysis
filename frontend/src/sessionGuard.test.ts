import { createSessionGuard, safeLoginDestination } from "./sessionGuard";
it("coalesces simultaneous checks and redirects only authenticated expiry responses", async () => {
  let resolve!: (value: Response) => void;
  const fetcher = vi.fn(() => new Promise<Response>(r => { resolve = r; }));
  const redirect = vi.fn(), save = vi.fn(async () => undefined);
  const guard = createSessionGuard({ statusUrl: "/status", beforeRedirect: save }, fetcher as typeof fetch, redirect);
  const a = guard.check(true), b = guard.check(true);
  expect(fetcher).toHaveBeenCalledTimes(1);
  resolve(new Response(JSON.stringify({ authenticated: false, login_url: "/webclient/login/" }), { status: 401 }));
  expect(await a).toBe("expired"); expect(await b).toBe("expired");
  expect(save).toHaveBeenCalledOnce(); expect(redirect).toHaveBeenCalledOnce();
});
it("does not redirect on permission denial or worker/network failure", async () => {
  const redirect = vi.fn();
  const guard = createSessionGuard({ statusUrl: "/status" }, vi.fn(async () => new Response("denied", { status: 403 })), redirect);
  expect(await guard.check(true)).toBe("unavailable"); expect(redirect).not.toHaveBeenCalled();
});
it("rejects cross-origin login or return URLs", () => {
  expect(() => safeLoginDestination("https://other.test/login", "/analysis", "http://localhost")).toThrow("same-origin");
  expect(() => safeLoginDestination("/login", "https://other.test", "http://localhost")).toThrow("same-origin");
});

it("uses OMERO's login return parameter and preserves the local query and fragment", () => {
  const url = new URL(safeLoginDestination("/webclient/login/", "/omero_biomero/biomero/?tab=data-analysis#notebook", "http://localhost"));
  expect(url.searchParams.get("url")).toBe("/omero_biomero/biomero/?tab=data-analysis#notebook");
});


it("retries draft preservation before redirecting after a temporary save failure", async () => {
  const save = vi.fn().mockRejectedValueOnce(new Error("temporary draft write failure")).mockResolvedValue(undefined);
  const redirect = vi.fn();
  const fetcher = vi.fn(async () => new Response(JSON.stringify({ authenticated: false }), { status: 401 }));
  const guard = createSessionGuard({ statusUrl: "/status", beforeRedirect: save }, fetcher, redirect);
  expect(await guard.check(true)).toBe("unavailable");
  expect(redirect).not.toHaveBeenCalled();
  expect(await guard.check(true)).toBe("expired");
  expect(save).toHaveBeenCalledTimes(2);
  expect(redirect).toHaveBeenCalledOnce();
});
