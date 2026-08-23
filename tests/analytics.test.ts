import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The booking button is the end of the only funnel on this site — the festival sells nothing,
 * so a DM to a venue is the closest thing it has to a conversion. These cover what a source
 * scan cannot: that an untagged build stays silent, and that a click landing before the tag
 * script has run is queued rather than dropped.
 */

type Layered = { dataLayer?: unknown[]; window?: unknown };
const global = globalThis as Layered;

/** What `sendGAEvent` does, minus the two warnings the guard in `track` exists to avoid. */
const sent: unknown[][] = [];
vi.mock("@next/third-parties/google", () => ({
  sendGAEvent: (...args: unknown[]) => {
    sent.push(args);
    (globalThis as Layered).dataLayer?.push(args);
  },
}));

beforeEach(() => {
  sent.length = 0;
  vi.resetModules();
  delete global.dataLayer;
  // The module is a browser one; the suite runs in node. Nothing here reads anything off
  // `window` but the dataLayer, so the global itself will do.
  global.window = globalThis;
});

afterEach(() => {
  delete process.env.NEXT_PUBLIC_GA_ID;
  delete global.window;
});

const load = () => import("@/lib/analytics");

describe("the booking event", () => {
  it("sends nothing at all when the measurement ID is unset", async () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    const { trackBookingClick } = await load();

    trackBookingClick("Lyma", "Chef Jarrod Moore × Lyma collaboration dinner");

    // Local dev and every preview deployment. No tag, no queue, no console warning.
    expect(sent).toEqual([]);
    expect(global.dataLayer).toBeUndefined();
  });

  it("names the venue and the event when the ID is set", async () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-TESTONLY00";
    const { trackBookingClick } = await load();

    trackBookingClick("Lyma", "Chef Jarrod Moore × Lyma collaboration dinner");

    expect(sent).toEqual([
      [
        "event",
        "booking_click",
        { venue: "Lyma", event_title: "Chef Jarrod Moore × Lyma collaboration dinner" },
      ],
    ]);
  });

  it("queues a click that lands before the tag script has run", async () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-TESTONLY00";
    const { trackBookingClick } = await load();

    // No dataLayer yet — the init script is `afterInteractive`, so this is the real state of
    // the page for a moment after hydration.
    expect(global.dataLayer).toBeUndefined();
    trackBookingClick("Bravo", "Siargao Mercado");
    expect(global.dataLayer).toHaveLength(1);

    // The init script opens with the same `|| []`, so it adopts the array rather than
    // replacing it, and gtag.js replays what is already in there.
    const queue = global.dataLayer;
    trackBookingClick("Sagana", "Salo salo sa Sagana");
    expect(global.dataLayer).toBe(queue);
    expect(global.dataLayer).toHaveLength(2);
  });
});
