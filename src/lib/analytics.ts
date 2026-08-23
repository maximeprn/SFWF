"use client";

import { sendGAEvent } from "@next/third-parties/google";

/* The same expression the layout reads, for the same reason: `NEXT_PUBLIC_` values are
   inlined at build time, so it has to be written out in full and not destructured. Unset —
   every local `npm run dev`, every preview deployment — and nothing below does anything. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * The one way this site sends anything to GA4.
 *
 * The `dataLayer` line is gtag's own snippet, and it is here to close a real gap rather than
 * out of caution: the tag's init script is `afterInteractive`, so it runs *after* hydration.
 * A visitor who opens a bubble and hits the booking button in that window would otherwise
 * have their click dropped. Queueing into the array ourselves means the init script — which
 * opens with the same `|| []` — inherits the event and gtag.js replays it on load.
 *
 * Nothing personal goes through here. The parameters are the festival's own copy — a venue,
 * an event title — never anything the visitor typed and nothing that identifies them.
 */
export function track(name: string, params: Readonly<Record<string, string>>): void {
  if (!GA_ID || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  sendGAEvent("event", name, params);
}

/**
 * A visitor left for a venue's Instagram to book. The festival sells nothing, so this click
 * is the closest thing the site has to a conversion — it is the end of the only funnel here.
 *
 * `venue` and `event_title` are GA4 custom parameters: they reach the property immediately
 * and show up in DebugView and Realtime, but they only appear in the standard reports once
 * someone registers them in Admin → Custom definitions.
 */
export function trackBookingClick(venue: string, eventTitle: string): void {
  track("booking_click", { venue, event_title: eventTitle });
}
