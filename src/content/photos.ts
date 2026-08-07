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

/**
 * The festival's seven hand-drawn icons. There is no icon font and no vector set — do not
 * link Lucide, Heroicons or any other library alongside these, and never redraw them as
 * SVG. The linework is intentionally slightly wobbly and matches the octopus mascot's hand.
 *
 * `tray`, `grilled-fish` and `fish-leaf` are a best reading of ambiguous drawings; the
 * festival has not confirmed the intended subjects.
 */
export const ICON_NAMES = [
  "coffee-beans",
  "wine-glass",
  "crab",
  "tray",
  "grilled-fish",
  "bananas",
  "fish-leaf",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/*
 * These point at the derivatives written by `scripts/optimize-images.mjs`, not at the
 * festival's original PNGs, which stay in `public/` as the master copies. None of these
 * three go through next/image — the icons are plain <img>, the seal is an SVG <image> and
 * the dye is a WebGL texture — so the codec has to be right in the file itself.
 */
export const iconSrc = (name: IconName): string => `/icons/icon-${name}.avif`;

export const DYE_TEXTURE = "/textures/indigo-shibori.webp";
export const LOGO = "/logo/sfwf-octopus-official.avif";
export const LOADER_SEAL = "/logo/loader-seal-art.avif";
