"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Reserved space the nav lives in: 56px inset + 46px mark. Not a bar height. */
export const NAV_H = 102;

export interface NavReveal {
  /** translateY for the nav band, from 0 (fully in) to -NAV_H (fully out). */
  readonly offset: number;
  /** True only for the one eased move — a fast flick that jumps a whole gap. */
  readonly snap: boolean;
}

/**
 * The nav lives in reserved space: NAV_H of empty room at the top of the page and at the
 * top of every [data-nav-anchor] section. Once it is in, it is sticky — reading up never
 * slides it away. Reading down pushes it out 1:1 with the section it belongs to, and it
 * stays out until a reserved gap brings it back.
 *
 * Ported from the prototype's inner-scroller version to window scroll, because an inner
 * scroller on a real site breaks iOS URL-bar collapse, anchor links and scroll restoration.
 * Nothing here ever writes scroll position.
 */
export function useNavReveal(): NavReveal {
  const [nav, setNav] = useState<NavReveal>({ offset: 0, snap: false });
  const state = useRef({ o: 0, y: 0, mode: "in" as "in" | "out" });
  const pathname = usePathname();

  /* A new screen starts with the nav in, at the top — it must not inherit the last one.
     This resets an external-system mirror (scroll position) on navigation, which is exactly
     one setState per route change, not a cascade. */
  useEffect(() => {
    state.current = { o: 0, y: 0, mode: "in" };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNav({ offset: 0, snap: false });
  }, [pathname]);

  useEffect(() => {
    let raf = 0;

    const apply = (o: number, snap: boolean) => {
      const s = state.current;
      if (o === s.o) return;
      s.o = o;
      setNav({ offset: o, snap });
    };

    /** Start of each reserved gap, in document coordinates. 0 is the page's own top gap. */
    const gaps = (): number[] => {
      const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-anchor]"));
      return [0, ...anchors.map((el) => el.getBoundingClientRect().top + window.scrollY)];
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const s = state.current;
        const y = window.scrollY;
        const yPrev = s.y;
        const d = y - yPrev;
        s.y = y;
        if (!d) return;

        const g = gaps();
        let above = 0;
        for (const gap of g) if (gap <= y) above = gap; // nearest gap at or above the top
        const glue = Math.max(-NAV_H, Math.min(0, above - y));

        if (s.mode === "in") {
          // Glued: rides out 1:1 reading on, rides back 1:1 on reversal, holds at 0.
          const o = Math.max(-NAV_H, Math.min(0, s.o - d));
          if (o <= -NAV_H) s.mode = "out";
          apply(o, false);
          return;
        }

        if (d > 0) {
          // Reading on: out stays out; a half-entered band rides back out 1:1.
          if (s.o <= -NAV_H) return;
          apply(Math.min(s.o, glue), false);
          return;
        }

        /* Reading up. It locks in only when a section's top edge crosses the viewport top —
           checked against the previous position, so a fast flick that jumps the whole gap
           between two frames still lands it. That is the only eased move in the mechanic. */
        for (const gap of g) {
          if (y <= gap && gap < yPrev) {
            s.mode = "in";
            apply(0, true);
            return;
          }
        }
        apply(glue, false);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return nav;
}
