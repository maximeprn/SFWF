/**
 * The Press page's copy, from `SFWF prototype.dc.html`.
 *
 * There is no media folder to link to yet, so the button asks for a person instead of a
 * file. That keeps the page honest and keeps it useful: the prototype's dead PDF button with
 * "link to be added" under it told a journalist what the festival does not have, where this
 * tells them what to do about it.
 */
export const MEDIA_KIT = {
  heading: "Festival media kit",
  body:
    "In our Media Folder, you will find a curated selection of high-resolution photos " +
    "available for download. Please credit ‘Siargao Food and Wine Festival’ when using " +
    "photos for your coverage.",
  cta: "Send us an email",
  note: "TO RECEIVE THE MEDIA KIT",
  subject: "Media kit request",
} as const;

export const COVERING = {
  heading: "Covering the Festival?",
  body: "Tell us what you’re working on and we’ll put you with the right people on the island.",
} as const;
