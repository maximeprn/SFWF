/**
 * The festival's dye ground — the same indigo shibori the 2025 site sampled, rotated to
 * portrait and remapped to exactly two palette colours: the violet keeps its exact hex and
 * the orange rides the cloth's darkest stains.
 *
 * Nothing in between. A third tint is what makes the ground read as a gradient rather than
 * as dyed cloth, which is why this is a two-stop remap and not a ramp.
 *
 * The remapped canvas is handed to the flow engine as its texture, so the page carries the
 * identical ground with the identical motion.
 */
import { DYE_TEXTURE } from "@/content/photos";

const GROUND: readonly [number, number, number] = [79, 63, 121];
const STAIN: readonly [number, number, number] = [233, 98, 45];

/** Texture width. The engine samples it at a displacement, so viewport pixels aren't needed. */
const TEXTURE_WIDTH = 700;

/** The shipped remap. Coverage is how much cloth takes orange, wash is how strongly. */
export const DYE_COVERAGE = 40;
export const DYE_WASH = 50;

let artPromise: Promise<HTMLCanvasElement> | null = null;

/** The artwork, decoded once per document and rotated to portrait. */
function loadArt(): Promise<HTMLCanvasElement> {
  if (artPromise) return artPromise;
  artPromise = new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const rotated = document.createElement("canvas");
      rotated.width = image.naturalHeight;
      rotated.height = image.naturalWidth;
      const ctx = rotated.getContext("2d");
      if (!ctx) return reject(new Error("dye ground: no 2d context"));
      ctx.translate(image.naturalHeight / 2, image.naturalWidth / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      resolve(rotated);
    };
    image.onerror = () => reject(new Error(`dye ground failed to load — ${DYE_TEXTURE}`));
    image.src = DYE_TEXTURE;
  });
  return artPromise;
}

/**
 * Luminance, normalised across the frame so the darkest stain always lands at 0 — the
 * threshold below then means the same thing whatever the exposure of the artwork.
 */
function luminance(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const { data } = ctx.getImageData(0, 0, width, height);
  const lum = new Float32Array(width * height);
  let lo = 1;
  let hi = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const l = (0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!) / 255;
    lum[p] = l;
    if (l < lo) lo = l;
    if (l > hi) hi = l;
  }
  const span = hi - lo || 1;
  for (let p = 0; p < lum.length; p++) lum[p] = (lum[p]! - lo) / span;
  return lum;
}

const groundCache = new Map<string, Promise<HTMLCanvasElement>>();

/**
 * The remapped ground. `coverage` is the percentile of darkest pixels that take orange;
 * `wash` is how strongly they do. Cached per setting: the per-pixel pass runs once, and
 * swapping between the live and still paths never pays for it twice.
 */
export function buildDyeGround(coverage = DYE_COVERAGE, wash = DYE_WASH) {
  const key = `${coverage}:${wash}`;
  const cached = groundCache.get(key);
  if (cached) return cached;
  const built = remap(coverage, wash);
  groundCache.set(key, built);
  return built;
}

async function remap(coverage: number, wash: number) {
  const art = await loadArt();
  const width = Math.min(TEXTURE_WIDTH, art.width);
  const height = Math.max(1, Math.round(art.height * (width / art.width)));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("dye ground: no 2d context");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(art, 0, 0, width, height);

  const lum = luminance(ctx, width, height);
  const sorted = Float32Array.from(lum).sort();
  const cov = Math.min(100, Math.max(0, coverage)) / 100;
  const strength = Math.min(100, Math.max(0, wash)) / 100;
  const cut = cov > 0 ? sorted[Math.floor(cov * (sorted.length - 1))]! : 0;

  const out = ctx.createImageData(width, height);
  for (let p = 0; p < lum.length; p++) {
    let k = 0;
    if (cut > 0 && lum[p]! < cut) {
      const t = lum[p]! / cut;
      /* Smoothstep, then biased dark: the orange stays in the stains instead of hazing out
         across the mid-tones. */
      k = Math.pow(1 - t * t * (3 - 2 * t), 1.6) * strength;
    }
    const i = p * 4;
    for (let c = 0; c < 3; c++) out.data[i + c] = Math.round(GROUND[c]! + (STAIN[c]! - GROUND[c]!) * k);
    out.data[i + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
  return canvas;
}

/** No WebGL: the same ground, flat. Locked to width — never `cover`, which rescales on reflow. */
export function paintStill(canvas: HTMLCanvasElement, ground: HTMLCanvasElement): void {
  const width = Math.max(320, Math.round(window.innerWidth / 2));
  const height = Math.max(320, Math.round(window.innerHeight / 2));
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = `rgb(${GROUND.join(",")})`;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(ground, 0, 0, width, ground.height * (width / ground.width));
}
