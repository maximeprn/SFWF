import { describe, expect, it } from "vitest";
import { NAV_H, contentMask } from "@/lib/useNavReveal";

/**
 * The fade under the nav band hangs from the top of the viewport, wherever the reader is.
 * The regression this guards: stops anchored to the scroll position of the band's last
 * movement, which left copy sliding under the mark fully opaque everywhere except the gap
 * where the band had locked in.
 */
describe("the content fade under the nav band", () => {
  it("hangs the zone from the viewport top and follows the reader 1:1", () => {
    expect(contentMask(0, 0)).toBe("linear-gradient(to bottom,rgba(0,0,0,0) 94px,#000 136px)");
    // Reading up with the band pinned at 0 — same zone, carried to the new position.
    expect(contentMask(0, 500)).toBe(
      "linear-gradient(to bottom,rgba(0,0,0,0) 594px,#000 636px)",
    );
  });

  it("shrinks the zone with the band as it rides out", () => {
    // Band at -46: 56px visible, so the ramp runs band - 8 → band + 34 above the reader.
    expect(contentMask(-46, 500)).toBe(
      "linear-gradient(to bottom,rgba(0,0,0,0) 548px,#000 590px)",
    );
  });

  it("never lets the clear stop go negative when the band is nearly out", () => {
    // Band at 6px visible: band - 8 would be -2; the guard pins it to the viewport top.
    expect(contentMask(-(NAV_H - 6), 0)).toBe(
      "linear-gradient(to bottom,rgba(0,0,0,0) 0px,#000 40px)",
    );
  });

  it("drops the mask entirely once the band is out", () => {
    expect(contentMask(-NAV_H, 800)).toBeUndefined();
    expect(contentMask(-100, 800)).toBeUndefined(); // band 2 — the <= 2 cutoff
  });
});
