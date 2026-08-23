import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  BLOB_PATHS,
  MEDIA_BLOB_PATH,
  MEDIA_SAFE,
  bubbleShape,
  buttonShape,
  soft,
} from "@/lib/design/shapes";
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

  /**
   * Every collapsing track and the title's own growth run on `--open`; only the kicker and
   * the mark fade early, at 260ms, so their text is gone before the row has finished
   * closing. A second duration anywhere in this component is what made opening and closing
   * look like two different moves.
   */
  it("runs the whole bubble on one clock, with one deliberate exception", () => {
    for (const rule of [".kicker-row", ".mark-slot", ".bubble-title"]) {
      const block = css.slice(css.indexOf(`${rule} {`));
      expect(block.slice(0, block.indexOf("}")), `${rule} is off the shared curve`).toMatch(
        /var\(--open\) var\(--ease\)/,
      );
    }
    expect(css.match(/opacity 0\.26s var\(--ease\)/g)).toHaveLength(2);
  });
});

/**
 * The bubble's two flags are not interchangeable, and mixing them up is the one bug this
 * component has actually shipped: the header and the padding were bound to `open`, which
 * only goes false *after* the animation has run, so closing collapsed the detail first and
 * snapped the header back afterwards. One gesture, read as two events.
 */
describe("the event bubble's state machine", () => {
  const bubble = stripComments(
    readFileSync(join(SRC, "components/sections/program/EventBubble.tsx"), "utf8"),
  );

  it("drives every transition from `grown`, never from `open`", () => {
    /* `open` may do exactly two things: label the control, and mount the detail. */
    const uses = bubble.match(/\bopen\b(?! =)/g) ?? [];
    expect(uses.length, "`open` reaches something it should not").toBe(3);
    expect(bubble).toMatch(/aria-expanded=\{open\}/);
    expect(bubble).toMatch(/\{open && \(/);
    expect(bubble).toMatch(/padding: grown/);
  });

  it("collapses the closed-only rows instead of unmounting them", () => {
    /* A ternary around either one would bring back the snap it exists to prevent. */
    expect(bubble).not.toMatch(/\{!open &&/);
    expect(bubble).toMatch(/className="kicker-row"/);
    expect(bubble).toMatch(/className="mark-slot"/);
    expect(bubble).toMatch(/gridTemplateRows: grown \? "0fr" : "1fr"/);
    expect(bubble).toMatch(/gridTemplateColumns: grown \? "0fr" : "1fr"/);
  });

/**
 * The programme's fade mask was reported as unusable on a phone: the fade line blinked and
 * swam while scrolling. The cause was compensation, not lag — a speed-derived slack widened
 * the hidden band by up to 200px, in 50px steps, on downward travel only, so the line sat
 * 200px lower going down than going up and snapped the whole way on every direction change.
 * Measured on a phone-width flick before the fix: 200px of swing, in single-frame jumps of
 * 200. After: the edge holds its exact position, every frame, in both directions.
 */
describe("the programme's fade mask", () => {
  const mask = stripComments(
    readFileSync(join(SRC, "lib/program/useProgramContentMask.ts"), "utf8"),
  );

  it("never widens its band to chase the scroll", () => {
    expect(mask, "the slack is the blink").not.toMatch(/createScrollSlack|scrollSlack/);
  });

  it("hides everything above the band with one stop rather than bounding it", () => {
    /* A gradient is its first stop's colour all the way above it, so the hidden region needs
       no top edge — and an edge computed there is one more number that can be wrong. */
    const stops = mask.match(/rgba\(0,0,0,0\)|#000/g) ?? [];
    expect(stops, "two stops: hidden, then the ramp").toHaveLength(2);
  });

  it("paints straight from the scroll listener, not a frame later", () => {
    expect(mask).toMatch(/addEventListener\("scroll", paint/);
    expect(mask, "a rAF hop here is a frame of lag on iOS").not.toMatch(
      /requestAnimationFrame\(paint\)/,
    );
  });

  it("keeps the search for the chrome off the scroll path", () => {
    /* `querySelector` on every scroll frame was the real cost; the element's own rect is one
       cached read and has to stay, because caching it instead drifts after a route change. */
    const paint = mask.match(/const paint = \(\) => \{([\s\S]*?)\n {4}\};/)?.[1];
    expect(paint, "the paint moved or was renamed").toBeTruthy();
    expect(paint).not.toMatch(/querySelector/);
    expect(paint).toMatch(/getBoundingClientRect/);
  });
});

/**
 * The day swap has one rule and it is the whole point of it: nothing that *replaces content*
 * may happen on the frame of the click. The chip, the fold and the scroll answer immediately;
 * the list, the open bubbles and the page height all wait until the list is invisible. Wire
 * any one of them back to `pick` and the flash comes straight back.
 */
describe("the day swap", () => {
  const program = stripComments(
    readFileSync(join(SRC, "components/sections/program/ProgramSection.tsx"), "utf8"),
  );
  const swap = stripComments(readFileSync(join(SRC, "lib/program/useDaySwap.ts"), "utf8"));

  it("renders the day the list is showing, never the day the rail is set to", () => {
    expect(program).toMatch(/const shown = showing === "all"/);
    expect(program).toMatch(/showing === "all"\n\s+\? `\$\{ALL_EVENTS\.length\}/);
    expect(program, "`pick` may reach the rail and nothing else").not.toMatch(/DAYS\[pick\]/);
  });

  it("keeps the click handler to what answers the click", () => {
    const body = program.match(/const onPick = \(day: DayPick\) => \{([\s\S]*?)\n {2}\};/)?.[1];
    expect(body, "the handler moved or was renamed").toBeTruthy();
    expect(body).not.toMatch(/showOpen|DAYS\[/);
    expect(program.match(/showOpen\(/g), "one caller, inside the swap").toHaveLength(1);
  });

  it("leaves faster than it arrives", () => {
    const out = Number(swap.match(/OUT_MS = (\d+)/)?.[1]);
    const enter = Number(swap.match(/IN = "opacity \.(\d+)s/)?.[1]) * 10;
    expect(out).toBeGreaterThan(0);
    /* The exit is dead time the reader is waiting through; the entrance is the thing they
       came for. Inverting the two makes the rail feel slow to answer. */
    expect(out).toBeLessThan(enter);
  });

  it("stands down entirely under prefers-reduced-motion", () => {
    expect(swap).toMatch(/transition: reduced \? "none"/);
    expect(swap).toMatch(/if \(reduced\) \{\n\s+commit\(\);/);
  });
});

  it("grows the title rather than swapping it for a bigger one", () => {
    expect(bubble).toMatch(/fontSize: grown/);
    expect(bubble.match(/className="bubble-title"/g), "one title, not two").toHaveLength(1);
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
    // is a decision, and an undocumented fifth is the way a wash ends up on the dye. The
    // four that exist: the media-kit hatching inside a beige card, the nav fade mask, the
    // programme's own taller fade mask under its sticky day rail, and the film caption
    // scrim on top of a photograph. Both masks paint no colour at all — they remove the
    // content's own alpha, which is exactly what lets the dye through at full strength.
    const ALLOWED = [
      "app/globals.css",
      "lib/chrome/useFadeMask.ts",
      "lib/program/useProgramContentMask.ts",
    ];
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

/**
 * The media frames. The browser's own controls used to sit hard against the bottom edge, and
 * the outline was cut shallow to stop them being clipped; the bar is drawn now, so the rule
 * runs the other way — the outline is fixed and the controls have to stay inside it.
 */
describe("media frames", () => {
  /** The path as a polygon, so a point can be tested against it. */
  const flatten = (d: string, steps = 64): readonly (readonly [number, number])[] => {
    const n = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
    const points: [number, number][] = [[n[0]!, n[1]!]];
    let [px, py] = [n[0]!, n[1]!];
    for (let i = 2; i + 5 < n.length; i += 6) {
      const [x1, y1, x2, y2, x, y] = n.slice(i, i + 6) as [number, number, number, number, number, number];
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        points.push([
          u ** 3 * px + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x,
          u ** 3 * py + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y,
        ]);
      }
      [px, py] = [x, y];
    }
    return points;
  };

  const inside = (poly: readonly (readonly [number, number])[], x: number, y: number): boolean => {
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i]!;
      const [xj, yj] = poly[j]!;
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };

  it("holds the drawn control bar inside the outline, at every frame width", () => {
    // Both are in objectBoundingBox units, which is the whole point: one comparison covers
    // the film at 268px, the strip at 208px, and every viewport between them.
    const outline = flatten(MEDIA_BLOB_PATH);
    const { side, bottom } = MEDIA_SAFE;
    for (const x of [side, 1 - side]) {
      // Down from mid-height, so a bar that grows taller is covered too — though it is the
      // two bottom corners that the outline actually bites at.
      for (const y of [0.5, 0.8, 1 - bottom]) {
        expect(inside(outline, x, y), `control corner ${x} , ${y}`).toBe(true);
      }
    }
  });

  it("hands the browser's own controls back", () => {
    // A bare `controls` attribute returns the grey scrubber the hand-cut edge was flattened
    // for, and puts two players on one frame.
    const frame = sources.find(([path]) => path === "components/ui/VideoFrame.tsx")?.[1] ?? "";
    expect(frame).not.toMatch(/^\s*controls\s*$/m);
  });
});

/**
 * The button press system: a raised side that goes flush on press, colour inverting by
 * variant, one global binding rather than one per button. Loosely mirrors the same
 * discipline as the bubble's state machine above — the one bug worth guarding against here
 * is a button whose rest colour is set directly rather than through `--btn-fill`, since a
 * direct `background` on the inline style would always out-rank `.pressed` and the press
 * would silently stop showing.
 */
describe("the button press system", () => {
  const pressFiles = [
    "components/sections/home/Hero.tsx",
    "components/sections/home/Purpose.tsx",
    "components/chrome/NavBand.tsx",
    "components/chrome/BackToTop.tsx",
    "components/sections/press/PressSection.tsx",
    "components/sections/program/BubbleDetail.tsx",
  ].map((path) => [path, stripComments(readFileSync(join(SRC, path), "utf8"))] as const);

  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const tokens = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

  it("never sets a press-btn's background directly — only through --btn-fill", () => {
    for (const [path, text] of pressFiles) {
      for (const match of text.matchAll(/className="[^"]*\bpress-btn\b[^"]*"[\s\S]{0,400}?\}/g)) {
        expect(match[0], `${path} sets background directly on a press-btn`).not.toMatch(
          /[^-]background:\s*["']var\(--(?:orange|beige|ground|cream)\)/,
        );
      }
    }
  });

  it("gives every press-btn one of the four named inversion targets", () => {
    for (const [path, text] of pressFiles) {
      const buttons = text.match(/className="[^"]*\bpress-btn\b[^"]*"/g) ?? [];
      const targets = text.match(/data-press="(?:beige|orange|ground|cream)"/g) ?? [];
      expect(targets.length, `${path} has a press-btn with no (or an unknown) data-press`).toBe(
        buttons.length,
      );
    }
  });

  it("keeps the raise and the drawn side off `--bubble-edge`", () => {
    expect(tokens).toMatch(/--raise: 2\.5px/);
    expect(css).toMatch(/\.slab-side \{/);
  });

  it("holds a press for the reference's own timings", () => {
    expect(css).toMatch(/transform 0\.07s cubic-bezier\(0\.3, 0\.9, 0\.4, 1\)/);
    expect(css).toMatch(/transform 0\.16s cubic-bezier\(0\.2, 0\.8, 0\.3, 1\)/);
  });

  it("leaves no dead hover token behind", () => {
    // These two were replaced outright by the inversion targets above, not layered under
    // them — a leftover reference means the swap missed a spot.
    expect(tokens).not.toMatch(/--orange-hover/);
    expect(css).not.toMatch(/cta-in-bubble/);
  });

  it("binds the interaction once, not per element", () => {
    const src = stripComments(readFileSync(join(SRC, "lib/ui/pressSystem.ts"), "utf8"));
    expect(src).toMatch(/addEventListener\(\s*"pointerdown"/);
    expect(src).toMatch(/let bound = false/);
  });
});
