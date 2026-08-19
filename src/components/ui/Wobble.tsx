import type { CSSProperties } from "react";

/**
 * Every rule in the product. There is no straight 1px line anywhere: a `border-top` is the
 * tell that a section was built wrong. These are inline SVG paths with round caps, and they
 * never animate — no draw-on effects, the ink is already dry.
 *
 * The stretched ones carry `vector-effect: non-scaling-stroke` so a 1.4px rule stays 1.4px
 * whatever width it is asked to span.
 */

const STRETCH_RULE =
  "M2 4.6 C 46 1.4 88 5.8 132 3.2 C 176 0.6 210 6.2 256 4.4 C 300 2.6 332 0.4 " +
  "378 2.8 C 420 5 452 6.4 496 3.4 C 534 0.8 562 5.4 598 2.2";

const BUBBLE_RULE =
  "M2 3.8 C 52 1.2 104 5.6 160 3.4 C 214 1.4 262 5.8 316 3.6 C 352 2.2 378 4.6 398 3";

const KICKER_RULE = "M1 3.6 C 34 1.2 68 5 100 2.8 C 134 0.7 168 4.8 199 2.2";

const UNDERLINE_RULE = "M1 3.4 C 18 1 34 5.2 52 3 C 68 1.1 84 5 99 2.6";

/** A rule that spans its container — day dividers, the footer hairline. */
export function WobbleRule({
  tone = "beige",
  style,
}: {
  readonly tone?: "beige" | "beige-strong" | "violet";
  readonly style?: CSSProperties;
}) {
  const violet = tone === "violet";
  return (
    <svg
      viewBox={violet ? "0 0 400 6" : "0 0 600 6"}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: 5, overflow: "visible", ...style }}
    >
      <path
        d={violet ? BUBBLE_RULE : STRETCH_RULE}
        fill="none"
        stroke={
          violet
            ? "var(--hairline-violet)"
            : tone === "beige-strong"
              ? "var(--hairline-beige-strong)"
              : "var(--hairline-beige)"
        }
        strokeWidth={violet ? 1.3 : 1.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** The short rule that runs right from a numbered chapter kicker. Phase 2 uses it too. */
export function WobbleKicker() {
  return (
    <svg
      viewBox="0 0 200 6"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ flex: 1, height: 5, overflow: "visible" }}
    >
      <path
        d={KICKER_RULE}
        fill="none"
        stroke="var(--hairline-beige-strong)"
        strokeWidth={1.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The two decorative section flourishes. Each carries its own slight rotation so no two
 * sit level — that tilt is the point, not a rounding error.
 */
const FLOURISHES = [
  {
    d:
      "M2 12 C 12 2 24 21 38 8 C 52 -2 66 19 82 10 C 98 3 110 20 128 11 " +
      "C 144 4 156 18 172 9 C 186 3 198 16 212 10",
    width: 1.7,
    opacity: 0.7,
    rotate: 1.4,
  },
  {
    d:
      "M4 10 C 16 22 30 1 46 14 C 60 24 74 4 90 16 C 106 24 120 3 138 15 " +
      "C 154 23 168 5 184 14 C 198 21 206 8 216 12",
    width: 1.9,
    opacity: 0.72,
    rotate: -1.2,
  },
] as const;

export function WobbleFlourish({ variant }: { readonly variant: 0 | 1 }) {
  const f = FLOURISHES[variant];
  return (
    <svg
      viewBox="0 0 216 24"
      fill="none"
      aria-hidden="true"
      style={{
        display: "block",
        margin: "0 auto clamp(28px,4vw,44px)",
        width: "clamp(120px,22vw,200px)",
        transform: `rotate(${f.rotate}deg)`,
      }}
    >
      <path
        d={f.d}
        stroke="var(--beige)"
        strokeOpacity={f.opacity}
        strokeWidth={f.width}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The short rule flanking the hero dateline. Mirrored on the right-hand side. */
export function WobbleTick({ flip = false }: { readonly flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 130 14"
      fill="none"
      aria-hidden="true"
      style={{
        display: "block",
        flex: "none",
        height: 12,
        width: "clamp(72px, 12vw, 130px)",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <path
        d="M2 8 C 14 2 26 12 40 7 C 52 3 64 11 78 7 C 90 3 102 11 116 6 C 122 4 126 7 128 5"
        stroke="var(--beige)"
        strokeOpacity={0.72}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The mark under the nav word for the page you are on. It is drawn rather than a
 * `text-decoration`, and it is the second signal on that word — orange alone is 2.73:1 on
 * the violet, which is a picture of emphasis rather than a legible one.
 */
export function WobbleUnderline() {
  return (
    <svg
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: 5, overflow: "visible" }}
    >
      <path
        d={UNDERLINE_RULE}
        stroke="var(--beige)"
        strokeWidth={1.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
