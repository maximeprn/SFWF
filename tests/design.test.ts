import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BLOB_PATHS, bubbleShape, buttonShape, soft } from "@/lib/design/shapes";

const SRC = new URL("../src/", import.meta.url).pathname;

function sourceFiles(dir = SRC): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(tsx?|css)$/.test(entry.name) ? [path] : [];
  });
}

/**
 * Comments are stripped before any of the scans below run. Several of these files document
 * the very rule being enforced — "never a `border-top`" — and a guard that fires on its own
 * explanation teaches everyone to delete the explanation.
 */
const stripComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const sources = sourceFiles().map(
  (path) => [path.slice(SRC.length), stripComments(readFileSync(path, "utf8"))] as const,
);

/**
 * These guard the parts of the brand that are easiest to erode by accident — the hand-cut
 * outlines, the drawn dividers, and the borders-not-shadows rule.
 */
describe("shapes", () => {
  it("keeps all six hand-cut outlines", () => {
    expect(BLOB_PATHS).toHaveLength(6);
    for (const d of BLOB_PATHS) {
      expect(d.startsWith("M")).toBe(true);
      expect(d.trim().endsWith("Z")).toBe(true);
    }
  });

  it("wraps indices round rather than running off the end", () => {
    expect(soft(0)).toBe(soft(6));
    expect(soft(1)).toBe("url(#pb1)");
  });

  it("never puts the same silhouette next to itself", () => {
    // A day of four gatherings is the widest row the grid ever draws; if neighbours match
    // there, the hand-cut edge reads as a rounded rectangle instead.
    for (let day = 0; day < 6; day++) {
      for (let i = 0; i < 3; i++) {
        expect(bubbleShape(i, day), `day ${day}, bubble ${i}`).not.toBe(bubbleShape(i + 1, day));
      }
      // Buttons walk the six outlines on their own offset, so no day draws the same
      // booking button twice. (A button may share its own shell's silhouette — at a
      // sixth of the size that reads as the hand, not as a repeat.)
      for (let i = 0; i < 3; i++) {
        expect(buttonShape(day, i), `day ${day}, button ${i}`).not.toBe(buttonShape(day, i + 1));
      }
    }
  });

  it("never produces a pill — the single easiest way to get this brand wrong", () => {
    for (const [path, text] of sources) {
      expect(text, path).not.toMatch(/border-?radius:?\s*["']?\s*(999|9999)/i);
    }
  });
});

describe("stylesheet rules", () => {
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const tokens = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

  it("uses borders, never shadows, on surfaces", () => {
    // text-shadow would be legitimate; box-shadow is not. This system has no elevation, and
    // the one place the design allows it — the 9:16 media frames — is not in this release.
    expect(css).not.toMatch(/box-shadow/);
    expect(tokens).not.toMatch(/box-shadow/);
  });

  it("draws every divider, never borders one", () => {
    // A CSS border-top is the tell that a section was built wrong: full-width separators
    // are the wobble path, and the rule inside an open bubble is the same idea in violet.
    for (const [path, text] of sources) {
      expect(text, path).not.toMatch(/border-?[Tt]op|border-?[Bb]ottom/);
    }
  });

  it("carries the 2026 palette and nothing of the 2025 one", () => {
    expect(tokens).toMatch(/#4f3f79/i); // violet ground
    expect(tokens).toMatch(/#e9622d/i); // orange
    expect(tokens).toMatch(/#e9e7c2/i); // beige
    for (const [path, text] of sources) {
      expect(text, path).not.toMatch(/#ffd010/i); // the 2025 gold, retired
      expect(text, path).not.toMatch(/#65c6bd/i); // cyan is in the palette, used nowhere
    }
  });

  it("honours prefers-reduced-motion", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });

  it("keeps the reveal on the one curve, at the one duration", () => {
    expect(tokens).toMatch(/--ease: cubic-bezier\(0\.22, 0\.75, 0\.2, 1\)/);
    expect(tokens).toMatch(/--open: 0\.34s/);
    expect(css).toMatch(/grid-template-rows var\(--open\) var\(--ease\)/);
  });
});

/**
 * Two rules that are easy to break with one well-meant line, and impossible to unsee once
 * shipped. Both were broken by the display shader we inherited, not by any CSS: it overlaid
 * a 64px noise tile, soft-light blended two copies of the dye, and lifted the result up to
 * 15% brighter. The scans below cover the engine as well as the page for that reason.
 */
describe("surfaces", () => {
  const page = sources.filter(([path]) => !path.startsWith("components/background/"));
  const display = readFileSync(
    new URL("../src/components/background/shader.ts", import.meta.url),
    "utf8",
  ).split("DISPLAY_FRAGMENT_SHADER")[1]!;

  it("lays no grain, noise or film over anything", () => {
    // The dye cloth is the only texture in the product. Flat surfaces are correct.
    for (const [path, text] of sources) {
      expect(text, path).not.toMatch(/feTurbulence|mix-blend|mixBlendMode|backgroundBlend/i);
      expect(text, path).not.toMatch(/grain|noise|film-?grain/i);
    }
  });

  it("writes the dye texel it sampled, unmodified", () => {
    // One fetch, no second layer to blend against it, and nothing multiplying the result.
    // If any of those come back, so does the contrast push they caused.
    expect(display.match(/texture2D\(T,/g) ?? []).toHaveLength(1);
    expect(display).toMatch(/gl_FragColor=vec4\(texture2D\(T,[^;]*\)\.rgb,1\.0\);/);
  });

  it("pushes no colour — the palette as written, over a flat ground", () => {
    // No filter stack, no gradient over the violet, and the ground hex is never lightened
    // or darkened to "lift" a section off it.
    for (const [path, text] of sources) {
      expect(text, path).not.toMatch(/saturate\(|hue-rotate|brightness\(|contrast\(/i);
    }
    for (const [path, text] of page) {
      expect(text, path).not.toMatch(/gradient/i);
    }
  });

  it("builds the dye at the shipped coverage and wash, locked to width", () => {
    const ground = readFileSync(new URL("../src/components/background/dyeGround.ts", import.meta.url), "utf8");
    expect(ground).toMatch(/DYE_COVERAGE = 40/);
    expect(ground).toMatch(/DYE_WASH = 50/);
    // `cover` rescales the ground the moment a bubble opens and the document grows taller.
    // Scoped to the properties that can do it, so it stays off `coverage` (the setting) and
    // off `viewportFit: "cover"` (the iOS safe-area opt-in, which is unrelated).
    const sizing = /(background(-size)?|backgroundSize|object-?fit|objectFit)\s*:\s*[^;"'`]*\bcover\b/i;
    for (const [path, text] of sources) expect(text, path).not.toMatch(sizing);
  });
});

/**
 * The chrome phase 1 deliberately removes. Each of these came back once already during the
 * redesign; the test is here so a stray import does not quietly reinstate one.
 */
describe("what this release does not ship", () => {
  it("has no loading seal, no nav band and no menu", () => {
    for (const [path, text] of sources) {
      expect(text, path).not.toMatch(/sfwf-loading|LOADER_SEAL|NavBand|useContentFade/);
    }
  });
});
