import type { ReactNode } from "react";
import { PLAY_PATH } from "@/components/ui/PlayMark";

/**
 * The control bar's glyphs, drawn the way every other stroke in this product is drawn: edges
 * that bow, corners cut unevenly, each mark a degree or so off level. They are not an icon set
 * and they are not tidy — nudge the control points if one ever needs adjusting.
 *
 * Play is literally `PLAY_PATH`, the same triangle the poster carries, at a sixth of the size.
 *
 * These sit inside a beige plate rather than on the footage, so they take a solid
 * `currentColor` instead of the beige-fill-and-violet-edge recipe the centred play mark needs.
 * Strokes are `non-scaling-stroke` at 1.7, which is the weight of the festival's own linework.
 */

const SOLID = { fill: "currentColor" } as const;
const DRAWN = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

/** The horn, shared by both sound states so muting swaps only what is struck through it. */
const HORN =
  "M 22.4 40.4 C 26 39.8 30.2 40.6 33.6 39.6 C 38.6 35.2 44 29.4 48.4 26.2 " +
  "C 51.4 24.2 54.4 25.6 54.6 29 C 54.9 43.2 54.2 57.6 54.6 71.4 " +
  "C 54.8 74.9 51.8 76.5 49 74.4 C 44.2 71 39 65.4 33.8 61 " +
  "C 30.2 60 25.6 60.9 22.1 60 C 19.8 59.4 19.4 55 19.6 50 " +
  "C 19.8 45 19.9 40.8 22.4 40.4 Z";

export type ControlMarkKind = "play" | "pause" | "sound" | "muted" | "expand" | "contract";

const MARKS: Record<ControlMarkKind, { readonly node: ReactNode; readonly rotate: number }> = {
  play: { node: <path d={PLAY_PATH} {...SOLID} />, rotate: -1.5 },

  pause: {
    node: (
      <>
        <path
          d={
            "M 34.2 19.6 C 38.6 18.4 43.8 19.2 45.4 21.8 C 46.8 24 46.2 34 45.8 48 " +
            "C 45.4 62 46.4 74.6 45 78.4 C 43.6 82 37 82.4 34.6 80.2 " +
            "C 32.6 78.4 33.2 66 33.4 50 C 33.6 34.4 32.4 21 34.2 19.6 Z"
          }
          {...SOLID}
        />
        <path
          d={
            "M 56.6 20.8 C 61 18.8 66.4 19.6 67.6 22.4 C 68.8 25 67.8 35.6 67.4 49.4 " +
            "C 67 63.2 68.2 75.2 66.6 78.8 C 65.2 82.2 58.6 82.6 56.2 80 " +
            "C 54.4 78 55.4 65.4 55.6 50.2 C 55.8 35 55 22 56.6 20.8 Z"
          }
          {...SOLID}
        />
      </>
    ),
    rotate: 1.2,
  },

  sound: {
    node: (
      <>
        <path d={HORN} {...SOLID} />
        <path d="M 63.6 36.2 C 70.6 41.6 71.2 58.6 63.2 64.8" {...DRAWN} />
        <path d="M 72.6 27.2 C 83.8 35.8 84.4 64 72 73" {...DRAWN} />
      </>
    ),
    rotate: -1.1,
  },

  muted: {
    node: (
      <>
        <path d={HORN} {...SOLID} />
        <path d="M 64.2 38.4 C 70.6 45.6 77.2 54 83.4 61.8" {...DRAWN} />
        <path d="M 83.2 38.2 C 76.6 45.8 69.8 54.2 63.8 61.9" {...DRAWN} />
      </>
    ),
    rotate: -1.1,
  },

  expand: {
    node: (
      <>
        <path d="M 39.4 20.8 C 33.4 20.2 26.6 19.8 22.8 20.9 C 21.3 21.4 20.7 27.6 21 33.4 C 21.1 36.2 21.2 38 21.3 39.6" {...DRAWN} />
        <path d="M 60.6 20.6 C 66.6 20 73.4 19.9 77.2 21 C 78.7 21.5 79.3 27.4 79 33.2 C 78.9 36 78.8 37.8 78.7 39.4" {...DRAWN} />
        <path d="M 21.3 60.4 C 21.2 66.4 20.7 72.8 21.7 76.4 C 22.2 78 28.4 78.6 34.2 78.3 C 37 78.2 38.8 78.1 40.4 78" {...DRAWN} />
        <path d="M 78.7 60.6 C 78.8 66.6 79.3 73 78.3 76.6 C 77.8 78.1 71.6 78.6 65.8 78.2 C 63 78.1 61.2 78 59.6 77.9" {...DRAWN} />
      </>
    ),
    rotate: 0.9,
  },

  contract: {
    node: (
      <>
        <path d="M 20.6 39.6 C 26.6 40.2 33.2 40.6 37 39.6 C 38.6 39.2 39.2 33 38.9 27.2 C 38.8 24.4 38.7 22.6 38.6 21" {...DRAWN} />
        <path d="M 79.4 39.4 C 73.4 40 66.8 40.4 63 39.4 C 61.4 39 60.8 32.8 61.1 27 C 61.2 24.2 61.3 22.4 61.4 20.8" {...DRAWN} />
        <path d="M 39.4 79.4 C 40 73.4 40.4 66.8 39.4 63 C 39 61.4 32.8 60.8 27 61.1 C 24.2 61.2 22.4 61.3 20.8 61.4" {...DRAWN} />
        <path d="M 60.6 79.2 C 60 73.2 59.6 66.6 60.6 62.8 C 61 61.2 67.2 60.6 73 60.9 C 75.8 61 77.6 61.1 79.2 61.2" {...DRAWN} />
      </>
    ),
    rotate: -0.8,
  },
};

export function ControlMark({ kind }: { readonly kind: ControlMarkKind }) {
  const mark = MARKS[kind];
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "visible",
        transform: `rotate(${mark.rotate}deg)`,
      }}
    >
      {mark.node}
    </svg>
  );
}
