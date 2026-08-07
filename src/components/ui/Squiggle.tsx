"use client";

import { useState } from "react";

/**
 * The hand-drawn rule under a link — the Tickets treatment in the nav, and the way in on
 * the loading seal. Not a `text-decoration`: the wobble is the brand, and a straight
 * browser underline reads as a different festival.
 *
 * Pressing it redraws the stroke left to right. That is the whole point of it being a
 * component rather than markup: a phone has no hover, so without the redraw a tap gives no
 * acknowledgement at all until the next screen arrives.
 */
export function useSquiggle() {
  const [draw, setDraw] = useState(0);
  return {
    draw,
    /* pointerdown, not click — the feedback has to land under the finger, not after it lifts. */
    onPointerDown: () => setDraw((n) => n + 1),
  };
}

export function Squiggle({
  draw,
  bottom = 4,
  startHidden = false,
}: {
  readonly draw: number;
  /** Distance from the label box's bottom edge. Bigger type needs more room. */
  readonly bottom?: number;
  /** No rule until the first press, then it draws itself in and stays. */
  readonly startHidden?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 62 6"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        width: "100%",
        height: 6,
        display: "block",
        overflow: "visible",
      }}
    >
      {/* Remounting on every press is what restarts the animation — CSS alone cannot
          replay a keyframe that has already run. */}
      <path
        key={draw}
        className={draw > 0 ? "squiggle-draw" : undefined}
        pathLength={1}
        /* Offset two whole path-lengths back, so neither the dash nor its round cap is
           anywhere near the path until the first press. */
        style={startHidden && draw === 0 ? { strokeDasharray: "1 3", strokeDashoffset: 2 } : undefined}
        d="M1 4C12 2 26 4.6 40 2.4C48 1.2 55 3 61 2"
        stroke="var(--mark)"
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
