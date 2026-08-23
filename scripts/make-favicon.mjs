/**
 * Writes the three App Router icons from the festival's favicon symbol.
 *
 * `public/logo/sfwf-favicon-symbol.svg` is the festival's own file — the seal's octopus with
 * its glasses and its catch, already cropped of the ring lettering. The one edit made to the
 * original was its ground hex, #4E3F79 → the palette's #4f3f79.
 *
 * The tab icons are round: the square ground becomes an inscribed disc and the drawing is
 * pulled in to sit inside it. `apple-icon.png` is the exception and stays full-bleed square —
 * iOS masks it to its own squircle and fills any transparency it finds with black, so a disc
 * would land on the home screen inside a black box.
 *
 * Run after replacing the symbol:  node scripts/make-favicon.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "public/logo/sfwf-favicon-symbol.svg";
const GROUND = "#4f3f79";
const BEIGE = "#e9e7c2";

/** How much of the disc's radius the drawing is allowed to reach. Left at its own size it
 *  spans 95% of it and the glasses and the antenna kiss the edge; this leaves a ring. */
const MARK_FILL = 0.88;

/**
 * The drawing is line art at one weight, and below ~64px its thinnest strokes fall under a
 * pixel and grey out. A little stroke on the fill's own colour holds them together at 48 and
 * under; past that it starts closing the crab's legs, and the large sizes need none of it.
 */
const SMALL_ICON_STROKE = 16;
const SMALL_ICON_EDGE = 48;

/** Rasterise at 4x and come down with a real filter — much cleaner at 16px than asking
 *  librsvg for 16 pixels directly. */
const SUPERSAMPLE = 4;

const source = await readFile(SOURCE, "utf8");
if (!source.includes(GROUND)) throw new Error(`${SOURCE} is not on the palette's ground`);

const box = source.match(/viewBox="([^"]+)"/)?.[1].split(/\s+/).map(Number);
const d = source.match(/ d="([^"]+)"/)?.[1];
if (!box || !d) throw new Error(`${SOURCE} is not the traced symbol any more`);

const centre = { x: box[0] + box[2] / 2, y: box[1] + box[3] / 2 };
const radius = box[2] / 2;

/** Every point in this path is an absolute M/L, so the extent is just the coordinates. */
function markRadius() {
  const nums = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  let reach = 0;
  for (let i = 0; i < nums.length; i += 2) {
    reach = Math.max(reach, Math.hypot(nums[i] - centre.x, nums[i + 1] - centre.y));
  }
  return reach;
}

const scale = (MARK_FILL * radius) / markRadius();

/** Stroke is applied inside the scaled group, so it has to be divided back out to land at
 *  the width the artboard means. */
function markup(edge, { round }) {
  const stroke =
    edge > SMALL_ICON_EDGE
      ? ""
      : ` stroke="${BEIGE}" stroke-width="${SMALL_ICON_STROKE / (round ? scale : 1)}" stroke-linejoin="round"`;
  const path = `<path fill="${BEIGE}" fill-rule="evenodd"${stroke} d="${d}"/>`;
  if (!round) return Buffer.from(source.replace(/ d="/, `${stroke} d="`));

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(" ")}">` +
      `<circle cx="${centre.x}" cy="${centre.y}" r="${radius}" fill="${GROUND}"/>` +
      `<g transform="translate(${centre.x} ${centre.y}) scale(${scale}) translate(${-centre.x} ${-centre.y})">` +
      `${path}</g></svg>`,
  );
}

function render(edge, { round = true } = {}) {
  return sharp(markup(edge, { round }), { density: (72 * SUPERSAMPLE * edge) / box[2] })
    .resize(edge, edge, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * An ICO holding PNG slices — a 6-byte header, one 16-byte directory entry per size, then
 * the images. Every browser still shipping has read PNG-in-ICO for well over a decade.
 */
function ico(slices) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(slices.length, 4);

  let offset = 6 + slices.length * 16;
  const directory = slices.map(({ edge, png }) => {
    const entry = Buffer.alloc(16);
    entry[0] = edge >= 256 ? 0 : edge;
    entry[1] = edge >= 256 ? 0 : edge;
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...directory, ...slices.map((s) => s.png)]);
}

const [icon, appleIcon, ...icoSlices] = await Promise.all([
  render(512),
  render(180, { round: false }),
  ...[16, 32, 48].map((edge) => render(edge).then((png) => ({ edge, png }))),
]);
const bundle = ico(icoSlices);

await Promise.all([
  writeFile("src/app/icon.png", icon),
  writeFile("src/app/apple-icon.png", appleIcon),
  writeFile("src/app/favicon.ico", bundle),
]);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}K`;
console.log(`icon.png        512       round     ${kb(icon.length)}`);
console.log(`apple-icon.png  180       full-bleed ${kb(appleIcon.length)}`);
console.log(`favicon.ico     ${icoSlices.map((s) => s.edge).join("/")}  round     ${kb(bundle.length)}`);
