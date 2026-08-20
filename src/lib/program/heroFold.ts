import type { CSSProperties } from "react";

/**
 * The collapsing-grid fold shared by the hero and the count line — see
 * `design_handoff_day_selector/README.md` §3. `grid-template-rows` animates real content
 * height with nothing measured, and the row is never unmounted, only shrunk to `0fr`.
 *
 * Timings match the site's own tokens exactly: `--open` (340ms) is the same clock every
 * other reveal in the product runs on; the 260ms opacity is the one value that isn't, so the
 * text is gone before the row has finished closing and never reads as crushed inside it.
 */
export function foldStyle(open: boolean, reduced: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateRows: open ? "1fr" : "0fr",
    opacity: open ? 1 : 0,
    overflow: "hidden",
    transition: reduced
      ? "none"
      : "grid-template-rows var(--open) var(--ease), opacity .26s var(--ease)",
  };
}

/** The fold's own inner box, so the row can shrink below its content's natural height. */
export const foldInner: CSSProperties = { minHeight: 0, minWidth: 0 };
