/**
 * Writes the three App Router icons from the festival's favicon symbol.
 *
 * `public/logo/sfwf-favicon-symbol.svg` is the festival's own file — the seal's octopus with
 * its glasses and its catch, already framed square on the violet ground and already cropped
 * of the ring lettering. Nothing here reframes it; this only rasterises it at the sizes
 * Next's file conventions ask for. The one edit made to the original was its ground hex,
 * #4E3F79 → the palette's #4f3f79.
 *
 * Run after replacing the symbol:  node scripts/make-favicon.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "public/logo/sfwf-favicon-symbol.svg";

/** The symbol's viewBox, in its own units — the density maths below is relative to it. */
const ARTBOARD = 2302;

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

const symbol = await readFile(SOURCE, "utf8");
if (!symbol.includes("#4f3f79")) throw new Error(`${SOURCE} is not on the palette's ground`);

function render(edge) {
  const svg =
    edge > SMALL_ICON_EDGE
      ? symbol
      : symbol.replace(
          'fill-rule="evenodd"',
          `fill-rule="evenodd" stroke="#E9E7C2" stroke-width="${SMALL_ICON_STROKE}" stroke-linejoin="round"`,
        );
  return sharp(Buffer.from(svg), { density: (72 * SUPERSAMPLE * edge) / ARTBOARD })
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
  render(180),
  ...[16, 32, 48].map((edge) => render(edge).then((png) => ({ edge, png }))),
]);
const bundle = ico(icoSlices);

await Promise.all([
  writeFile("src/app/icon.png", icon),
  writeFile("src/app/apple-icon.png", appleIcon),
  writeFile("src/app/favicon.ico", bundle),
]);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}K`;
console.log(`icon.png        512       ${kb(icon.length)}`);
console.log(`apple-icon.png  180       ${kb(appleIcon.length)}`);
console.log(`favicon.ico     ${icoSlices.map((s) => s.edge).join("/")}  ${kb(bundle.length)}`);
