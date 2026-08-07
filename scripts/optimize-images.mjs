/**
 * Regenerates the served derivatives of the festival's raster art.
 *
 * The originals in `public/` are the festival's own files and are not regenerable, so they
 * stay exactly where they are — this only writes siblings next to them. The site points at
 * the siblings; the PNGs remain the master copies.
 *
 * Run after replacing any original:  node scripts/optimize-images.mjs
 */
import { readdir, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const ICON_DIR = "public/icons";

/**
 * Icons render at 44–50 CSS px, so 192 covers a 3x screen with room to spare. The seal and
 * the dye texture keep their native size — both are drawn large, and the whole win there is
 * the codec, not the pixel count.
 */
const ICON_EDGE = 192;

/** AVIF for line art, WebP for the dye. The dye is the largest image on the critical path
 *  and decodes measurably faster as WebP, at the same file size. */
const encode = {
  avif: (pipe, quality) => pipe.avif({ quality, effort: 9 }),
  webp: (pipe, quality) => pipe.webp({ quality, effort: 6 }),
};

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}K`;

async function convert({ src, format, quality, edge }) {
  const out = join(src, "..", `${basename(src, extname(src))}.${format}`);
  let pipe = sharp(src);
  if (edge) pipe = pipe.resize({ width: edge, height: edge, fit: "inside" });
  await encode[format](pipe, quality).toFile(out);

  const [before, after] = await Promise.all([stat(src), stat(out)]);
  const saved = Math.round((1 - after.size / before.size) * 100);
  console.log(
    `${out.replace("public/", "").padEnd(32)} ${kb(before.size).padStart(6)} → ${kb(after.size).padStart(6)}  −${saved}%`,
  );
  return before.size - after.size;
}

const icons = (await readdir(ICON_DIR))
  .filter((file) => file.endsWith(".png"))
  .map((file) => ({ src: join(ICON_DIR, file), format: "avif", quality: 62, edge: ICON_EDGE }));

const saved = await Promise.all(
  [
    { src: "public/logo/loader-seal-art.png", format: "avif", quality: 80 },
    { src: "public/textures/indigo-shibori.png", format: "webp", quality: 80 },
    ...icons,
  ].map(convert),
);

console.log(`\nSaved ${kb(saved.reduce((a, b) => a + b, 0))} across ${saved.length} files.`);
