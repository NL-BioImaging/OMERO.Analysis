import { appTabFromRoute, runKindForTab } from "./navigation";

describe("Analysis navigation", () => {
  it("uses separate reusable-artifact routes", () => {
    expect(appTabFromRoute("methods")).toBe("methods");
    expect(appTabFromRoute("pipelines")).toBe("pipelines");
    expect(appTabFromRoute("notebooks")).toBe("notebooks");
    expect(appTabFromRoute("assistant")).toBe("assistant");
    expect(appTabFromRoute("runs")).toBe("home");
    expect(appTabFromRoute("notebook")).toBe("home");
    expect(appTabFromRoute("chat")).toBe("home");
  });

  it("returns Home for missing or invalid routes", () => {
    expect(appTabFromRoute(null)).toBe("home");
    expect(appTabFromRoute("unknown")).toBe("home");
  });

  it("maps the run tabs to independent history kinds", () => {
    expect(runKindForTab("methods")).toBe("method");
    expect(runKindForTab("pipelines")).toBe("pipeline");
    expect(runKindForTab("home")).toBeNull();
  });
});
