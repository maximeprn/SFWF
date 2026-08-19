/* Hand-cut outlines. These are drawn by hand, not generated — a parametric version made
 * the silhouettes noticeably worse — so they are copied verbatim from the 2026 prototype
 * and should not be "tidied up". The wobble is the brand.
 *
 * Coordinates are in objectBoundingBox space (0–1), so one path stretches to any box.
 * Edge midpoints sit almost on the boundary — no flat runs, no sliced sides — while only
 * the corners are cut, which is what keeps text and photos intact inside them.
 *
 * Six of them, so that a round-robin over a grid never puts two identical silhouettes side
 * by side. Nothing in the product is pill-shaped; a fully rounded control is always a bug.
 */
export const BLOB_PATHS: readonly string[] = [
  "M 0.098 0.988 C 0.324 1.002 0.556 0.974 0.774 0.990 C 0.892 0.998 0.974 0.956 0.984 0.864 C 0.994 0.778 0.982 0.622 0.988 0.478 C 0.994 0.332 1.000 0.152 0.962 0.082 C 0.930 0.022 0.796 0.022 0.586 0.010 C 0.376 -0.002 0.148 0.008 0.054 0.038 C 0.008 0.052 0.002 0.204 0.008 0.400 C 0.014 0.596 0.000 0.818 0.028 0.906 C 0.046 0.972 0.066 0.980 0.098 0.988 Z",
  "M 0.895 0.986 C 0.680 1.000 0.440 0.976 0.240 0.992 C 0.120 1.002 0.032 0.954 0.018 0.870 C 0.004 0.788 0.016 0.620 0.010 0.480 C 0.004 0.336 -0.004 0.158 0.034 0.084 C 0.066 0.020 0.210 0.024 0.420 0.012 C 0.628 0.000 0.850 0.006 0.948 0.040 C 0.994 0.056 0.996 0.210 0.990 0.404 C 0.984 0.596 1.004 0.810 0.974 0.902 C 0.952 0.970 0.938 0.976 0.895 0.986 Z",
  "M 0.922 0.980 C 0.700 0.994 0.420 0.980 0.188 0.994 C 0.074 1.002 0.024 0.938 0.014 0.848 C 0.004 0.760 0.018 0.608 0.012 0.472 C 0.006 0.332 0.006 0.174 0.048 0.094 C 0.082 0.028 0.230 0.034 0.434 0.020 C 0.640 0.006 0.860 0.014 0.954 0.054 C 0.996 0.072 0.992 0.218 0.986 0.412 C 0.980 0.606 1.000 0.836 0.966 0.916 C 0.944 0.968 0.952 0.970 0.922 0.980 Z",
  "M 0.888 0.992 C 0.664 1.004 0.452 0.970 0.214 0.986 C 0.098 0.994 0.020 0.962 0.012 0.874 C 0.004 0.792 0.020 0.628 0.014 0.484 C 0.008 0.328 -0.006 0.144 0.040 0.078 C 0.074 0.028 0.196 0.018 0.406 0.008 C 0.616 -0.002 0.844 0.010 0.942 0.034 C 0.990 0.046 0.998 0.196 0.992 0.394 C 0.986 0.592 0.998 0.824 0.970 0.910 C 0.956 0.974 0.930 0.982 0.888 0.992 Z",
  "M 0.914 0.984 C 0.690 0.998 0.430 0.972 0.200 0.990 C 0.082 1.000 0.028 0.946 0.016 0.858 C 0.004 0.772 0.014 0.614 0.010 0.476 C 0.006 0.334 0.002 0.166 0.042 0.090 C 0.074 0.024 0.220 0.030 0.428 0.016 C 0.634 0.002 0.854 0.010 0.950 0.046 C 0.994 0.062 0.994 0.214 0.988 0.408 C 0.982 0.602 1.002 0.828 0.970 0.910 C 0.948 0.970 0.944 0.974 0.914 0.984 Z",
  "M 0.902 0.988 C 0.676 1.002 0.444 0.974 0.226 0.990 C 0.108 0.998 0.026 0.956 0.016 0.864 C 0.006 0.778 0.018 0.622 0.012 0.478 C 0.006 0.332 0.000 0.152 0.038 0.082 C 0.070 0.022 0.204 0.022 0.414 0.010 C 0.624 -0.002 0.852 0.008 0.946 0.038 C 0.992 0.052 0.998 0.204 0.992 0.400 C 0.986 0.596 1.000 0.818 0.972 0.906 C 0.954 0.972 0.934 0.980 0.902 0.988 Z",
];

/** clip-path referencing one of the hand-cut outlines. `<BlobDefs />` must be mounted once. */
export const soft = (i: number): string => `url(#pb${i % BLOB_PATHS.length})`;

/**
 * A shallow hand-cut outline, for a video while it is playing.
 *
 * Native controls sit hard against the bottom edge, and all six of the outlines above curve
 * inward there — the scrubber's ends and its timecodes were being clipped away. Dropping the
 * clip fixed that and looked wrong: the frame changed shape under the tap.
 *
 * Deriving it by scaling one of them does not work. They already sit almost exactly on the
 * unit square, so any outward scale puts the whole boundary outside the box and the clip
 * renders as a plain rectangle. This is drawn instead: the same irregular hand, with every
 * deviation held inside about 2% so nothing reaches the controls.
 */
export const SHALLOW_BLOB_PATH =
  "M 0.014 0.024 C 0.280 0.002 0.600 0.022 0.984 0.008 " +
  "C 0.998 0.280 0.984 0.620 0.992 0.974 " +
  "C 0.720 0.996 0.340 0.976 0.018 0.990 " +
  "C 0.002 0.700 0.020 0.320 0.014 0.024 Z";

export const shallow = (): string => "url(#sbPlay)";
/**
 * Which silhouette a bubble and its booking button take. Both are deliberately coprime-ish
 * walks over the six outlines, so neighbours in the grid never match and a button never
 * repeats the shell it sits inside.
 */
export const bubbleShape = (index: number, dayIndex: number): number =>
  (index * 5 + dayIndex) % BLOB_PATHS.length;

export const buttonShape = (dayIndex: number, eventIndex: number): number =>
  (dayIndex * 5 + eventIndex + 2) % BLOB_PATHS.length;
