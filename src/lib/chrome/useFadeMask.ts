"use client";

import { useEffect, type RefObject } from "react";

/** The band the copy is masked out under, and the ramp back to opaque below it. */
const BAND = 56;
const RAMP = 26;

/**
 * The nav band sits straight on the dye with no plate, no blur and no border, so page copy
 * scrolling up would collide with the wordmark. This masks it instead: content is fully
 * transparent for the first 56px under the viewport top, ramps to opaque over the next 26,
 * and is untouched below.
 *
 * It has to be a mask rather than a scrim. A gradient div would paint a wash of one flat
 * colour over the dye exactly where the dye is most visible — and the dye is a photograph
 * in motion, so no single colour could match it and any static scrim would separate from
 * it. `mask-image` removes the content's own alpha and composites nothing of its own, so
 * the dye passes through at full strength.
 *
 * Written straight to the node on a rAF-throttled scroll listener. This recomputes on every
 * frame of every scroll; routing it through React state would re-render the whole page each
 * time to change one string.
 *
 * `enabled` exists for the one page that cannot use this band. A mask clips every descendant,
 * so a page whose sticky chrome is taller than the nav — the programme's day rail sits *under*
 * it, inside <main> — gets the top of that chrome eaten by this 56px ramp. Such a page stands
 * this one down and masks its own regions around the rail instead. Anything left masked here
 * would be a second gradient over the same pixels, recomputed on the same frames.
 */
export function useFadeMask(ref: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Hand the element back exactly as it was found: a page that owns its own mask must not
       inherit a half-applied one from the last route. */
    if (!enabled) {
      el.style.maskImage = "";
      el.style.webkitMaskImage = "";
      return;
    }

    /* Honour the reader's setting by simply never masking: the effect exists to keep copy
       off the wordmark, and at rest there is nothing to keep off it. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let queued = false;

    /* The leading `#000` stop is the fail-safe, and it must never be removed.
     *
     * A gradient paints its first stop's colour everywhere above that stop, without limit.
     * With transparent first, any paint made from a stale scroll offset — a route change the
     * browser has not finished settling, a scroll this hook was never told about — pushes the
     * stops far down the element and turns the entire viewport invisible over a background
     * that stays: a blank page, curable only by the next repaint. That shipped, twice.
     *
     * The hard cut costs nothing when the paint is correct — everything above `-top` is above
     * the viewport, off screen by definition — and converts every stale paint from "the page
     * is blank" into "the top of the content is briefly unmasked", which the next scroll
     * event repaints out. Wrong stays wrong for a frame; it no longer stays catastrophic. */
    const paint = () => {
      queued = false;
      const { top } = el.getBoundingClientRect();
      const mask = still.matches
        ? "none"
        : `linear-gradient(to bottom,#000 ${-top}px,rgba(0,0,0,0) ${-top}px,rgba(0,0,0,0) ${-top + BAND}px,#000 ${-top + BAND + RAMP}px)`;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    paint();
    /* And again on the next frame.
     *
     * On a route change this effect can run before the browser has settled the new page's
     * scroll position, and the mask is written in the element's own coordinate space — so a
     * stale scroll puts the first stop hundreds of pixels down, and a gradient is its first
     * stop's colour all the way above it. That colour is transparent: the whole viewport goes
     * invisible over a background that stays, and only a scroll brings it back, because a
     * scroll is the thing that repaints it. Safari lands there arriving from a scrolled page;
     * Chromium happened not to, which is the sort of difference that ships. */
    const settle = requestAnimationFrame(paint);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    still.addEventListener("change", paint);
    return () => {
      cancelAnimationFrame(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      still.removeEventListener("change", paint);
    };
  }, [ref, enabled]);
}
