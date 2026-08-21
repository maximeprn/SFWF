"use client";

/** Close enough that moving at all would read as a twitch rather than as a landing. */
const NEAR = 2;

/**
 * A fixed cost to get under way plus a share of the distance, capped. Distance has to count
 * for something — one duration over 40px and over 900px is either a crawl or a lurch — but it
 * cannot count for everything, or the long travel from the top of the programme takes as long
 * as the reader would have taken to scroll it themselves.
 *
 * The base is the site's own `--open`, so the shortest landing and the hero's fold are the
 * same length and read as one movement; everything longer than that stretches past it. There
 * is deliberately no floor above it — the second, correcting pass in `useDayHero` is usually a
 * few dozen pixels, and a floor is what turns that into a visible crawl at the end of a
 * landing that had already arrived.
 */
const BASE_MS = 340;
const PER_PX = 0.75;
const MAX_MS = 1000;

/**
 * Sine in and out, which is the gentlest curve that starts and ends at rest: its acceleration
 * is zero at both ends, so there is no frame where the page snaps into motion or stops dead.
 * A cubic would be quicker through the middle and is the usual choice, but quicker through
 * the middle is the opposite of what this is for.
 */
const ease = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * The page's own scroll animation, in place of `behavior: "smooth"`.
 *
 * The native one is not tunable and it is short — it treats a scroll as a jump to get over
 * with. Here the scroll is part of the choreography of a pick, running alongside the hero
 * folding and the day list arriving, and at the browser's pace it read as a snap that the
 * rest of the movement then had to catch up with.
 *
 * Writing every frame ourselves also survives the page changing height underneath it, which
 * it does twice on a pick — the fold, then the swap. A native smooth scroll aimed past a
 * document that has momentarily shrunk is clamped and gives up there; this one is simply
 * clamped for those frames and lands on the next one that has room.
 *
 * `onRest` runs on arrival only. An interrupted glide is the reader taking the page back, and
 * following that with anything of our own is arguing with them.
 */
export function glide(target: number, onRest?: () => void): () => void {
  const from = window.scrollY;
  const distance = target - from;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;

  function stop() {
    cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  }

  if (still || Math.abs(distance) <= NEAR) {
    if (Math.abs(distance) > NEAR) window.scrollTo({ top: target, behavior: "instant" });
    /* Next frame rather than now: `onRest` measures the page, and the jump above has not been
       through layout yet. */
    frame = requestAnimationFrame(() => onRest?.());
    return () => cancelAnimationFrame(frame);
  }

  const ms = Math.min(MAX_MS, BASE_MS + Math.abs(distance) * PER_PX);
  const start = performance.now();

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    /* `instant`, never the default `auto`. The document carries `scroll-behavior: smooth`, so
       an `auto` write hands each frame's position to the browser's own easing — which then
       starts again from the next frame's, and the page crawls a long way behind the curve
       being drawn here. Two eases over one scroll is one too many; this is the one. */
    window.scrollTo({ top: from + distance * ease(t), behavior: "instant" });
    if (t < 1) {
      frame = requestAnimationFrame(step);
      return;
    }
    stop();
    onRest?.();
  };

  frame = requestAnimationFrame(step);
  /* Not `scroll`: every frame above fires one of those, and this would cancel itself on the
     first one. These three are the reader, and the reader always wins. */
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  return stop;
}
