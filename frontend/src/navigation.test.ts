import { appTabFromRoute } from "./navigation";
it("defaults to Inspector and preserves notebook/library links", () => {
  expect(appTabFromRoute(null)).toBe("inspector");
  expect(appTabFromRoute("notebooks")).toBe("notebooks");
  expect(appTabFromRoute("libraries")).toBe("libraries");
  expect(appTabFromRoute("editor")).toBe("notebooks");
  for (const retired of ["methods", "pipelines", "assistant", "settings", "home"])
    expect(appTabFromRoute(retired)).toBe("inspector");
});
