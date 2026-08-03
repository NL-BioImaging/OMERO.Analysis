import { describe, expect, it } from "vitest";
import { newChat } from "./storage";
import { manuallyNamedChat, shouldAutoTitleChat } from "./chatTitle";

describe("chat titles", () => {
  it("uses the first prompt only for an untouched new chat title", () => {
    const chat = newChat("workspace");
    expect(shouldAutoTitleChat(chat)).toBe(true);

    const renamed = manuallyNamedChat(chat, "My chosen name", "2026-08-02T10:00:00Z");
    expect(renamed.title).toBe("My chosen name");
    expect(renamed.titleEdited).toBe(true);
    expect(shouldAutoTitleChat(renamed)).toBe(false);
  });
});
