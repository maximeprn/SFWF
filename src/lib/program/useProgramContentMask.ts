"use client";

import { useEffect, type RefObject } from "react";

/** The ramp back to opaque, below the band — same value the sitewide mask uses. */
const RAMP = 26;

/**
 * The programme's own fade mask, measured rather than assumed.
 *
 * The sitewide mask (`useFadeMask`) stands down on this route, because it masks the whole of
 * <main> and the day rail is sticky chrome *inside* <main> — its 56px band put a 26px ramp
 * straight across the top of the chips, fading them to 8% alpha at their own top edge. So the
 * page masks around the rail instead, in two disjoint regions, and the rail itself is left in
 * no mask at all:
 *
 *   · the hero, above the rail, with `railRef` omitted — it only has the nav to clear, and it
 *     is the region that would otherwise slide across the wordmark on the way up;
 *   · the content, below the rail, with `railRef` given — nav *plus* rail, so a card dissolves
 *     before it reaches the chips rather than sliding behind them.
 *
 * Neither band ever reaches the rail, so nothing recalculates a fade between the nav and the
 * bottom of the chips: that whole strip is one solid block.
 *
 * ## Two stops, not three, and nothing measured on a scroll frame
 *
 * A gradient is its first stop's colour everywhere above that stop, so the hidden band needs
 * no top edge: one transparent stop at the foot of the sticky chrome hides everything above
 * it, to any height, for free. Only the ramp has a position worth computing. That is the whole
 * shape of this mask now — an unbounded hidden region, and one line under it that has to land
 * in the right place.
 *
 * It has to land there on the frame the page moves, which is the hard part: `mask-image` is
 * positioned in the element's own box, the element scrolls, and CSS has no viewport-anchored
 * mask to hand — `mask-attachment` is not in Blink at any prefix, so the position can only
 * come from JavaScript. What can be removed is every reason for that JavaScript to be late:
 *
 *   · **Nothing is *searched for* while scrolling.** The band above — the nav's height plus
 *     the rail's — is a layout fact, not a scroll fact, so it is read from a `ResizeObserver`
 *     and cached. A scroll frame used to run `document.querySelector("header")` and measure
 *     three elements to ask a question whose answer had not changed.
 *   · **The element's own position is still read every frame, on purpose.** It is one
 *     `getBoundingClientRect` on a box whose layout the scroll has not dirtied, so it is a
 *     cached read — and caching it instead was tried and was wrong: the page's document
 *     position settles a few pixels after a route change, nothing fires a resize when it
 *     does, and the fade line then sits 6px high for the rest of the visit. A value that is
 *     cheap and exact beats one that is free and drifts.
 *   · **The paint is synchronous.** It used to be deferred to `requestAnimationFrame`, which
 *     buys a frame of latency in exchange for throttling that a string assignment does not
 *     need. On iOS that frame is the difference between the mask landing with the scroll and
 *     landing after it.
 *   · **The band never moves on purpose.** It used to be widened by a speed-derived slack, in
 *     50px steps, downward travel only — so the fade line sat 200px lower going down than
 *     going up and snapped between the two on every direction change. Measured on a
 *     phone-width flick: the edge crossed 200px of the viewport, in single-frame jumps of the
 *     full 200. The cure was worse than the lag. An edge that translates is far more visible
 *     than one a few pixels late, and reversing direction moved it the whole width of the
 *     guard — which is the blinking this hook was reported for.
 *
 * What is left is the main thread's own latency, which only a custom scroll container could
 * remove entirely — CSS has no viewport-anchored mask to hand off to, `mask-attachment` being
 * absent from Blink at every prefix.
 */
export function useProgramContentMask(
  ref: RefObject<HTMLElement | null>,
  railRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    /* How much chrome stands above the element. A layout fact, so it is cached. */
    let band = 0;
    let drawn = Number.NaN;

    const paint = () => {
      /* One read, of one box the scroll has not dirtied. */
      const hidden = Math.round(band - el.getBoundingClientRect().top);
      if (hidden === drawn) return;
      drawn = hidden;
      const mask = still.matches
        ? "none"
        : `linear-gradient(to bottom,rgba(0,0,0,0) ${hidden}px,#000 ${hidden + RAMP}px)`;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
    };

    /* The chrome above is re-found on every measure rather than captured once. A route change
       swaps the page out under this hook, and the nav queried during that commit can be the
       outgoing one — a node about to be detached, whose height then never changes again.
       Observing that is observing nothing. */
    let watchedNav: Element | null = null;
    let watchedRail: Element | null = null;

    const measure = () => {
      const nav = document.querySelector("header");
      const rail = railRef?.current ?? null;
      if (nav !== watchedNav) {
        if (watchedNav) ro.unobserve(watchedNav);
        if (nav) ro.observe(nav);
        watchedNav = nav;
      }
      if (rail !== watchedRail) {
        if (watchedRail) ro.unobserve(watchedRail);
        if (rail) ro.observe(rail);
        watchedRail = rail;
      }
      band =
        (nav?.getBoundingClientRect().height ?? 0) + (rail?.getBoundingClientRect().height ?? 0);
      drawn = Number.NaN;
      paint();
    };

    const ro = new ResizeObserver(measure);
    measure();
    /* And again on the next frame — this can run before the new page's scroll has settled,
       and the mask is written in the element's own coordinate space, so a stale reading puts
       the hidden stop hundreds of pixels down, which a gradient reads as "transparent all the
       way up": the whole viewport disappears until something repaints it. Safari lands there
       arriving from a scrolled page; Chromium happened not to, which is the sort of difference
       that ships. */
    const settle = requestAnimationFrame(measure);
    /* A webfont swap resizes the nav and fires no resize event of its own. */
    void document.fonts?.ready.then(measure);

    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", measure);
    still.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(settle);
      ro.disconnect();
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", measure);
      still.removeEventListener("change", measure);
      el.style.maskImage = "";
      el.style.webkitMaskImage = "";
    };
  }, [ref, railRef]);
}
