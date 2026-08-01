import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const stylesheet = readFileSync(resolve(process.cwd(), "src/style.css"), "utf8");

describe("dark theme typography", () => {
  it("takes ownership of Blueprint bare-element colors", () => {
    expect(stylesheet).toContain('body {\n  background: #0b1117; color: #e5eef5;');
    expect(stylesheet).toContain("summary, dt, dd, li, th, td, figcaption { color: inherit; }");
    expect(stylesheet).toContain('.app-shell[data-theme="dark"] { background: #0b1117; color: #e5eef5;');
  });

  it("gives the preparation screen an explicit high-contrast foreground", () => {
    expect(stylesheet).toContain(".boot-message {");
    expect(stylesheet).toContain("background: #0b1117; color: #dceaf2;");
  });
});
