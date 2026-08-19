/**
 * The play triangle, drawn by hand like every other stroke in the product.
 *
 * Not a geometric polygon and not an icon-set glyph: the edges bow, the corners are cut
 * unevenly, and the whole thing sits a degree and a half off level — the same tilt the
 * section flourishes carry. Copied from no library; if it ever needs adjusting, nudge the
 * control points rather than "tidying" it into a clean triangle.
 *
 * Beige fill with a violet edge, because this lands on a photograph and neither ink can be
 * trusted alone: the fill carries it over dark footage, the drawn edge over a bright sky.
 * That edge is also the reason there is no shadow here — this system draws outlines instead.
 */
const PLAY_PATH =
  "M 27.6 13.4 C 25.6 10.1 29.4 6.9 32.4 9.3 " +
  "C 44.2 17.1 56.4 24.9 69.8 34.2 " +
  "C 75.4 38.1 81.6 41.2 85.1 45.1 " +
  "C 87.9 48.3 86.9 52.7 83.1 54.7 " +
  "C 71.4 61.9 59.8 69.3 48.2 76.4 " +
  "C 41.9 80.3 35.4 84.6 30.8 88.4 " +
  "C 27.6 91 23.9 88.2 24.4 84.4 " +
  "C 26.4 70.1 25.1 56.4 26.6 42.2 " +
  "C 27.2 32.8 27.2 22.9 27.6 13.4 Z";

export function PlayMark() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "clamp(44px,21%,64px)",
        height: "auto",
        transform: "translate(-50%,-50%) rotate(-1.5deg)",
        overflow: "visible",
      }}
    >
      <path
        d={PLAY_PATH}
        fill="var(--beige)"
        stroke="var(--ground)"
        strokeWidth={2.2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
