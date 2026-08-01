import { describe, expect, it } from "vitest";

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => channel(parseInt(value.slice(offset, offset + 2), 16)));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string): number {
  const [high, low] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}

describe("theme contrast", () => {
  it("keeps normal and muted dark text readable", () => {
    expect(contrast("#e5eef5", "#0b1117")).toBeGreaterThanOrEqual(7);
    expect(contrast("#8fa8b8", "#0b1117")).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps normal and muted light text readable", () => {
    expect(contrast("#1c2127", "#f0f1f5")).toBeGreaterThanOrEqual(7);
    expect(contrast("#5f6b7c", "#f0f1f5")).toBeGreaterThanOrEqual(4.5);
  });
});
