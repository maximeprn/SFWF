import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { DATELINE, SITE } from "@/content/site";

export const alt = `${SITE.name} — ${SITE.edition}, ${DATELINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Read off disk rather than `fetch(new URL(..., import.meta.url))`: this route is
   prerendered at build time, where the file: scheme is not fetchable. Each path is a
   literal so the bundler can trace exactly these four files — behind a variable it gives
   up and traces the whole project into the route. */
const root = process.cwd();
const GROUND = join(root, "src/assets/og-ground.jpg");
const WORDMARK = join(root, "public/logo/sfwf-beige.png");
const SCRIPT_FACE = join(root, "src/assets/fonts/beth-ellen.woff");
const META_FACE = join(root, "src/assets/fonts/arimo-700.woff");

const dataUri = (buf: Buffer, mime: string) =>
  `data:${mime};base64,${buf.toString("base64")}`;

/**
 * The link preview. It is the hero, reduced to the three things a share has to carry: whose
 * festival, what it is called, and when.
 *
 * The ground is `ground-rendered.png` from the handoff — the dye as the design says it
 * should resolve — so the card and the page are the same cloth rather than a flat stand-in.
 * The dateline is Arimo 700 tracked wide, not the `ui-monospace` the page uses: this renders
 * on a server with no system fonts, and a third font file to set one line is not worth the
 * weight.
 *
 * The palette is written out here rather than taken from `tokens.css` — Satori resolves no
 * custom properties, and there is no stylesheet on the render path. These four values must
 * be kept in step with the tokens by hand; they are the only hardcoded hexes in the product.
 */
export default function Image() {
  const ground = readFileSync(GROUND);
  const wordmark = readFileSync(WORDMARK);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#4F3F79",
          backgroundImage: `url(${dataUri(ground, "image/jpeg")})`,
          backgroundSize: "1200px 630px",
        }}
      >
        <img src={dataUri(wordmark, "image/png")} width={430} height={177} alt="" />
        <div
          style={{
            marginTop: 22,
            fontFamily: "Beth Ellen",
            fontSize: 66,
            color: "#E9622D",
            lineHeight: 1.16,
          }}
        >
          {SITE.edition}
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: "Arimo",
            fontWeight: 700,
            fontSize: 21,
            letterSpacing: 4.6,
            color: "#E9E7C2",
          }}
        >
          {DATELINE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Beth Ellen", data: readFileSync(SCRIPT_FACE), style: "normal", weight: 400 },
        { name: "Arimo", data: readFileSync(META_FACE), style: "normal", weight: 700 },
      ],
    },
  );
}
