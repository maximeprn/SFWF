"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A coach mark, not furniture: it points at the first unopened programme bubble and retires
 * the moment the gesture is used.
 *
 * Hand-drawn: one sweeping shaft that curls into a loop, plus a two-stroke head, with round
 * caps and slightly uneven weights so it reads as brush rather than vector. It is absolutely
 * positioned inside its bubble's own wrapper, so it tracks that bubble rather than a
 * hard-coded offset into the row, and takes no part in the row's flex layout.
 *
 * Nothing draws until the bubble has passed the middle of the screen — a mark that animates
 * while still off-screen has already been missed.
 */
/**
 * How far the mark extends past the bubble's right edge. The label sits *under* the arrow
 * rather than off to its side, which keeps the whole thing narrow enough to live in the
 * margin beside the bubble — a wider mark has to be shifted left to stay on screen, and
 * that walks it straight into the day heading above.
 */
const HINT_REACH = 78;
const EDGE_MARGIN = 12;

export function TapHint() {
  const box = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  /* The mark hangs off the bubble's right edge, which on a narrow screen can put the label
     past the viewport. Rather than hide it, slide the whole assembly back inside — the
     arrow still points down-left into the bubble, so the gesture still reads. */
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    const clamp = () => {
      const { left } = el.getBoundingClientRect();
      const overflow = left + HINT_REACH - (window.innerWidth - EDGE_MARGIN);
      setShift(overflow > 0 ? -Math.ceil(overflow) : 0);
    };
    clamp();
    window.addEventListener("resize", clamp);

    // -35%: the trigger line sits 35% up from the bottom of the viewport.
    const io = new IntersectionObserver(
      ([hit]) => {
        if (hit?.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", clamp);
    };
  }, []);

  return (
    <div
      ref={box}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "100%",
        top: 0,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 2,
        transform: shift ? `translateX(${shift}px)` : undefined,
      }}
    >
      {/* Arrow and label are positioned independently off the bubble's top-right corner, so
          nudging one never drags the other — and only the arrow carries the looping nudge. */}
      <div
        style={{
          position: "absolute",
          left: 7,
          top: -27,
          animation: armed ? "hintJab 5s cubic-bezier(.4,.2,.3,1) 1.15s infinite" : "none",
        }}
      >
        <div style={{ transform: "rotate(10deg) scaleX(-1)", transformOrigin: "50% 50%" }}>
          <svg width="53" height="32" viewBox="0 0 200 120" fill="none" style={{ display: "block" }}>
            <g
              stroke="var(--mark)"
              strokeLinecap="round"
              strokeDasharray="390"
              strokeDashoffset={armed ? undefined : 390}
              style={{ animation: armed ? "hintShaft 1.15s cubic-bezier(.3,.7,.2,1) both" : "none" }}
            >
              <path
                d="M16 92C34 62 62 28 96 22C116 18 130 32 122 52C114 72 88 80 80 62C72 44 94 24 118 26C152 30 174 54 184 98"
                strokeWidth="6"
              />
            </g>
            <g
              stroke="var(--mark)"
              strokeLinecap="round"
              strokeDasharray="44"
              strokeDashoffset={armed ? undefined : 44}
              style={{ animation: armed ? "hintHead .4s cubic-bezier(.3,.7,.2,1) 1s both" : "none" }}
            >
              <path d="M184 98L190 68" strokeWidth="6.5" />
              <path d="M184 98L160 80" strokeWidth="5.5" />
            </g>
          </svg>
        </div>
      </div>

      {/* Two short lines stepping down along the tail's direction, each tilted a touch less
          than the last, the way a hand writes into a curve. They hang below the arrow's
          tail rather than beside it, so the mark stays clear of the day heading. */}
      <div
        style={{
          position: "absolute",
          /* Lines the label's right edge up with the arrow's, so the mark reads as one
             gesture. This stays under HINT_REACH, which the arrow already sets — raising
             that instead would only make the clamp drag the whole mark back left. */
          left: 34,
          top: 22,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1,
          visibility: armed ? "visible" : "hidden",
        }}
      >
        <span
          style={{
            font: "400 15px var(--font-display)",
            color: "var(--mark)",
            whiteSpace: "nowrap",
            lineHeight: 1.05,
            transform: "rotate(-12deg)",
            transformOrigin: "0% 50%",
            animation: armed ? "hintWrite .34s steps(9, end) 1.3s both" : "none",
          }}
        >
          Tap to
        </span>
        <span
          style={{
            font: "400 15px var(--font-display)",
            color: "var(--mark)",
            whiteSpace: "nowrap",
            lineHeight: 1.05,
            marginLeft: 11,
            transform: "rotate(-6deg)",
            transformOrigin: "0% 50%",
            animation: armed ? "hintWrite .3s steps(8, end) 1.6s both" : "none",
          }}
        >
          open
        </span>
      </div>
    </div>
  );
}
