"use client";

import { useEffect, useRef, useState } from "react";
import { VideoFrame } from "@/components/ui/VideoFrame";
import { LAST_YEAR, LAST_YEAR_EYEBROW } from "@/content/videos";

/** The design's own cap. Two and a bit clips are visible at once on a phone. */
const CLIP = "min(58vw,208px)";

/**
 * Last year's clips, as a strip that scrolls sideways with no visible bar.
 *
 * The section carries `var(--sec)` above it and nothing below, which is how every other
 * block on this page spaces itself — the footer brings its own top margin. Its gutters are
 * the section's, not the header's, so the eyebrow sits on the same left edge as every other
 * eyebrow and paragraph in the product.
 *
 * The strip is flush with the content column at every width — see `.last-year-rail` in
 * `globals.css`.
 *
 * `SWIPE` appears only when the strip actually overflows. Six clips never fit the column, so
 * today it always shows — the measurement stays because the day it stops being true, the
 * instruction should stop appearing on its own.
 */
export function LastYear() {
  const rail = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    // Measured, not guessed from a breakpoint: the clip width is a vw clamp, so whether the
    // clips overflow depends on the viewport in a way no media query expresses.
    const measure = () => setOverflows(el.scrollWidth - el.clientWidth > 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{
        maxWidth: "var(--sw)",
        margin: "0 auto",
        padding: "var(--sec) var(--gutter) 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "16px",
          paddingBottom: "clamp(18px,2.8vw,26px)",
        }}
      >
        <h2
          className="mono"
          style={{
            margin: 0,
            fontWeight: 400,
            fontSize: "11.5px",
            letterSpacing: ".2em",
            color: "var(--beige)",
          }}
        >
          {LAST_YEAR_EYEBROW}
        </h2>
        {overflows ? (
          <p
            className="mono"
            aria-hidden="true"
            style={{
              margin: 0,
              fontSize: "11px",
              letterSpacing: ".2em",
              color: "var(--beige)",
              whiteSpace: "nowrap",
            }}
          >
            SWIPE →
          </p>
        ) : null}
      </div>

      <div
        ref={rail}
        className="rail last-year-rail"
      >
        {LAST_YEAR.map((clip, i) => (
          <div key={clip.id} style={{ flex: "0 0 auto" }}>
            <VideoFrame
              clip={clip}
              /* Offset by one so the first clip never repeats the film's silhouette. */
              shape={(i + 1) % 6}
              width={CLIP}
              posterWidth={208}
              showCaption
            />
          </div>
        ))}
      </div>
    </section>
  );
}
