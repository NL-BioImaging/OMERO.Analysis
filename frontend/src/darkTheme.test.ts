import { describe, expect, it } from "vitest";
import { Colors } from "@blueprintjs/core";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const stylesheet = readFileSync(resolve(process.cwd(), "src/style.css"), "utf8").replace(/\r\n/g, "\n");

describe("dark theme typography", () => {
  it("takes ownership of Blueprint bare-element colors", () => {
    expect(stylesheet).toContain('body {\n  background: #252a31; color: #f6f7f9;');
    expect(stylesheet).toContain("summary, dt, dd, li, th, td, figcaption { color: inherit; }");
    expect(stylesheet).toContain('.app-shell[data-theme="dark"] { background: #252a31; color: #f6f7f9;');
  });

  it("gives the preparation screen an explicit high-contrast foreground", () => {
    expect(stylesheet).toContain(".boot-message {");
    expect(stylesheet).toContain("background: #252a31; color: #e5e8eb;");
  });
});

it("uses Blueprint colors for every dark theme token", () => {
  const root = stylesheet.slice(stylesheet.indexOf(":root"), stylesheet.indexOf("}"));
  const allowed = new Set(Object.values(Colors).map(value => value.toLowerCase()));
  const tokens = [...root.matchAll(/--theme-[a-z-]+:\s*(#[0-9a-f]{6})/g)];
  expect(tokens.length).toBeGreaterThanOrEqual(8);
  tokens.forEach(([, value]) => expect(allowed.has(value)).toBe(true));
});
