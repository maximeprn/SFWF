"use client";

import { useEffect, type RefObject } from "react";
import { paintUntilSettled } from "@/lib/chrome/paintUntilSettled";

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
 * The band is re-measured every scroll frame because the rail's height is not a constant —
 * the nav alone differs across the site's one breakpoint (58px wide, 76px narrow), and the
 * chips are two lines on desktop against one on mobile. Written straight to the node: this
 * runs on every frame of every scroll, and routing it through state would re-render the page
 * to change one string.
 */
export function useProgramContentMask(
  ref: RefObject<HTMLElement | null>,
  railRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let queued = false;

    const paint = () => {
      queued = false;
      const { top } = el.getBoundingClientRect();
      const header = document.querySelector("header");
      const navHeight = header?.getBoundingClientRect().height ?? 0;
      const railHeight = railRef?.current?.getBoundingClientRect().height ?? 0;
      const band = navHeight + railHeight;
      /* The leading `#000` is the fail-safe — see `useFadeMask` for the full account. A
         gradient is its first stop's colour everywhere above it, so with transparent first a
         stale paint blanked the whole viewport; opaque first, the same mistake shows the
         content unmasked for a beat instead, and the next scroll event repaints it out. */
      const mask = still.matches
        ? "none"
        : `linear-gradient(to bottom,` +
          `#000 ${-top}px,` +
          `rgba(0,0,0,0) ${-top}px,` +
          `rgba(0,0,0,0) ${-top + band}px,` +
          `#000 ${-top + band + RAMP}px)`;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    /* Repainted until the page stops moving, for the same reason as `useFadeMask` — this can
       run before a new route's scroll has settled, and a mask written from a stale offset is
       transparent across the whole viewport. */
    const stopSettling = paintUntilSettled(paint);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    still.addEventListener("change", paint);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onScroll);
    vv?.addEventListener("scroll", onScroll);
    return () => {
      stopSettling();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      still.removeEventListener("change", paint);
      vv?.removeEventListener("resize", onScroll);
      vv?.removeEventListener("scroll", onScroll);
      el.style.maskImage = "";
      el.style.webkitMaskImage = "";
    };
  }, [ref, railRef]);
}
