/**
 * The Press page's copy. The two unset facts — the accreditation deadline and the media
 * folder's URL — are written as unset rather than left out or invented: the festival has
 * not sent either, and a page that stays silent about a deadline reads as though there
 * isn't one.
 *
 * `ACCREDITATION_EMAIL` is the second address in play. The footer and the programme use
 * `CONTACT_EMAIL`; the design puts this one on every Press action. Both are live and the
 * festival has not yet picked one — see `project-docs/phase-1-deviations.md`.
 */
export const ACCREDITATION_EMAIL = "hello@siargaofoodandwinefestival.com";

export const ACCREDITATION = {
  kicker: { lead: "NOW OPEN", rest: "ACCREDITATION" },
  title: "Media accreditation for the 2026 festival",
  intro:
    "26 – 31 August 2026, bringing together celebrated chefs, culinary experts, food " +
    "entrepreneurs and passionate food lovers from across Siargao and the world.",
  benefits: [
    "A media pass with entry to all main programmes across the week — demos, food discussions and live programming at every venue",
    "Invitations to festival press conferences and the opening celebration",
    "Interviews with chefs, speakers and festival representatives",
  ],
  deadline: "APPLICATIONS CLOSE ON A DATE STILL TO BE CONFIRMED",
  cta: "Apply for accreditation",
} as const;

export const MEDIA_KIT = {
  kicker: { lead: "MEDIA KIT", rest: "IMAGES" },
  title: "Festival media kit",
  intro:
    "Our media folder holds a curated selection of high-resolution photographs available " +
    "for download. Please credit “Siargao Food and Wine Festival” when using images in " +
    "your coverage.",
  /* Named tiles, not thumbnails. There are four festival photographs in total and none of
     them is one of these — the grid says what the folder holds, it does not preview it. */
  tiles: ["2025 GALA", "WET MARKET", "THE FARM", "LONG TABLE"],
  link: "FOLDER LINK TO BE ADDED BY THE FESTIVAL",
} as const;

export const PRESS_STATS = [
  { figure: "6", label: "THEMED DAYS" },
  { figure: "9", label: "MUNICIPALITIES" },
  { figure: "30+", label: "COLLABORATORS" },
  { figure: "2nd", label: "EDITION" },
] as const;
