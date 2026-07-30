import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const stylesheet = readFileSync(resolve(process.cwd(), "src/style.css"), "utf8");
const marker = "/* BIOMERO / Blueprint-inspired light theme.";
const lightTheme = stylesheet.slice(stylesheet.indexOf(marker));
const withoutComments = lightTheme.replace(/\/\*[\s\S]*?\*\//g, "");

describe("BIOMERO-inspired light theme", () => {
  it("uses the BIOMERO canvas, text, action, and card tokens", () => {
    expect(lightTheme).toContain("--biomero-blue: #215db0");
    expect(lightTheme).toContain("--biomero-text: #1c2127");
    expect(lightTheme).toContain("--biomero-canvas: #f0f1f5");
    expect(lightTheme).toContain("0 2px 6px rgba(17, 20, 24, .2)");
  });

  it("remains scoped and does not change layout geometry", () => {
    const rules = Array.from(withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g));
    expect(rules.length).toBeGreaterThan(10);
    for (const [, selector, declarations] of rules) {
      expect(selector.split(",").every((entry) =>
        entry.trim().startsWith('.app-shell[data-theme="light"]')
      )).toBe(true);
      expect(declarations).not.toMatch(
        /(?:^|;)\s*(?:display|position|overflow|grid[^:]*|flex[^:]*|gap|width|height|min-width|max-width|min-height|max-height|padding|margin|inset|top|right|bottom|left)\s*:/m
      );
    }
  });
});
