import type { CSSProperties } from "react";
import type { Stroke } from "./story";

/**
 * The payoff image: a root system spreading out under the last bubble. It is the one place
 * chapter 02's stem finally goes somewhere, so it draws for far longer than any other
 * connector (4.2s, set on `.purpose .roots path` in globals.css).
 *
 * Hand-drawn, like the rest of the story's linework — the taper comes from ~60 paths at
 * decreasing stroke weights, not from a generator.
 */

const GHOST = "rgba(255,255,255,.36)";
const len = (l: number): CSSProperties => ({ "--l": l }) as CSSProperties;

/** The two main laterals, spreading left and right from the crown. */
const LATERALS: readonly Stroke[] = [
  { d: "M143 0 C135 -1 130 4 124 7 C116 10 111 7 103 11 C95 16 91 22 83 26 C75 30 68 29 60 35 C50 42 45 51 37 55 C28 60 18 60 10 66 C6 69 4 72 2 75", sw: 3.2 },
  { d: "M143 0 C153 -2 161 2 169 5 C178 9 183 14 191 16 C201 18 209 16 218 21 C227 26 233 34 242 37 C252 40 260 40 269 46 C279 53 287 59 297 62", sw: 3 },
];

/** The taproots, running straight down from the crown. */
const TAPROOTS: readonly Stroke[] = [
  { d: "M143 0 C139 11 131 18 133 30 C135 41 126 50 130 61 C134 72 127 83 130 94 C133 104 129 113 126 121", sw: 2.4 },
  { d: "M143 0 C150 10 155 18 151 28 C146 39 150 50 146 60 C141 69 149 79 145 89 C141 99 146 109 143 118", sw: 2.2 },
  { d: "M143 0 C159 9 165 16 162 27 C159 37 169 45 166 56 C163 67 171 75 169 86 C168 98 173 106 171 115", sw: 2 },
  { d: "M143 0 C133 9 124 13 119 22 C114 31 117 40 112 49 C107 59 111 70 106 79 C102 89 105 98 101 108", sw: 1.8 },
];

/** Secondaries dropping off the laterals. */
const SECONDARIES: readonly Stroke[] = [
  { d: "M103 11 C100 20 94 28 89 34 C84 41 86 49 80 56 C74 64 71 73 68 83", sw: 2.2 },
  { d: "M60 35 C58 45 54 48 50 56 C46 64 47 72 42 79 C37 86 37 94 33 102", sw: 1.9 },
  { d: "M191 16 C195 26 200 32 204 40 C207 49 214 54 216 63 C218 72 226 77 230 87", sw: 2.1 },
  { d: "M242 37 C240 46 245 52 244 60 C243 69 250 74 252 82 C254 90 262 95 266 103", sw: 1.8 },
];

const TERTIARIES: readonly Stroke[] = [
  { d: "M124 7 C120 13 115 14 111 20 C108 25 104 29 99 29", sw: 1.8 },
  { d: "M103 11 C95 12 89 17 82 17 C77 18 72 21 67 25", sw: 1.5 },
  { d: "M83 26 C75 30 70 36 64 39 C60 42 57 43 55 43", sw: 1.6 },
  { d: "M60 35 C52 37 46 41 41 44 C37 47 34 48 31 49", sw: 1.4 },
  { d: "M37 55 C31 60 26 63 22 68 C20 71 19 74 18 76", sw: 1.3 },
  { d: "M10 66 C8 72 5 77 5 81 C4 84 4 87 4 88", sw: 1.1 },
  { d: "M89 34 C82 40 77 43 72 49 C68 53 65 56 64 56", sw: 1.7 },
  { d: "M80 56 C73 61 68 66 64 72 C60 77 58 82 56 84", sw: 1.5 },
  { d: "M68 83 C63 89 59 94 57 100 C55 105 54 109 53 111", sw: 1.2 },
  { d: "M50 56 C43 60 39 66 35 70 C32 74 29 77 28 79", sw: 1.6 },
  { d: "M42 79 C35 84 31 90 27 95 C23 99 21 103 19 105", sw: 1.3 },
  { d: "M33 102 C29 107 27 111 25 115 C24 117 23 119 22 119", sw: 1.1 },
  { d: "M169 5 C175 10 179 15 182 20 C185 24 187 27 188 28", sw: 1.7 },
  { d: "M191 16 C198 19 204 21 209 25 C211 27 213 29 214 30", sw: 1.6 },
  { d: "M218 21 C225 22 232 24 237 26 C240 27 242 28 243 28", sw: 1.5 },
  { d: "M242 37 C250 39 257 42 263 45 C267 48 270 50 271 51", sw: 1.4 },
  { d: "M269 46 C277 50 283 54 287 59 C290 62 291 65 292 67", sw: 1.2 },
  { d: "M297 62 C298 67 298 72 299 76 C299 79 299 81 299 82", sw: 1.1 },
  { d: "M204 40 C211 44 216 48 220 53 C223 56 224 58 225 59", sw: 1.6 },
  { d: "M216 63 C223 68 229 73 233 78 C236 81 238 83 239 84", sw: 1.4 },
  { d: "M230 87 C235 93 240 98 243 103 C245 106 246 109 247 110", sw: 1.1 },
  { d: "M244 60 C251 62 257 67 261 71 C264 73 267 75 268 76", sw: 1.5 },
  { d: "M252 82 C260 86 266 91 271 96 C274 99 277 102 278 103", sw: 1.3 },
  { d: "M266 103 C271 108 275 112 278 116 C280 117 281 118 282 118", sw: 1.1 },
  { d: "M130 61 C122 66 118 72 114 79 C110 86 111 95 104 102", sw: 1.5 },
  { d: "M166 56 C174 61 178 68 181 76 C184 85 192 91 199 99", sw: 1.3 },
];

/** The finest hairs, where the system fades out. */
const HAIRS: readonly Stroke[] = [
  { d: "M99 29 C95 29 92 31 89 33", sw: 1.2 },
  { d: "M99 29 C97 33 96 36 94 39", sw: 1 },
  { d: "M55 43 C51 44 48 47 45 49", sw: 1.1 },
  { d: "M18 76 C14 78 12 82 10 85", sw: 1 },
  { d: "M56 84 C52 87 49 91 47 94", sw: 1.1 },
  { d: "M56 84 C56 89 54 94 54 98", sw: 1 },
  { d: "M53 111 C49 114 47 118 45 121", sw: 1 },
  { d: "M214 30 C218 31 221 34 224 36", sw: 1.2 },
  { d: "M214 30 C215 34 218 38 219 41", sw: 1 },
  { d: "M292 67 C295 70 297 73 299 76", sw: 1 },
  { d: "M239 84 C242 88 245 91 248 94", sw: 1.1 },
  { d: "M247 110 C250 114 253 117 256 120", sw: 1 },
];

const Paths = ({ set }: { readonly set: readonly Stroke[] }) => (
  <>
    {set.map((s) => (
      <path key={s.d} d={s.d} strokeWidth={s.sw} />
    ))}
  </>
);

/** The stem coming down out of the last bubble, before the crown. */
const STEM = "M143 0 C141 6 146 10 142 16 C139 20 145 23 143 26";

export function RootsMark() {
  return (
    <div className="rv" style={{ margin: "-4px 0 0" }}>
      <svg
        className="cr roots"
        width="316"
        height="157"
        viewBox="0 0 302 150"
        fill="none"
        aria-hidden="true"
        style={{ display: "block", marginLeft: 8, maxWidth: "100%" }}
      >
        <g stroke={GHOST} strokeLinecap="round" style={len(46)} transform="translate(2.5,2)">
          <path d={STEM} strokeWidth={1.8} />
        </g>
        <g stroke="var(--mark)" strokeLinecap="round" style={len(46)}>
          <path d={STEM} strokeWidth={3.4} />
        </g>

        <g transform="translate(0,26)">
          <g stroke={GHOST} strokeLinecap="round" style={len(300)} transform="translate(2.5,2)">
            {LATERALS.map((s) => (
              <path key={s.d} d={s.d} strokeWidth={1.6} />
            ))}
          </g>
          <g stroke="var(--mark)" strokeLinecap="round" style={len(300)}>
            <Paths set={LATERALS} />
          </g>
          <g stroke="var(--mark)" strokeLinecap="round" style={len(160)}>
            <Paths set={TAPROOTS} />
          </g>
          <g stroke="var(--mark)" strokeLinecap="round" style={len(170)}>
            <Paths set={SECONDARIES} />
          </g>
          <g stroke="var(--mark)" strokeLinecap="round" style={len(120)}>
            <Paths set={TERTIARIES} />
          </g>
          <g stroke="var(--mark)" strokeLinecap="round" style={len(70)}>
            <Paths set={HAIRS} />
          </g>
        </g>
      </svg>
    </div>
  );
}
