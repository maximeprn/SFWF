import { describe, expect, it } from "vitest";
import { NAV_H, contentMask } from "@/lib/useContentFade";

/**
 * The fade under the nav band hangs from the top of the viewport, wherever the reader is.
 * The regression this guards: stops anchored to a stale scroll position, which left copy
 * sliding under the mark fully opaque everywhere except where they were last written.
 */
describe("the content fade under the nav band", () => {
  it("cuts the band's height less 8px, then ramps back over 42px", () => {
    expect(contentMask(0)).toBe(
      `linear-gradient(to bottom,rgba(0,0,0,0) ${NAV_H - 8}px,#000 ${NAV_H + 34}px)`,
    );
  });

  it("carries the scroll position, so the zone stays put in the viewport", () => {
    expect(contentMask(500)).toBe(
      "linear-gradient(to bottom,rgba(0,0,0,0) 594px,#000 636px)",
    );
    expect(contentMask(1440)).toBe(
      "linear-gradient(to bottom,rgba(0,0,0,0) 1534px,#000 1576px)",
    );
  });

  it("keeps the ramp 42px deep at every position", () => {
    for (const y of [0, 37, 500, 1440, 9999]) {
      const [clear, opaque] = (contentMask(y).match(/(\d+)px/g) ?? []).map((s) =>
        parseInt(s, 10),
      );
      expect(opaque - clear).toBe(42);
      expect(clear - y).toBe(NAV_H - 8);
    }
  });
});
