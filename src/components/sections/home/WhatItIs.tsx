import { WobbleFlourish } from "@/components/ui/Wobble";
import { STATS, WHAT_IT_IS } from "@/content/home";

/**
 * What the festival is, then the four figures.
 *
 * Numbers are sparse and honest — every one of these is a figure the festival has actually
 * published, and the row is not padded to a rounder count. No top padding: the flourish
 * carries this boundary on both sides.
 */
export function WhatItIs() {
  return (
    <section style={{ maxWidth: "var(--sw)", margin: "0 auto", padding: "0 var(--gutter)" }}>
      <WobbleFlourish variant={2} />
      <div style={{ maxWidth: "min(80vw,820px)", margin: "0 auto", textAlign: "center" }}>
        <p
          className="mono"
          style={{ margin: "0 0 14px", fontSize: 11.5, letterSpacing: ".2em", color: "var(--beige)" }}
        >
          WHAT IT IS
        </p>
        <p
          style={{
            margin: 0,
            font: "400 clamp(14.5px,0.5vw + 13.1px,16px)/1.7 var(--font-body)",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          {WHAT_IT_IS}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "clamp(18px,4vw,44px)",
            margin: "clamp(24px,3.4vw,34px) 0 0",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p style={{ margin: 0, font: "400 clamp(30px,5vw,44px)/1 var(--font-display)", color: "var(--orange)" }}>
                {stat.figure}
              </p>
              <p
                className="mono"
                style={{ margin: "6px 0 0", fontSize: 11, letterSpacing: ".16em", color: "var(--beige)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
