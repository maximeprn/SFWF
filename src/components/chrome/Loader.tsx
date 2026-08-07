"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Squiggle, useSquiggle } from "@/components/ui/Squiggle";
import { LOADER_SEAL } from "@/content/photos";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * On the way out the seal holds still while the underline finishes drawing itself, and
 * only then fades. Without the hold the acknowledgement is cut off halfway by its own
 * transition, which reads as a glitch rather than as a response. SiteShell keeps the seal
 * mounted for the total.
 */
export const ENTER_HOLD_MS = 560;
const ENTER_FADE_MS = 440;
export const ENTER_TOTAL_MS = ENTER_HOLD_MS + ENTER_FADE_MS;

/**
 * The loading seal: the mark fills like a poured drink over 2s, once. The count is the
 * only copy, and at 100% it becomes the way in.
 *
 * Shown once per session rather than on every navigation — see SiteShell. A two-second
 * pour on each page load would be hostile.
 */
export function Loader({
  onEnter,
  exiting,
}: {
  readonly onEnter: () => void;
  readonly exiting: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const squiggle = useSquiggle();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - t0) / 2000);
      setP(t * t * (3 - 2 * t)); // eases with the pour
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Reduced motion skips the pour entirely and offers the way in immediately.
  const pct = reduced ? 100 : Math.round(p * 100);
  const ready = pct >= 100;
  const type: CSSProperties = {
    font: "400 34px/1 var(--font-display)",
    color: "var(--mark)",
    textShadow: "0 2px 14px rgba(8,16,26,.35)",
    gridArea: "1/1",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        padding: "64px 22px 78px",
        opacity: exiting ? 0 : 1,
        transition: `opacity ${ENTER_FADE_MS}ms ease ${ENTER_HOLD_MS}ms`,
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* The mark is the biggest thing on the screen and reads as the door, so it opens it
          too. A five-letter word is a poor tap target next to a 300px seal. Pressing it
          draws the same underline, so both ways in acknowledge the same way. */}
      <button
        type="button"
        aria-label="Enter"
        onClick={onEnter}
        onPointerDown={squiggle.onPointerDown}
        disabled={!ready}
        style={{
          display: "block",
          width: "min(300px, 86%)",
          padding: 0,
          border: 0,
          background: "none",
          cursor: ready ? "pointer" : "default",
        }}
      >
        <svg
          viewBox="40 40 720 730"
          role="img"
          aria-label="Siargao Food and Drink Festival"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            overflow: "visible",
            filter: "drop-shadow(0 14px 30px rgba(8,16,26,.28))",
          }}
        >
          <defs>
            <path id="ldr-top" d="M 104 404 A 296 296 0 0 1 696 404" />
            <path id="ldr-bottom" d="M 104 420 A 296 296 0 0 0 696 420" />
            {/* Keeps only the supplied logo's white ink; its yellow texture goes transparent. */}
            <filter id="ldr-ink" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 2.2 0 -1.2" />
            </filter>
            {/* Crop preserves the octopus and its props, and drops the original wording. */}
            <clipPath id="ldr-crop" clipPathUnits="userSpaceOnUse">
              <path d="M365 158h70l20 126c55 44 116 78 195 105v76c-66-2-105 18-125 53l55 126H220l55-126c-20-35-59-55-125-53v-76c79-27 140-61 195-105Z" />
              <rect x="184" y="282" width="125" height="185" />
              <rect x="560" y="298" width="98" height="217" />
              <rect x="80" y="326" width="102" height="92" />
              <rect x="680" y="326" width="70" height="80" />
            </clipPath>
            <mask id="ldr-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="800" style={{ maskType: "alpha" }}>
              <image href={LOADER_SEAL} x="0" y="6.5" width="800" height="787" preserveAspectRatio="none" clipPath="url(#ldr-crop)" filter="url(#ldr-ink)" />
            </mask>
            <g id="ldr-mark">
              <text style={{ font: "800 58px 'Arial Rounded MT Bold','Avenir Next','Trebuchet MS',sans-serif", letterSpacing: 10, fill: "currentColor" }}>
                <textPath href="#ldr-top" startOffset="50%" textAnchor="middle">
                  SIARGAO FOOD
                </textPath>
              </text>
              <text style={{ font: "800 44px 'Arial Rounded MT Bold','Avenir Next','Trebuchet MS',sans-serif", letterSpacing: 7, fill: "currentColor" }}>
                <textPath href="#ldr-bottom" startOffset="50%" textAnchor="middle">
                  AND DRINK FESTIVAL
                </textPath>
              </text>
              <g mask="url(#ldr-mask)">
                <rect width="800" height="800" style={{ fill: "currentColor" }} />
              </g>
            </g>
          </defs>
          <use href="#ldr-mark" style={{ color: "rgba(255,255,255,.20)" }} />
          {/* Reduced motion gets the filled mark outright rather than the pour. */}
          <g
            style={
              reduced
                ? undefined
                : { animation: "fillRise 2s cubic-bezier(.42,0,.19,1) both", clipPath: "polygon(0 100%,100% 100%,100% 100%,0 100%)" }
            }
          >
            <use href="#ldr-mark" style={{ color: "var(--mark)" }} />
          </g>
        </svg>
      </button>

      <div style={{ display: "grid", placeItems: "center", minHeight: 40 }}>
        <span style={{ ...type, opacity: ready ? 0 : 1, transition: "opacity .3s ease", pointerEvents: "none" }}>
          {pct}%
        </span>
        {/* Lifted above the sibling so it stays hittable once it fades in. */}
        <button
          type="button"
          onClick={onEnter}
          onPointerDown={squiggle.onPointerDown}
          style={{
            ...type,
            padding: "8px 14px",
            border: 0,
            background: "none",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            opacity: ready ? 1 : 0,
            transform: ready ? "none" : "translateY(8px)",
            pointerEvents: ready ? "auto" : "none",
            transition: "opacity .42s ease, transform .42s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {/* The nav's Tickets rule, but drawn on the press rather than sitting there —
              the acknowledgement a tap gets on a phone, where there is no hover. */}
          <span style={{ position: "relative", display: "inline-block" }}>
            Enter
            <Squiggle draw={squiggle.draw} bottom={-2} startHidden />
          </span>
        </button>
      </div>
    </div>
  );
}
