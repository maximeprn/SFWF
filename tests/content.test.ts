import { describe, expect, it } from "vitest";
import { DAYS, TIER_LABEL } from "@/content/events";
import { CRAWLS, CRAWL_KEYS, MECHANICS } from "@/content/crawls";
import { PHOTOS, ICON_NAMES } from "@/content/photos";
import { FESTIVAL_DATES, NAV, STATS } from "@/content/site";
import { MEDIA_BENEFITS } from "@/content/media";

const allEvents = DAYS.flatMap((d) => d.events);

describe("programme", () => {
  it("carries every day block and event the festival published", () => {
    expect(DAYS).toHaveLength(8);
    expect(allEvents).toHaveLength(16);
  });

  it("gives every day and event a unique id", () => {
    const dayIds = DAYS.map((d) => d.id);
    const eventIds = allEvents.map((e) => e.id);
    expect(new Set(dayIds).size).toBe(dayIds.length);
    expect(new Set(eventIds).size).toBe(eventIds.length);
  });

  it("keeps the two August 31 blocks distinct", () => {
    // The prototype told these apart with a trailing space in the date string, which is a
    // hazard waiting to be trimmed. They must be separated by id and venue instead.
    const aug31 = DAYS.filter((d) => d.date === "August 31");
    expect(aug31).toHaveLength(2);
    expect(aug31[0]!.id).not.toBe(aug31[1]!.id);
    expect(aug31[0]!.venue).not.toBe(aug31[1]!.venue);
  });

  it("gives every event a known tier and real copy", () => {
    for (const event of allEvents) {
      expect(Object.keys(TIER_LABEL)).toContain(event.tier);
      expect(event.title.trim()).not.toBe("");
      expect(event.blurb.trim().length).toBeGreaterThan(20);
      expect(event.venue.trim()).not.toBe("");
    }
  });

  it("links both all-week crawls to a real crawl screen", () => {
    const crawlEvents = allEvents.filter((e) => e.crawl);
    expect(crawlEvents).toHaveLength(2);
    for (const event of crawlEvents) {
      expect(CRAWL_KEYS).toContain(event.crawl);
      expect(event.tier).toBe("allWeek");
    }
  });

  it("uses no emoji anywhere — the source has none and none should be introduced", () => {
    const emoji = /\p{Extended_Pictographic}/u;
    for (const event of allEvents) {
      expect(emoji.test(`${event.title}${event.blurb}${event.credit ?? ""}`)).toBe(false);
    }
  });
});

describe("crawls", () => {
  it("states one passport, four steps, for both crawls", () => {
    expect(MECHANICS).toHaveLength(4);
    expect(CRAWL_KEYS).toHaveLength(2);
  });

  it("matches each crawl's stated count to its actual partner list", () => {
    // The 2025 site claimed 14 cafés while listing 10. The number in the copy and the
    // number of venues must not drift apart again.
    for (const key of CRAWL_KEYS) {
      const crawl = CRAWLS[key];
      const stated = crawl.task.match(/\b(\d+)\b/);
      expect(stated, `${key} task should state a count`).not.toBeNull();
      expect(Number(stated![1])).toBe(crawl.venues.length);
    }
  });

  it("gives every karinderya its human one-liner and every café its logo", () => {
    for (const venue of CRAWLS.karinderya.venues) {
      expect(venue.note?.trim().length ?? 0).toBeGreaterThan(20);
    }
    for (const venue of CRAWLS.coffee.venues) {
      expect(venue.logo).toBeTruthy();
    }
  });

  it("spells it karinderya throughout — never carinderia or karinerya", () => {
    const text = JSON.stringify({ CRAWLS, DAYS });
    expect(text).not.toMatch(/carinderia|karinerya/i);
    expect(text).toMatch(/karinderya/i);
  });
});

describe("site", () => {
  it("keeps the dateline in one place and machine-readable", () => {
    expect(FESTIVAL_DATES.start).toBe("2026-08-26");
    expect(FESTIVAL_DATES.end).toBe("2026-08-31");
    expect(new Date(FESTIVAL_DATES.start) < new Date(FESTIVAL_DATES.end)).toBe(true);
    expect(FESTIVAL_DATES.label).toContain("2026");
  });

  it("routes every menu item to a real path", () => {
    const paths = ["/", "/program", "/food-crawl", "/media-center", "/about"];
    expect(NAV.map((n) => n.href)).toEqual(paths);
  });

  it("publishes only the stats that carry a real number", () => {
    // Two of the festival's four stats have no figure; the design renders an em-dash rather
    // than inventing one, so those two are simply not shipped.
    expect(STATS).toHaveLength(2);
    for (const stat of STATS) expect(stat.value).toMatch(/\d/);
  });
});

describe("assets", () => {
  it("references the four real photos and seven real icons", () => {
    expect(PHOTOS).toHaveLength(4);
    expect(ICON_NAMES).toHaveLength(7);
    for (const photo of PHOTOS) {
      expect(photo.src.startsWith("/photography/")).toBe(true);
      expect(photo.caption.trim()).not.toBe("");
    }
  });

  it("keeps the corrected press copy, not the audit's placeholders", () => {
    const text = MEDIA_BENEFITS.join(" ");
    expect(text).not.toMatch(/\(START DATE\)|\(END DATE\)|\(DEADLINE DATE\)/);
    expect(text).not.toMatch(/Ubud|3-day/i);
    expect(text).toMatch(/seven-day/);
  });
});
