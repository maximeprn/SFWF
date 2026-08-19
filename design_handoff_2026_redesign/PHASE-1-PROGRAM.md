# Phase 1 — the Program one-pager

The urgent release. The live site becomes **one page at `/`** carrying the redesigned programme in
the **full new identity** — violet dye, orange script, beige bubbles, Beth Ellen + Arimo + Baloo 2.
No menu, no other routes. Everything here is specified in the main README; this file only says
what is in and what is out, in build order.

All decisions below were made by the festival on 19 Aug 2026. None are open.

## What ships

One route. Top to bottom:

1. **The home hero** (README §6 Home 1) — beige wordmark with "2nd edition" pinned to its corner,
   the orange script *"ani sang Siargao"*, the mono dateline `26 – 31 AUGUST 2026` between mirrored
   wobble rules. **No CTA button** — the programme starts right below; there is nothing to link to.
2. **The programme** (README §6 Program, §7 for the bubble) — h1 *"the six-day journey"*,
   standfirst, farmer doodle, the day filter (`ALL SIX DAYS` default), the mono count line, six day
   sections with the sixteen event bubbles, ending in the script line *"The festival sells nothing.
   Every table is booked with the people cooking at it."*
3. **Sponsors row** — `OFFICIAL PARTNERS AND SPONSORS`, the four marks from `assets/sponsors/`.
4. **Hosts row** — `HOSTED ACROSS THE ISLAND BY`, the venue logos (README §6 Home 8; not a link).
5. **The full mockup footer** (README §5) — hairline rule, tilted social marks, email, dateline.

Plus: the **animated dye flow** ground (README §4 — the two-colour remap driving the flow engine,
coverage 40 / wash 50), and the **back-to-top** blob past 640px of scroll.

## What phase 1 removes from the live site

- **The loader seal** — removed now, not in phase 2. Pages load straight into content.
- **The nav band and the menu** — no top bar at all. The page opens on the hero. With no band there
  is **no fade mask** in phase 1 (it returns with the nav in phase 2).
- **Every other route** — `/program`, `/food-crawl`, `/media-center`, `/about`, `/tickets`,
  `/purpose` all 301 to `/`. Nothing 404s; old links keep working.
- The Tickets pinned button, the WhatsApp deep link, the enquiry form and its API route — booking
  is per-venue Instagram DM, spoken by the bubbles themselves.

## Content and code notes

- Programme data per README §10 — sixteen events, with times and prices. **Relax the content tests
  that ban clock times and peso figures before this ships** (keep the karinderya and no-emoji
  tests). Reconcile `src/content/events.ts`; keep `EventJsonLd` and feed it the new calendar.
- Fonts move to the Google Fonts one-liner (README §3). Wigglye and Satoshi are no longer loaded.
- Tokens: replace `src/styles/tokens.css` values with README §3. The old gold `#FFD010` should not
  survive anywhere on the page.
- Animations exactly per README §3 "Motion — match the mockup, NOT the live site": the bubble
  reveal is the one piece of real engineering in this release — build it to §7's mechanics and the
  rest of the site inherits it in phase 2.
- `<title>` / meta description: the festival name + *Ani sang Siargao — the six-day journey,
  26–31 August 2026*. Update `sitemap.ts` to the single URL.

## What phase 2 reuses

The bubble component, the day filter, the dye mount, the tokens, the footer — all built here —
carry into the full site unchanged. Phase 2 (main README) adds the nav band + menu + fade mask,
the rest of Home, Press, and the route structure.
