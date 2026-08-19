import { useEffect, useRef, useState } from "react";

/** Long enough to read the bar and reach for it, short enough that it stops covering the clip. */
const IDLE = 2000;

/**
 * The auto-hide behind the control bar.
 *
 * `armed` is the caller's whole policy — the bar only counts down while a clip is actually
 * running with nobody touching it. Paused, focused, or under `prefers-reduced-motion`, the
 * caller passes false and the bar simply stays up: a control that disappears on a timer is not
 * something to hand someone who has asked for less movement.
 */
export function useIdleControls(armed: boolean): {
  readonly awake: boolean;
  readonly revive: () => void;
} {
  const [asleep, setAsleep] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!armed) return;
    timer.current = window.setTimeout(() => setAsleep(true), IDLE);
    // Clears whichever timer is current, so one started by `revive` cannot outlive the frame.
    return () => window.clearTimeout(timer.current);
  }, [armed]);

  const revive = () => {
    /* Waking an already-awake bar is a bail-out rather than a render, which is what makes this
       safe to call from every pointermove across the frame. */
    setAsleep(false);
    window.clearTimeout(timer.current);
    if (armed) timer.current = window.setTimeout(() => setAsleep(true), IDLE);
  };

  return { awake: !armed || !asleep, revive };
}
