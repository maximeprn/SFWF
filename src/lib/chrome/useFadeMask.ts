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
 */
export function useFadeMask(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Honour the reader's setting by simply never masking: the effect exists to keep copy
       off the wordmark, and at rest there is nothing to keep off it. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let queued = false;

    const paint = () => {
      queued = false;
      const { top } = el.getBoundingClientRect();
      const mask = still.matches
        ? "none"
        : `linear-gradient(to bottom,rgba(0,0,0,0) ${-top}px,rgba(0,0,0,0) ${-top + BAND}px,#000 ${-top + BAND + RAMP}px)`;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    still.addEventListener("change", paint);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      still.removeEventListener("change", paint);
    };
  }, [ref]);
}
