/**
 * The festival's dye ground, as one call.
 *
 * The same indigo shibori the live site samples, rotated to portrait and remapped to two
 * palette colours: the violet keeps its exact hex and the orange rides the cloth's darkest
 * stains. Nothing in between — a third tint is what makes the ground read as a gradient
 * rather than as dyed cloth.
 *
 * The remapped canvas is then handed to the dye-flow engine as its texture, so every page
 * carries the identical ground with the identical motion:
 *
 *   const flow = await mountDyeGround(canvas, { coverage: 40, wash: 62 });
 *
 * Resolves to null when WebGL is unavailable — paintStill() draws the same ground flat.
 */

import { createDyeFlow } from './dye-flow.js';

const DYE_SRC = 'design_handoff_dye_flow_background/assets/indigo-shibori.png';

const GROUND = [79, 63, 121];
const STAIN = [233, 98, 45];

/** Texture width. The engine samples it at a displacement, so viewport pixels aren't needed. */
const TEXTURE_WIDTH = 700;

let artPromise = null;

/** The artwork, decoded once per document and rotated to portrait. */
function loadArt() {
  if (artPromise) return artPromise;
  artPromise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const rotated = document.createElement('canvas');
      rotated.width = image.height;
      rotated.height = image.width;
      const ctx = rotated.getContext('2d');
      ctx.translate(image.height / 2, image.width / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      resolve(rotated);
    };
    image.onerror = () => reject(new Error('dye ground failed to load — ' + DYE_SRC));
    image.src = DYE_SRC;
  });
  return artPromise;
}

/**
 * Luminance, normalised across the frame so the darkest stain always lands at 0 — the
 * threshold below then means the same thing whatever the exposure of the artwork.
 */
function luminance(ctx, width, height) {
  const data = ctx.getImageData(0, 0, width, height).data;
  const lum = new Float32Array(width * height);
  let lo = 1;
  let hi = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    lum[p] = l;
    if (l < lo) lo = l;
    if (l > hi) hi = l;
  }
  const span = hi - lo || 1;
  for (let p = 0; p < lum.length; p++) lum[p] = (lum[p] - lo) / span;
  return lum;
}

/**
 * The remapped ground.
 *
 * `coverage` is how much of the cloth takes orange at all, as a percentile of the darkest
 * pixels; `wash` is how strongly it does. Both 0–100.
 */
export async function buildDyeGround({ coverage = 40, wash = 62 } = {}) {
  const art = await loadArt();
  const width = Math.min(TEXTURE_WIDTH, art.width);
  const height = Math.max(1, Math.round(art.height * (width / art.width)));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(art, 0, 0, width, height);

  const lum = luminance(ctx, width, height);
  const sorted = Float32Array.from(lum).sort();
  const cov = Math.min(100, Math.max(0, coverage)) / 100;
  const strength = Math.min(100, Math.max(0, wash)) / 100;
  const cut = cov > 0 ? sorted[Math.floor(cov * (sorted.length - 1))] : 0;

  const out = ctx.createImageData(width, height);
  for (let p = 0; p < lum.length; p++) {
    let k = 0;
    if (cut > 0 && lum[p] < cut) {
      const t = lum[p] / cut;
      /* Smoothstep, then biased dark: the orange stays in the stains instead of hazing out
       * across the mid-tones. */
      k = Math.pow(1 - t * t * (3 - 2 * t), 1.6) * strength;
    }
    const i = p * 4;
    for (let c = 0; c < 3; c++) out.data[i + c] = Math.round(GROUND[c] + (STAIN[c] - GROUND[c]) * k);
    out.data[i + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
  return canvas;
}

/** No WebGL: the same ground, flat. Locked to width — never `cover`, which rescales on reflow. */
export function paintStill(canvas, ground) {
  const width = Math.max(320, Math.round(window.innerWidth / 2));
  const height = Math.max(320, Math.round(window.innerHeight / 2));
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = 'rgb(' + GROUND.join(',') + ')';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(ground, 0, 0, width, ground.height * (width / ground.width));
}

/**
 * Build the ground and start the flow on `canvas`. Strength and radius are left at the
 * engine's behind-content defaults; pass `flow` to override for a page that is all dye.
 */
export async function mountDyeGround(canvas, options = {}) {
  const { coverage, wash, flow: flowOptions } = options;
  const ground = await buildDyeGround({ coverage, wash });
  const flow = createDyeFlow(canvas, { image: ground, ...flowOptions });
  if (!flow) paintStill(canvas, ground);
  return flow;
}
