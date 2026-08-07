import type { FestivalDay } from "./types";

/**
 * The 2026 programme — sixteen events across eight day-blocks, verbatim from the festival's
 * own copy. Local vocabulary (kinilaw, boodle, karinderya, adlai, inyam) is used unglossed
 * and should stay that way; "karinderya" is the standardised spelling, since the source
 * alternates between karinderya / carinderia / karinerya.
 *
 * Note the two separate August 31 blocks — Mamon Island & Siago, and Harana Surf Resort.
 * They are genuinely different days' worth of programming at different venues, not a
 * duplicate, which is why they carry distinct ids.
 */
export const DAYS: readonly FestivalDay[] = [
  {
    id: "aug-26-wild",
    date: "August 26",
    venue: "Wild Siargao",
    events: [
      {
        id: "opening-gala",
        title: "Opening Gala & Dinner",
        tier: "paid",
        venue: "Wild Siargao",
        blurb:
          "A special evening with Chef Andrew Malarky, and guests Chef Dom Marquez-Hammond, and Chef Sean Singco. With cocktails by Jessey Qi of Last Chance.",
        credit: "In partnership with Bezza, Supernatural Wine, Bauhinia Brew",
      },
    ],
  },
  {
    id: "all-week",
    date: "Happening All Week",
    venue: "Island-wide",
    allWeek: true,
    events: [
      {
        id: "laylow-coffee-crawl",
        title: "Laylow Coffee Crawl",
        tier: "allWeek",
        venue: "10 cafés",
        crawl: "coffee",
        blurb:
          "Explore the island's rich coffee scene through a self-guided crawl of partner cafés.",
      },
      {
        id: "suroy-suroy-karinderya",
        title: "Suroy Suroy sa Karinderya",
        tier: "allWeek",
        venue: "6 karinderyas",
        crawl: "karinderya",
        blurb:
          "A crawl of beloved karinderya featuring their signature dishes. Get to know Siargao's homegrown flavors and the families behind them.",
      },
    ],
  },
  {
    id: "aug-27-28-various",
    date: "August 27–28",
    venue: "Various Venues",
    events: [
      {
        id: "coffee-cupping",
        title: "Coffee Cupping by Laylow",
        tier: "free",
        venue: "Wild Siargao",
        blurb: "Cupping of beans from island cafes—discover the diverse brews of Siargao.",
      },
      {
        id: "bravo-sundown",
        title: "Bravo Cocktail Acoustic Sundown",
        tier: "free",
        venue: "Bravo Beach Resort",
        blurb: "An afternoon of Filipino-Spanish fusion tapas.",
      },
      {
        id: "kermit-pizza",
        title: "Kermit Pizza Experience",
        tier: "paid",
        venue: "Kermit Siargao",
        blurb:
          "A Kermit Pizza Experience featuring guest Chef Gringo, with cocktails by JUAGI.",
      },
      {
        id: "kiniloy-masterclass",
        title: "Kiniloy Masterclass",
        tier: "free",
        venue: "Kermit Siargao",
        blurb: "Learn how to make the iconic Siargao-style kinilaw.",
        credit: "with Genelo 'Eloy' Nogalo",
      },
      {
        id: "natural-wine-101",
        title: "Super Natural Wine 101",
        tier: "free",
        venue: "Wild Siargao",
        blurb:
          "A guided tasting and intro workshop exploring the basics of natural wine.",
      },
    ],
  },
  {
    id: "aug-28-lyma",
    date: "August 28",
    venue: "Lyma Siargao",
    events: [
      {
        id: "introduction-to-lyma",
        title: "Introduction to Lyma",
        tier: "paid",
        venue: "Lyma Siargao",
        blurb:
          "A soft opening featuring sustainable, island-inspired plates, house ferments, and natural wines.",
        credit: "with Chef Marc Silvestre Carbó",
      },
    ],
  },
  {
    id: "aug-29-roots",
    date: "August 29",
    venue: "Roots Siargao",
    events: [
      {
        id: "roots-field-day",
        title: "Roots Field Day Experience",
        tier: "paid",
        venue: "General Luna",
        blurb:
          "A half-day immersion exploring Siargao Organics, the local market, and a shared ceviche feast with local fishermen.",
      },
      {
        id: "lamari-brunch",
        title: "Lamari Sunday Brunch",
        tier: "paid",
        venue: "Lamari Siargao",
        blurb: "Ease into the weekend with a fresh take on brunch classics.",
        credit: "by Chef Erica Quemado",
      },
    ],
  },
  {
    id: "aug-30-roots",
    date: "August 30",
    venue: "Roots Siargao",
    events: [
      {
        id: "roots-tasting-dinner",
        title: "Roots Tasting Dinner",
        tier: "paid",
        venue: "Roots Siargao",
        blurb:
          "A tasting menu highlighting inyam and adlai — two deeply rooted Filipino ingredients.",
        credit: "reimagined by Kat Cortez",
      },
    ],
  },
  {
    id: "aug-31-mamon",
    date: "August 31",
    venue: "Mamon Island & Siago",
    events: [
      {
        id: "jam-on-in-mamon",
        title: "Jam On in Mam-On",
        tier: "paid",
        venue: "Mamon Island",
        blurb:
          "An island tour with a beachfront boodle, in partnership with Galatea Tours.",
        credit: "Chef David Del Rosario · Chef Agnes Sanchez · Sweet Halika",
      },
      {
        id: "siago-x-alma",
        title: "Siago x Alma La Puesta del Sol",
        tier: "paid",
        venue: "Siago",
        blurb:
          "An evening inspired by Spain and Latin America, featuring Alma's signature paellas, tapas, agave cocktails and live music.",
      },
    ],
  },
  {
    id: "aug-31-harana",
    date: "August 31",
    venue: "Harana Surf Resort",
    events: [
      {
        id: "closing-ceremonies",
        title: "Closing Ceremonies & TABO Market",
        tier: "free",
        venue: "Bayani at Harana Surf Resort",
        blurb:
          "LokalLab TABO Market, cocktails by Adam Hrapko of Paraluman Gin Parlour, and community recognition and awards.",
      },
      {
        id: "latte-art-throwdown",
        title: "1st Siargao Latte Art Throwdown",
        tier: "free",
        venue: "Harana Surf Resort",
        blurb: "An island showdown of creativity and skill, hosted by Laylow.",
      },
    ],
  },
];

export const TIER_LABEL = {
  free: "Free",
  paid: "Ticketed",
  allWeek: "All week",
} as const;
