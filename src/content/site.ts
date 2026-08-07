/* Site-wide constants. Anything the festival might correct lives here and nowhere else. */

/**
 * The 2026 dateline. Sources disagree: the live 2025 site is a partial find-replace and
 * contradicts itself across all seven pages, and an earlier hero prototype carried
 * 14–21 August. These are the dates the current mobile prototype states in its hero and
 * backs up with a full eight-block programme, so they are what the site uses.
 *
 * Still unconfirmed by the festival — change it here and it changes everywhere.
 */
export const FESTIVAL_DATES = {
  label: "26–31 August 2026",
  /** Machine-readable, for JSON-LD and <time>. */
  start: "2026-08-26",
  end: "2026-08-31",
  location: "Siargao Island, Philippines",
} as const;

export const DATELINE = `${FESTIVAL_DATES.label} · ${FESTIVAL_DATES.location}`;

export const SITE = {
  name: "Siargao Food & Wine Festival",
  shortName: "SFWF",
  tagline: "A weeklong celebration of food, culture, and community.",
  description:
    "A weeklong celebration of food, culture, and community on Siargao Island — " +
    `${FESTIVAL_DATES.label}. Sixteen events, a self-guided coffee and karinderya crawl, ` +
    "and thirty-plus collaborators across the island's nine municipalities.",
} as const;

/** The menu. "Tickets" is pinned separately in the nav band, so it is not a menu word. */
export const NAV = [
  { label: "Home", href: "/" },
  { label: "Program", href: "/program" },
  { label: "Food Crawl", href: "/food-crawl" },
  { label: "Media Center", href: "/media-center" },
  { label: "About", href: "/about" },
] as const;

/**
 * Two addresses appear in the source and both are kept: the festival's general address
 * and the one the Media Center gives for press. Not deduplicated on purpose.
 */
export const CONTACT = {
  general: "info@siargaofoodfest.com",
  press: "hello@siargaofoodandwinefestival.com",
} as const;

/**
 * The festival ships no social icon assets, so these are drawn in the same yellow
 * line-weight as the food icons. Each sits at its own slight angle so the row reads
 * hand-placed rather than aligned.
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

/** Homepage stats. Two of the four carry no number and the design renders an em-dash
 *  rather than inventing one — the source is sparse and honest, and stays that way. */
export const STATS = [
  { value: "8+", label: "Events & pocket experiences" },
  { value: "30+", label: "Culinary collaborators" },
] as const;
