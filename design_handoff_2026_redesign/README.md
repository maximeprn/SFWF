# Handoff: SFWF 2026 — site redesign (2nd edition)

**For:** the developer (Claude Code) working in `siargaofoodfest` — the Next.js app already live.
**Date:** 19 August 2026. **Festival:** 26–31 August 2026, Siargao Island, Philippines.

> ## ⛔ Corrections after the first handoff pass — read these first
>
> The first implementation added two things this document never asked for. Both must be removed and
> neither may be reintroduced:
>
> 1. **No grain, noise, film or paper overlay. Anywhere.** Not on the ground, not on the bubbles, not
>    on images, not at low opacity, not as a `background-blend-mode`, not as an SVG `feTurbulence`, not
>    as a repeating PNG. **The dye cloth is the only texture in this design.** If a surface looks flat,
>    that is the design working correctly.
> 2. **Do not push the colour.** The palette is exactly four hexes — `#4F3F79` violet, `#E9622D`
>    orange, `#E9E7C2` beige, `#65C6BD` cyan (unused) — plus the derived inks in §3. No `filter:
>    saturate()`, `contrast()`, `brightness()` or `hue-rotate()` on the ground or on any surface; no
>    gradient over the violet; no third colour introduced to "warm it up". The ground hex is never
>    lightened or darkened, and the dye is remapped to **two palette colours only**.
>
> The dye ground ships at **coverage 40, wash 50** (§8's tweak list) — those exact numbers, locked to
> width, never `cover`. Higher coverage or wash reads as "too strong colours" and is wrong.
>
> Content corrections from the festival's own poster set — three confirmed times, the fuller Slow Food
> line, Last Chance on the Mam-on chef's table, Hiyas Farm removed, six added sponsor marks — are
> specified in `CLAUDE-CODE-2026-08-19-content-update.md` in this bundle.

---

## Overview

The site is already live and its architecture stays. This is **not a greenfield build** — it is a
redesign applied to an existing Next.js/React app: a new visual identity, a new page set, and a
rebuilt programme page. Routing, content typing, SEO and deployment do not change shape.

Three things move:

1. **A new brand skin.** Violet dye ground, orange script headlines, beige hand-cut bubbles. This
   replaces the indigo-and-gold system with Wigglye + Satoshi. Type is now **Beth Ellen + Arimo +
   Baloo 2**, all from Google Fonts.
2. **A new page set.** `Home · Program · Press`. `/tickets`, `/about`, `/food-crawl` and
   `/purpose` no longer exist as pages — their content is folded into Home or dropped.
3. **A rebuilt programme.** Sixteen events over six named days, with **times and prices**, tap-to-open
   bubbles, a day filter, and a per-venue Instagram booking CTA instead of any ticketing.

Point 3 breaks rules the live repo currently **enforces with tests** — see §2.4. Read §2 before
touching code.

---

## Production plan — two releases, in order

**Phase 1 — the Program one-pager (urgent).** The live site becomes a single page at `/` — the
home hero on top, then the full programme, sponsors, hosts and footer — in the new identity, with
**no top bar, no menu and no other routes** (old paths 301 to `/`); the loader seal is removed
now and the dye ships animated. The team needs the programme published now. Full scope and build
order in `PHASE-1-PROGRAM.md`. Build and ship this first; touch nothing else until it is live.

**Phase 2 — the full redesign.** Once the one-pager is live, implement the rest of this document:
Home, Program, Press, the chrome, the dye flow, everything. The
one-pager's programme section carries over as-is — build it once, in phase 1, to this spec.

## About the design files

The files in this bundle are **design references created in HTML** — prototypes showing intended
look and behaviour, not production code to copy. Each one is a "Design Component": a single
`.dc.html` file with an inline-styled template and a small logic class, driven by a runtime
(`support.js`) that exists only to let designers iterate. **Do not port `support.js`, `<x-dc>`,
`<sc-if>`, `<sc-for>` or `{{ holes }}` into the app.**

The task is to **recreate these designs in the existing Next.js codebase** using its established
patterns: React components in `src/components/`, typed content in `src/content/`, CSS custom
properties in `src/styles/tokens.css`, the App Router pages in `src/app/`. Every measurement,
colour and behaviour in this README is authoritative; the HTML is there to look at and to read
values out of when this document is not specific enough.

To open a prototype: serve the bundle folder over HTTP (`npx serve .`) and open
`SFWF prototype.dc.html`. The dye ground needs WebGL; without it a flat still is painted instead.

## Fidelity

**High fidelity.** Colours, type scale, spacing, clip-path silhouettes, easing curves and copy are
final and were argued to their current values. Recreate them exactly. Two deliberate exceptions:

- **Imagery is placeholder.** The film frame and the three "last year" clips are drop-zones
  (`<image-slot>`) at `aspect-ratio: 9/16`. Real footage/stills are still to come; ship them as a
  `<video>` or `<Image>` with the same frame geometry.
- **The Press page in the prototype is a trimmed stub.** The full Press design is the standalone
  `SFWF Press.dc.html`. Build from that one.

---

# 1 · Site map (new)

```
/            Home     hero · film · island intro · what it is + stats · acknowledgement ·
                      partners · why we do this (01/02) · host logos · last year strip
/program     Program  6 days · 16 events · day filter · tap-to-open bubbles
/press       Press    accreditation · media kit · stats · contact
```

Nav order: **Home · Program · Press**, with **View Program** pinned right as the one primary
button. **There is no Venues page** — it was explored and cut. The prototype still carries a
`#/venues` route and a `showVenues` flag from that cut: leave both out of the build. There is no Tickets link and no ticketing page: **the festival sells nothing**, and
every reservation is a DM to the venue hosting that event.

### What happens to the live routes

| Live route | Becomes |
|---|---|
| `/` | Rebuilt. Keeps the "Why we do this" argument (01 The gap / 02 The solution) as prose; gains film, island intro, stats, acknowledgement, partners, host logos, last-year strip |
| `/program` | Rebuilt (see §6) |
| `/about` | **Gone.** Its mission copy is now Home's "WHAT IT IS" + "ACKNOWLEDGEMENT" sections |
| `/tickets` | **Gone.** No form, no WhatsApp button, no enquiry topics. Booking is per-venue Instagram |
| `/media-center` | Becomes `/press` (redirect the old path) |
| `/food-crawl` | **Gone.** The Coffee Crawl page was cut from the redesign; the route 301s home |
| `/purpose` | **Gone as a page.** The parked seed story is not in the redesign. Keep the file if the festival still wants it parked, but nothing in the new design references it |

---

# 2 · The delta — what changes against what shipped

## 2.1 Identity

| | Live | Redesign |
|---|---|---|
| Ground | Indigo shibori bloom, ripple on press | Same cloth, **remapped to two palette colours** (violet + orange), fixed behind the page (§5) |
| Accent | Gold `#FFD010` | Orange `#E9622D` |
| Surfaces | White hand-cut bubbles | **Beige** `#E9E7C2` hand-cut bubbles |
| Display face | Wigglye | **Beth Ellen** (Google) |
| Body face | Satoshi | **Arimo** (Google) |
| Buttons | Satoshi | **Baloo 2 700** for primary CTAs; Arimo 700 inside bubbles |
| Meta / eyebrows | Satoshi uppercase | **`ui-monospace`**, 10–11.5px, `letter-spacing: .2em` |
| Mark | Octopus line art, gold | **Beige wordmark PNG** (`assets/logos/sfwf-beige.png`); the octopus is not used |
| Loading seal | Gold pour, once per session | **Dropped.** (`SFWF Loading.dc.html` in the project is the old gold seal — legacy, not part of this handoff) |

Wigglye's unverified licence (live open question 6) goes away with it: Beth Ellen, Arimo and
Baloo 2 are all Google Fonts, free for commercial use.

## 2.2 Structure

- One breakpoint: **860px**. Display type takes a second step at **1100px** (hero only). The live
  900px / 1100px pair is replaced by this.
- Content column is **1040px** (`--sw`), not 1180px. Gutter `clamp(18px, 5vw, 52px)`; the Program
  page runs a tighter frame — `calc(var(--sw) - 60px)` with a `clamp(24px, 7vw, 76px)` gutter.
- **Doodles are shown at every width** (the live site hides them ≥900px). They are now day markers
  next to programme headings, and one large farmer drawing above the day filter — they punctuate
  headings, not prose, so they no longer drift.
- Home is **centre-spined**: hero, intro, stats, acknowledgement, partners and host logos are all
  centred; only "Why we do this" is left-aligned prose.

## 2.3 Behaviour

- **The nav band's fade survives and is unchanged in spirit, retuned in numbers**: copy is masked
  out for the first **56px** under the viewport top, then ramps to opaque over **26px** (live:
  94px + 42px). Still a mask, not a scrim — the dye carries through at full strength.
- **The dye no longer reacts to the pointer** on the page ground. It is a fixed, viewport-sized
  canvas painted once per coverage/wash setting, repainted on resize. A long scroll must never
  rescale it, and it must be locked to width, never `cover` — with `cover` the background visibly
  jumps when a bubble opens.
- **Bubbles open independently** (as live), and now animate `grid-template-rows: 0fr → 1fr` plus
  opacity over **.34s `cubic-bezier(.22,.75,.2,1)`**. Nothing starts open.
- **Opening a bubble adds height, never width.** A bubble keeps its grid column and its 440px cap
  open or closed, so a day of one event reads the same as a day of four.
- New: a **day filter** above the programme, and a **back-to-top** button after 640px of scroll.

## 2.4 Content rules that REVERSE — read this before you code

The live repo enforces these with tests. The redesign breaks three of them on purpose, because the
festival supplied the data:

| Live rule (test-enforced) | Redesign |
|---|---|
| No clock times in programme copy | **Times are shown** — `6PM – 10PM`, `1ST SEATING 5PM · 2ND 8PM`, `TIME TBD` |
| No peso figures | **Known prices are shown** when the bubble is open — `₱2,400 per head`, `₱1,500`, `free`, `pay per dish`. An unconfirmed price is simply not mentioned |
| `TICKETED` chip on ticketed events | **Replaced** by an access mark: orange dot + `RESERVE`, or `WALK IN` with no dot |
| No `passport` / `stamp` / `₱` in crawl content | Moot — the Coffee Crawl page is cut; its content and route go away |
| `karinderya` never "carinderia"; no emoji | **Unchanged — keep both tests.** |

Also: **17 events → 16**. The redesign's programme is the confirmed press-release calendar
(`uploads/SFWF_2026_3_Press_Releases.docx.pdf`), which is not identical to the deck the live site
was built from. Treat §10 as the source of truth and reconcile `src/content/events.ts` against it.

---

# 3 · Design tokens

## Colour

| Token | Hex | Use |
|---|---|---|
| Violet ground | `#4F3F79` | Page background; the dye's base. Never lighten or darken it |
| Orange | `#E9622D` | Script headlines, primary buttons, the access dot, chapter statements |
| Beige | `#E9E7C2` | All copy on the violet ground; bubble fill; logo colourway |
| Deep violet ink | `#3E3064` | Titles **on** beige bubbles |
| Violet ink | `#4F3F79` | Body and meta on beige bubbles |
| Venue kicker orange | `#F9621B` | The bold venue name in a collapsed bubble's kicker only |
| Dark orange | `#8F3A12` | Orange text on beige/light grounds (5.99:1) — never `#E9622D` there |
| Button label | `#191218` | Label on orange and beige buttons |
| Cyan | `#65C6BD` | In the palette, not used on the site yet. Reserved |
| Bubble hover | `#F2F0D4` | |
| Orange hover (primary) | `#f27a49` | |
| Orange hover (secondary/in-bubble) | `#d4551f` | |
| Hairline on violet | `rgba(233,231,194,.4–.5)` | Drawn rules and day dividers (SVG strokes, never borders) |
| Hairline on beige | `rgba(79,63,121,.3)` | The drawn rule above a bubble's footer |

**Contrast rules, learned the hard way — these are decisions, not defects:**

- On the violet ground, `#E9622D` is **2.73:1**. It is kept for the big script headline only, where
  it is a picture rather than a label. **Every eyebrow, date, meta line and body paragraph on violet
  is beige `#E9E7C2`** (7.28:1). An earlier draft set meta in orange; that was overturned.
- On beige bubbles, the pale dye and white surfaces, **any ink under ~.7 alpha falls below 4.5:1**.
  Only `#4F3F79` and the near-black inks clear it. Never reach for a lighter tint to mean
  "secondary" — use italic, weight or size.
- Derived steps that do pass: `#8F3A12` on light grounds (5.99:1), `#F7F3E4` on violet (8.4:1).

## Type

```
Display / script  Beth Ellen  400            — headlines, day names, nav words, emails, pull quotes
Body              Arimo       400 / 500 / 700 — prose, bubble titles, line-ups
Primary buttons   Baloo 2     700            — "View the Program", "See the Program", "Write to us"
Meta              ui-monospace, Menlo, monospace (.mono) — eyebrows, dates, counts, access marks
```

Google Fonts one-liner used by every page:

```html
<link href="https://fonts.googleapis.com/css2?family=Beth+Ellen&family=Baloo+2:wght@400;700&family=Arimo:wght@400;500;700&display=swap" rel="stylesheet">
```

⚠️ **The table below is the prototype's own scale, trimmed for its narrow 1040px column. Do not
build from it.** Used at full width it renders everything too small — that is what happened on the
first pass. The shipped scale, at the 1180px content column, is in **`PHASE-1-TYPE-SCALE.md`**;
build from that file and treat this one as historical.

| Role | Value |
|---|---|
| Hero script headline | `400 clamp(32px, 5.4vw, 56px)/1.1` Beth Ellen, orange, `× var(--hs)` (1.4) above 1100px |
| Page h1 (Program) | `400 clamp(27px, 3.8vw, 40px)/1.12` Beth Ellen, orange |
| Page h1 (Venues) | `400 clamp(30px, 4.6vw, 48px)/1.12` Beth Ellen, orange |
| Section h2 | `400 clamp(24px, 3.2vw, 34px)/1.16` Beth Ellen, beige |
| Day name | `400 clamp(18px, 2.2vw, 22px)/1.16` Beth Ellen, beige |
| Pull quote / sign-off | `400 clamp(19px, 2.6vw, 28px)/1.26` Beth Ellen |
| Stat numeral | `400 clamp(24px, 3.4vw, 32px)/1` Beth Ellen, orange |
| Prose | `400 clamp(13px, .22vw + 12.17px, 15px)/1.7` Arimo, beige, `text-wrap: pretty` |
| Chapter statement | `700 15.5px/1.34` Arimo, **uppercase**, orange |
| Bubble title, closed | `700 clamp(13.2px, .14vw + 12.7px, 14.5px)/1.35` Arimo, `#3E3064` |
| Bubble title, open | `700 clamp(15px, .2vw + 14.25px, 16.5px)/1.3` Arimo, `#3E3064` |
| Bubble kicker (venue · time) | mono `10px/1.5`, `.14em`; venue `700 #F9621B`, rest `#4F3F79` |
| Bubble hint line (open) | mono-ish Arimo `900 8.5px`, **uppercase**; place in orange, rest `#4F3F79` |
| Bubble description | `400 11.5px/1.62` Arimo, `#3E3064`, max 78ch |
| Line-up | `400 clamp(12px, .11vw + 11.6px, 13px)/1.5` Arimo, `#4F3F79`, max 52ch |
| Eyebrow / meta | mono `10–10.5px`, `letter-spacing: .2em`, beige |
| Access mark | mono `10px`, `.12em`, `#4F3F79` |
| Nav word | `400 14px/1` Beth Ellen (mobile menu: 23px) |
| Primary button | `700 12.5–13.5px/1` Baloo 2, `.02em` |
| In-bubble button | `700 12px/1.2` Arimo, beige on orange |

(Again: those are 1040px-column numbers. `PHASE-1-TYPE-SCALE.md` has the ones to ship — bubble title
15.5–17px closed, 18–21px open, description 14.5–16px, mono eyebrows 11–12px, nothing under 11px.)

Set the **display faces in lowercase** where the design does — "ani sang Siargao", "the six-day
journey", "the whole island is the venue". That lowercase is the voice, not a CSS transform.

## Layout variables

⚠️ **Same trap as the type table: these are the prototype's frame values, not the shipped ones.**
`--sw: 1040px` / `--tm: 80ch` belong to the narrow prototype column. Ship the numbers in the second
block — the measure especially: `ch` scales with font-size, so 80ch at the shipped prose size
(15–16.5px) is ≈700–740px of line, well past comfortable. The design of record caps each block
explicitly instead.

```css
/* prototype — historical */
--sw: 1040px;   /* content column. Tweakable 840–1320 in the prototype */
--tm: 80ch;     /* reading measure; sections cap at --tm, --tm ± 2–8ch. Fallback literal 58ch */
--hs: 1.4;      /* hero scale, applied only at ≥1100px; 1 below that */
```

```css
/* ship these */
--sw: 1180px;   /* content column, side padding 24px */
--hs: 1.4;      /* hero scale, only at ≥1100px; 1 below that */
```

No global `--tm`. Per-block caps, as measured off `SFWF Home.dc.html` / `SFWF Programme.dc.html`:

| Block | Cap |
|---|---|
| Centred intro prose, hero | `620px` |
| Centred section prose (what it is, acknowledgement) | `660px` |
| Left-aligned purpose column | `680px` |
| Programme intro line | `32em` |
| Open bubble description | `900px` |
| Open bubble title | `26em` |
| Script sign-off | `24em` |
| Hero `h1` / programme `h1` | `15em` / `16em` |

Gutter `clamp(18px, 5vw, 52px)` · Program gutter `clamp(24px, 7vw, 76px)` inside
`calc(var(--sw) - 60px)` · section rhythm `clamp(34px, 4.6vw, 54px)` top padding, with the
last-year strip opening at `clamp(84px, 10.5vw, 140px)`.

## Shape

There are **six hand-cut bubble silhouettes**, `pb0`–`pb5`, as `clipPath clipPathUnits=
"objectBoundingBox"` paths. They are in the `<defs>` block at the top of every prototype file —
lift the path data verbatim into one shared `<BlobDefs>` SVG (the live repo already has one). They
are assigned round-robin so neighbouring bubbles never share a silhouette:

```
bubble:  BLOBS[(n * 5 + dayIndex) % 6]
button:  BLOBS[(dayIndex * 5 + eventIndex + 2) % 6]
```

Every surface and every button uses one. **Nothing is pill-shaped and nothing has a shadow** —
except the 9:16 media frames, which carry `0 18px 46px rgba(20,14,40,.32)` (hero) and
`0 14px 34px rgba(20,14,40,.3)` (strip clips), and a `16px` radius on the hero frame. The burger
button is the one organic radius: `52% 48% 56% 44% / 60% 42% 58% 40%`.

Hand-drawn strokes (section dividers, nav underline, footer rule, the menu ring, the swipe arrow)
are inline SVG paths with `stroke-linecap: round`, `1.3–2.8px`, beige at `.4–.74` alpha,
`vector-effect: non-scaling-stroke` on the ones that stretch. Decorative divider SVGs carry a
`rotate(±0.7–1.4deg)` so no two sit level.

**Every divider is drawn — never a `border`.** No straight 1px rule exists anywhere in the
product: full-width separators (Program day sections, footers, "why we do this") are the wobble
path at `rgba(233,231,194,.4)` / `stroke-width 1.4`, and the rule inside an open bubble is the
same idea in violet, `rgba(79,63,121,.3)` / `1.3`. A CSS `border-top` is the tell that a section
was built wrong.

## Motion — match the mockup, NOT the live site

The animation vocabulary was rebuilt with the identity. Where the mockup and the live site
disagree, **the mockup wins** (the differences are listed at the end of this section). The
principle carries over: motion is response, not ambience — if it isn't answering a tap, a hover, a
scroll or a route change, it does not move. The dye is the one ambient exception, and it is slow
enough to read as cloth.

**The full inventory** — every animated thing in the product:

| Thing | Behaviour |
|---|---|
| Bubble open/close | The signature. `grid-template-rows 0fr→1fr` + `opacity 0→1`, both `.34s cubic-bezier(.22,.75,.2,1)`; the shell's padding animates on the same curve (`22→24px` top, `26→28px` bottom). Two-frame mount and 360ms delayed unmount — exact JS in §7. Closing runs the same curve back down. The chevron flips `▾/▴` with no transition |
| Page/route change | `pageIn` keyframes on the incoming screen — `opacity 0→1` + `translateY(6px)→0`, `.3s ease both`; plus `window.scrollTo({top: 0, behavior: 'smooth'})` |
| Menu overlay | `menuIn` — opacity only, `.34s ease both`. Simultaneously the page's `<main>` fades to `opacity: 0` over `.3s ease` (and back on close). No scrim, no slide |
| Dye ground | Alive on every page — see "The dye flow" below |
| Nav fade mask | Recomputed every scroll frame (rAF-throttled, straight to the node): copy dissolves in the 56px band under the viewport top, ramps to opaque over the next 26px |
| Colour hovers | `.15s ease` everywhere: nav words → orange, bubbles → `#F2F0D4`, primary buttons → `#f27a49`, in-bubble buttons → `#d4551f` |
| Social marks | Rest at −5°/+4°/−3°; on hover stand upright and scale to 1.14 — `transform .22s cubic-bezier(.34,1.56,.64,1)` (deliberate overshoot), `color .2s ease` to orange |
| Day-filter chips | No movement — the active chip swaps instantly; unselected chips only ease opacity `.7→1` on hover, `.15s` |
| Back to top | Appears past `scrollY > 640` with no entrance animation; smooth-scrolls to 0 |

**The dye flow.** The ground is the mockup's remapped cloth driven by the flow engine
(`components/backgrounds/dye-flow.js`, full parameters in
`design_handoff_dye_flow_background/README.md`): a swipe stirs the dye like a hand through liquid,
the whole path of the stroke stays stirred, and the motion keeps developing for ~2–3s after the
pointer lifts; scrolling stirs it gently; flow leaving one edge re-enters the opposite edge. It
runs at the engine's behind-content defaults and is mounted once per page on the fixed canvas
(§4). Never a ripple that stops dead on release.

**Hand-drawn strokes do not animate.** No draw-on effects anywhere: the wobble underlines,
dividers, the menu ring and the footer rule are static ink. (The live site's purpose story was the
one sanctioned draw-on; it is gone — see below.)

**Removed against the live site — do not carry these over:**

- **The loader seal** (once-per-session gold pour, blocking script, Enter button) — gone entirely.
  Pages load straight into content.
- **The purpose story's scroll reveal and root-system drawing** (`.purpose .rv.on .cr path`, the
  4.2s roots) — gone with the story linework; the 01/02 chapters are plain copy and do not move.
- **The press-and-hold ripple** (already superseded live) — stays gone.
- **The nav band's reveal travel** (already removed live) — stays gone; the band is fixed chrome.
- The fade mask's numbers are retuned: live 94px + 42px → **56px + 26px**.

**Reduced motion:** under `prefers-reduced-motion`, cut the bubble reveal and `pageIn` to their
end states, and pause the dye flow (`paintStill()` draws the same ground flat).

---

# 4 · The dye ground

The one background in the product. Every page carries it; nothing else brings a gradient, panel or
photo backdrop.

It is the live site's own shibori texture
(`design_handoff_dye_flow_background/assets/indigo-shibori.png`) **rotated to portrait, halved in
resolution, and remapped to exactly two palette colours** — the violet keeps its exact hex and the
orange rides the cloth's darkest stains. Nothing in between: a third tint makes it read as a
gradient rather than as dyed cloth.

Implementation to port, verbatim in spirit:

- `components/backgrounds/dye-ground.js` — `buildDyeGround({coverage, wash})` remaps the artwork on
  a canvas (luminance normalised per frame, smoothstep biased dark, `pow(…, 1.6)`), then
  `mountDyeGround(canvas, …)` hands it to the flow engine as its texture. Defaults in the
  prototype: **coverage 40, wash 50**.
- `components/backgrounds/dye-flow.js` — the two-pass flow engine (already shipped on the live site
  as `src/components/background/dyeFlow.ts`). `design_handoff_dye_flow_background/README.md` in this
  bundle documents it in full.
- The canvas is **`position: fixed; inset: 0; z-index: 0`**, `pointer-events: none`, and the page
  sits on `z-index: 1`. Rebuild only when coverage/wash changes; repaint on resize.
- **No WebGL:** `paintStill()` draws the same ground flat, locked to width.
- Baked JPEG fallbacks for static contexts are in `assets/dye-hr/` — `violet-orange-hr.jpg` is the
  one the standalone page files use as a CSS `background` under the canvas.

---

# 5 · Chrome

### Nav band

`position: sticky; top: 0; z-index: 60; pointer-events: none` (children re-enable), no plate, no
blur, no border — it sits straight on the dye and the page copy dissolves under it (§2.3).
Inner grid `1fr auto 1fr`, `max-width: calc(var(--sw) + 60px)`, `padding: 15px clamp(18px,5vw,52px)`.

- **Left:** beige wordmark, `height: 23px`, links home.
- **Centre (≥860px):** three Beth Ellen words at 14px, `gap: clamp(16px,2.2vw,28px)`, hover → orange.
  The current page carries a **hand-drawn wobble underline** — an inline SVG path,
  `viewBox="0 0 100 6"`, `preserveAspectRatio="none"`, 5px tall, beige, `stroke-width: 1.6`, sitting
  `bottom: 0` of a 6px-padded span.
- **Right (≥860px):** `View Program` — `clip-path: url(#pb2)`, orange, `#191218` Baloo 2 700 12.5px,
  `padding: 10px 19px 12px`.
- **Right (<860px):** 42px burger, `rgba(233,231,194,.16)` on a `1px rgba(233,231,194,.34)` border,
  `backdrop-filter: blur(6px)`, organic radius, glyph `☰` / `✕`.

### Mobile menu

Full-screen `position: fixed; inset: 0; z-index: 55`, **no scrim** — the page's own copy fades to
`opacity: 0` and the dye stays exactly as it was. The links sit inside a hand-drawn ring (a single
SVG path, `stroke-width: 2.8`, beige) in a `min(84vw, 322px)` box at `aspect-ratio: 322/326`.
Words are Beth Ellen 23px, `gap: 24px`, centred. Tapping the backdrop or `Escape` closes;
`body { overflow: hidden }` while open.

### The fade mask

On `<main>`, recomputed from its `getBoundingClientRect().top` on every scroll frame (rAF-throttled,
written straight to the node — far too often for React state):

```js
const g = `linear-gradient(to bottom,
  rgba(0,0,0,0) ${-top}px,
  rgba(0,0,0,0) ${-top + 56}px,
  #000 ${-top + 82}px)`;
el.style.maskImage = g; el.style.webkitMaskImage = g;
```

### Footer

Hand-drawn hairline rule (full width, 5px tall SVG), then a centred column: three social marks →
email → mono dateline `26 – 31 AUGUST 2026 · SIARGAO ISLAND, PHILIPPINES`.
Marks are 40px hit areas resting at **−5°, +4°, −3°**, standing upright and scaling to **1.14** on
hover, turning orange. Icons are 22px `currentColor` strokes at `1.6`.
Socials: `instagram.com/siargaofoodandwinefestival` · `facebook.com/siargaofoodfest` ·
`tiktok.com/@siargaofoodfest`.

### Back to top

Appears after `scrollY > 640`: `position: fixed`, `right/bottom clamp(14px,3vw,26px)`, 44×44,
`clip-path: url(#pb4)`, orange, `↑` in `#191218`. Smooth-scrolls to 0.

---

# 6 · Screens

## Home — `/`

Order is fixed by the festival's brief. Every section is centred and separated by a hand-drawn
divider except where noted.

1. **Hero.** Beige wordmark at `min(46vw, 300px) × var(--hs)`, with **"2nd edition"** in Beth Ellen
   `clamp(15px,2vw,20px)` pinned to its top-right corner, `rotate(-4deg)`, origin bottom-right.
   Then the script headline **"ani sang Siargao"** in orange, `max-width: 14em`. Then the dateline
   **`26 – 31 AUGUST 2026`** (mono, `.22em`) flanked by two mirrored wobble rules. Then the CTA
   **View the Program** — beige fill, `#191218` label, `clip-path: url(#pb1)`.
2. **The film.** A single `min(72vw, 268px)` 9:16 frame, `border-radius: 16px`, drop shadow, with a
   bottom scrim `linear-gradient(transparent, rgba(20,14,40,.66))` and the mono caption
   `THE FILM · 2026`. Placeholder — real film goes here.
3. **Island intro.** Two prose paragraphs ("Siargao is nine municipalities of farmland, mangrove and
   open water…" / "There is no way to understand it from the outside. You have to come and eat with
   us."), then the orange script line **"See you on Siargao this August"**.
4. **What it is.** Eyebrow `WHAT IT IS`, one paragraph, then four stats in a wrapping centred row,
   `gap: clamp(16px,4vw,40px)`: **6 DAYS · 9 MUNICIPALITIES · 30+ MAKERS · 18 GATHERINGS**
   (numeral in orange Beth Ellen, label in mono `.16em` beige).
5. **Acknowledgement.** Eyebrow `ACKNOWLEDGEMENT`, then the statement in **Arimo 700 uppercase**
   (`clamp(13.5px, .22vw + 12.67px, 15.5px)/1.55`, `.01em`) — "THE SIARGAO FOOD & WINE FESTIVAL IS
   HELD ON THE LAND AND WATERS OF THE PEOPLE OF SIARGAO." — then two prose paragraphs. It sits **on
   the dye**; no beige band, no box.
6. **Partners.** Eyebrow `OFFICIAL PARTNERS AND SPONSORS`, the ten sponsor marks
   (`assets/sponsors/`: Happy Living, Masterplan Global, Modulus, Destileria Limtuaco, Galatea Tours,
   Greenhouse, Ripple, The Henry, Coconut Cruisers, Tropika) knocked to beige
   at `height: clamp(24px,2.8vw,32px)`, `gap: clamp(22px,3.6vw,38px)`. The same row repeats on Press.
7. **Why we do this.** The one left-aligned block, `max-width: calc(var(--tm) + 4ch)`.
   Eyebrow → h2 *"Siargao grows less of its own food every year."* → two chapters, each:
   `01` in Beth Ellen + label in mono `.2em` + a hairline wobble rule running right; then the
   statement in orange uppercase Arimo 700; then prose. `01 THE GAP` / `02 THE SOLUTION` — copy in
   §10. Then a full-width wobble rule, `AND IT TAKES ROOT`, the payoff *"Local farmers know what to
   grow."* (Arimo 700 `clamp(15.5px, .6vw + 13.2px, 18.5px)`), a closing line, and the orange
   **See the Program** CTA. **No root-system drawing and no scroll reveal** — this is copy, not
   linework; the live site's `.purpose .rv.on .cr path` machinery is not used here.
8. **Host logos.** Eyebrow `HOSTED ACROSS THE ISLAND BY`, fifteen beige venue logos plus one
   type-set name (Tropical Academy) in Beth Ellen 20px. The row is **not a link** —
   the prototype wraps it in one to `/venues`, which no longer exists. Per-logo widths are in the prototype markup and are hand-tuned for optical weight —
   copy them (`wild 30 · alma 84 · lokal-lab 66 · lyma 64 · kermit 60 · bravo 42 · roots 98 ·
   lamari 92 · hue 62 · sagana 58 · paraluman 78 · isla-panciteria 74 · cev 72 · lunares 48 ·
   siargao-corner-cafe 48`).
9. **Last year.** Eyebrow `RELIVE LAST YEAR'S BEST MOMENTS` on the left, a mono `SWIPE` + arrow on
   the right **only when the strip actually overflows**. Three 9:16 clips, `min(58vw, 208px)`,
   `gap: 36px`, `scroll-snap-type: x mandatory`, captions bottom-left in mono with a text shadow.
   Scrollbars hidden. The padding maths matter: when the three fit, the row is centred and there is
   nothing to scroll; when they don't, side padding centres the **first** clip at scroll 0 so the
   rest are reachable to the right (a centred flex row would strand them off-screen left).

## Program — `/program`

1. **Header.** h1 *"the six-day journey"* (orange script), then a standfirst: "Tap any gathering to
   see who is cooking and how to get in. Every reservation is made with the venue itself."
2. **Day filter.** Above it, on ≥860px, the farmer doodle at `min(56%, 300px)`.
   - **≥860px:** a row of seven buttons (`ALL SIX DAYS` + six days), `justify-content: space-between`.
     Each shows a mono date (`WED 26`) over the day name in Beth Ellen. **Selected** = beige blob
     chip (`padding: 7px 13px 9px`), date in `#8F3A12`, name 16px in `#3E3064`. **Unselected** =
     no chip, beige text at `opacity: .7` → 1 on hover.
   - **<860px:** wrapping mono chips of dates only (`ALL`, `WED 26`, `THUR 27`…), selected = orange
     fill with beige label, unselected = `rgba(233,231,194,.1)` at `.72` opacity.
   - Below it a mono count: `16 GATHERINGS · SIX DAYS`, or the long weekday when one day is picked
     (`THURSDAY 27 AUGUST`).
3. **Day sections.** Each day opens on a full-width hand-drawn wobble rule (§3 Shape — never a
   `border-top`), then a mono date, then
   the day name in Beth Ellen beside its **doodle marker** (`assets/doodles/beige/<icon>.png` at the
   per-day width in §10). Then the bubble grid:
   `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))`, `gap: 12px`,
   `align-items: start`, `max-width: calc(var(--sw) - 148px)`, bubbles capped at 440px.
4. **Close.** A centred Beth Ellen line: *"The festival sells nothing. Every table is booked with
   the people cooking at it."*

## Press — `/press`

Build from `SFWF Press.dc.html` (the prototype's Press tab is a stub). Two beige blob cards side by
side (`repeat(auto-fit, minmax(min(100%,300px),1fr))`, `gap: 14px`):

- **Accreditation** — kicker `NOW OPEN · ACCREDITATION` (kicker's first span bold `#F9621B`), title
  *"Media accreditation for the 2026 festival"*, intro, a three-item benefit list, then
  `APPLICATIONS CLOSE ON A DATE STILL TO BE CONFIRMED` in mono, then a violet-filled CTA to a
  `mailto:` with `subject=Media accreditation 2026`.
- **Media kit** — kicker `MEDIA KIT · IMAGES`, copy, a 2×2 striped placeholder grid
  (`repeating-linear-gradient(135deg, rgba(79,63,121,.14) 0 8px, transparent 8px 16px)` on a
  `1px rgba(79,63,121,.3)` border), then `FOLDER LINK TO BE ADDED BY THE FESTIVAL`.

Then four stat blobs (**6 THEMED DAYS · 9 MUNICIPALITIES · 30+ COLLABORATORS · 2nd EDITION**, numeral
in `#8F3A12` Beth Ellen 34px), then two photographs clipped to blob silhouettes at
`aspect-ratio: 2/1`, then a *"Covering the Festival?"* sign-off with the email in Beth Ellen 16px.

---

# 7 · The event bubble — the one component worth building properly

Everything else on these pages is layout. This is the component.

**Shell.** `background: #E9E7C2`, `clip-path: url(#pbN)`, `cursor: pointer`,
`role="button" tabIndex="0"`, hover `#F2F0D4` (`.15s ease`), `overflow-wrap: break-word`,
`max-width: 440px`.
Padding: closed `22px clamp(26px,3vw,38px) 26px`; open `24px clamp(26px,3vw,38px) 28px` — animated
on the same curve as the reveal.

**Collapsed** (a scannable chip; no field labels anywhere):

```
[ VENUE · TIME ]                    [ ● RESERVE ]  ▾
[ Event title, Arimo 700           ]
```

- Kicker: mono 10px `.14em` — venue in `700 #F9621B`, separator and time in `#4F3F79`; the time
  never wraps.
- Access mark: 8px orange dot + `RESERVE`, or bare `WALK IN`. **No price when closed.**
- Chevron `▾` / `▴` in `rgba(79,63,121,.92)`.

**Open** (reflow, not disclosure — the "4e" behaviour):

```
[ Event title, grown to 15–16.5px ]  [ ● RESERVE ]  ▴
PLACE · time to be confirmed · ₱2,400 per head     ← hint line, uppercase, place in orange
Description, Arimo 11.5/1.62, max 78ch
〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜  ← hand-drawn wobble stroke, rgba(79,63,121,.3)
Chef Jarrod · Chef Marc · Chef Jose (Lyma)          ← line-up, max 52ch
[ Message Lyma to reserve ]                         ← hand-cut orange button
```

- The title **grows** (13.2–14.5 → 15–16.5) rather than being replaced.
- The venue leaves the kicker and joins time and price in **one hint line**, so the time is stated
  once. Prices are spoken here and only here — `free` · `pay per dish` · `₱2,400 per head` — and
  **only when known**: on a `TBD` price the hint line is place · time alone. Never print
  "price to be confirmed". (`TIME TBD` is different: time is still spoken, as "time to be
  confirmed".)
- Missing copy is stated, not hidden: *"Program details to be announced."* and *"Line-up to be
  announced"*, both italic Arimo in `#4F3F79`.
- The booking button appears **only on bookable events**: `clip-path`, orange, beige label, Arimo
  700 12px, text `Message <host> to reserve`, `target="_blank" rel="noopener"`, opens
  `https://www.instagram.com/<handle>/`, and **stops propagation** so the tap doesn't collapse the
  bubble.

**Reveal mechanics** (two-step, so height animates from 0 without a measured height):

```js
// open:  mount the detail block at 0fr, then next-next frame → 1fr
setOpen(k, true);
requestAnimationFrame(() => requestAnimationFrame(() => setGrown(k, true)));
// close: 1fr → 0fr, unmount after 360ms
setGrown(k, false); setTimeout(() => setOpen(k, false), 360);
```

The detail wrapper is `display: grid; grid-template-rows: 0fr|1fr; overflow: hidden` with
`opacity 0|1`, both on `.34s cubic-bezier(.22,.75,.2,1)`; the inner child needs
`min-height: 0; min-width: 0`. `Enter` and `Space` toggle; `preventDefault` on both.

**Access derivation** — the mark is the booking, not a price tag:

```js
const walk = ['FREE', 'OPEN FOR ALL', 'À LA CARTE'].includes(price.toUpperCase());
// walk → { dot: false, word: 'WALK IN' }   else → { dot: true, word: 'RESERVE' }
```

---

# 8 · Interactions & behaviour

| Interaction | Behaviour |
|---|---|
| Nav word / CTA | Real route change. In the app these are `next/link`s; the prototype uses `#/route` hashes only so back/forward work without interception |
| Route change | Scroll to top (smooth), close the menu, **reset the day filter to "all"** |
| Burger | Toggle overlay; page copy → `opacity: 0`, `pointer-events: none`; body scroll locked; `Escape` closes; auto-closes if the viewport crosses to ≥860px |
| Bubble tap / Enter / Space | Toggle that bubble. Multi-open by default; single-open is a flag (then it behaves as an accordion) |
| Booking button | New tab to the venue's Instagram; does not toggle the bubble |
| Day chip | Filter to one day; the count line becomes that day's long weekday |
| Scroll | Recompute the nav fade mask (rAF-throttled); show back-to-top past 640px |
| Resize | Recompute dye canvas, `--hs`, and the last-year strip's padding/justification |
| Host card / logo row | New tab to Instagram / link to `/venues` |
| Hover (pointer only) | Nav → orange; bubble → `#F2F0D4`; primary button → `#f27a49`; in-bubble button → `#d4551f`; social mark → upright + 1.14 |

**Reduced motion:** honour `prefers-reduced-motion` on the bubble reveal and the page-in fade (cut to
final state). The dye is slow and ambient — pause it rather than animate it.

**Nothing anywhere is for sale.** No cart, no checkout, no ticket count, no "book now" that implies
a transaction. Every action is either a route change, an Instagram DM, or a `mailto:`.

---

# 9 · State

Trivial by design — all of it is view state; nothing is fetched at runtime.

| State | Type | Notes |
|---|---|---|
| `route` | enum `home \| program \| venues \| press` | App Router does this; the prototype uses the hash |
| `viewportWidth` | number | Only to derive `mobile = w < 860` and `hero = w >= 1100`. Track with one resize listener, bail when unchanged |
| `menuOpen` | boolean | Forced false ≥860px |
| `open` / `grown` | `Record<eventKey, boolean>` | Two maps, not one — `open` mounts the detail, `grown` animates it (§7) |
| `dayFilter` | `'all' \| 0…5` | Resets on route change |
| `showTop` | boolean | `scrollY > 640`, set only when it flips |

The nav fade mask and the dye canvas are **not state** — they are written to the DOM directly. Do
not route them through React.

Content is static, typed, and lives in `src/content/`. No CMS, no database, no API. Editing the
programme is a commit.

---

# 10 · Content — the confirmed calendar

Source: `uploads/SFWF_2026_3_Press_Releases.docx.pdf` (the festival's own press releases).
**Six days, sixteen events.** Reconcile `src/content/events.ts` against this list, and note that it
differs from the deck the live site was built from (§2.4).

Fields per event: `venue` (the kicker's uppercase short name), `time`, `title`, `price`, `who`
(line-up, nullable), `desc` (nullable). A `TBD` price is data state only — the UI never prints it. Fields per day: `date`, `weekday`, `name`, `icon`, icon
width.

### AUG 26 · WED 26 · "gala opening" — icon `wine` (34px)
- **WILD** · 6PM – 10PM · *Ani sang Siargao opening celebration* · TBD
  Line-up: Chef Morris · Chef Jarrod · Chef Hannah · Chef Dre · the WILD team · Manu

### AUG 27 · THU 27 · "ocean day" — icon `fish` (40px)
- **SIARGAO CORNER CAFÉ** · 8AM – 11AM · *Brewed by the Pioneers* · FREE
- **GL PUBLIC MARKET** · 4PM – 6PM · *Wet market experience by Roots* · À LA CARTE
- **ALMA** · 1ST SEATING 5PM · 2ND 8PM · *Alma × CMD Supper Club tasting menu* · TBD

### AUG 28 · FRI 28 · "coconut day" — icon `coconut` (32px)
- **LUNARES CAFÉ** · 8AM – 11AM · *Brewed by the Pioneers* · TBD · no line-up on record
- **ISLA PANCITERIA** · ALL DAY · *Miki Fiesta!* · À LA CARTE
- **LOKAL HUB** · 5PM – 7PM · *Meet the Changemakers: Coconut Lab, from tree to table* · FREE
- **LYMA** · DINNER · *Chef Jarrod Moore × Lyma collaboration dinner* · ₱2,400 / HEAD

### AUG 29 · SAT 29 · "producer day" — icon `dish` (34px)
- **TROPICAL ACADEMY SAN ISIDRO** · DAYTIME · *Island meets the Outback* · TBD
- **KERMIT** · 4PM · *Kermit pizza eating contest!* · TBD · no line-up on record
- **LAMARI** · 6:30PM · *Lamari presents "The Bounty of Siargao"* · ₱1,500
- **PARALUMAN** · 9PM – 1AM · *After dinner bar feature* · TBD · **no line-up, no description**

### AUG 30 · SUN 30 · "community day" — icon `ukulele` (22px)
- **MAM-ON ISLAND** · 9AM – 5PM · *Island style chef's table* · ₱6,000 / HEAD
- **BRAVO** · 4PM – 9PM · *Siargao Mercado* · OPEN FOR ALL
- **SAGANA** · 4PM – 11PM · *Salo salo sa Sagana* · ₱2,000

### AUG 31 · MON 31 · "closing celebration" — icon `flower` (20px)
- **HUE HOTEL** · 4PM · *Closing celebration & recognition* · TBD

Full descriptions are in the `DAYS` array in `SFWF prototype.dc.html` — copy them verbatim; they are
the festival's own words, edited only for length.

### Venue → place name · Instagram handle · booking name

```
WILD                        Wild                        @wild.siargao
SIARGAO CORNER CAFÉ         Siargao Corner Café         (no handle — festival account)
GL PUBLIC MARKET            General Luna public market  @roots.siargao        book: Roots
ALMA                        Alma                        @almasiargao
LUNARES CAFÉ                Lunares Café                (no handle — festival account)
ISLA PANCITERIA             Isla Panciteria             @islapanciteria.siargao
LOKAL HUB                   Lokal Hub                   @lokallab
LYMA                        Lyma                        @lymasiargao
TROPICAL ACADEMY SAN ISIDRO Tropical Academy, San Isidro @tropicalacademyiao   book: Tropical Academy
KERMIT                      Kermit                      @kermitsiargao
LAMARI                      Lamari                      @lamarisiargao
PARALUMAN                   Paraluman                   @paraluman.ph
MAM-ON ISLAND               Mam-on Island               @cevsiargao           book: Cev
BRAVO                       Bravo                       @bravosiargao
SAGANA                      Sagana                      (no handle — festival account)
HUE HOTEL                   Hue Hotel                   @huesiargao
```

Fallback account: `siargaofoodandwinefestival` — used wherever a venue has no handle on record.
One further host, **Bar Principal** (`@barprincipal.ph`), appears in the line-up data but has no
event in the confirmed calendar.

### Copy blocks

- **Chapter 01 · THE GAP** — *"Tourism grows. But not everyone grows with it."* → "As Siargao
  develops, rising costs, unequal access to resources and pressure on local food systems can leave
  communities behind. The challenge is ensuring tourism creates value **with the island — not at its
  expense.**" (the bold phrase is `<strong>`, same colour — the beige is already the emphasis
  ceiling on violet).
- **Chapter 02 · THE SOLUTION** — *"Turn tourism into a force for local resilience."* → "Through
  collaboration between hospitality, producers, chefs and communities, we create more circular food
  systems, supporting local sourcing, reducing waste and directing resources back into the
  communities that sustain Siargao."
- **Payoff** — `AND IT TAKES ROOT` / *"Local farmers know what to grow."* / "The week is what gets
  everyone in the room. Join us and be part of the solution."

### Copy rules that carry over from the live site

Local vocabulary stays unglossed (**karinderya** — never "carinderia"). Numbers are sparse and
honest: every stat is one the festival actually published; don't fuse two figures or pad the row.
**No emoji.** No passport, no stamps, nothing implying the festival sells anything.

---

# 11 · Assets

All originals are the festival's; none are regenerable. Everything referenced is in this bundle
under the same relative paths the prototypes use.

| Path | What |
|---|---|
| `assets/logos/sfwf-beige.png` | The wordmark used everywhere in this design |
| `assets/logos/sfwf-{violet,white,black,orange,cyan}.png` | Other colourways, for light grounds and print |
| `assets/venues/beige/*.png\|svg` | 19 host and partner marks, knocked out to beige |
| `assets/doodles/beige/*.png` | Six day markers (`wine, fish, coconut, dish, ukulele, flower`) + `scene` |
| `assets/doodles/orange/farmer.png` | The drawing above the day filter |
| `assets/photography/*.png` | Four festival photographs |
| `assets/dye-hr/violet-orange-hr.jpg` | Baked dye fallback for static contexts |
| `design_handoff_dye_flow_background/assets/indigo-shibori.png` | **The source cloth — it is blue.** Nothing on the site is blue: the remap in §4 turns it violet + orange at runtime. `assets/dye-hr/ground-rendered.png` is what it becomes |
| `assets/sponsors/*` | The ten sponsor marks used in "OFFICIAL PARTNERS AND SPONSORS": Happy Living, Masterplan Global, Modulus, Destileria Limtuaco, Galatea Tours, Greenhouse, Ripple, The Henry, Coconut Cruisers, Tropika (also present in `assets/venues/beige/`) |

**Rules.** The doodles and the wobble strokes are hand-drawn — no Lucide, no Heroicons, no redrawn
SVGs, no emoji: the wobble *is* the brand. Venue marks are always the beige knockout on the dye,
never boxed and never on a white plate. Photography is warm, on-location, available light; there
are only four images, so prefer type-set blocks over reusing one photo.

Not in this bundle, and deliberately: the octopus mark and the gold loading seal. They belong to the
superseded system.

---

# 12 · Files in this bundle

| File | What it is |
|---|---|
| `PHASE-1-PROGRAM.md` | **Build this first** — the urgent Program one-pager: scope, removals, build order |
| `SFWF prototype.dc.html` | **The canonical artifact.** All four pages in one hash-routed prototype, with the tweak panel values baked as prop defaults |
| `SFWF Home.dc.html` | Home alone, at the 1180px poster measure — the fuller type scale, useful for the desktop end of the ramp |
| `SFWF Programme.dc.html` | Program alone |
| `SFWF Press.dc.html` | **The real Press design** — build from this, not the prototype's stub |
| `components/backgrounds/dye-ground.js` | The two-colour remap + mount (§4) |
| `components/backgrounds/dye-flow.js` | The flow engine (already live as `dyeFlow.ts`) |
| `design_handoff_dye_flow_background/README.md` | Full spec for the flow engine and its parameters |
| `design_handoff_dye_flow_background/NAV-BAND.md` | The nav band's fade, from the earlier handoff |
| `support.js`, `image-slot.js` | Prototype runtime and the image drop-zone. **Do not port** |
| `_shots/` | Full-page screenshots, one per screen per breakpoint (390 · 900 · 1440) + an opened-bubble state. `_shots/README.md` explains the capture caveats |
| `assets/dye-hr/ground-rendered.png` | The dye ground as actually rendered — violet with orange stains. Use this to sanity-check your remap output |
| `assets/sponsors/` | The ten sponsor marks, split out of `assets/venues/beige/` for clarity |

Prototype tweaks, and where they land: `heroScale 1.4` → `--hs` above 1100px · `readingWidth 80ch`
→ `--tm` · `contentWidth 1040px` → `--sw` · `multiOpen true` → independent bubbles · `showDoodles true` → day markers on ·
`dyeCoverage 40` / `dyeIntensity 50` → the dye remap. Ship those values.

---

# 13 · Open — do not invent past these

1. **Three venues have no Instagram handle on record** — Sagana, Siargao Corner Café, Lunares Café.
   Corner Café and Lunares are walk-in so it costs nothing; **Sagana is a ₱2,000 dinner whose
   booking currently points at the festival account.** Needs a real handle before launch.
2. **`@tropicalacademyiao`** looks truncated — every other handle is a full name. Verify before it
   sends anyone to a dead profile.
3. **Two contact addresses are in play** — `info@siargaofoodfest.com` (footer, Venues, Press
   sign-off) and `hello@siargaofoodandwinefestival.com` (Press accreditation CTA). Pick one.
4. **Media kit / media folder URL** and **accreditation deadline** are both still unset, and are
   stated as unset in the design rather than invented. Keep them that way until the festival sends
   them.
5. **The film and the three 2025 clips do not exist yet.** The frames are placeholders at 9:16.
6. **Prices and times are the festival's own but not all confirmed** — five events carry `TBD` in
   the data. The UI stays silent about those (§7): no price in the hint line, and never a guessed
   figure. `TIME TBD` is different — time is still spoken as "time to be confirmed".
7. **One event has no line-up and no description** (Paraluman, After dinner bar feature) and two
   more have no line-up. That is real content state, not a gap to design around — the "to be
   announced" copy is the design.
8. **Cyan `#65C6BD`** is in the palette and used nowhere yet. Leave it unused rather than finding it
   a job.
9. **The live content tests will fail** on times and peso figures (§2.4). Decide with the festival
   whether to relax those tests or hold the programme copy back — do not silently delete tests.
