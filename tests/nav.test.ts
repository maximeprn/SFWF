import { describe, expect, it } from "vitest";
import { NAV_H, advance, contentMask } from "@/lib/useNavReveal";

/**
 * The band mechanic: fixed chrome that hides riding down and returns the moment upward
 * travel reads as intent. Mirrors the hook's caller contract — the caller commits the
 * returned offset back onto the state.
 */
describe("the band mechanic", () => {
  const fresh = () => ({ o: 0, y: 0, up: 0 });
  const step = (s: { o: number; y: number; up: number }, y: number) => {
    const next = advance(s, y);
    if (next) s.o = next.offset;
    return next;
  };

  it("rides out 1:1 reading down, and stays out", () => {
    const s = fresh();
    expect(step(s, 40)).toEqual({ offset: -40, snap: false });
    expect(step(s, 200)).toEqual({ offset: -NAV_H, snap: false });
    expect(step(s, 400)).toBeNull(); // already out — reading on costs nothing
  });

  it("returns, eased, as soon as upward travel reads as intent", () => {
    const s = fresh();
    step(s, 400);
    expect(step(s, 396)).toBeNull(); // 4px — momentum jitter, hold
    expect(step(s, 388)).toEqual({ offset: 0, snap: true }); // 12px accumulated — return
  });

  it("forgets upward intent when the reader turns back down", () => {
    const s = fresh();
    step(s, 400);
    step(s, 394); // 6px up — under the threshold
    step(s, 420); // down again — the accumulator resets
    expect(step(s, 414)).toBeNull(); // a fresh 6px is still under it
    expect(step(s, 405)).toEqual({ offset: 0, snap: true });
  });

  it("holds without travel", () => {
    const s = fresh();
    step(s, 300);
    expect(advance(s, 300)).toBeNull();
  });
});

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
