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
  /** Scroll position this offset was read at. The content mask needs it — see below. */
  readonly y: number;
}

/** The fade: cut for the band's height less 8px, then ramping back over 42px. */
const MASK_HEAD = 8;
const MASK_TAIL = 34;

type State = { o: number; y: number; mode: "in" | "out" };

/**
 * How long after a layout change the scroll position stops counting as travel.
 *
 * The URL bar does not resize the viewport in one step — it animates, firing resizes and
 * dragging the scroll position along with it for the whole sweep. Re-baselining once at
 * the first resize therefore fixes nothing: the frames after it still read the rest of the
 * sweep as the reader heading down the page. Every layout change pushes this window out
 * again, so it stays open for the animation and closes shortly after it stops.
 */
const LAYOUT_QUIET_MS = 120;

/**
 * Where each reserved gap starts, in document coordinates. 0 is the page's own top gap.
 *
 * Measured on layout changes rather than per scroll frame: the numbers only move when the
 * document does, and reading them mid-resize returns values that are still in flux.
 */
function measureGaps(): number[] {
  const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-anchor]"));
  return [0, ...anchors.map((el) => el.getBoundingClientRect().top + window.scrollY)];
}

/**
 * Scroll position, clamped to the range the document actually has.
 *
 * iOS reports positions outside that range while rubber-banding, and the spring back out
 * of an overscroll arrives as a downward delta — which the mechanic below cannot tell
 * apart from the reader deciding to head down the page. Unclamped, that is what threw the
 * nav away again at the top of a fast flick up.
 */
function scrollTop(): number {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(window.scrollY, max));
}

/** One frame of the mechanic. Returns the band's new offset, or null to hold it. */
function advance(s: State, gaps: number[], y: number): { offset: number; snap: boolean } | null {
  const yPrev = s.y;
  const d = y - yPrev;
  s.y = y;
  if (!d) return null;

  let above = 0;
  for (const gap of gaps) if (gap <= y) above = gap; // nearest gap at or above the top
  const glue = Math.max(-NAV_H, Math.min(0, above - y));

  if (s.mode === "in") {
    // Glued: rides out 1:1 reading on, rides back 1:1 on reversal, holds at 0.
    const o = Math.max(-NAV_H, Math.min(0, s.o - d));
    if (o <= -NAV_H) s.mode = "out";
    return { offset: o, snap: false };
  }

  if (d > 0) {
    // Reading on: out stays out; a half-entered band rides back out 1:1.
    if (s.o <= -NAV_H) return null;
    return { offset: Math.min(s.o, glue), snap: false };
  }

  /* Reading up. It locks in only when a section's top edge crosses the viewport top —
     checked against the previous position, so a fast flick that jumps the whole gap
     between two frames still lands it. That is the only eased move in the mechanic. */
  for (const gap of gaps) {
    if (y <= gap && gap < yPrev) {
      s.mode = "in";
      return { offset: 0, snap: true };
    }
  }
  return { offset: glue, snap: false };
}

/**
 * The content fade — page copy cut for the band's height and ramping back over 42px, so
 * text evaporates a few pixels before the mark instead of sliding under it.
 *
 * A mask, not a scrim. It removes the content's own alpha and paints nothing of its own,
 * so the dye carries through the gap at full strength. A gradient overlay would have to
 * pick a flat colour to stand in for a moving photograph, and would separate from it the
 * moment the dye shifted.
 *
 * The spec anchors this to a scroller whose box is the viewport. This site scrolls the
 * window instead — deliberately, since an inner scroller breaks iOS URL-bar collapse — so
 * `main`'s box starts at the top of the document, not of the viewport, and every stop
 * carries the scroll position to compensate. That is also why the mask is dropped outright
 * once the band is out: recomputing it costs a repaint of the masked layer, and the band
 * is only ever on screen for NAV_H of travel around a reserved gap.
 */
export function contentMask(nav: NavReveal): string | undefined {
  const band = NAV_H + nav.offset; // the band's visible height right now, NAV_H → 0
  if (band <= 2) return undefined;
  const clear = nav.y + Math.max(0, band - MASK_HEAD);
  const opaque = nav.y + band + MASK_TAIL;
  /* Above the viewport top the mask stays opaque — nothing up there should be cut. */
  return (
    `linear-gradient(to bottom,#000 0px,#000 ${nav.y}px,` +
    `rgba(0,0,0,0) ${nav.y}px,rgba(0,0,0,0) ${clear}px,#000 ${opaque}px)`
  );
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
 *
 * The mechanic reads travel, so it is only as good as its idea of what counts as travel.
 * On a phone two things move the page without the reader touching it — the URL bar
 * resizing the viewport, and rubber-band overscroll — and both used to arrive here as
 * ordinary downward scrolling. That is why the band behaved on a desktop browser and not
 * on a phone. Both are now absorbed rather than read.
 */
export function useNavReveal(): NavReveal {
  const [nav, setNav] = useState<NavReveal>({ offset: 0, snap: false, y: 0 });
  const state = useRef<State>({ o: 0, y: 0, mode: "in" });
  const gaps = useRef<number[]>([]);
  const pathname = usePathname();

  /* A new screen starts with the nav in, at the top — it must not inherit the last one.
     This resets an external-system mirror (scroll position) on navigation, which is exactly
     one setState per route change, not a cascade. */
  useEffect(() => {
    const s = state.current;
    s.o = 0;
    s.y = scrollTop();
    s.mode = "in";
    gaps.current = measureGaps();
    setNav({ offset: 0, snap: false, y: s.y });
  }, [pathname]);

  useEffect(() => {
    const s = state.current;
    let raf = 0;
    let settle = 0;
    let quietUntil = 0;

    const frame = () => {
      raf = 0;
      const y = scrollTop();
      /* Inside the window the page is moving under the reader, not because of them.
         Follow the position so no travel accumulates, and leave the band where it is. */
      if (performance.now() < quietUntil) {
        s.y = y;
        return;
      }
      const next = advance(s, gaps.current, y);
      if (!next || next.offset === s.o) return;
      s.o = next.offset;
      /* The mask is derived from the offset and the position it was read at, so both
         travel together in one commit — the fade can never lag the band by a frame. */
      setNav({ ...next, y });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const remeasure = () => {
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        gaps.current = measureGaps();
      }, 200);
    };

    /* The viewport itself moved — the URL bar retracting or returning. The reader did not
       scroll, so hold travel for the sweep and take the position it leaves us at. */
    const onViewportChange = () => {
      quietUntil = performance.now() + LAYOUT_QUIET_MS;
      s.y = scrollTop();
      remeasure();
    };

    /* The document reflowed under a reader who is still scrolling for real — an image
       landed, a story bubble unfolded. Only the gap positions are stale. Deliberately no
       quiet window and no re-baselining here: both would swallow genuine travel, and a
       swallowed frame at the top of the page is a frame the band never locks back in on. */
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("resize", onViewportChange);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
    };
  }, []);

  return nav;
}
