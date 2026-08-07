/* Hand-cut outlines. These are drawn by hand, not generated — a parametric version made
 * the silhouettes noticeably worse — so they are copied verbatim from the prototype and
 * should not be "tidied up". The wobble is the brand.
 *
 * Coordinates are in objectBoundingBox space (0–1), so one path stretches to any box.
 * Edge midpoints sit almost on the boundary — no flat runs, no sliced sides — while only
 * the corners are cut, which is what keeps text and photos intact inside them.
 */
export const BLOB_PATHS: readonly string[] = [
  "M.105.014C.320.000.560.024.760.008C.880-.002.968.046.982.130C.996.212.984.380.990.520C.996.664 1.004.842.966.916C.934.980.790.976.580.988C.372 1.000.150.994.052.960C.006.944.004.790.010.596C.016.404-.004.190.026.098C.048.030.062.024.105.014Z",
  "M.078.020C.300.006.580.020.812.006C.926-.002.976.062.986.152C.996.240.982.392.988.528C.994.668.994.826.952.906C.918.972.770.966.566.980C.360.994.140.986.046.946C.004.928.008.782.014.588C.020.394.000.164.034.084C.056.032.048.030.078.020Z",
  "M.112.008C.336-.004.548.030.786.014C.902.006.980.038.988.126C.996.208.980.372.986.516C.992.672 1.006.856.960.922C.926.972.804.982.594.992C.384 1.002.156.990.058.966C.010.954.002.804.008.606C.014.408.002.176.030.090C.044.026.070.018.112.008Z",
  "M.086.016C.310.002.570.028.800.010C.918.000.972.054.984.142C.996.228.986.386.990.524C.994.666.998.834.958.910C.926.976.780.970.572.984C.366.998.146.990.050.954C.006.938.006.786.012.592C.018.398-.002.172.030.090C.052.030.056.026.086.016Z",
  "M.098.012C.324-.002.556.026.774.010C.892.002.974.044.984.136C.994.222.982.378.988.522C.994.668 1.000.848.962.918C.930.978.796.978.586.990C.376 1.002.148.992.054.962C.008.948.002.796.008.600C.014.404.000.182.028.094C.046.028.066.020.098.012Z",
];

/** clip-path referencing one of the hand-cut outlines. `<BlobDefs />` must be mounted once. */
export const soft = (i: number): string => `url(#blob${i % BLOB_PATHS.length})`;

/* Organic border-radius for boxes that can't take a clip-path — chips and the menu buttons,
 * where a clipped edge would cut the ring stroke. */
const BLOBS: readonly string[] = [
  "58% 42% 47% 53% / 52% 48% 55% 45%",
  "46% 54% 61% 39% / 55% 44% 56% 45%",
  "62% 38% 42% 58% / 45% 58% 42% 55%",
  "52% 48% 56% 44% / 60% 42% 58% 40%",
  "44% 56% 50% 50% / 48% 55% 45% 52%",
];
export const blob = (i: number): string => BLOBS[i % BLOBS.length]!;

/* Small controls (buttons, step markers) sit between a pill and a blob: px radii near half
 * the height, varied per corner. Percentage blobs pinch into points at this size, and a
 * uniform radius would read as a pill — which the system never uses. */
const NUBS: readonly (readonly number[])[] = [
  [20, 15, 19, 14, 17, 20, 14, 19],
  [15, 20, 14, 19, 20, 16, 19, 15],
  [19, 14, 20, 16, 15, 19, 17, 20],
];

export const nub = (i: number): string => {
  const n = NUBS[i % NUBS.length]!.map((v) => `${v.toFixed(1)}px`);
  return `${n.slice(0, 4).join(" ")} / ${n.slice(4).join(" ")}`;
};

/** Hand-drawn irregular outline behind the menu — one closed wobbly path, stroke only. */
export const MENU_RING =
  "M152 9 C188 5 212 21 226 45 C240 69 233 91 246 111 C259 131 264 156 253 178 " +
  "C242 200 247 223 232 245 C217 267 191 281 165 289 C139 297 110 293 88 281 C66 269 50 249 42 227 " +
  "C34 205 39 182 31 160 C23 138 29 113 43 93 C57 73 55 51 73 33 C91 15 119 13 152 9 Z";
