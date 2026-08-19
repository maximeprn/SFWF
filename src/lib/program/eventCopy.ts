import type { FestivalEvent } from "@/content/types";

/** Prices that mean "just turn up". Everything else is something you have to ask for. */
const WALK_IN_PRICES = ["FREE", "OPEN FOR ALL", "À LA CARTE"];

export interface AccessMark {
  /** The orange dot. It marks a booking, not a price tag. */
  readonly dot: boolean;
  readonly word: "RESERVE" | "WALK IN";
}

export function access(event: FestivalEvent): AccessMark {
  return WALK_IN_PRICES.includes(event.price.toUpperCase())
    ? { dot: false, word: "WALK IN" }
    : { dot: true, word: "RESERVE" };
}

/**
 * The price as the open bubble speaks it — and only when it is known. An unconfirmed price
 * returns an empty string and simply drops out of the hint line: the festival would rather
 * say nothing than print a figure it has not agreed.
 */
export function priceNote(event: FestivalEvent): string {
  const price = event.price.toUpperCase();
  if (price === "FREE" || price === "OPEN FOR ALL") return "free";
  if (price === "À LA CARTE") return "pay per dish";
  if (price === "TBD") return "";
  return event.price.replace(" / HEAD", " per head");
}

/**
 * The time in the open bubble's voice. Unlike a price, an unconfirmed time is still spoken
 * — a gathering with no hour yet is different from one you can't afford to be surprised by.
 */
export function softTime(time: string): string {
  if (time === "TIME TBD") return "time to be confirmed";
  return time.toLowerCase().replace("1st seating", "first seating").replace("2nd", "second");
}

/** Place · time · price, with the unknowns left out rather than named. */
export function hintRest(event: FestivalEvent): string {
  return [softTime(event.time), priceNote(event)].filter(Boolean).join(" · ");
}
