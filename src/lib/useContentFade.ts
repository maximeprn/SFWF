"use client";

import { useEffect, useRef, type RefObject } from "react";

/** The band's height: 56px inset + 46px mark. The fade is cut to match it. */
export const NAV_H = 102;

/** The fade: cut for the band's height less 8px, then ramping back over 42px. */
const MASK_HEAD = 8;
const MASK_TAIL = 34;

/**
 * The content fade — page copy cut for the band's height and ramping back to opaque over
 * 42px, so text evaporates a few pixels before the mark instead of sliding under it.
 *
 * A mask, not a scrim. It removes the content's own alpha and paints nothing of its own,
 * so the dye carries through the gap at full strength. A gradient overlay would have to
 * pick a flat colour to stand in for a moving photograph, and would separate from it the
 * moment the dye shifted.
 *
 * The zone hangs from the top of the VIEWPORT, so copy is dissolving wherever the reader
 * is. The prototype got that for free by masking a scroller whose box is the viewport;
 * this site scrolls the window, so the masked element's box is the document and the stops
 * have to carry the current scroll position — which is why the mask is rewritten as the
 * reader moves rather than set once.
 */
export function contentMask(y: number): string {
  const clear = y + NAV_H - MASK_HEAD;
  const opaque = y + NAV_H + MASK_TAIL;
  return `linear-gradient(to bottom,rgba(0,0,0,0) ${clear}px,#000 ${opaque}px)`;
}

/**
 * Scroll position, clamped to the range the document actually has. iOS reports positions
 * outside it while rubber-banding, and an unclamped negative would drag the fade above the
 * viewport top and briefly uncut the copy under the mark.
 */
function scrollTop(): number {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(window.scrollY, max));
}

/**
 * Keeps the fade under the nav band in step with the reader.
 *
 * The band itself is plain fixed chrome — it does not move, hide or return, so there is no
 * travel to read and no state machine here. All that is left is the mask, rewritten on
 * each scroll frame because its stops are document coordinates and the zone they describe
 * is a viewport one.
 *
 * The mask is written straight onto the element rather than through React state: it
 * changes every frame the reader scrolls, which is far too often to render, and keeping it
 * out of JSX means no render can clobber it with a stale value. Both spellings are
 * required — Safari, iOS included, still needs the prefix, and the unprefixed property
 * alone does nothing there.
 */
export function useContentFade(target: RefObject<HTMLElement | null>): void {
  const last = useRef("");

  useEffect(() => {
    let raf = 0;

    const paint = () => {
      raf = 0;
      const el = target.current;
      if (!el) return;
      const mask = contentMask(scrollTop());
      if (mask === last.current) return;
      last.current = mask;
      el.style.setProperty("-webkit-mask-image", mask);
      el.style.setProperty("mask-image", mask);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.visualViewport?.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
    };
  }, [target]);
}
