import { CONTACT, FESTIVAL_DATES } from "./site";

/**
 * Press content, verbatim from /media-center with the content audit's documented errors
 * corrected rather than reproduced: the heading said 2025, "(START DATE)" / "(END DATE)" /
 * "(DEADLINE DATE)" shipped as literal placeholders, "3-day Festival" contradicted the
 * seven-day programme, and the Opening Night was said to be "in Ubud" — Bali copy left in
 * from a template.
 */
export const MEDIA_BENEFITS: readonly string[] = [
  "A media pass granting unlimited entry to all main programs during the seven-day Festival, including cooking demos, food discussions, and live entertainment across venues",
  "Invitations to Festival press conferences and the exclusive Opening Night event",
  "Opportunities to interview chefs, speakers, and Festival representatives",
];

export const MEDIA = {
  eyebrow: "Press",
  title: "Media Center",
  intro:
    "Welcome to the Media Center. We're available to assist all media outlets, journalists, and food content creators needing information, images, videos, and interviews for coverage of the Festival.",
  accreditationTitle: "Media accreditation for 2026 Festival now open!",
  accreditationBlurb:
    `Taking place from August 26 to 31, ${FESTIVAL_DATES.start.slice(0, 4)}, bringing together celebrated chefs, ` +
    "culinary experts, food entrepreneurs, and passionate food lovers from across Siargao and the world.",
  /* The source said "(DEADLINE DATE)". Stating the deadline is unset is honest;
     inventing one is not. Replace once the festival confirms it. */
  deadline: "Applications close on a date still to be confirmed.",
  kitTitle: "Festival media kit",
  kitBlurb:
    "In our Media Folder, you will find a curated selection of high-resolution photos available for download. Please credit ‘Siargao Food and Wine Festival’ when using photos for your coverage.",
  contactTitle: "Covering the Festival?",
  contactEmail: CONTACT.press,
} as const;

/** The mission copy, from /about. Mission-forward, not party-forward — keep that order. */
export const ABOUT = {
  eyebrow: "Tourism with Intention",
  title: "Building a Better Island, One Bite at a Time",
  paragraphs: [
    "Siargao is more than a surf destination—it's a cultural and ecological mosaic. This festival aims to highlight the socio-economic impact of tourism, and how intentional food events can support local supply chains, heritage, and livelihoods across the island's 9 municipalities.",
    "The Siargao Food & Wine Festival brings together chefs, karinderya cooks, farmers, foragers, and creatives across the island to showcase Siargao's evolving culinary identity while creating space for meaningful conversations around sustainability, tourism, and community.",
  ],
  chips: [
    "Intentional tourism",
    "Local supply chains",
    "Heritage & livelihoods",
    "9 municipalities",
    "Sustainability",
    "Community",
  ],
  closing: "Let's cook up something special together!",
  contactEmail: CONTACT.general,
} as const;
