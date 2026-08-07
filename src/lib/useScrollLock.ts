"use client";

import { useEffect } from "react";

/**
 * WebKit's pinch events. They are the one route out of the CSS lock: iOS runs pinch zoom on
 * the visual viewport, above the layout viewport `touch-action` governs, so a two-finger
 * spread on the seal still scales the page and brings the browser's chrome back with it.
 * Nothing else fires these — they do not exist in Chrome or Firefox, where `touch-action`
 * already covers zoom.
 */
const PINCH_GESTURES: readonly string[] = ["gesturestart", "gesturechange", "gestureend"];

/**
 * Holds the document still while the loading seal is up.
 *
 * The lock's first half is CSS — `.sfwf-loading` in globals.css pins html and body to the
 * viewport before the first paint. This is the second half, and it only closes what CSS
 * cannot: the pinch. Both halves lift together when the seal is dismissed.
 *
 * These listen on the document and never do anything but call `preventDefault`, so the
 * dye's own passive listeners still receive every touch and the field keeps being fed —
 * the loading screen stays stirrable while it is impossible to scroll.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const block = (e: Event) => e.preventDefault();
    /* A second finger landing is the start of a pinch; one finger has nothing to pan. */
    const blockMultiTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    const options = { passive: false } as const;

    for (const name of PINCH_GESTURES) document.addEventListener(name, block, options);
    document.addEventListener("touchmove", blockMultiTouch, options);

    return () => {
      for (const name of PINCH_GESTURES) document.removeEventListener(name, block);
      document.removeEventListener("touchmove", blockMultiTouch);
    };
  }, [active]);
}
