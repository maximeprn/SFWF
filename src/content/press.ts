/**
 * The Press page's copy, from `SFWF prototype.dc.html`.
 *
 * The media folder's URL is not here because the festival has not sent it. The page says so
 * in its own words rather than hiding the button or inventing a link — "missing copy is
 * stated, not hidden" is the design, and a press page with no visible media kit reads as a
 * festival that has none.
 */
export const MEDIA_KIT = {
  heading: "Festival media kit",
  body:
    "In our Media Folder, you will find a curated selection of high-resolution photos " +
    "available for download. Please credit ‘Siargao Food and Wine Festival’ when using " +
    "photos for your coverage.",
  cta: "Download the media kit (PDF)",
  note: "PDF LINK TO BE ADDED",
} as const;

export const COVERING = {
  heading: "Covering the Festival?",
  body: "Tell us what you’re working on and we’ll put you with the right people on the island.",
} as const;
