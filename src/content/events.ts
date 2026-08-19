import type { FestivalDay } from "./types";

/**
 * The confirmed 2026 calendar — six days, sixteen events — from the festival's own press
 * releases (`SFWF_2026_3_Press_Releases`). This is not the deck the 2025 site was built
 * from: that one carried seventeen events across eight blocks, some of which were dropped
 * and some merged. Where the two disagree, the press release wins.
 *
 * Copy is the festival's own, edited only for length. Local vocabulary stays unglossed —
 * karinderya, kinilaw, sugba, salo-salo, miki — and "karinderya" is the standardised
 * spelling, since the source alternates between karinderya / carinderia / karinerya.
 *
 * `TBD` prices are real content state, not placeholders to fill in: five events have no
 * confirmed price and the UI stays silent about them rather than guessing.
 */
export const DAYS: readonly FestivalDay[] = [
  {
    id: "aug-26",
    date: "AUG 26",
    weekday: "WED 26",
    longWeekday: "Wednesday 26 August",
    name: "gala opening",
    icon: "wine",
    iconWidth: 34,
    events: [
      {
        id: "wild-opening",
        venue: "WILD",
        time: "6PM – 10PM",
        title: "Ani sang Siargao opening celebration",
        price: "TBD",
        who: "Chef Morris · Chef Jarrod · Chef Hannah · Chef Dre · the WILD team · Manu",
        desc:
          "Ani sang Siargao opens with a high-energy celebration at WILD Siargao, bringing " +
          "together chefs, farmers, media, creatives, partners and guests from across the " +
          "island and beyond. The evening features cultural performances by Espoir, " +
          "specialty cocktails by Manu, and a collaborative chef-led dining experience.",
      },
    ],
  },
  {
    id: "aug-27",
    date: "AUG 27",
    weekday: "THU 27",
    longWeekday: "Thursday 27 August",
    name: "ocean day",
    icon: "fish",
    iconWidth: 40,
    events: [
      {
        id: "corner-cafe-brewed",
        venue: "SIARGAO CORNER CAFÉ",
        time: "8AM – 11AM",
        title: "Brewed by the Pioneers",
        price: "FREE",
        who: "Guests from Don Narciso Café, Claveria (Misamis Oriental)",
        desc:
          "Waffle, Coffee and Roasting 101. Participants taste two coffees without knowing " +
          "what they are, then guests from Don Narciso Café educate them on the basics of " +
          "coffee roasting and lead a Coffee Appreciation on the Siargao Robusta.",
      },
      {
        id: "gl-market-roots",
        venue: "GL PUBLIC MARKET",
        time: "4PM – 6PM",
        title: "Wet market experience by Roots",
        price: "À LA CARTE",
        who: "Roots",
        desc:
          "Set in the heart of the General Luna Wet Market, among fishermen and local " +
          "vendors, this casual standing pop-up celebrates Siargao’s everyday coastal food " +
          "culture through fresh seafood, island drinks and an open, community-driven " +
          "atmosphere.",
      },
      {
        id: "alma-supper-club",
        venue: "ALMA",
        time: "1ST SEATING 5PM · 2ND 8PM",
        title: "Alma × CMD Supper Club tasting menu",
        price: "TBD",
        who: "Chef Luis · Chef Morris",
        desc:
          "Chef Luis Martinez and Chef Morris Danzen prepare a beautiful dinner focused on " +
          "the bounty of Siargao’s prime and native seafood.",
      },
    ],
  },
  {
    id: "aug-28",
    date: "AUG 28",
    weekday: "FRI 28",
    longWeekday: "Friday 28 August",
    name: "coconut day",
    icon: "coconut",
    iconWidth: 32,
    events: [
      {
        id: "lunares-brewed",
        venue: "LUNARES CAFÉ",
        time: "8AM – 11AM",
        title: "Brewed by the Pioneers",
        price: "TBD",
        who: null,
        desc:
          "Coffee, pastry, and island café Italian culture. Relaxed, welcoming and focused " +
          "on the relationship between coffee, breakfast and café culture that brings the " +
          "Italian flavours.",
      },
      {
        id: "isla-panciteria-miki",
        venue: "ISLA PANCITERIA",
        time: "ALL DAY",
        title: "Miki Fiesta!",
        price: "À LA CARTE",
        who: "Isla Panciteria",
        desc:
          "Isla Panciteria presents Miki Fiesta, a celebration of Filipino miki featuring " +
          "three new signature miki dishes inspired by the flavours of Siargao and the sea. " +
          "It opens with a free miki-making workshop, followed by an afternoon of street " +
          "food, music and cocktails, with a one-day-only à la carte festival menu and " +
          "exclusive merchandise.",
      },
      {
        id: "lokal-hub-coconut-lab",
        venue: "LOKAL HUB",
        time: "5PM – 7PM",
        title: "Meet the Changemakers: Coconut Lab, from tree to table",
        price: "FREE",
        who: "c/o Lokal",
        desc:
          "Lokal Hub hosts a very special Meet the Changemakers featuring workshops and " +
          "talks on processing, fermentation, and zero-waste coconut utilization.",
      },
      {
        id: "lyma-jarrod-moore",
        venue: "LYMA",
        time: "DINNER",
        title: "Chef Jarrod Moore × Lyma collaboration dinner",
        price: "₱2,400 / HEAD",
        who: "Chef Jarrod · Chef Marc · Chef Jose (Lyma)",
        desc:
          "Chef Jarrod, Chef Marc and Chef Jose collaborate on a coconut-themed, zero-waste " +
          "five-course dinner at Lyma.",
      },
    ],
  },
  {
    id: "aug-29",
    date: "AUG 29",
    weekday: "SAT 29",
    longWeekday: "Saturday 29 August",
    name: "producer day",
    icon: "dish",
    iconWidth: 34,
    events: [
      {
        id: "tropical-academy-outback",
        venue: "TROPICAL ACADEMY SAN ISIDRO",
        time: "DAYTIME",
        title: "Island meets the Outback",
        price: "TBD",
        who: "Chef Jarrod · Chef Morris · Lokal",
        desc:
          "Spend a day immersed in the rhythms of island agriculture. Guests are invited to " +
          "learn alongside farmers and chefs through farming, workshops and conversations " +
          "centred on Siargao’s land and food culture.",
      },
      {
        id: "kermit-pizza-contest",
        venue: "KERMIT",
        time: "4PM",
        title: "Kermit pizza eating contest!",
        price: "TBD",
        who: null,
        desc:
          "Pizza making workshops showcasing native ingredients, and the ever-popular Pizza " +
          "Eating Contest back for its second year.",
      },
      {
        id: "lamari-bounty",
        venue: "LAMARI",
        time: "6:30PM",
        title: "Lamari presents “The Bounty of Siargao”",
        price: "₱1,500",
        who: "Chef Ericka · Sinta · FullMoon · Lokal Lab",
        desc:
          "A story of abundance told through a convergence of chefs who revere and celebrate " +
          "the incredible native produce Siargao has to offer. LAMARI, Sinta, FullMoon " +
          "Siargao and Lokal Lab come together for a collaborative feast prepared entirely " +
          "from 100% local produce.",
      },
      {
        /* No line-up and no description on record. That is real content state, not a gap to
           design around — the bubble says so in its own words. */
        id: "paraluman-after-dinner",
        venue: "PARALUMAN",
        time: "9PM – 1AM",
        title: "After dinner bar feature",
        price: "TBD",
        who: null,
        desc: null,
      },
    ],
  },
  {
    id: "aug-30",
    date: "AUG 30",
    weekday: "SUN 30",
    longWeekday: "Sunday 30 August",
    name: "community day",
    icon: "ukulele",
    iconWidth: 22,
    events: [
      {
        id: "mam-on-chefs-table",
        venue: "MAM-ON ISLAND",
        time: "9AM – 5PM",
        title: "Island style chef’s table",
        price: "₱6,000 / HEAD",
        who: "Chef David · Hapag Manila · Ayà Manila · Last Chance",
        desc:
          "Cev brings the chefs of Hapag Manila (1 Michelin Star) and Ayà Manila (Michelin " +
          "Selected) over to curate an island feast on beautiful Mam-on Island — a " +
          "one-of-a-kind boodle fight inspired heavily by kinilaw (raw) and sugba (grilled) " +
          "cooking techniques. Cocktails by Last Chance.",
      },
      {
        id: "bravo-mercado",
        venue: "BRAVO",
        time: "4PM – 9PM",
        title: "Siargao Mercado",
        price: "OPEN FOR ALL",
        who: "Assorted restaurants and eateries of Siargao",
        desc:
          "Bravo hosts a vibrant gathering celebrating the flavours and creativity of " +
          "Siargao. Karinderyas, local eateries and some of Siargao’s favourite restaurants " +
          "come together right by the beach, with live performances, workshops and cultural " +
          "programming, plus the community introduction of Slow Food Siargao — a local " +
          "chapter of the international Slow Food movement, formed by island chefs, giving " +
          "talks on the gaps in Siargao’s local food supply chain.",
      },
      {
        id: "sagana-salo-salo",
        venue: "SAGANA",
        time: "4PM – 11PM",
        title: "Salo salo sa Sagana",
        price: "₱2,000",
        who: "Chef EJ · Chef Gino · Castaway Cocktails",
        desc:
          "An afternoon-to-evening celebration of regional Filipino cuisine featuring " +
          "Sagana’s winning signature Sunday Roast with Chef Gino of Haole (2024 Siargao " +
          "Lechon Festival Champion), followed by a collaborative Luzon–Visayas–Mindanao " +
          "salo-salo by Chef EJ and Chef Gino, paired with a cocktail collaboration and a " +
          "rotating lineup of guest DJs.",
      },
    ],
  },
  {
    id: "aug-31",
    date: "AUG 31",
    weekday: "MON 31",
    longWeekday: "Monday 31 August",
    name: "closing celebration",
    icon: "flower",
    iconWidth: 20,
    events: [
      {
        id: "hue-closing",
        venue: "HUE HOTEL",
        time: "4PM",
        title: "Closing celebration & recognition",
        price: "TBD",
        who: "Dayana Resto · Castaway Cocktails",
        desc:
          "Overlooking the world-class Cloud 9 surf break, Ani sang Siargao concludes with " +
          "an afternoon of recognition, celebration, community and cocktails by the wild " +
          "boys of Castaway Cocktails at the newly opened HUE Hotel.",
      },
    ],
  },
];

export const ALL_EVENTS = DAYS.flatMap((day) => day.events);
