# Phase 1 — the type scale, as shipped

**This file supersedes the type table in README §7 for anything you build.** That table was trimmed
for the prototype's narrow 1040px column and is the reason the first pass came out too small: its
numbers (bubble title 13.2px, description 11.5px, mono 10px) were correct only inside that narrow
frame. The one-pager runs at a **1180px content column** and uses the numbers below — measured off
`SFWF Programme.dc.html` and `SFWF Home.dc.html`, which are the design of record.

Rule of thumb if you ever have to judge a size yourself: **nothing on this page is below 11px, body
prose is 15–16.5px, and the smallest thing on screen is a mono eyebrow at 11–12px** — not 8.5 or 10.

Faces: **Beth Ellen** 400 (display/script), **Arimo** 400/700 (body), **Baloo 2** 700/800 (buttons),
`ui-monospace, Menlo, monospace` (`.mono`, all eyebrows and meta). Widths: content column
`max-width: 1180px`, side padding `24px`.

**The measure is the same trap.** `readingWidth: 80ch` / `--tm` was a prototype tweak, and `ch`
scales with font-size: at the shipped prose size it computes to ~700–740px of line, too long. There is
no global measure here — every block carries its own cap: centred hero prose `620px`, centred section
prose `660px`, left-aligned purpose column `680px`, programme intro `32em`, open-bubble description
`900px`, open-bubble title `26em`, script sign-off `24em`, `h1` `15–16em`. Ship those, not 80ch.

## 1 · Chrome

| Element | Type | Colour |
|---|---|---|
| Nav word, desktop | Beth Ellen `400 13px/1` | beige; active `#E9622D` |
| Nav word, mobile menu | Beth Ellen `400 21px/1` (first item 22px) | beige; active orange |
| Header CTA | Baloo 2 `700 14px/1`, `.02em`, padding `12px 24px 15px` | `#141210` on orange |

## 2 · Hero (top of the one-pager)

| Element | Type | Colour |
|---|---|---|
| Wordmark lockup | image, `width: min(50vw, 490px)` | beige asset |
| "2nd edition" | Beth Ellen `400 clamp(19px, 2.5vw, 29px)/1`, rotated −4° | beige |
| Festival name `h1` | Beth Ellen `400 clamp(46px, 8.4vw, 88px)/1.06` — the design ships it pinned at **54px**, `max-width: 15em` | orange |
| Dateline | mono `clamp(11.5px, 1.6vw, 13.5px)`, `.24em`, uppercase, between two wobble rules | beige |
| Primary CTA | Baloo 2 `700 16px/1`, `.02em`, padding `17px 36px 20px`, clip-path blob | `#141210` on orange |
| Film caption | mono `10.5px`, `.18em` | beige on the gradient |
| Intro prose | Arimo `400 clamp(15px, .6vw + 13.3px, 16.5px)/1.72` — ships at **15.5px**, `max-width: 620px` | beige |
| Script sign-off | Beth Ellen `400 clamp(26px, 4.4vw, 38px)/1.2` | orange |

## 3 · Programme head

| Element | Type | Colour |
|---|---|---|
| Eyebrow `THE PROGRAMME` | mono `11.5px`, `.2em`, uppercase | beige |
| `h1` "the six-day journey" | Beth Ellen `400 clamp(38px, 7vw, 74px)/1.1`, `max-width: 16em` | orange |
| Intro line | Arimo `400 clamp(14.5px, .5vw + 13.1px, 16px)/1.7`, `max-width: 32em` | beige |
| Day-filter chip | mono `400 12px/1`, `.14em`, padding `11px 18px 13px`, 1px beige-45% border, blob radius | selected: `#3E3064` on beige · rest: beige |
| Grid heading (one day picked) | Beth Ellen `400 clamp(28px, 4vw, 38px)/1.2` | beige |
| Grid count (`16 GATHERINGS · SIX DAYS`) | mono `11.5px`, `.2em` | beige |

## 4 · Day header inside the grid

| Element | Type | Colour |
|---|---|---|
| Day date (`AUG 26`) | mono `12px`, `.2em` | beige |
| Day name (`gala opening`) | Beth Ellen `400 clamp(26px, 3.4vw, 30px)/1.15` | beige |
| Doodle | `width` per day, README §10 | — |

## 5 · Event bubble — collapsed

| Element | Type | Colour |
|---|---|---|
| Kicker `VENUE · TIME` | mono `11.5px`, `.16em`, uppercase | venue `700 #F9621B`, separator + time `#4F3F79` |
| Title | Arimo `700 clamp(15.5px, .7vw + 13.3px, 17px)/1.35` | `#3E3064` |
| Access mark (`RESERVE` / `WALK IN`) | mono `11.5px`, `.14em`; 10px orange dot when bookable | `#4F3F79` |
| Caret | Arimo `700 13px/1` | `rgba(79,63,121,.92)` |

## 6 · Event bubble — open

| Element | Type | Colour |
|---|---|---|
| Title (grows) | Arimo `700 clamp(18px, 1.05vw + 14.6px, 21px)/1.22`, `max-width: 26em` | `#3E3064` |
| Hint line (date · time · place · price) | Arimo `400 clamp(13.5px, .3vw + 12.8px, 14.5px)/1.45` | `#4F3F79` |
| Description | Arimo `400 clamp(14.5px, .5vw + 13.1px, 16px)/1.6`, `max-width: 900px`, `text-wrap: pretty` | `#3E3064` |
| "Programme details to be announced." | same as description, *italic* | `#4F3F79` |
| Line-up | Arimo `400 clamp(13.5px, .3vw + 12.8px, 14.5px)/1.45`, `min-width: 150px` | `#4F3F79` |
| "Line-up to be announced" | same, *italic* | `#4F3F79` |
| Booking button | Arimo `700 14.5px/1.2`, padding `16px 28px`, clip-path blob | `#F7F3E4` on `#4F3F79` |

Secondary information is carried by **italic, weight and size — never by a lighter tint** (README §3).

## 7 · Closing, sponsors, hosts, footer

| Element | Type | Colour |
|---|---|---|
| Script sign-off ("The festival sells nothing…") | Beth Ellen `400 clamp(24px, 3.4vw, 32px)/1.24`, `max-width: 24em` | beige |
| `OFFICIAL PARTNERS AND SPONSORS` | mono `10.5–11.5px`, `.2em` | beige |
| `OFFICIAL WINE PARTNER` | mono `11px`, `.18em` | beige |
| `HOSTED ACROSS THE ISLAND BY` | mono `11px`, `.22em` | beige |
| Type-set partner name (Tropical Academy) | Beth Ellen `400 20–26px/1` | beige |
| Stat numeral / label | Beth Ellen `400 clamp(30px, 5vw, 44px)/1` orange · label mono `11px`, `.16em` beige | — |
| Footer email / social | Beth Ellen `400 20–24px/1` | beige, orange on hover |

## 8 · Two things that are easy to get wrong

- **Lowercase is the voice, not a transform.** "ani sang Siargao", "the six-day journey", "coconut
  day" are typed lowercase in the content. Never `text-transform: lowercase`, and never title-case
  them back.
- **Uppercase only in mono.** Eyebrows, dates, counts, kickers and access marks are uppercase mono
  with wide tracking; no other role is uppercased.
