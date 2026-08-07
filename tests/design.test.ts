import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BLOB_PATHS, blob, nub, soft, MENU_RING } from "@/lib/design/shapes";

/**
 * These guard the parts of the brand that are easiest to erode by accident — the tight
 * radii, the hand-cut outlines, and the border-not-shadow rule.
 */
describe("shapes", () => {
  it("keeps all five hand-cut outlines", () => {
    expect(BLOB_PATHS).toHaveLength(5);
    for (const d of BLOB_PATHS) {
      expect(d.startsWith("M")).toBe(true);
      expect(d.trim().endsWith("Z")).toBe(true);
    }
  });

  it("wraps indices round rather than running off the end", () => {
    expect(soft(0)).toBe(soft(5));
    expect(blob(1)).toBe(blob(6));
    expect(nub(0)).toBe(nub(3));
  });

  it("never produces a pill — the single easiest way to get this brand wrong", () => {
    for (let i = 0; i < 6; i++) {
      const radii = nub(i);
      expect(radii).not.toMatch(/9999|50%|999px/);
      // Per-corner px values, all under half a small control's height.
      for (const value of radii.match(/[\d.]+px/g) ?? []) {
        expect(Number.parseFloat(value)).toBeLessThanOrEqual(20);
      }
    }
  });

  it("draws the menu ring as one closed path", () => {
    expect(MENU_RING.startsWith("M")).toBe(true);
    expect(MENU_RING.trim().endsWith("Z")).toBe(true);
  });
});

describe("stylesheet rules", () => {
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const tokens = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

  it("uses borders, never shadows, on surfaces", () => {
    // text-shadow is legitimate — it is the scrim that keeps copy legible on the dye.
    // box-shadow is not: this system has no elevation.
    expect(css).not.toMatch(/box-shadow/);
    expect(tokens).not.toMatch(/box-shadow/);
  });

  it("keeps the two verified brand colours exact", () => {
    expect(tokens).toMatch(/#ffd010/i);
    expect(tokens).toMatch(/#101b27/i);
  });

  it("honours prefers-reduced-motion", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });
});
