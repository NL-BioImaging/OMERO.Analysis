import {
  EMBEDDED_MESSAGE_SCHEMA,
  biomeroThemeFromMessage,
  embeddedHostMessage
} from "./embeddedBridge";

describe("BIOMERO embedded host bridge", () => {
  it("does not expose host messages in standalone mode", () => {
    expect(embeddedHostMessage({}, "ready")).toBeNull();
  });

  it("creates a small versioned message for the whitelisted BIOMERO host", () => {
    expect(embeddedHostMessage(
      { embeddedHost: "biomero" },
      "dirty-state-changed",
      { dirty: true }
    )).toEqual({
      schema: EMBEDDED_MESSAGE_SCHEMA,
      source: "omero-analysis",
      type: "dirty-state-changed",
      payload: { dirty: true }
    });
  });

  it("accepts only same-origin theme messages from the BIOMERO parent", () => {
    const parent = {} as Window;
    const event = {
      origin: "http://localhost",
      source: parent,
      data: {
        schema: EMBEDDED_MESSAGE_SCHEMA,
        source: "omero-biomero",
        type: "theme-changed",
        payload: { theme: "dark" }
      }
    } as MessageEvent;
    expect(biomeroThemeFromMessage(event, parent, "http://localhost")).toBe("dark");
    expect(biomeroThemeFromMessage(event, {} as Window, "http://localhost")).toBeNull();
  });
});
