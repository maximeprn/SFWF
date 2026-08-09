# Siargao Food & Wine Festival — 2026 site

Next.js 15 (App Router) · TypeScript strict · Tailwind v4 · deployed on Vercel. No database.

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
src/components/
  background/     The WebGL dye. BloomLayer is the React host; dyeFlow owns the two passes,
                  field the velocity simulation, stroke the input, shader the frozen GLSL.
                  One per document.
  chrome/         NavBand, Menu, Loader, Footer, SiteShell.
  ui/             Bubble, Cta, Photo, Prose, Doodle, PassportCard, Lightbox, Field.
  sections/       Per-screen composition: home, purpose, program, crawl, tickets.
  seo/            JSON-LD.
src/lib/
  design/         Blob paths, nub radii, the menu ring.
  tickets/        Enquiry schema, mail, rate limit.
  useContentFade.ts The mask that dissolves copy under the fixed nav band.
src/styles/       tokens.css — every colour, type and rhythm value.
public/           Brand assets. All originals from the festival; none are regenerable.
project-docs/     Design decisions and the list of deliberate deviations.
```

## Design rules — these are the brand, not preferences

Taken from the design system's `SKILL.md` and the mobile prototype. Breaking any of these makes
it look like a different festival.

- **Two type registers.** Wigglye (display) for headings, bubble labels and numerals — never body
  copy, it's illegible below ~18px. Satoshi for everything else. Never mix within one block.
- **Nothing is pill-shaped.** Small controls use the per-corner px radii in `nub()`; surfaces use
  the hand-cut `clipPath` outlines in `soft()`. A `border-radius: 999px` anywhere is a bug.
  Exceptions that are correct: tier chips and stamp rings, which are true circles/ovals.
- **Borders, never shadows.** There is no elevation system and no shadow tokens. `text-shadow` is
  fine — it's the scrim that keeps copy legible on the dye. `box-shadow` is not.
- **Only the festival's seven hand-drawn PNG icons.** No Lucide, no Heroicons, no redrawn SVGs,
  no emoji. The wobble is the brand.
- **The octopus mark is light line art only.** It needs an ink or dye ground and has no dark
  colorway. Never redraw, recolor or reinterpret it. On a light background, use type instead.
- **One bloom background per page**, on the primary surface. It is the only ambient motion in the
  system. No scroll animations, no fade-ins, no parallax, no bounces.
- **The shader constants are frozen** (`src/components/background/shader.ts`). They were hand-tuned
  in the festival's own motion prototype. Don't retune them. Shipped feel is `Turbulent`; moving
  `tau`, `visc` or `disp` by more than ~20% changes the character.
- **Never add a `pointerup`, `pointerleave` or `pointercancel` handler to the dye.** Lifting off
  is not an event it cares about — the field stops being fed and coasts. A release handler
  reintroduces the old "stops dead on release" behaviour.
- **Blur only on the nav controls and lightbox buttons.** No frosted panels anywhere else.
- **Colours come from `src/styles/tokens.css`.** Only `#FFD010` and `#204020` are measured from
  real brand assets; everything else is a considered proposal. Never hardcode a hex in a
  component.

## Content rules

- Local vocabulary stays unglossed: karinderya, suroy suroy, kinilaw, boodle, ihaw-ihaw,
  pan de coco, adlai, inyam, balbacua. **Standardise on "karinderya"** — a test enforces this.
- **Numbers are sparse and honest.** Don't pad a stat row to a tidy four. Don't invent a deadline.
- **No emoji.** The source has none — a test enforces this too.
- Extend the human one-liner pattern (each karinderya gets a sentence about the family behind it).
  Don't reduce venues to name-only lists.
- The dateline lives in `FESTIVAL_DATES` and nowhere else.

## Quality gates

No file over 300 lines. No function over 50. TypeScript strict, no `any`. Tests pass, build
clean, zero lint warnings. Never commit `.env` or `.env.local`.

## Open questions for the festival

Tracked in `project-docs/deviations-from-prototype.md`:

1. **Confirm the 2026 dates** — 26–31 August is taken from the prototype; sources disagree.
2. **Café count** — copy says 10 and lists 10; one blurb said 14. Using 10.
3. **Wigglye licence** — Satoshi is Fontshare (free commercial); Wigglye is unverified.
4. **WhatsApp number and destination inbox** — needed before the tickets form can send.
5. **Media folder URL** — "Request images" is a `mailto:` until one exists.
