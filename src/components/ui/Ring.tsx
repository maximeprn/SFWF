import { blobPath } from "@/lib/design/shapes";

/**
 * The drawn edge of a hand-cut shape.
 *
 * `clip-path` cuts an element's *entire* rendering, `box-shadow` and `filter: drop-shadow()`
 * included, so an outline drawn either of those ways is removed at exactly the curve it was
 * meant to trace — the line dies at the corners, where it is most visible. Inset rings and
 * edge-hugging gradients fail the same way. Stacking offset shadow copies fails differently:
 * each copy carries its own antialiased edge, and on a stretched shape they do not line up.
 *
 * So the edge is stroked on the same geometry as the clip, from inside the clipped element:
 *
 *   · `viewBox="0 0 1 1"` with `preserveAspectRatio="none"` maps the path onto the box the
 *     way `clipPathUnits="objectBoundingBox"` does, so stroke and clip are one outline at
 *     every size.
 *   · `vector-effect="non-scaling-stroke"` holds the stroke at a constant CSS width. Without
 *     it the non-uniform scale draws it fat on one axis and thin on the other.
 *   · the clip keeps only the stroke's inner half, so the width is doubled and the *visible*
 *     weight is the variable as written.
 *
 * The host must be `position: relative`. The ring never takes a pointer event.
 */
export function Ring({
  shapeIndex,
  weight = "var(--bubble-edge)",
}: {
  readonly shapeIndex: number;
  readonly weight?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <path
        d={blobPath(shapeIndex)}
        fill="none"
        stroke="var(--edge-ink)"
        vectorEffect="non-scaling-stroke"
        style={{ strokeWidth: `calc(${weight} * 2)` }}
      />
    </svg>
  );
}
