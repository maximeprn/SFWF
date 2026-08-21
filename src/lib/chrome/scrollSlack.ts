"use client";

/**
 * How far behind the mask is allowed to be, measured in frames of the speed it is currently
 * travelling at. Three is the pessimistic case: a main thread busy enough to miss two frames
 * and still be writing the third.
 */
const LAG_FRAMES = 3;

/** The most the hidden band may grow, whatever the speed. Beyond this the cure is worse. */
const MAX_SLACK = 240;

/**
 * Slack falls off between events rather than dropping to whatever the last delta was. A flick
 * is not smooth — one slow frame in the middle of it would otherwise collapse the guard for
 * exactly the frame that needed it.
 */
const DECAY = 0.6;

/** No scroll for this long means the page has stopped, and the band can be exact again. */
const SETTLE_MS = 140;

/**
 * The fade masks are positioned in their element's own coordinate space, so where the band
 * lands depends on the scroll offset — and that offset is read by JavaScript on the main
 * thread while the page is being scrolled by the compositor. On a hard flick the compositor
 * has already drawn the content at its new position while the mask still describes the old
 * one, and the band is left behind: content rides up through the fade, past the chips, and
 * nearly to the top of the window. No amount of repainting fixes it, because the repaint is
 * the thing that is late.
 *
 * Since the mask cannot be made to keep up, it is made to fail in the safe direction. This
 * measures how fast the page is moving and reports how much further down the band should be
 * carried — so a mask written one frame ago still covers the ground the page has crossed
 * since. Late now means hiding *more*, never less, which is the same bargain the gradient's
 * leading opaque stop makes about a stale paint.
 *
 * It costs nothing at rest: with the page still, slack is zero and the band is exactly where
 * the design puts it. It only widens while the page is moving, which is precisely when nobody
 * can read the strip of content it is covering.
 */
export function createScrollSlack(onSettle: () => void) {
  let slack = 0;
  let lastY = typeof window === "undefined" ? 0 : window.scrollY;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return {
    /** The current allowance, in pixels. Read by the paint. */
    current: () => slack,

    /**
     * Called on every scroll event, unthrottled — this is where the speed is read, and a
     * throttled sample would under-report exactly the fast scroll it exists to catch.
     * Reading `scrollY` forces no layout, so it is cheap enough to do every time.
     */
    measure: () => {
      const y = window.scrollY;
      const travelled = Math.abs(y - lastY);
      lastY = y;
      slack = Math.min(MAX_SLACK, Math.max(travelled * LAG_FRAMES, slack * DECAY));
      clearTimeout(timer);
      timer = setTimeout(() => {
        slack = 0;
        onSettle();
      }, SETTLE_MS);
      return slack;
    },

    stop: () => clearTimeout(timer),
  };
}
