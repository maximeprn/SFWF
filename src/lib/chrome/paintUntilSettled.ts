"use client";

/**
 * Repaint every frame until the page has stopped moving, then stop.
 *
 * Both fade masks are written in their element's own coordinate space, so every stop carries
 * the element's current offset. Read that offset before the browser has settled a new route's
 * scroll position and the stops land hundreds of pixels down the element — and a gradient is
 * its first stop's colour everywhere above that stop, which here is transparent. The viewport
 * goes blank over a background that stays, and only a scroll brings it back, because a scroll
 * is what repaints it.
 *
 * One extra frame fixed Safari on the desktop and was not enough on an iPhone, where the reset
 * arrives later and over more frames. Rather than bidding a larger number against a timing
 * this cannot see, this watches the thing that actually matters: it repaints until the scroll
 * position has held still for two consecutive frames, and gives up at `budgetMs` so a page
 * that genuinely never settles — a running smooth-scroll, an animation — cannot hold the loop
 * open. Each pass writes one gradient string; the whole sequence is a handful of them.
 *
 * Returns a cancel function for effect cleanup.
 */
export function paintUntilSettled(paint: () => void, budgetMs = 600): () => void {
  let frame = 0;
  let stillFor = 0;
  let lastY = Number.NaN;
  const deadline = performance.now() + budgetMs;

  const step = () => {
    paint();
    const y = window.scrollY;
    stillFor = y === lastY ? stillFor + 1 : 0;
    lastY = y;
    if (stillFor < 2 && performance.now() < deadline) {
      frame = requestAnimationFrame(step);
    }
  };

  step();
  return () => cancelAnimationFrame(frame);
}
