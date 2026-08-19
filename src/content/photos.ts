/**
 * The festival's photography — warm, on-location, available-light. Four images is not
 * enough to carry a whole site, so prefer text-only card grids over reusing one image
 * repeatedly. Captions surface in the lightbox, not under the thumbnails: the homepage
 * reel should read as images, not as a list.
 *
 * Every `width`/`height` here was wrong until 19 Aug 2026 — all four were declared as
 * landscape at 1200x800 or 1600x1067, and all four are portrait. next/image reserves the
 * box from these numbers, so the page would have laid out to an aspect ratio none of the
 * files has. They are now the files' real dimensions.
 *
 * Three of them are 331x497, which is too small to display at any size this design uses:
 * the smallest frame on the site is 300px wide, so they are at 1.1x and soft on any
 * retina screen. Ask the festival for the originals before putting them on a page.
 */
export interface Photo {
  readonly src: string;
  readonly caption: string;
  readonly width: number;
  readonly height: number;
}

export const PHOTOS: readonly Photo[] = [
  {
    src: "/photography/wild-gala-dinner.webp",
    caption: "Opening gala, Wild Siargao",
    width: 1365,
    height: 2048,
  },
  {
    src: "/photography/chef-flambe.png",
    caption: "Service at the tasting dinner",
    width: 331,
    height: 497,
  },
  {
    src: "/photography/communal-table-dusk.png",
    caption: "The closing boodle, Harana",
    width: 331,
    height: 497,
  },
  {
    src: "/photography/string-lights-palms.png",
    caption: "Sundown under the palms",
    width: 331,
    height: 497,
  },
];

/*
 * The dye's source cloth. It is blue: nothing on the site is, because `dyeGround` remaps it
 * to violet and orange at runtime (§4). It never goes through next/image — it is read into
 * a canvas and uploaded as a WebGL texture — so the codec has to be right in the file.
 *
 * The 2025 icon set, the octopus mark and the gold loading seal are no longer referenced by
 * anything: they belong to the superseded system. Their files stay in `public/` because
 * they are the festival's own originals and none of them are regenerable.
 */
export const DYE_TEXTURE = "/textures/indigo-shibori.webp";
