import {
  EMBEDDED_MESSAGE_SCHEMA,
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
});
