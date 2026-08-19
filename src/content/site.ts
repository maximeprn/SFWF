/* Site-wide constants. Anything the festival might correct lives here and nowhere else. */

/**
 * The 2026 dateline, confirmed by the festival on 19 August 2026 alongside the press-release
 * calendar. Change it here and it changes everywhere.
 */
export const FESTIVAL_DATES = {
  label: "26–31 August 2026",
  /** The hero and footer set it with spaces around the dash, as the design draws it. */
  display: "26 – 31 AUGUST 2026",
  /** Machine-readable, for JSON-LD and <time>. */
  start: "2026-08-26",
  end: "2026-08-31",
  location: "Siargao Island, Philippines",
} as const;

export const DATELINE = `${FESTIVAL_DATES.display} · SIARGAO ISLAND, PHILIPPINES`;

/**
 * Where this site lives. Every canonical, sitemap entry, Open Graph URL and JSON-LD id is
 * built from this, so it has to match the domain actually being served — move the site and
 * change it here only.
 */
export const SITE_URL = "https://siargaofoodfest.com";

export const SITE = {
  name: "Siargao Food & Wine Festival",
  shortName: "SFWF",
  /** The festival's own name for the 2026 edition. Lowercase display is deliberate. */
  edition: "ani sang Siargao",
  editionLabel: "2nd edition",
  description:
    "Ani sang Siargao — the six-day journey, 26–31 August 2026. Sixteen gatherings across " +
    "the island's nine municipalities, hosted by the people cooking at them.",
} as const;

/**
 * One address for the whole site. The Press page's `hello@siargaofoodandwinefestival.com`
 * is a phase 2 question; nothing in the one-pager reaches for it.
 */
export const CONTACT_EMAIL = "info@siargaofoodfest.com";

/**
 * The three marks in the footer. Each rests at its own slight angle so the row reads
 * hand-placed rather than aligned, and stands upright on hover.
 */
export const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/siargaofoodandwinefestival/",
    tilt: -5,
  },
  { name: "Facebook", href: "https://www.facebook.com/siargaofoodfest", tilt: 4 },
  { name: "TikTok", href: "https://www.tiktok.com/@siargaofoodfest", tilt: -3 },
] as const;

export type SocialName = (typeof SOCIALS)[number]["name"];

/**
 * The four sponsor marks, knocked out to beige. `intrinsic` is the artwork's own pixel
 * size — next/image needs it to reserve the box; the rendered height is set in CSS.
 */
export const SPONSORS = [
  { name: "Happy Living Philippines", src: "/sponsors/happy-living.png", intrinsic: [560, 338] },
  { name: "Modulus", src: "/sponsors/modulus.png", intrinsic: [640, 188] },
  { name: "Destileria Limtuaco", src: "/sponsors/destileria-limtuaco.svg", intrinsic: [2022, 416] },
  { name: "Galatea Tours Siargao", src: "/sponsors/galatea.svg", intrinsic: [2311, 955] },
  { name: "Coconut Cruisers", src: "/sponsors/coconut-cruisers.svg", intrinsic: [388, 391] },
  { name: "Greenhouse", src: "/sponsors/greenhouse.svg", intrinsic: [734, 271] },
  { name: "Masterplan Global", src: "/sponsors/masterplan-global.svg", intrinsic: [837, 713] },
  { name: "Ripple", src: "/sponsors/ripple.svg", intrinsic: [852, 243] },
  { name: "The Henry", src: "/sponsors/the-henry.svg", intrinsic: [383, 371] },
  { name: "Tropika", src: "/sponsors/tropika.svg", intrinsic: [395, 395] },
] as const;

/**
 * The host marks. Widths are hand-tuned per logo for optical weight, not derived from the
 * artwork — a uniform height leaves the wide wordmarks shouting and the round marks lost.
 *
 * Marks only. The prototype set two further hosts in type because they have no artwork;
 * that pair is out, so the row is a wall of logos with nothing lettered among them.
 */
export const HOST_LOGOS = [
  { name: "Wild Siargao", src: "/venues/beige/wild.png", width: 30, intrinsic: [114, 174] },
  { name: "Alma", src: "/venues/beige/alma.png", width: 84, intrinsic: [318, 141] },
  { name: "Lokal Lab", src: "/venues/beige/lokal-lab.png", width: 66, intrinsic: [249, 147] },
  { name: "Lyma", src: "/venues/beige/lyma.png", width: 64, intrinsic: [246, 147] },
  { name: "Kermit Siargao", src: "/venues/beige/kermit.png", width: 60, intrinsic: [228, 147] },
  { name: "Bravo Beach Resort", src: "/venues/beige/bravo.png", width: 42, intrinsic: [156, 165] },
  { name: "Roots Siargao", src: "/venues/beige/roots.png", width: 98, intrinsic: [372, 138] },
  { name: "Lamari", src: "/venues/beige/lamari.png", width: 92, intrinsic: [348, 75] },
  { name: "Hue Hotels & Resorts Siargao", src: "/venues/beige/hue.png", width: 62, intrinsic: [237, 138] },
  { name: "Sagana Siargao", src: "/venues/beige/sagana.png", width: 58, intrinsic: [560, 421] },
  { name: "Paraluman Siargao", src: "/venues/beige/paraluman.png", width: 78, intrinsic: [560, 296] },
  { name: "Isla Panciteria", src: "/venues/beige/isla-panciteria.png", width: 74, intrinsic: [560, 309] },
  { name: "Cev Siargao", src: "/venues/beige/cev.png", width: 72, intrinsic: [620, 246] },
  { name: "Lunares Café", src: "/venues/beige/lunares.png", width: 48, intrinsic: [420, 420] },
  { name: "Siargao Corner Café", src: "/venues/beige/siargao-corner-cafe.png", width: 48, intrinsic: [1120, 1121] },
] as const;
