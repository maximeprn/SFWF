/**
 * The festival's photography — warm, on-location, available-light. Four images is not
 * enough to carry a whole site, so prefer text-only card grids over reusing one image
 * repeatedly. Captions surface in the lightbox, not under the thumbnails: the homepage
 * reel should read as images, not as a list.
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
    width: 1600,
    height: 1067,
  },
  {
    src: "/photography/chef-flambe.png",
    caption: "Service at the tasting dinner",
    width: 1200,
    height: 800,
  },
  {
    src: "/photography/communal-table-dusk.png",
    caption: "The closing boodle, Harana",
    width: 1200,
    height: 800,
  },
  {
    src: "/photography/string-lights-palms.png",
    caption: "Sundown under the palms",
    width: 1200,
    height: 800,
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
