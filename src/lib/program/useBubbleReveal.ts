"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * How long the detail block stays mounted after it has been told to close. One frame longer
 * than the reveal itself would be enough; 360ms against a 340ms curve is that frame.
 */
const CLOSE_MS = 360;

/** `opening` and `closing` both mean "mounted at 0fr" — one on the way up, one on the way down. */
export type Phase = "opening" | "open" | "closing";

interface Timer {
  readonly phase: Phase;
  readonly cancel: () => void;
}

/**
 * The signature reveal, as two steps rather than a measured height.
 *
 * A bubble's detail block mounts at `grid-template-rows: 0fr` and is grown to `1fr` two
 * frames later, so the browser has a start value to animate from without anyone measuring
 * anything. Closing runs the same curve back down and unmounts once it has finished.
 *
 * Bubbles open independently: a visitor comparing two dinners should be able to hold both
 * open, and tapping a third never shuts the first two.
 */
export function useBubbleReveal() {
  const [phases, setPhases] = useState<Readonly<Record<string, Phase>>>({});
  const timers = useRef(new Map<string, Timer>());

  const set = useCallback((key: string, phase: Phase | null) => {
    setPhases((current) => {
      const next = { ...current };
      if (phase) next[key] = phase;
      else delete next[key];
      return next;
    });
  }, []);

  const toggle = useCallback(
    (key: string) => set(key, phases[key] === "closing" || !phases[key] ? "opening" : "closing"),
    [phases, set],
  );

  useEffect(() => {
    const pending = timers.current;
    /* Cancel only what has moved on. Rescheduling every key on every change would restart
       one bubble's unmount timer each time another bubble is tapped. */
    for (const [key, timer] of pending) {
      if (phases[key] !== timer.phase) {
        timer.cancel();
        pending.delete(key);
      }
    }
    for (const [key, phase] of Object.entries(phases)) {
      if (phase === "open" || pending.has(key)) continue;
      const done = () => {
        pending.delete(key);
        set(key, phase === "opening" ? "open" : null);
      };
      pending.set(key, { phase, cancel: phase === "opening" ? nextFrame(done) : delay(done) });
    }
  }, [phases, set]);

  /* Only on unmount — the effect above owns cancellation for the whole page's lifetime. */
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) timer.cancel();
      pending.clear();
    };
  }, []);

  return { phases, toggle };
}

/** Two frames: one to commit the 0fr mount, one for the browser to see 1fr as a change. */
function nextFrame(run: () => void): () => void {
  let inner = 0;
  const outer = requestAnimationFrame(() => {
    inner = requestAnimationFrame(run);
  });
  return () => {
    cancelAnimationFrame(outer);
    cancelAnimationFrame(inner);
  };
}

function delay(run: () => void): () => void {
  const id = setTimeout(run, CLOSE_MS);
  return () => clearTimeout(id);
}
