import { describe, expect, it } from "vitest";
import { ALL_EVENTS, DAYS } from "@/content/events";
import { VENUES } from "@/content/venues";
import { FESTIVAL_DATES, HOST_LOGOS, SPONSORS } from "@/content/site";
import { PHOTOS } from "@/content/photos";

describe("programme", () => {
  it("carries the confirmed press-release calendar — six days, sixteen gatherings", () => {
    // The 2025 site was built from a deck with seventeen events across eight blocks. This
    // is the festival's own press release, and where the two disagree it wins.
    expect(DAYS).toHaveLength(6);
    expect(ALL_EVENTS).toHaveLength(16);
  });

  it("gives every day and event a unique id", () => {
    const dayIds = DAYS.map((d) => d.id);
    const eventIds = ALL_EVENTS.map((e) => e.id);
    expect(new Set(dayIds).size).toBe(dayIds.length);
    expect(new Set(eventIds).size).toBe(eventIds.length);
  });

  it("routes every event to a venue that knows where a reservation goes", () => {
    for (const event of ALL_EVENTS) {
      expect(Object.keys(VENUES), event.id).toContain(event.venue);
      expect(event.title.trim()).not.toBe("");
      expect(event.time.trim()).not.toBe("");
      expect(event.price.trim()).not.toBe("");
    }
  });

  it("states the missing copy rather than shipping an empty string", () => {
    // Null is the design — "to be announced" is written copy. An empty string would render
    // as a silent gap instead.
    for (const event of ALL_EVENTS) {
      expect(event.who === null || event.who.trim().length > 0, event.id).toBe(true);
      expect(event.desc === null || event.desc.trim().length > 20, event.id).toBe(true);
    }
    expect(ALL_EVENTS.filter((e) => e.who === null)).toHaveLength(3);
    expect(ALL_EVENTS.filter((e) => e.desc === null)).toHaveLength(1);
  });

  it("gives each of the six days its own doodle marker", () => {
    const icons = DAYS.map((d) => d.icon);
    expect(new Set(icons).size).toBe(icons.length);
    for (const day of DAYS) expect(day.iconWidth).toBeGreaterThan(0);
  });

  it("uses no emoji anywhere — the source has none and none should be introduced", () => {
    const emoji = /\p{Extended_Pictographic}/u;
    for (const event of ALL_EVENTS) {
      const text = `${event.title}${event.desc ?? ""}${event.who ?? ""}`;
      expect(emoji.test(text), event.id).toBe(false);
    }
  });

  it("spells it karinderya throughout — never carinderia or karinerya", () => {
    // Local vocabulary stays unglossed, and this is the one word the source keeps
    // misspelling three different ways.
    const text = JSON.stringify(DAYS);
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
    expect(FESTIVAL_DATES.display).toContain("2026");
  });

  it("carries the eleven sponsor marks and the fifteen host marks, all beige", () => {
    expect(SPONSORS).toHaveLength(11);
    expect(HOST_LOGOS).toHaveLength(15);
    for (const mark of [...SPONSORS, ...HOST_LOGOS]) {
      const [w, h] = mark.intrinsic;
      expect(w, mark.name).toBeGreaterThan(0);
      expect(h, mark.name).toBeGreaterThan(0);
    }
    // Venue marks are always the beige knockout on the dye, never boxed and never on a
    // white plate — which is what this path means.
    for (const host of HOST_LOGOS) expect(host.src.startsWith("/venues/beige/")).toBe(true);
  });

  it("references the four real photographs", () => {
    expect(PHOTOS).toHaveLength(4);
    for (const photo of PHOTOS) {
      expect(photo.src.startsWith("/photography/")).toBe(true);
      expect(photo.caption.trim()).not.toBe("");
    }
  });
});
