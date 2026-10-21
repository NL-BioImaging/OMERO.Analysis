import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const stylesheet = readFileSync(resolve(process.cwd(), "src/style.css"), "utf8");
const token = (name: string) => stylesheet.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`))![1];

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
    expect(contrast(token("--theme-text"), token("--theme-background"))).toBeGreaterThanOrEqual(7);
    expect(contrast(token("--theme-muted"), token("--theme-background"))).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps normal and muted light text readable", () => {
    expect(contrast("#1c2127", "#f0f1f5")).toBeGreaterThanOrEqual(7);
    expect(contrast("#5f6b7c", "#f0f1f5")).toBeGreaterThanOrEqual(4.5);
  });
});

it.each(["dark","light"])("keeps %s control boundaries and text distinguishable", theme=>{
  const blocks=[...stylesheet.matchAll(new RegExp(`\\.app-shell\\[data-theme="${theme}"\\]\\s*\\{([^}]+)\\}`,"g"))].map(match=>match[1]).join("\n");
  const color=(name:string)=>blocks.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`))![1];
  const text=theme==="dark"?"#f6f7f9":"#1c2127";
  const panel=theme==="dark"?"#2f343c":"#ffffff";
  expect(contrast(color("--control-border"),panel)).toBeGreaterThanOrEqual(3);
  expect(contrast(color("--control-border"),color("--theme-input"))).toBeGreaterThanOrEqual(3);
  for(const name of ["--theme-input","--control-surface","--control-hover"])
    expect(contrast(text,color(name))).toBeGreaterThanOrEqual(4.5);
  expect(contrast(color("--control-disabled-text"),color("--control-disabled"))).toBeGreaterThanOrEqual(4.5);
});
