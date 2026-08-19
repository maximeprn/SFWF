import { describe, expect, it } from "vitest";
import { ALL_EVENTS, DAYS } from "@/content/events";
import type { FestivalEvent } from "@/content/types";
import { FALLBACK_HANDLE, VENUES, bookNameOf, instagramUrl, placeOf } from "@/content/venues";
import { access, hintRest, priceNote, softTime } from "@/lib/program/eventCopy";

const event = (price: string, time = "6PM"): FestivalEvent => ({
  id: "t",
  venue: "WILD",
  time,
  title: "t",
  price,
  who: null,
  desc: null,
});

/**
 * The one rule in the programme that is a promise rather than a preference: the site never
 * prints a figure the festival has not agreed. Five of the sixteen events carry `TBD`, and
 * the open bubble has to stay silent about every one of them.
 */
describe("prices", () => {
  it("never speaks an unconfirmed price, and never says one is unconfirmed", () => {
    expect(priceNote(event("TBD"))).toBe("");
    expect(hintRest(event("TBD", "DINNER"))).toBe("dinner");
    expect(hintRest(event("TBD", "DINNER"))).not.toMatch(/confirm|tbd|price/i);
  });

  it("speaks a known price in the festival's own words", () => {
    expect(priceNote(event("₱2,400 / HEAD"))).toBe("₱2,400 per head");
    expect(priceNote(event("₱1,500"))).toBe("₱1,500");
    expect(priceNote(event("FREE"))).toBe("free");
    expect(priceNote(event("OPEN FOR ALL"))).toBe("free");
    expect(priceNote(event("À LA CARTE"))).toBe("pay per dish");
  });

  it("leaves seven events with nothing to say about price", () => {
    // Seven, not the five the handoff's open-questions list claims — §10, the confirmed
    // calendar, is the source of truth and carries seven TBDs. Counted here so the number
    // moves only when the festival confirms a price.
    expect(ALL_EVENTS.filter((e) => priceNote(e) === "")).toHaveLength(7);
  });
});

describe("time", () => {
  it("still speaks an unconfirmed time — unlike a price, a missing hour is worth saying", () => {
    expect(softTime("TIME TBD")).toBe("time to be confirmed");
  });

  it("reads published times back as prose", () => {
    expect(softTime("6PM – 10PM")).toBe("6pm – 10pm");
    expect(softTime("1ST SEATING 5PM · 2ND 8PM")).toBe("first seating 5pm · second 8pm");
  });
});

describe("access", () => {
  it("marks the booking, not the price", () => {
    for (const price of ["FREE", "OPEN FOR ALL", "À LA CARTE"]) {
      expect(access(event(price))).toEqual({ dot: false, word: "WALK IN" });
    }
    for (const price of ["TBD", "₱1,500", "₱6,000 / HEAD"]) {
      expect(access(event(price))).toEqual({ dot: true, word: "RESERVE" });
    }
  });

  it("gives every reservable event somewhere to send the message", () => {
    for (const e of ALL_EVENTS.filter((e) => access(e).dot)) {
      expect(instagramUrl(e.venue), e.id).toMatch(/^https:\/\/www\.instagram\.com\/[\w.]+\/$/);
      expect(bookNameOf(e.venue).trim(), e.id).not.toBe("");
    }
  });

  it("falls back to the festival's own account only where no handle is on record", () => {
    // Two venues have none. Sagana was the one that mattered — a ₱2,000 dinner whose booking
    // pointed at the festival's own account — and the festival confirmed @saganasiargao on
    // 19 Aug 2026. Of the two left, Siargao Corner Café is free and so costs nothing; Lunares
    // Café still shows RESERVE, because its price is TBD rather than confirmed free. If that
    // price lands as a real figure it needs a real handle with it.
    const unhandled = Object.entries(VENUES).filter(([, v]) => v.handle === null);
    expect(unhandled.map(([key]) => key).sort()).toEqual(["LUNARES CAFÉ", "SIARGAO CORNER CAFÉ"]);
    expect(access(ALL_EVENTS.find((e) => e.venue === "SIARGAO CORNER CAFÉ")!).word).toBe("WALK IN");
    for (const [key] of unhandled) {
      expect(instagramUrl(key as keyof typeof VENUES)).toContain(FALLBACK_HANDLE);
    }
  });

  it("names the host a visitor would recognise, not the venue key", () => {
    expect(placeOf("GL PUBLIC MARKET")).toBe("General Luna public market");
    expect(bookNameOf("GL PUBLIC MARKET")).toBe("Roots");
    expect(bookNameOf("MAM-ON ISLAND")).toBe("Cev");
    expect(bookNameOf("WILD")).toBe("Wild");
  });
});

describe("the day filter", () => {
  it("has a long weekday to print for every day it can select", () => {
    for (const day of DAYS) {
      expect(day.longWeekday, day.id).toMatch(/^[A-Z][a-z]+ \d{1,2} August$/);
      expect(day.weekday, day.id).toMatch(/^[A-Z]{3} \d{2}$/);
    }
  });
});
