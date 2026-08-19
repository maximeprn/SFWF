# Claude Code task — live site content update (19 Aug 2026)

## 0 · Undo two things from the first pass, before anything else

- **Remove the grain / noise / film overlay entirely.** It was never in the handoff. No overlay on the
  ground, the bubbles, the images or the footer — not at any opacity, not as `feTurbulence`, not as a
  repeating PNG, not via `background-blend-mode`. The dye cloth is the only texture in this design;
  flat surfaces are the design working.
- **Take the colour back down.** Palette is exactly `#4F3F79` violet, `#E9622D` orange, `#E9E7C2`
  beige (`#65C6BD` cyan reserved, unused), plus the derived inks in README §3. No `filter:
  saturate()/contrast()/brightness()/hue-rotate()`, no gradient laid over the violet, no fourth
  colour. The ground hex is never lightened or darkened; the dye is remapped to two palette colours
  only and ships at **coverage 40, wash 50**, locked to width, never `cover`.

Then the content changes below.

Source of truth for this update: the festival's own 2026 poster set (transcribed in
`design_handoff_2026_redesign/2026 Program - Poster Transcript & Site Comparison.md`). Every change
below has already been applied to the design prototypes in this project
(`SFWF prototype.dc.html`, `SFWF Programme.dc.html`, `SFWF Home.dc.html`) — mirror them on the live
Next.js site.

⚠️ **Read before editing.** The live `src/content/events.ts` is NOT the same event list as the
prototypes: it was built from an earlier deck and carries events the confirmed press-release
calendar doesn't (Kinilaw Masterclass, El Born Goes Wild, Bar Principal, Tropical Academy at Ihayas
Farm) and names others differently. Match each change to the live event by **venue + what happens**,
not by title, and do not delete or invent events as part of this task. Where you can't map a change
onto exactly one live event, leave it and report it back.

## 1 · Three confirmed times

The live content model has **no `time` field** (`FestivalEvent` in `src/content/types.ts` is
`id · title · venue · blurb · credit?`). The posters now confirm times for three events, so:

1. Add `readonly time?: string;` to `FestivalEvent`, documented as "as printed on the festival's
   posters; absent where the festival hasn't confirmed one."
2. Render it in the programme bubble in the same hint line that already carries date and venue —
   the prototype's open state is the reference (`SFWF Programme.dc.html`): the time is stated once,
   never as a labelled field, and an event without a time simply omits it.
3. Populate:

| Live event (match on this) | `time` |
|---|---|
| `wet-market-roots` — Wet Market Experience by Roots, General Luna wet market | `4PM – 6PM` |
| `kermit-pizza-contest` — Kermit Pizza Eating Contest, Kermit Siargao | `4PM` |
| the Cev / Hapag island boodle on Aug 30 (`cev-hapag-boodle`) | `9AM – 5PM` |

Times already on the posters and already correct in prose elsewhere — Wild 6PM–10PM, Alma 5PM &
8PM seatings, Lunares and Siargao Corner Café 8AM–11AM, Lokal Hub 5PM–7PM, Lamari 6:30PM,
Paraluman 9PM–1AM, Bravo 4PM–9PM, Sagana 4PM–11PM, Hue 4PM — can be filled in the same pass if you
want the field complete; they are in the transcript file.

## 2 · Siargao Mercado (Bravo, Aug 30) — fuller Slow Food line

The live blurb ends with "…and a very special introduction of Siargao Slow Food to the community."
The poster explains what that actually is. Replace that closing clause with:

> …plus the community introduction of Slow Food Siargao — a local chapter of the international Slow
> Food movement, formed by island chefs, giving talks on the gaps in Siargao's local food supply
> chain.

Keep the rest of the blurb as it is.

## 3 · Island style chef's table (Mam-on Island, Aug 30) — cocktails by Last Chance

The live `cev-hapag-boodle` entry has a title and venue but no blurb. Give it the confirmed poster
copy, with Last Chance added to the credit:

- `title`: `Island Style Chef's Table`
- `venue`: `Mam-on Island`
- `blurb`: "Chefs from Hapag Manila (1 Michelin Star) and Ayà Manila (Michelin Selected), brought
  over by Cev, curate an island feast on Mam-on Island — a one-of-a-kind boodle fight built around
  kinilaw (raw) and sugba (grilled) techniques. Cocktails by Last Chance."
- `credit`: `Chef David · Hapag Manila · Ayà Manila · Last Chance`
- keep the existing `link` (Cev's Instagram) — Cev still takes the booking.

## 4 · Sponsor row — six marks added

The row currently shows four marks (Happy Living, Modulus, Destileria Limtuaco, Galatea Tours). The
posters' "Made possible by" list has nine. Six cream (`#E9E7C2`) PNGs have been cut for this and
live in this project at `design_handoff_2026_redesign/assets/sponsors/`:

`masterplan-global.png` · `greenhouse.png` · `ripple.png` · `the-henry.png` ·
`coconut-cruisers.png` · `tropika.png`

Copy them into the site's logo directory (`public/partners/`, alongside the existing marks) and add
them to the "OFFICIAL PARTNERS AND SPONSORS" row in poster order: **Masterplan Global** first (it
appears on nearly every day-poster), then the existing Modulus · Destileria Limtuaco · Galatea
Tours, then Greenhouse · Ripple · The Henry · Coconut Cruisers · Tropika. Happy Living stays where
it is as the official wine partner.

Sizing, as set in the prototypes: wordmarks (Greenhouse, Ripple) take the row's existing
`height: clamp(24px,2.8vw,32px)`; the stacked and circular marks (Masterplan Global, The Henry,
Coconut Cruisers, Tropika) need `height: clamp(30px,3.6vw,42px)` to hold equal optical weight. All
are transparent PNGs already in the beige ink — no CSS filter, no recolouring.

## 5 · "Hiyas Farm" removed from the hosts row

`Hiyas Farm` is not a 2026 partner — it was a leftover from the older dataset, and the farm it
referred to is part of **Tropical Academy**, which is already a named venue (Aug 29, San Isidro).
In the "HOSTED ACROSS THE ISLAND BY" row, delete the Hiyas Farm entry and make sure
`Tropical Academy` is present as the type-set name (Beth Ellen, beige) — no logo file exists for it.

## 6 · Still open, do not guess

- **Dayána, Hapag and Morris Danzen** appear in the posters' Community Partners grid but have no
  cream mark and are not in the hosts row. They're already named in programme copy. If they should
  appear as logos, say so and the marks will be cut the same way as the six above.
- The posters frame the Aug 27 (Siargao Corner Café) and Aug 28 (Lunares Café) **"Brewed by the
  Pioneers"** events as two halves of one named 2-day thread ("Coffee Crawl — Pioneers of the
  Siargao Coffee Scene"). Neither the live site nor the prototype connects them. Design decision
  pending — do not restructure the programme for it in this pass.
- Two poster artifacts, not content: the Aug 27 Wet Market poster's description is a stray
  copy-paste of the Opening Gala paragraph, and the Aug 31 poster carries a leftover
  "30 AUG SALO SALO SA SAGANA" sub-line. Ignore both.
