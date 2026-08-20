import type { CSSProperties } from "react";

/**
 * Closing answers a click. It keeps the site's own clock — `--open` (340ms) on `--ease`, the
 * same curve every other reveal in the product runs on — because a filter that dawdles is a
 * filter you wait for. The 260ms opacity is the one value that is not the token: the copy is
 * gone before the row has finished closing, so it never reads as crushed inside a shrinking
 * box.
 */
const FOLD = "grid-template-rows var(--open) var(--ease), opacity .26s var(--ease)";

/**
 * Opening answers a pull, and the two are not the same gesture. It arrives at the top of the
 * page unbidden and moves everything below it, so on the site's own 340ms it lands as a snap
 * rather than as the week coming back. It runs half again as long, and on a curve that leaves
 * its start gently where `--ease` lifts away immediately.
 *
 * The opacity is the close read backwards: there the copy leaves first, here it arrives last,
 * fading in behind a box that has already begun to open instead of surfacing inside a row
 * that is still a few pixels tall.
 *
 * Two numbers to tune if it still reads fast: the .52s row, and the .14s the copy waits.
 */
const REVEAL =
  "grid-template-rows .52s cubic-bezier(.25,.5,.2,1)," +
  " opacity .38s cubic-bezier(.25,.5,.2,1) .14s";

/**
 * The collapsing-grid fold shared by the hero and the count line. `grid-template-rows`
 * animates real content height with nothing measured, and the row is never unmounted, only
 * shrunk to `0fr` — an unmount cannot animate, and the fold is the whole effect.
 */
export function foldStyle(open: boolean, reduced: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateRows: open ? "1fr" : "0fr",
    opacity: open ? 1 : 0,
    overflow: "hidden",
    transition: reduced ? "none" : open ? REVEAL : FOLD,
  };
}

/** The fold's own inner box, so the row can shrink below its content's natural height. */
export const foldInner: CSSProperties = { minHeight: 0, minWidth: 0 };
