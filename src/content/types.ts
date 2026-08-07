/** Which crawl an event links through to. Both share one ₱500 passport. */
export type CrawlKey = "coffee" | "karinderya";

/**
 * Event tiers. The 2025 site drew no distinction between a ₱-ticketed gala and a free
 * workshop, which the content audit flagged as its clearest usability gap; the tier is
 * the fix, and it is why every event below carries one.
 */
export type Tier = "free" | "paid" | "allWeek";

export interface FestivalEvent {
  /** Stable across content edits — used for the open/closed state of a programme bubble. */
  readonly id: string;
  readonly title: string;
  readonly tier: Tier;
  /** Where it happens. Often narrower than the day's own venue line. */
  readonly venue: string;
  readonly blurb: string;
  /** Chefs, partners and collaborators. Separated by `·` — never a comma list. */
  readonly credit?: string;
  /** Present only on the two all-week crawls, which link into the Food Crawl screen. */
  readonly crawl?: CrawlKey;
}

export interface FestivalDay {
  /**
   * Stable id. The programme has two separate August 31 blocks (Mamon Island & Siago,
   * and Harana Surf Resort); the prototype told them apart with a trailing space in the
   * date string, which is a hazard waiting to be trimmed away. They key off this instead.
   */
  readonly id: string;
  readonly date: string;
  readonly venue: string;
  readonly allWeek?: boolean;
  readonly events: readonly FestivalEvent[];
}

export interface CrawlVenue {
  readonly name: string;
  /** The human one-liner. Karinderyas have one; cafés are represented by their logo. */
  readonly note?: string;
  /** Filename stem under public/partners/. */
  readonly logo?: string;
}

export interface Crawl {
  readonly key: CrawlKey;
  readonly tab: string;
  readonly heading: string;
  readonly intro: string;
  readonly task: string;
  readonly prize: string;
  readonly partnersLabel: string;
  readonly venues: readonly CrawlVenue[];
}
