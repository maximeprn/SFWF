/**
 * "Why we do this" — the purpose story, told as a growing line.
 *
 * Chapter 01 is the problem: four bubbles stepping down a stem that keeps forking but never
 * blooms, ending in a stub. Chapter 02 is the answer: the same stem, now putting out buds,
 * ending in a root system. The connectors are hand-drawn — each one is a specific shape
 * cut to sit between two specific bubbles — so they are data, not generated.
 *
 * `len` is the path's approximate length, used as the stroke-dasharray so it draws itself
 * on at a consistent rate regardless of how long the path actually is.
 */

export interface Stroke {
  readonly d: string;
  readonly sw: number;
}

export interface Bud {
  /** Where the bud sits, in the connector's own viewBox coordinates. */
  readonly x: number;
  readonly y: number;
  readonly rot?: number;
  /** A dot rather than a leaf — the smaller of the two bud forms. */
  readonly dot?: boolean;
}

export interface Connector {
  readonly w: number;
  readonly h: number;
  readonly vb: string;
  /** Negative margins tuck the connector into the bubbles above and below it. */
  readonly margin: string;
  readonly main: Stroke;
  readonly len: number;
  /** Side shoots off the main stem. */
  readonly branches?: readonly Stroke[];
  /** The two short strokes that close chapter 01 — a stub, not a bud. */
  readonly ends?: readonly Stroke[];
  readonly buds?: readonly Bud[];
}

export interface StoryStep {
  readonly n: string;
  readonly title: string;
  readonly body: string;
  /** Ragged widths and alternating sides are what make the column read as a line. */
  readonly width: string;
  readonly side: "left" | "right" | "center";
  readonly blob: number;
}

export const PROBLEM_STEPS: readonly StoryStep[] = [
  {
    n: "01",
    title: "There is no short route",
    body: "With no local buyer to plant for, growers guess what to sow — and sow less.",
    width: "93%",
    side: "left",
    blob: 0,
  },
  {
    n: "02",
    title: "Seed supply has thinned",
    body: "Fewer varieties are available locally at the start of every season.",
    width: "79%",
    side: "right",
    blob: 1,
  },
  {
    n: "03",
    title: "So seed comes from abroad",
    body: "What's left is ordered in from abroad by the sack, sight unseen.",
    width: "86%",
    side: "left",
    blob: 2,
  },
  {
    n: "04",
    title: "Our own varieties go quiet",
    body: "Imported seed gives back less here, and each season another island variety stops being planted.",
    width: "90%",
    side: "right",
    blob: 4,
  },
];

export const PROBLEM_CONNECTORS: readonly Connector[] = [
  {
    w: 84,
    h: 86,
    vb: "0 0 84 86",
    margin: "-5px 0 -6px 86px",
    main: { d: "M12 4C4 24 30 32 20 50C11 66 32 74 26 82", sw: 3.6 },
    len: 120,
  },
  {
    w: 150,
    h: 112,
    vb: "0 0 150 112",
    margin: "-18px 0 -19px 96px",
    main: { d: "M10 4C24 28 4 42 22 62C40 82 82 86 112 106", sw: 3.4 },
    len: 200,
    branches: [{ d: "M22 62C12 70 8 78 10 86", sw: 2.2 }],
  },
  {
    w: 150,
    h: 80,
    vb: "0 0 150 80",
    margin: "-2px 0 -3px 128px",
    main: { d: "M120 4C102 22 66 16 36 28C14 37 6 56 14 72", sw: 3.8 },
    len: 200,
    branches: [{ d: "M36 28C42 16 54 12 64 14", sw: 2.2 }],
    buds: [{ x: 64, y: 14, rot: -28 }],
  },
];

/** Chapter 01's ending: the line runs out. A stub with two short strokes, and no bud. */
export const DEAD_END: Connector = {
  w: 86,
  h: 56,
  vb: "0 0 86 56",
  margin: "0",
  main: { d: "M14 4C7 18 22 24 16 39", sw: 3.6 },
  len: 70,
  ends: [
    { d: "M16 39L7 49", sw: 2.2 },
    { d: "M16 39L24 50", sw: 2.2 },
  ],
};

export const SOLUTION_STEPS: readonly StoryStep[] = [
  {
    n: "01",
    title: "One week, one room",
    body: "Growers, restaurants and cafés in the same place, once a year.",
    width: "83%",
    side: "left",
    blob: 1,
  },
  {
    n: "02",
    title: "The kitchens already doing it",
    body: "The ones already sourcing this way carry the programme and get the audience.",
    width: "91%",
    side: "right",
    blob: 2,
  },
  {
    n: "03",
    title: "Demand, written down early",
    body: "Kitchens say what they will want, while there is still time to plant it.",
    width: "78%",
    side: "center",
    blob: 3,
  },
  {
    n: "04",
    title: "They know what to plant",
    body: "A standing relationship with a kitchen tells a grower what's wanted, before the season starts.",
    width: "93%",
    side: "right",
    blob: 0,
  },
];

export const SOLUTION_CONNECTORS: readonly Connector[] = [
  {
    w: 110,
    h: 96,
    vb: "0 0 110 96",
    margin: "-10px 0 -11px 24px",
    main: { d: "M14 4C4 26 34 32 22 52C10 72 42 78 36 90", sw: 3.6 },
    len: 145,
    branches: [
      { d: "M22 52C34 48 44 52 52 44", sw: 2.2 },
      { d: "M22 52C14 58 8 66 10 74", sw: 2.2 },
    ],
    buds: [
      { x: 52, y: 44, rot: -26 },
      { x: 10, y: 74, dot: true },
    ],
  },
  {
    w: 164,
    h: 80,
    vb: "0 0 164 80",
    margin: "-2px 0 -3px 40px",
    main: { d: "M10 4C28 22 64 14 96 26C120 35 132 52 140 68", sw: 3.4 },
    len: 200,
    branches: [
      { d: "M96 26C98 14 108 8 118 10", sw: 2.2 },
      { d: "M96 26C86 32 78 40 80 50", sw: 2.2 },
    ],
    buds: [
      { x: 118, y: 10, rot: -16 },
      { x: 80, y: 50, dot: true },
    ],
  },
  {
    w: 134,
    h: 106,
    vb: "0 0 134 106",
    margin: "-15px 0 -16px 140px",
    main: { d: "M110 4C120 26 88 36 100 56C112 76 70 84 82 100", sw: 3.7 },
    len: 165,
    branches: [
      { d: "M100 56C112 52 120 58 126 52", sw: 2.2 },
      { d: "M100 56C90 64 86 74 90 82", sw: 2.2 },
    ],
    buds: [
      { x: 126, y: 52, rot: -10 },
      { x: 90, y: 82, dot: true },
    ],
  },
];

/** The leaf shape every bud uses. */
export const BUD_PATH = "M0 0C3.5-5 10.5-5.5 13.5-1C10.5 4 3.5 4.5 0 0Z";

/**
 * Both chapters open the same way — numeral and rule on one line, then a heading and the
 * copy that frames what follows. The prototype set chapter 01's label inline on the rule
 * instead; matching 02 makes the two halves of the argument read as a pair.
 */
export const PURPOSE_COPY = {
  eyebrow: "Why we do this",
  title: "Siargao grows less of its own food every year.",
  problemTitle: "The problem",
  problemIntro:
    "Not for lack of farmers. For lack of a route between them and the kitchens two towns over — and for lack of seed that belongs here.",
  deadEnd: "The line runs out. Nothing carries the season forward.",
  solutionTitle: "How do we fix this",
  solutionIntro:
    "Enough people here have already found a way. The festival gathers them, so what one farm proved can become how the island eats.",
  payoff: "And it takes root — Local farmers know what to grow.",
  closing: "The week is what gets everyone in the room. Join us and be part of the solution.",
} as const;
