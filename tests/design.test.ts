import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BLOB_PATHS, bubbleShape, buttonShape, soft } from "@/lib/design/shapes";
import { NAV_CTA, NAV_LINKS } from "@/content/nav";

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

  it("gives every decorated boundary equal air above and below it", () => {
    // This drifted once and could not be seen in the source: the wave sat 71px under the
    // last host logo and 27px over the next label, because the space above it belonged to
    // the section's `padding-top` and the space below it to the flourish's own margin. Two
    // owners cannot agree. Both halves are the flourish's now, and they are written as a
    // two-value margin — there is no third value to set, so they cannot come apart.
    const wobble = sources.find(([path]) => path === "components/ui/Wobble.tsx")?.[1] ?? "";
    const flourish = wobble.split("export function WobbleFlourish")[1] ?? "";
    expect(flourish).toMatch(/margin: "var\(--flourish-air\) auto"/);
    expect(flourish).not.toMatch(/marginTop|marginBottom|marginBlockStart|marginBlockEnd/);

    // The other half of the rule: a section that opens with a flourish takes no top padding
    // of its own, or the gap above the wave grows by that padding and the gap below it does
    // not — which is the exact shape of the original bug.
    for (const [path, text] of sources) {
      if (path === "components/ui/Wobble.tsx" || !text.includes("<WobbleFlourish")) continue;
      expect(text, `${path} pads above its flourish`).not.toMatch(/padding:\s*"var\(--sec\)/);
    }

    // The hero's dateline is the same kind of element and had the same kind of bug, mirrored:
    // 80px under "ani sang Siargao" and 126px over the film, because the space above was the
    // headline's margin and the space below was the hero's padding plus the film's.
    const hero = sources.find(([path]) => path === "components/sections/home/Hero.tsx")?.[1] ?? "";
    const film = sources.find(([path]) => path === "components/sections/home/TheFilm.tsx")?.[1] ?? "";
    // Matched on shape, not on the exact value. The group's two ends are no longer equal —
    // the button joined it, and above is a headline meeting its dateline where below is the
    // hero meeting the film — but they are still one shorthand on one element, which is what
    // stops them drifting. A separate marginTop/marginBottom pair is what must not come back.
    expect(hero, "the dateline group still owns both sides in one shorthand").toMatch(
      /margin: "[^"]*var\(--sec\)[^"]*auto[^"]*"/,
    );
    expect(hero, "the headline took its bottom margin back").toMatch(/auto 0"/);
    expect(hero, "the hero pads below its dateline again").toMatch(/var\(--gutter\) 0"/);
    expect(film, "the film pads above itself again").toMatch(/padding: "0 var\(--gutter\)"/);
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
    // No filter stack, and the ground hex is never lightened or darkened to "lift" a
    // section off it.
    for (const [path, text] of sources) {
      expect(text, path).not.toMatch(/saturate\(|hue-rotate|brightness\(|contrast\(/i);
    }
  });

  it("lays no gradient over the violet", () => {
    // Phase 2 introduces gradients, so this can no longer be "none anywhere" — but each one
    // is a decision, and an undocumented fourth is the way a wash ends up on the dye. The
    // three that exist: the media-kit hatching inside a beige card, the nav fade mask
    // (which paints no colour at all — it removes the content's own alpha), and the film
    // caption scrim on top of a photograph.
    const ALLOWED = ["app/globals.css", "lib/chrome/useFadeMask.ts"];
    const sheet = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
    for (const [path, text] of page) {
      if (!/gradient/i.test(text)) continue;
      expect(ALLOWED, `${path} introduces a gradient — document it or take it out`).toContain(path);
    }
    // Whatever the allowlist says, nothing gradient-y lands on the ground itself.
    for (const rule of [/\.dye-layer\s*\{[^}]*\}/, /\bbody\s*\{[^}]*\}/, /\bhtml\s*\{[^}]*\}/]) {
      expect(sheet.match(rule)?.[0] ?? "", String(rule)).not.toMatch(/gradient/i);
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
 * The chrome. Phase 1 shipped without a nav band, a menu or a fade mask and had a test
 * saying so; phase 2 adds all three, so what is guarded here is the way they work — the
 * mask's numbers, and the fact that the menu never puts a scrim over the dye.
 */
describe("chrome", () => {
  const mask = readFileSync(new URL("../src/lib/chrome/useFadeMask.ts", import.meta.url), "utf8");
  const menu = readFileSync(
    new URL("../src/components/chrome/MobileMenu.tsx", import.meta.url),
    "utf8",
  );

  it("keeps the loading seal gone", () => {
    // The gold pour was dropped with the 2025 system and is not coming back in any phase.
    for (const [path, text] of sources) {
      expect(text, path).not.toMatch(/sfwf-loading|LOADER_SEAL/);
    }
  });

  it("masks the copy under the band rather than scrimming it", () => {
    // A gradient div would paint a flat wash over a moving photograph. mask-image composites
    // nothing of its own, so the dye passes through at full strength.
    expect(mask).toMatch(/maskImage/);
    expect(mask).toMatch(/const BAND = 56/);
    expect(mask).toMatch(/const RAMP = 26/);
  });

  it("gives the menu no scrim — the dye stays exactly as it was", () => {
    expect(stripComments(menu)).not.toMatch(/background(Color)?\s*:/);
  });

  it("carries the three routes and exactly one primary button", () => {
    // README §1: "with View Program pinned right as the one primary button." One button,
    // one label, every route — not a per-page CTA, which is what the per-section prototypes
    // suggested and what this shipped by mistake.
    expect(NAV_LINKS.map((l) => l.href)).toEqual(["/", "/program", "/press"]);
    expect(NAV_CTA.label).toBe("View Program");
    expect(NAV_CTA.href).toBe("/program");
  });
});
