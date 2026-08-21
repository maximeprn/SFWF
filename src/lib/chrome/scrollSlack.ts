"use client";

/**
 * The speed, in pixels per frame, below which nothing happens at all.
 *
 * This is the whole difference between a guard and a nuisance. Reading, dragging, a wheel
 * notch — none of them reach 40px in a frame, and none of them outrun the mask, so the band
 * stays exactly where it is drawn. Only a flick crosses this, and a flick is the only thing
 * that was ever leaking.
 */
const FAST = 40;

/**
 * How many frames of the *excess* over `FAST` to cover. Two, not three: the guard now starts
 * from the speed that is actually dangerous rather than from zero, so it does not need to be
 * as generous to reach the same place.
 */
const LAG_FRAMES = 2;

/** The most the hidden band may grow, whatever the speed. Beyond this the cure is worse. */
const MAX_SLACK = 200;

/**
 * The band moves in steps of this, never continuously.
 *
 * A value recomputed every frame is a value that trembles every frame, and the eye reads a
 * fade edge creeping about far more readily than it reads one sitting a little low. Rounding
 * to a coarse step means most frames of a flick ask for the same number and write nothing.
 */
const STEP = 50;

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
 * measures how fast the page is travelling *downward* and reports how much further down the
 * band should be carried — so a mask written one frame ago still covers the ground the page
 * has crossed since. Late now means hiding *more*, never less.
 *
 * Only downward, because only downward is dangerous: scrolling up, a late mask already errs
 * toward hiding too much on its own. See `measure`.
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
    /** The current allowance, in pixels, rounded to `STEP` so the edge steps rather than creeps. */
    current: () => Math.round(Math.min(MAX_SLACK, slack) / STEP) * STEP,

    /**
     * Called on every scroll event, unthrottled — this is where the speed is read, and a
     * throttled sample would under-report exactly the fast scroll it exists to catch.
     * Reading `scrollY` forces no layout, so it is cheap enough to do every time.
     */
    measure: () => {
      const y = window.scrollY;
      const travelled = y - lastY;
      lastY = y;
      /* Downward only, because the danger is not symmetrical. Going down, a late mask leaves
         its band too high in the element and the top of the window falls past the stale ramp,
         into the opaque — content appears where the chips are. Going up, the same lateness
         leaves the band too low, and the top of the window falls short of it, into the
         transparent: a late mask up is already hiding more than it should. There is nothing
         there to guard, so guarding it would only widen the fade for no reason.

         Upward and stationary frames decay rather than reset. Momentum is not monotonic — one
         jittered frame reading backwards in the middle of a downward flick would otherwise
         drop the guard for the frame that needed it. A genuine scroll up empties it in about
         five frames, and the settle timer takes the remainder. */
      /* Only the part of the speed above `FAST` counts, so the guard grows from the point
         where the mask starts losing rather than from standstill. Below it there is no
         excess, the value decays, and `current()` rounds it to nothing. */
      const excess = Math.max(0, travelled - FAST);
      slack =
        excess > 0
          ? Math.min(MAX_SLACK, Math.max(excess * LAG_FRAMES, slack * DECAY))
          : slack * DECAY;
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
