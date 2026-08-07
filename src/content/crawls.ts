import type { Crawl, CrawlKey } from "./types";

/**
 * Hub mechanics. The live site repeats a near-identical four-step module on all three
 * crawl pages; here it is stated once, because both crawls run on one ₱500 passport.
 */
export const MECHANICS = [
  {
    title: "Buy Your Passport",
    blurb:
      "Purchase your Crawl Passport for only ₱500 at the Sayak Airport and all our participating establishments.",
  },
  {
    title: "Indulge in the Food and Drink",
    blurb:
      "Visit each of the participating karinderyas or coffee shops and order their signature dish or any drink.",
  },
  {
    title: "Get Stamped",
    blurb: "After each meal or drink, get your passport stamped by the establishment.",
  },
  {
    title: "Win Freebies",
    blurb:
      "Once you've collected all stamps per crawl, receive exclusive and limited edition goodies from the festival!",
  },
] as const;

export const PASSPORT = {
  eyebrow: "Crawl Ticket · both crawls included",
  price: "₱500",
  where:
    "On sale at Sayak Airport and all participating establishments across Siargao.",
} as const;

/**
 * The two crawls. The karinderya list is the richest content the festival has — every
 * eatery gets a sentence about the family behind it — so those render as bubbles while
 * the cafés render as their own logos. Don't reduce either to a name-only list.
 *
 * Café count: the festival's own copy says "Visit all 10 participating cafés" and lists
 * exactly ten, while one programme blurb elsewhere said fourteen. Ten matches the actual
 * partner list, so ten is used throughout. Worth confirming with the festival.
 */
export const CRAWLS: Readonly<Record<CrawlKey, Crawl>> = {
  coffee: {
    key: "coffee",
    tab: "Coffee Crawl",
    heading: "A Stamp at every Sip",
    intro:
      "Explore the island's rich coffee scene through a self-guided crawl of partner cafés. Collect your stamps and get a chance to win some cool goodies.",
    task: "Visit all 10 participating cafés and try any item on their menu.",
    prize:
      "Limited Edition Coffee Crawl T-Shirt — while supplies last, so don't snooze on your brews.",
    partnersLabel: "in partnership with our island cafés:",
    venues: [
      { name: "LOKA", logo: "loka" },
      { name: "Coffee Stroll", logo: "coffee-stroll" },
      { name: "Pawikan", logo: "pawikan" },
      { name: "Marmalade", logo: "marmalade" },
      { name: "St. Thomas", logo: "st-thomas" },
      { name: "Amon", logo: "amon" },
      { name: "Good Times Coffee", logo: "good-times-coffee" },
      { name: "Sunset Coffee Roasters", logo: "sunset-coffee-roasters" },
      { name: "Mondayyys", logo: "mondayyys" },
      { name: "Happy Islanders Club", logo: "happy-islanders-club" },
    ],
  },
  karinderya: {
    key: "karinderya",
    tab: "Suroy Suroy sa Karinderya",
    heading: "Kollect your Stamps and get a chance to win some goodies",
    intro:
      "This food crawl pays tribute to the local eateries and families who've been quietly shaping Siargao's culinary identity long before it became a travel hotspot. These are the kitchens that fed generations, served after storms, and stayed open through waves of change.",
    task: "Visit each of the 6 participating karinderyas and order their signature dish.",
    prize:
      "Collect all 6 stamps and be among the first 25 finishers to receive a Limited Edition Karinderya Crawl T-Shirt.",
    partnersLabel: "in partnership with our island eateries:",
    venues: [
      {
        name: "Talia's karinderya",
        note: "One of the OG family-run karinderyas near the church, serving affordable home-cooked meals with island warmth.",
      },
      {
        name: "Pan de Siargao",
        note: "Makers of the island's beloved pan de coco and iconic pan de surf — a must-stop for fresh, local bread.",
      },
      {
        name: "Kanto ta Par",
        note: "Street food classics from one of Siargao's first ihaw-ihaw stalls — grab a stick, chill, and eat like a local.",
      },
      {
        name: "Jorene's Homemade Ice Cream",
        note: "A sweet, homemade treat that's become a local favorite — don't miss her signature island-inspired flavors.",
      },
      {
        name: "Kabja",
        note: "Road-side goodness at its finest — serving kambing, bulalo, and balbacua.",
      },
      {
        name: "Kurvada",
        note: "A karinderya with a twist — vegetarian and pescetarian-friendly, Kurvada brings a fresh take on local comfort food.",
      },
    ],
  },
};

export const CRAWL_KEYS = ["coffee", "karinderya"] as const satisfies readonly CrawlKey[];
