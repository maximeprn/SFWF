# Siargao Food & Wine Festival — 2026 site

Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · deployed on Vercel. No database.

**Currently in phase 1 of a redesign**: the site is one page at `/` carrying the hero and the
programme in the 2026 identity. Every other route 301s home. Phase 2 restores Home · Program ·
Press with the nav band, menu and fade mask. Scope for both is in
`design_handoff_2026_redesign/` — `PHASE-1-PROGRAM.md` first, then the README.

## Commands

```bash
npm run dev        # dev server
npm run build      # production build (also typechecks)
npm test           # vitest
npm run typecheck  # tsc --noEmit
npx eslint .       # must be clean
```

## Where things live

```
src/content/      All copy and data. Change the festival's content here and nowhere else.
                  events.ts is the confirmed press-release calendar; venues.ts is the whole
                  booking system (a DM to the venue, per event).
src/components/
  background/     The WebGL dye. BloomLayer is the React host; dyeGround does the two-colour
                  remap; dyeFlow owns the two passes, field the velocity simulation, stroke
                  the input, shader the GLSL. One per document.
  chrome/         Footer, BackToTop, SocialMark.
  ui/             BlobDefs (the six silhouettes), Wobble (every rule in the product), Mark.
  sections/       home (Hero), program (the bubble and its filter), partners (the two rows).
  seo/            JSON-LD.
src/lib/
  design/shapes.ts  The six blob paths and the round-robin that assigns them.
  program/          Event copy derivations and the bubble reveal hook.
src/styles/       tokens.css — every colour, type and rhythm value.
public/           Brand assets. All originals from the festival; none are regenerable.
project-docs/     phase-1-deviations.md is the current record of decisions.
```

## Design rules — these are the brand, not preferences

Taken from `design_handoff_2026_redesign/README.md`. Breaking any of these makes it look like a
different festival.

- **Three type registers.** Beth Ellen (display script) for headlines, day names and numerals —
  never body copy. Arimo for prose and everything inside a bubble. Baloo 2 700 for primary
  buttons only. Meta lines are `ui-monospace` at 10–11.5px, `letter-spacing: .2em`.
- **Display type is lowercase where the design sets it lowercase** — "ani sang Siargao", "the
  six-day journey". That is the voice, not a CSS transform.
- **Nothing is pill-shaped.** Every surface and button takes one of the six `clipPath` outlines
  in `soft()`. A `border-radius: 999px` anywhere is a bug. True circles are correct in the one
  place they appear: the 8px access dot.
- **Every divider is drawn, never a border.** Full-width separators are the wobble path in
  `Wobble.tsx`; a `border-top` is the tell that a section was built wrong.
- **Borders, never shadows.** No elevation system, no shadow tokens. `box-shadow` is not used
  in this release. `text-shadow` would be fine.
- **No grain, noise or film over anything.** Not at any opacity, not as `feTurbulence`, not as a
  tiling PNG, not via a blend mode. The dye cloth is the only texture; flat surfaces are correct.
  The display shader was stripped of its noise overlay for this reason.
- **No colour push.** The palette hexes as written. No `saturate`/`contrast`/`brightness`/
  `hue-rotate`, no gradient over the violet, and the ground hex is never lightened or darkened.
  The dye renders as a straight lerp between `#4F3F79` and `#E9622D` and must stay that way.
- **Only the festival's hand-drawn PNGs.** Six day doodles and the farmer. No Lucide, no
  Heroicons, no redrawn SVGs, no emoji. The wobble is the brand.
- **One dye ground per page**, fixed behind everything, at coverage 40 / wash 50, locked to
  width — never `cover`, which visibly jumps the moment a bubble opens.
- **The shader's motion constants are frozen** (`src/components/background/shader.ts`). `tau`,
  `visc`, `disp`, `curl` and `push` were hand-tuned in the festival's own prototype; moving them
  more than ~20% changes the character. The colour half of that shader is deliberately gone.
- **Never add a `pointerup`, `pointerleave` or `pointercancel` handler to the dye.** Lifting off
  is not an event it cares about — the field stops being fed and coasts.
- **Colours come from `src/styles/tokens.css`.** Never hardcode a hex or an rgba in a component.
- **Motion is response, not ambience.** The bubble reveal, colour hovers, the footer marks
  standing upright, and the dye. Nothing else moves — no scroll reveals, no fade-ins, no
  parallax, and hand-drawn strokes never draw themselves on.

## Content rules

- Local vocabulary stays unglossed: karinderya, kinilaw, sugba, salo-salo, miki, boodle.
  **Standardise on "karinderya"** — a test enforces this.
- **No emoji.** The source has none — a test enforces this too.
- **Never print an unconfirmed price.** Seven events carry `price: "TBD"`; the open bubble states
  place and time alone and never says "price to be confirmed". `TIME TBD` is different — the time
  is still spoken, as "time to be confirmed".
- **Missing copy is stated, not hidden.** "Program details to be announced" and "Line-up to be
  announced" are written copy, not placeholders to fill in.
- **Nothing is for sale.** No cart, no checkout, no ticket count, no "book now". Every action is
  an Instagram DM to the venue or a `mailto:`.
- Numbers are sparse and honest. Don't pad a stat row; don't invent a deadline.
- The dateline lives in `FESTIVAL_DATES` and nowhere else.

## Quality gates

No file over 300 lines. No function over 50. TypeScript strict, no `any`. Tests pass, build
clean, zero lint warnings. Never commit `.env` or `.env.local`.

## Open questions for the festival

Tracked in `project-docs/phase-1-deviations.md`:

1. **Sagana's Instagram handle** — a ₱2,000 dinner currently booking through the festival account.
2. **`@tropicalacademyiao`** — looks truncated; verify before it sends anyone to a dead profile.
3. **Which contact address** — `info@siargaofoodfest.com` (shipped) or
   `hello@siargaofoodandwinefestival.com` (Press, phase 2).
4. **Seven unconfirmed prices**, one event with no line-up and no description.
