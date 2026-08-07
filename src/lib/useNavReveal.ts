"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";

/** Reserved space the nav lives in: 56px inset + 46px mark. Not a bar height. */
export const NAV_H = 102;

export interface NavReveal {
  /** translateY for the nav band, from 0 (fully in) to -NAV_H (fully out). */
  readonly offset: number;
  /** True only for the one eased move — the return when the reader turns back up. */
  readonly snap: boolean;
}

/** The fade: cut for the band's height less 8px, then ramping back over 42px. */
const MASK_HEAD = 8;
const MASK_TAIL = 34;

/**
 * Upward travel that counts as intent to read up rather than momentum jitter. Below this
 * the band holds; at it, the band returns. Small enough to feel instant under a finger,
 * large enough that the wobble at the end of an iOS fling cannot flicker the band in.
 */
const REVEAL_AFTER = 8;

type State = { o: number; y: number; up: number };

/**
 * How long after a layout change the scroll position stops counting as travel.
 *
 * The URL bar does not resize the viewport in one step — it animates, firing resizes and
 * dragging the scroll position along with it for the whole sweep. Re-baselining once at
 * the first resize therefore fixes nothing: the frames after it still read the rest of the
 * sweep as the reader scrolling. Every layout change pushes this window out again, so it
 * stays open for the animation and closes shortly after it stops.
 */
const LAYOUT_QUIET_MS = 120;

/**
 * Scroll position, clamped to the range the document actually has.
 *
 * iOS reports positions outside that range while rubber-banding, and the spring back out
 * of an overscroll arrives as travel the mechanic cannot tell apart from the reader's own.
 * Unclamped, the top-of-page bounce reads as a scroll down — and hides the band the moment
 * it returned.
 */
function scrollTop(): number {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(window.scrollY, max));
}

/**
 * One frame of the mechanic. Returns the band's new offset, or null to hold it.
 *
 * Reading down, the band rides out 1:1 with the finger and stays out. The moment upward
 * travel reads as intent — REVEAL_AFTER accumulated pixels — it comes back, eased. This
 * replaces the prototype's reserved-gap mechanic, which held the band out until a section
 * boundary crossed the viewport top: on phones that read as the nav failing to return.
 */
export function advance(s: State, y: number): { offset: number; snap: boolean } | null {
  const d = y - s.y;
  s.y = y;
  if (!d) return null;

  if (d > 0) {
    // Reading on: ride out 1:1, and forget any upward intent that was accumulating.
    s.up = 0;
    const o = Math.max(-NAV_H, Math.min(0, s.o - d));
    return o === s.o ? null : { offset: o, snap: false };
  }

  s.up -= d; // d is negative — accumulate upward travel
  if (s.o === 0) return null;
  if (s.up >= REVEAL_AFTER || y <= 0) {
    s.up = 0;
    return { offset: 0, snap: true };
  }
  return null;
}

/**
 * The content fade — page copy cut for the band's visible height and ramping back to
 * opaque over 42px, so text evaporates a few pixels before the mark instead of sliding
 * under it.
 *
 * A mask, not a scrim. It removes the content's own alpha and paints nothing of its own,
 * so the dye carries through the gap at full strength. A gradient overlay would have to
 * pick a flat colour to stand in for a moving photograph, and would separate from it the
 * moment the dye shifted.
 *
 * The zone hangs from the top of the VIEWPORT — wherever the reader is, whatever the band
 * is doing. Copy passing under the mark is dissolving at any scroll position, not only
 * around the gap where the band last moved. The spec's prototype got that for free by
 * masking a scroller whose box is the viewport; this site scrolls the window, so the
 * masked element's box is the document and the stops must carry the current scroll
 * position — which is why the mask has to be rewritten as the reader moves, not only when
 * the band does. Past band <= 2 it is dropped entirely rather than left as a no-op
 * composite on every frame of the reading-down scrolling readers do most.
 */
export function contentMask(offset: number, y: number): string | undefined {
  const band = NAV_H + offset; // the band's visible height right now, NAV_H → 0
  if (band <= 2) return undefined;
  const clear = y + Math.max(0, band - MASK_HEAD);
  const opaque = y + band + MASK_TAIL;
  return `linear-gradient(to bottom,rgba(0,0,0,0) ${clear}px,#000 ${opaque}px)`;
}

/**
 * Writes the fade onto the masked element. The mask changes on every scroll frame the
 * band is on screen — too often for React state — so it goes straight to the style and
 * stays out of JSX entirely, where a render could clobber it with a stale value. Both
 * spellings are required: Safari, iOS included, still needs the prefix, and the
 * unprefixed property alone does nothing there — the exact platform this fade is for.
 */
function applyMask(
  el: HTMLElement,
  offset: number,
  y: number,
  last: { current: string },
): void {
  const mask = contentMask(offset, y) ?? "";
  if (mask === last.current) return;
  last.current = mask;
  el.style.setProperty("-webkit-mask-image", mask);
  el.style.setProperty("mask-image", mask);
}

/**
 * The nav band: fixed chrome that hides while the reader reads on and returns the moment
 * they turn back. Riding out is pixel-tracked to the finger; the return is the mechanic's
 * one eased move. Nothing here ever writes scroll position.
 *
 * The mechanic reads travel, so it is only as good as its idea of what counts as travel.
 * On a phone two things move the page without the reader touching it — the URL bar
 * resizing the viewport, and rubber-band overscroll — and both used to arrive here as
 * ordinary scrolling. That is why the band behaved in a desktop browser and not on a
 * phone. Both are absorbed rather than read: positions are clamped to the document's real
 * range, and travel is held through a viewport resize sweep.
 */
export function useNavReveal(fadeTarget?: RefObject<HTMLElement | null>): NavReveal {
  const [nav, setNav] = useState<NavReveal>({ offset: 0, snap: false });
  const state = useRef<State>({ o: 0, y: 0, up: 0 });
  const lastMask = useRef("");
  const pathname = usePathname();

  /* A new screen starts with the nav in, at the top — it must not inherit the last one.
     This resets an external-system mirror (scroll position) on navigation, which is exactly
     one setState per route change, not a cascade. */
  useEffect(() => {
    const s = state.current;
    s.o = 0;
    s.y = scrollTop();
    s.up = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNav({ offset: 0, snap: false });
    const el = fadeTarget?.current;
    if (el) applyMask(el, 0, s.y, lastMask);
  }, [pathname, fadeTarget]);

  useEffect(() => {
    const s = state.current;
    let raf = 0;
    let quietUntil = 0;

    const paint = (offset: number, y: number) => {
      const el = fadeTarget?.current;
      if (el) applyMask(el, offset, y, lastMask);
    };

    const frame = () => {
      raf = 0;
      const y = scrollTop();
      /* Inside the window the page is moving under the reader, not because of them.
         Follow the position so no travel accumulates, and leave the band where it is. */
      if (performance.now() < quietUntil) {
        s.y = y;
        s.up = 0;
        paint(s.o, y);
        return;
      }
      const next = advance(s, y);
      if (next && next.offset !== s.o) {
        s.o = next.offset;
        setNav(next);
      }
      /* Every frame, not only when the band moves: the zone hangs from the viewport top,
         and reading down with the band already out is when copy passes through it least —
         the mask is "none" then, so the write is skipped inside applyMask. */
      paint(s.o, y);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    /* The viewport itself moved — the URL bar retracting or returning. The reader did not
       scroll, so hold travel for the sweep and take the position it leaves us at. */
    const onViewportChange = () => {
      quietUntil = performance.now() + LAYOUT_QUIET_MS;
      s.y = scrollTop();
      s.up = 0;
      paint(s.o, s.y);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("resize", onViewportChange);
    paint(s.o, scrollTop()); // first paint, before any scroll arrives

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
    };
  }, [fadeTarget]);

  return nav;
}
