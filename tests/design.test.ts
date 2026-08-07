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

/**
 * The seal is the one screen that must not move. Every rule below closes a route the page
 * has to travel — scroll, rubber band, pull-to-refresh, zoom, selection callout — and each
 * is easy to drop by accident, because none of them show up on a desktop browser.
 */
describe("the loading lock", () => {
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  const shell = readFileSync(
    new URL("../src/components/chrome/SiteShell.tsx", import.meta.url),
    "utf8",
  );
  const lock = css.slice(css.indexOf("html.sfwf-loading"), css.indexOf(".noscroll"));

  it("pins the document so there is nothing to scroll or rubber-band", () => {
    expect(lock).toMatch(/position:\s*fixed/);
    expect(lock).toMatch(/overflow:\s*hidden/);
    expect(lock).toMatch(/overscroll-behavior:\s*none/);
  });

  it("closes zoom and the selection callout", () => {
    expect(lock).toMatch(/touch-action:\s*none/);
    expect(lock).toMatch(/user-select:\s*none/);
    expect(lock).toMatch(/-webkit-touch-callout:\s*none/);
  });

  it("is scoped to the seal, so the site below still scrolls", () => {
    // The unconditional html rule must stay a plain scroller — the page itself is the
    // scroller the nav mechanic and iOS URL-bar collapse both depend on.
    const base = css.slice(css.indexOf("\nhtml {"), css.indexOf("html::-webkit-scrollbar"));
    expect(base).not.toMatch(/position:\s*fixed|touch-action:|user-select:/);
    // The class is the only thing holding the lock, and it is removed on the way in.
    expect(shell).toMatch(/classList\.remove\("sfwf-loading"\)/);
  });

  it("applies before paint rather than on hydration", () => {
    // The blocking script in <head> is what makes the first frame unscrollable.
    expect(layout).toMatch(/classList\.add\('sfwf-loading'\)/);
  });

  it("holds the pinch guard for as long as the seal is mounted", () => {
    expect(shell).toMatch(/useScrollLock\(loading\)/);
  });
});
