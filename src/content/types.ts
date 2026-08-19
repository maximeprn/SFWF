/**
 * The programme's shape. Two fields here reverse rules the 2025 site enforced by simply
 * having nowhere to put them: `time` and `price`.
 *
 * The festival supplied both in its own press releases, so the redesign shows them — but
 * only as far as they are confirmed. `price: "TBD"` is a data state, never printed; the
 * open bubble states place and time alone rather than "price to be confirmed".
 * `time: "TIME TBD"` is different: the time is still spoken, as "time to be confirmed".
 */
export interface FestivalEvent {
  /** Stable across content edits — keys the open/closed state of a programme bubble. */
  readonly id: string;
  /** Uppercase short name, as the collapsed kicker prints it. Keys into `VENUES`. */
  readonly venue: VenueKey;
  /** As published: `6PM – 10PM`, `1ST SEATING 5PM · 2ND 8PM`, `TIME TBD`. */
  readonly time: string;
  readonly title: string;
  /** As published, or `TBD`. Read through `priceNote` / `access` — never printed raw. */
  readonly price: string;
  /** Chefs and collaborators, separated by `·`. Null where the festival has none on record. */
  readonly who: string | null;
  /** Null on the one event with no description yet — the "to be announced" copy is design. */
  readonly desc: string | null;
}

/** The six day markers. One hand-drawn PNG each, under `public/doodles/beige/`. */
export type DoodleName = "wine" | "fish" | "coconut" | "dish" | "ukulele" | "flower";

export interface FestivalDay {
  readonly id: string;
  /** The mono date above the day name — `AUG 26`. */
  readonly date: string;
  /** The filter chip's date — `WED 26`. */
  readonly weekday: string;
  /** The count line when this day alone is picked — `Wednesday 26 August`. */
  readonly longWeekday: string;
  /** Lowercase by design — that is the voice, not a CSS transform. */
  readonly name: string;
  readonly icon: DoodleName;
  /** Hand-tuned per doodle for optical weight, in px. */
  readonly iconWidth: number;
  readonly events: readonly FestivalEvent[];
}

export type VenueKey =
  | "WILD"
  | "SIARGAO CORNER CAFÉ"
  | "GL PUBLIC MARKET"
  | "ALMA"
  | "LUNARES CAFÉ"
  | "ISLA PANCITERIA"
  | "LOKAL HUB"
  | "LYMA"
  | "TROPICAL ACADEMY SAN ISIDRO"
  | "KERMIT"
  | "LAMARI"
  | "PARALUMAN"
  | "MAM-ON ISLAND"
  | "BRAVO"
  | "SAGANA"
  | "HUE HOTEL";

export interface Venue {
  /** The place as prose names it, for the open bubble's hint line. */
  readonly place: string;
  /** Instagram handle without the `@`. `null` where the festival has none on record. */
  readonly handle: string | null;
  /** Who the booking button names, where that differs from the place. */
  readonly bookName?: string;
}
