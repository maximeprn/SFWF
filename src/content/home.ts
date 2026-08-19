/**
 * Home's prose. The festival's own words, and the copy blocks in README §10 verbatim.
 *
 * The stats are only figures the festival has actually published, and each one is checked
 * against the data where the data knows: `GATHERINGS` is the length of the calendar, not a
 * number typed twice. The design's own earlier draft said 18; the confirmed press-release
 * programme has sixteen.
 */
import { ALL_EVENTS } from "./events";

export const ISLAND_INTRO = [
  "Siargao is nine municipalities of farmland, mangrove and open water, and for six days " +
    "in August the whole island becomes the venue. Ani Sang Siargao is not held in one " +
    "place. It happens in kitchens, on a farm, in a wet market among the fishers, on a " +
    "beach at sunset, in the cafés that were here long before anyone was watching.",
  "There is no way to understand it from the outside. You have to come and eat with us.",
] as const;

export const ISLAND_SIGN_OFF = "See you on Siargao this August";

export const WHAT_IT_IS =
  "The Siargao Food & Wine Festival is the Philippines’ first community-led, island-wide " +
  "culinary festival. Six days, nine municipalities, and more than thirty chefs, farmers, " +
  "fishers, producers and venues, run by the people who actually live and cook here. Now " +
  "in its second year.";

export const STATS = [
  { figure: "6", label: "DAYS" },
  { figure: "9", label: "MUNICIPALITIES" },
  { figure: "30+", label: "MAKERS" },
  { figure: String(ALL_EVENTS.length), label: "GATHERINGS" },
] as const;

export const ACKNOWLEDGEMENT = {
  statement:
    "THE SIARGAO FOOD & WINE FESTIVAL IS HELD ON THE LAND AND WATERS OF THE PEOPLE OF SIARGAO.",
  body: [
    "We cook with what their farmers grow and their fishers bring in, and we gather in the " +
      "kitchens, markets and community spaces they built and still keep. This festival " +
      "celebrates those who stayed. The families who kept feeding this island through the " +
      "storms, through the pandemic, through every season the visitors did not see, and who " +
      "are still here doing it now.",
    "We ask our guests to arrive with that in mind, and to leave having supported it.",
  ],
} as const;

/**
 * Why we do this. Two numbered chapters, then the payoff.
 *
 * The bold phrase in chapter 01 is a `<strong>` in the same colour, not a second tint — on
 * the violet ground beige is already the contrast ceiling, so a lighter or warmer emphasis
 * reads as a broken link rather than as stress.
 */
export const PURPOSE = {
  heading: "Siargao grows less of its own food every year.",
  chapters: [
    {
      number: "01",
      label: "THE GAP",
      statement: "Tourism grows. But not everyone grows with it.",
      body: "As Siargao develops, rising costs, unequal access to resources and pressure on " +
        "local food systems can leave communities behind. The challenge is ensuring tourism " +
        "creates value ",
      emphasis: "with the island — not at its expense.",
    },
    {
      number: "02",
      label: "THE SOLUTION",
      statement: "Turn tourism into a force for local resilience.",
      body: "Through collaboration between hospitality, producers, chefs and communities, we " +
        "create more circular food systems — supporting local sourcing, reducing waste and " +
        "directing resources back into the communities that sustain Siargao.",
      emphasis: null,
    },
  ],
  payoff: "And it takes root — local farmers know what to grow.",
  closing: "The week is what gets everyone in the room. Join us and be part of the solution.",
  cta: "See the Program",
} as const;
