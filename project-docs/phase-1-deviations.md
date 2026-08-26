# Phase 1 — deviations from the 2026 handoff

The one-pager is a faithful build of `design_handoff_2026_redesign/`. Everything below is a place
where it deliberately differs, or where the handoff contradicts itself, so each one is a decision on
the record rather than drift.

**Reading order.** `PHASE-1-TYPE-SCALE.md` and `CLAUDE-CODE-2026-08-19-content-update.md` (both 19
Aug 2026) supersede the README wherever they touch it — the type table in README §7 and the `--sw`
/ `--tm` block in §3 are explicitly marked historical. The design of record for type and frame is
`SFWF Programme.dc.html` + `SFWF Home.dc.html`, not `SFWF prototype.dc.html`.

Geometry was verified by measuring this build at 375, 603 and 1440: the section frame lands on
1180px, every bubble on 516px whatever its day holds, and no width overflows.

`project-docs/deviations-from-prototype.md` covers the 2025 site and is superseded wherever the two
disagree; it is kept because the food-crawl and purpose decisions it records may come back.

## Where the handoff contradicts itself

| Handoff says | Built | Why |
|---|---|---|
| §2.4: "the live repo enforces [no clock times / no peso figures] with tests" | Nothing to relax | No such test exists. The 2025 repo enforced it *structurally* — `FestivalEvent` simply had no `time` or `price` field. Both are now on the type. The karinderya and no-emoji tests are unchanged and still pass against the new calendar. |
| §13.6: "five events carry `TBD`" | Seven | §10, the confirmed calendar and the stated source of truth, lists seven. `tests/program.test.ts` pins the number so it moves only when the festival confirms a price. |
| §2.3: "the dye no longer reacts to the pointer" | It does | §3 "Motion", which `PHASE-1-PROGRAM.md` names as authoritative, specifies the live flow engine — swipe stirs, motion develops for 2–3s after release. §2.3 is describing the *removal of the press-and-hold ripple*, which is separately listed as gone. |
| §3 Shape: `bubble: BLOBS[(n * 5 + dayIndex) % 6]` | `n` is the event index | In the prototype `n` is declared and never incremented, so every bubble in a day shares one silhouette. The README states the intent one line earlier — "assigned round-robin so neighbouring bubbles never share a silhouette" — and that needs `n` to vary. A test asserts neighbours differ. |

## The 19 August type correction

The first pass built from the README §7 table, which is the prototype's own scale trimmed for a
narrow 1040px column. Used at full width everything came out too small. Rebuilt from
`PHASE-1-TYPE-SCALE.md`, measured live:

| | Was | Now |
|---|---|---|
| Content frame | 1040px + `clamp(18px,5vw,52px)` gutter | **1180px + 24px** |
| Reading measure | `--tm: 80ch` (grew every time the type did) | **per-block caps** — programme intro `32em`, open description `900px`, open title `26em`, sign-off `24em`, hero `h1` `15em` |
| Prose | 14.1–16.0 | **15–16.5** |
| Bubble title, closed / open | 14.5–16.0 / 16.5–18.2 | **15.5–17 / 18–21** |
| Bubble description | 13.8–14.9 | **14.5–16** |
| Hint line | 11.6–12.7, uppercase, 700 | **13.5–14.5, sentence case, 400** |
| Line-up | 13.2–14.3 | **13.5–14.5** |
| Booking button | 14.9–16.5 | **14.5**, and violet/cream (below) |
| Day name | 19.8–24.2 | **26–30** |
| Mono eyebrows, kickers, access marks | 9.35–11.55 | **11–12** |
| Hero `h1` / wordmark / dateline | 86.2 / 420 / 17.7 at desktop | **88 / 490 / 13.5** |
| Host and sponsor marks | tuned against the 1040 column | **× 1.27** |

Nothing on the page is now under 11px.

## Deliberate departures

| Design | Built | Why |
|---|---|---|
| The `font-size:` overrides baked into the design files — `h1` 54px, prose 15.5px, section `h2` 20px | The clamps those overrides sit on | They are the design tool's live-tweak values, and they contradict the clamps they follow: the `h2` one is 20px where its own clamp floors at 30px. `PHASE-1-TYPE-SCALE.md` reports two of them as pins; taking all of them literally would set section headings below body copy. |
| `--hs: 1.4` above 1100px, multiplying the hero | Deleted | The shipped hero clamps carry that ramp in their own `vw` term — `clamp(46px, 8.4vw, 88px)` reaches its maximum at a 1048px viewport. Multiplying on top applied it twice, which is what put the dateline 31% over. |
| `max-width: 1180px` with the padding inside it | `--sw: 1132px` + two 24px gutters | Same 1180px frame. The handoff's prototypes run on the browser default box-sizing; this product restores content-box, which the 440px bubble cap depends on. |
| Day filter as one row of single-line mono chips with a 1px border (`SFWF Programme.dc.html`) | The two-line chips kept — mono date over the day name in Beth Ellen, selected in a hand-cut beige blob | README §6 specifies the two-line form and it is the better control; the prototype's row reads as a simplification of it. The new scale is applied to it: date 12px, name `clamp(15px,.5vw + 11.8px,18px)` — 18px is where seven chips still fit the row at 1440 without the rail having to scroll. |
| Open bubble spans the full grid row (`grid-column: 1 / -1`) | It does not | README §2.3 is explicit and reasoned — opening adds height, never width, so a day of one gathering reads the same as a day of four. Neither correction doc revisits it. |
| Bubble grid `minmax(min(100%,280px),1fr)` inside `calc(--sw - 148px)` | `minmax(min(100%,380px),1fr)` at the full frame, no cap on the grid | The 440px cap on each bubble is what holds the row; capping the grid as well only reintroduces the difference, because a collapsed auto-fit track hands a lone bubble the whole row. Every bubble now renders at 516px (440 content + its padding) on every day. The old 280px minimum drew four columns of 249px, which a 21px open title cannot live in. |
| Booking button: beige on orange | **Cream `#F7F3E4` on violet `#4F3F79`** | `PHASE-1-TYPE-SCALE.md` §6 and the design of record both. Beige on orange is 1.9:1 — it put the one thing you are meant to press below the legibility of the prose above it. This retires `--orange-hover-in-bubble`; the hover is now `--ink-title`. |
| Programme standfirst capped at 16px (`PHASE-1-TYPE-SCALE.md` §3) | `clamp(15.5px, .72vw + 11.1px, 20px)` | Raised at the festival's request. It is the only prose on the one-pager and the one instruction anybody has to read; at 16px on an 1180px frame it read as a caption. 32em at 20px is 640px of line, inside the 660px the same document caps centred prose at. |
| `--sec: clamp(40px, 5.4vw, 62px)` | `clamp(72px, 2.65vw + 62px, 96px)` | Raised at the festival's request — the page read as cramped on a phone. The old value was the reason: a bare `vw` term collapses on a narrow screen, so 5.4vw is 20px at 375 and the token sat on its 40px floor across every mobile width while desktop took 62. That is backwards; stacked in one column with no horizontal separation to help them, sections need more air to read as separate blocks, not less. Written as an offset now, so the floor is the number that matters and the ramp only adds to it. Then lifted a further 30%, again at the festival's request. **Mobile 40 → 94, desktop 62 → 125.** All three terms of the clamp were scaled, the `vw` coefficient included, so the mobile-to-desktop curve keeps its shape and only sits higher — the same method the type scale's 10% lift used. Everything downstream is expressed against this token — the flourish air, the film's opening gap, the footer — so none of them had to be touched. |
| Hero bottom padding `clamp(30px,4vw,44px)`, headline bottom margin `clamp(52px,7.2vw,80px)`, film top padding | All three removed; the dateline carries `var(--sec)` on each side | The dateline had the flourish bug mirrored: **80px under "ani sang Siargao" and 126px over the film** at 1280, because the space above it was the headline's margin and the space below it was the hero's padding plus the film's — three owners for two gaps. All of it is the dateline's now, as a two-value margin (`var(--sec) auto`) so there is no third value to set the halves apart. The value is `--sec` rather than the flourishes' half, because the gap below it already measured one `--sec` — raising the short side to meet the long one keeps the air the festival asked for instead of halving it. Measures 94/94 at 375 and 125/125 at 1280. **Held by the same test**, which was checked by breaking it. The hero's *top* padding is deliberately untouched: it is the page's opening inset under the nav band, not a boundary between two blocks, and lifting it only pushes the wordmark down the first screen. |
| The film carried `var(--sec)` *below* it, and the footer its own `clamp(50px,6.4vw,80px)` | Both on the page rhythm — film spacing on top only, footer `var(--sec)` | The rhythm was uneven before anyone raised it: 46 · 80 · 40 · 40 · 50 on a phone. The film's bottom padding silently doubled one gap against `HostRow`'s top padding while every other break sat on the floor, and the footer's own clamp collapsed to 50px, which read as it riding up into the content. Every boundary is now one `--sec`: 70 · 72 · 72 · 72 · 72 at 375, 97 · 96 · 96 · 96 · 96 at 1280. The film keeps `calc(var(--sec) * 0.55)` above it, because it is the hero's closing statement rather than the next subject. |
| Flourish margin `0 auto clamp(28px,4vw,44px)`, section padding above it | `--flourish-air` on both sides, section padding removed | The wave sat **71px under the last logo and 27px over the next label**. Nothing in the source looked wrong, because the two halves had different owners: the space above belonged to the section's `padding-top`, the space below to the flourish's own margin, and two owners cannot agree. Both halves are the flourish's now, written as a two-value margin (`var(--flourish-air) auto`) so there is no third value to set them apart, and a section that opens with a flourish takes no top padding. Measures 35/35 at 375 and 46/46 at 1280. A decorated boundary is therefore one `--sec` plus the wave's own height; a plain one is `--sec`. **Both halves are held by a test** — `tests/design.test.ts`, "gives every flourish equal air above and below it" — which was checked by breaking each half in turn and confirming it fails, naming the offending file. |
| Access dot at 8px | 10px | The design of record draws it at 10px in both bubble states. Supersedes the 8px figure in `CLAUDE.md`. |
| Grain overlay in the display shader (64px noise tile, overlay-blended at 0.42, boosted to 1.9× in a stirred wake) | Removed | Instructed: no grain, noise or film over anything. The dye cloth is the only texture. |
| Two dye samples at different scales, soft-light blended at 70%; result multiplied up to ~15% brighter | One sample, written unmodified | Instructed: no colour push. Every rendered pixel now lies on the line between `#4F3F79` and `#E9622D` — measured across 4096 live canvas pixels, max deviation 1.16/255, which is 8-bit rounding. This overrides CLAUDE.md's "shader constants are frozen" for colour only; the motion constants (`tau`, `visc`, `disp`, `curl`, `push`) are untouched. |
| Viewport width tracked in React state to derive `mobile` and `hero` (§9) | Both are CSS | The day filter renders both chip rows and hides one at 860px. Same result, correct on the first painted frame, and no resize listener. `display: none` also takes the hidden row out of the accessibility tree. |
| Tailwind's preflight (inherited from the 2025 stack) | `box-sizing: content-box` and `line-height: normal` restored | Every measurement in the handoff was taken against a page with neither. Under border-box the widest bubble renders 54px narrow and the content column 152px narrow at desktop widths. Documented at the top of `globals.css`. |
| Hint line as `place · weekday · time · price` | `place · time · price` | The weekday is already the heading two lines above it on this page, and `FestivalEvent` does not know which day it belongs to. Worth revisiting in phase 2, where the programme may be filtered out of its day context. |
| `THE PROGRAMME` eyebrow, the `the six-day journey` `h1`, and a grid heading repeating the picked day's name | None of the three | The `h1` was removed at the festival's request (two script headlines in a row under "ani sang Siargao"); an eyebrow with no headline under it labels nothing, and the grid heading prints the day name immediately above the day section that prints it again. |
| `assets/dye-hr/violet-orange-hr.jpg` as a CSS background under the canvas | Not shipped | It is 160KB for a case the canvas already covers: `paintStill()` draws the same ground for reduced motion, no WebGL, and a lost context. Flat `--ground` shows for the few hundred ms before the remap finishes, and that is the exact same hex. |
| Four sponsor marks at a common `height: clamp(24px,2.8vw,32px)` | Ten marks at hand-tuned per-logo widths | The festival supplied six more (Coconut Cruisers, Greenhouse, Masterplan Global, Ripple, The Henry, Tropika), four of which are square badges rather than landscape wordmarks. A common height cannot serve both: at 32px a badge rendered 25×25 beside a 122px Destileria and read as a dot. The row now works the way `HOST_LOGOS` already did. Widths started from a damped equal-ink baseline and were then nudged per mark against the rendered row — Destileria and Modulus down, they carry the heaviest ink; Greenhouse, The Henry and Tropika up, they are hairline drawings. **These are our numbers, not the festival's.** |
| Host widths copied from the prototype (§6.8) | Nine kept exactly, six nudged | Measured against the same baseline the prototype's numbers held up well — thirteen of fifteen within ±10px, and its one big divergence (Lamari, held narrow) is the designer correctly downweighting solid bold caps, so it stays narrow. Six read off against the rendered row: `wild`, `bravo` and `cev` up (line-art marks with small type beneath, which a bounding box flatters), `lokal-lab`, `roots` and `lamari` down (the heaviest ink in the set). |
| Host row ends with Hiyas Farm and Tropical Academy set in Beth Ellen 20px (§6.8) | Removed | Marks only; nothing lettered among the logos. Tropical Academy still hosts "Island meets the Outback" in the programme, with its own booking link — this drops the *credit*, not the venue. |
| Partners row, then hosts row (§6.6 then §6.8) | Hosts, then partners | The programme has just named these venues sixteen times, so the logo wall reads as the same list at a glance; the money follows it. The two hand-drawn flourishes swapped with the sections, so the tilt down the page still alternates. The hosts row is held at 980px, where its fifteen marks pack 8 + 7. The sponsors row shared that measure while it carried ten marks — at the full column they packed 8 + 2 and the last two read as stragglers — and gave it up on 23 Aug 2026 when four more arrived: fifteen sponsor marks at 980 pack 6 + 7 + 2 and strand the same two, where the full 1132 column packs 7 + 8. The two blocks no longer share a measure; they share a shape, which is what the 980 was protecting. |
| Day filter changes which events are listed (§6 Program 2) | ...and opens them | Narrowing to one day is asking to read that day; making someone tap four more times to do it is the site arguing with them. The day arrives fully open, with no reveal — picking a day is a jump to another view, not a tap on a bubble, and the chips themselves swap instantly for the same reason. "All six days" closes everything again, because sixteen open bubbles is a wall of text and the closed chip is the scannable thing. |
| The §3 type scale as published | Every font size × 1.1 | A flat 10% lift across the whole page, applied to sizes only: line-heights, weights, tracking (all in `em`, so it follows), padding, gaps and every logo width are untouched, which is why the layout holds and only the type grew. Clamp ramps scaled with their ends — the `vw` coefficient too — so the mobile-to-desktop curve is the same shape, just higher. 20% was tried first and was too much. Checked for overflow at 390, 900 and 1440: none, the day filter still fits without scrolling, and the longest booking button ("Message Tropical Academy", 233px) still clears its 283px bubble interior on a phone. |
| Bubble description at a flat `11.5px/1.62` (§3 Type) | `clamp(12.5px, 0.14vw + 11.95px, 13.5px)` | The only body value in the system that did not scale, so it never grew on a 440px bubble — and at 11.5px it sat *below* the 12–13px line-up crediting it, which is the one thing in the bubble you read least. Prose now sits under the title and above its own credit list at every width. |
| Hint line at `900 8.5px` uppercase (§3 Type, §7) | `700 clamp(10.5px, 0.11vw + 10.07px, 11.5px)`, `.03em` | This line carries the price, and it was the least legible type in the product. Uppercase throws away the word shapes you read by and weight 900 closes the counters at exactly the size where they are already collapsing; the tracking is what a run that long needs once it is set in caps. **Colour unchanged and kept deliberately:** the place name stays `#E9622D`, which measures 2.67:1 on the beige bubble even though §3 states `#E9622D` must not go on light grounds and names `#8F3A12` (5.99:1) for it. The prototype draws it in the bright orange and the festival wants it that way. It is not the only route to the information — the venue is also in the collapsed kicker and in the booking button — but it is a known contrast failure and belongs on the list below. |
| In-bubble button `700 12px`, label "Message <host> to reserve" (§7) | `700 clamp(13.5px, 0.17vw + 12.84px, 15px)`, label "Message <host>" | The one thing in the bubble you are meant to press was set smaller than the prose above it. "To reserve" is already said twice on the way in — by the standfirst and by the access mark — so the button only has to name who you are writing to. |
| Hero CTA "View the Program" | Dropped | `PHASE-1-PROGRAM.md`: the programme starts immediately below, so there is nothing to link to. Returns with phase 2's Home. |
| Programme h1 *"the six-day journey"* | Dropped | It is the Program *page's* headline, and on one page it lands directly under "ani sang Siargao" — two script headlines in a row, and a second `h1` on a document that already has one. The standfirst carries the instruction alone. It stays in the `<title>` and meta description, which is where §"Content and code notes" asks for it. Returns with phase 2's Program route. |

## The app partner credit (26 Aug 2026)

Requested by the festival, so it is on the record rather than in the handoff.

TravelGO is credited under the sponsor row as **OFFICIAL DIGITAL APP PARTNER** — the mono label,
then the mark, the row's own structure — and it is the only outbound link on the site that is not
a social account or a `mailto:`.

| Rule it departs from | What was built | Why |
|---|---|---|
| Every mark is the beige knockout on the dye (`--beige`, "logo colourway") | TravelGO's own four-colour artwork, unaltered | The festival asked for the actual logo. The mark carries no wordmark — it is four colour-coded tiles (pin, taxi, bag, sail) and nothing else — so a beige flatten costs it the only thing that identifies it. A knockout was cut and rejected for this: the dark taxi glyph survived the flatten and left one tile blank, and even repaired it read as an anonymous badge. |
| The sponsor and host rows are where partners appear | Its own tier below the sponsor row | The row is fifteen beige wordmarks; a single colour badge inside it reads as a mark that was prepared wrong, and the mono label naming the relationship has nowhere to sit in a wrap-flow. Below the row it is plainly the next tier of the same list — same label register (11.5px, `.2em`, `--beige`), no flourish and no heading of its own, just more air above it. |

The mark hovers with the footer marks' step forward (`.partner-mark`, `scale(1.08)` on the same
spring) and takes no colour hover, having colours of its own. It rides `--mark-scale` like the
sponsor marks, so the two tiers stay in proportion at every width. The link is `rel="noopener"` — not
`sponsored` — which is correct for a partnership rather than a paid placement. **If money changed
hands for it, it needs `rel="sponsored"`.**

Artwork is `public/partners/travelgo.png`, cropped from the file at
`travelgo.ph/images/logos/travelgo-logo.png` to its content bounds and served locally. It is never
hotlinked: their outage would otherwise be our broken logo.

## Not built yet, on purpose

The island intro, the stats row, the acknowledgement and "why we do this" are still to come. The
film frame and the last-year strip are now built — see the section below. Press, the nav band, the
mobile menu and the fade mask have landed. The bubble, the day filter, the dye mount, the tokens
and the footer carried over unchanged.

## Video hosting and the two media frames

The festival's footage is hosted on **Mux**, not on Vercel: the clips total 320 MB and Vercel's
bandwidth is the account's scarcest resource. Cloudflare Stream costs ~$12.50/month for the same
job; Cloudflare R2 is also free but serves one fixed file, and it needs the domain's nameservers
moved off Hostinger. Mux's free plan covers 100k delivery minutes a month against roughly 7.5k
expected, and it builds the adaptive ladder — 270x480 at 465 kbps up to 1080x1920 at 4.33 Mbps —
which is the whole point for an audience on Philippine mobile data.

The plan caps at **10 stored videos**; seven are used. `video-source/` holds the masters and the
encodes and is gitignored — Mux is a delivery layer, not an archive.

| Handoff says | Built | Why |
|---|---|---|
| Film frame at `border-radius: 16px` with a drop shadow (§2) | One of the six hand-cut outlines, no shadow | `CLAUDE.md` is explicit on both: every surface takes a `soft()` clip, and `box-shadow` is not used in this release. A rounded rectangle on the one photographic surface would be the only unclipped box on the page. |
| Film caption at mono `10.5px` (`PHASE-1-TYPE-SCALE.md` §2) | `11px` | The same document's floor is "nothing under 11px". It contradicts itself in one row; the floor wins. |
| `THE FILM · 2026` set over the frame's own scrim | Dropped entirely | Removed at the festival's request: a poster frame sitting under the festival's own name does not need to be told it is the film. The line inside the frame already says the only thing a still cannot — that this is a video, and how long it runs. The section keeps the eyebrow's top padding so the frame lands where the design puts it. |
| Poster frame left to Mux | An explicit `time` per clip, on `Clip.posterTime` | Mux's own pick is not always the one that sells the clip. Two of the six open on black — Restaurant Bravo and the fashion show — so an early frame is a dead poster, and the film's default was a seedling tray. The film is set to 1:13, the aerial over the palms and the water, chosen by the festival — it reads as the island rather than as one plate, and its mid-tones leave the play mark legible dead centre. Chosen against a contact sheet cut from each master. |
| Three clips in the last-year strip (§9) | Six | Six exist, and the strip was always built to scroll. Six never fit the column, so `SWIPE` always shows today — the overflow measurement stays anyway, so the instruction stops appearing on its own the day it stops being true. |
| Strip centres the first clip at scroll 0 (§9) | Only below 860px | At desktop the first clip sits flush with the content column, in line with the eyebrow above it and with every other section — measured at 1280, all of them land on 74px. Centring is kept on a phone, where it opens on one whole clip with the next peeking in. The snap alignment moves with it: under `x mandatory`, `center` is what makes a centred first clip a resting position, so leaving it on at desktop would drag the flush strip back to the middle on the first touch. `start` is the same promise for a flush strip. |
| — | The section spaces itself with `var(--sec)` above and nothing below | The convention every other block on the page follows — `HostRow` and `SponsorRow` both use `var(--sec) var(--gutter) 0`, and the footer brings its own top margin. The strip originally carried its padding on the bottom and none on top, which left it butted against the sponsor marks. |
| — | A hand-drawn play triangle, centred | Asked for by the festival. It is drawn the way every other stroke in the product is — edges that bow, corners cut unevenly, a degree and a half off level, the same tilt the section flourishes carry — so it reads as the festival's hand rather than as an icon lifted from a set. Beige fill with a violet drawn edge: the fill carries it over dark footage, the edge over a bright sky, and between them no shadow is needed. It lives in `src/components/ui/PlayMark.tsx`; nudge its control points if it ever needs adjusting, never "tidy" it into a clean triangle. |
| Bottom scrim on the film frame, `linear-gradient(transparent, rgba(20,14,40,.66))` (§2) | Removed, with the `--scrim` token and the `.media-cap` class | The scrim existed to hold a mono caption legible over footage. With the caption gone and the play mark centred, it paints a wash that nothing sits on — and an unjustified gradient is exactly what the allowlist in `tests/design.test.ts` exists to prevent. The duration it used to print still reaches anyone who cannot see the mark, through the button's accessible name. |
| Native `<video controls>` | A drawn control bar — play/pause, mute, fullscreen, and a scrubber on the film only | The browser's own controls are grey, unstyleable, and were the sole reason `MEDIA_BLOB_PATH` had to be cut shallow: they sit hard against the bottom edge, where the six outlines curve in far enough to clip a scrubber's ends away. The bar is one hand-cut beige plate carrying violet ink — the day filter's selected chip, laid on footage — so it needs no scrim to stay legible over a black frame or a bright sky, which is the same argument the centred play mark settles with a beige fill and a violet edge. It is held inside the outline by `MEDIA_SAFE`, a fraction of the box rather than a pixel count, because the clip is authored in objectBoundingBox units and only a fraction stays correct at both 268px and 208px. `tests/design.test.ts` flattens the path and holds the bar's corners inside it. The outline itself was left exactly as tuned. |
| Scrubber on all seven frames | The film only | A strip clip is 208px wide, which is three controls and no more. A scrubber squeezed into what was left would be a target nobody could hit. The three keys carry the same labels on every frame, so there is one behaviour to learn, not two. |
| Volume slider | Mute toggle | iOS ignores `video.volume` outright, so a slider is dead UI on most of this audience's devices and the OS owns the level anyway. |
| — | The bar fades out after 2s of a clip running untouched | It comes back on a pointer move, a tap, or a tab into it, and it never leaves at all while the clip is stopped, while a control holds focus, or under `prefers-reduced-motion` — a control that disappears on a timer is not something to hand someone who has asked for less movement. |
| — | Nothing autoplays; the player loads on the click | Motion is response, not ambience. It also spends no one's mobile data before they have asked for it: the poster is a single WebP and `hls.js` is fetched only by browsers without native HLS, only after a press. |

Poster frames come from `image.mux.com`, which is free on every plan, so no still is cut by hand or
stored in `public/`. They are requested `unoptimized` — Mux already returns WebP at the width asked
for, and routing them through Vercel's optimizer would re-encode an encode and bill a transform.

**One incident on the record.** The first upload run had two processes going at once, which put 13
assets on a 10-video account and left the manifest naming one asset while its twin sat there
unreferenced. Six duplicates were deleted and the manifest was rebuilt from the Mux API by matching
each local encode to its asset on duration. `scripts/mux-upload.mjs` now takes an atomic lock.

## Still open with the festival

These are §13 items that touch what shipped. None were invented around.

0. **The six last-year captions are ours, not the festival's.** "Opening night at Wild", "The
   gathering at Alma", "Restaurant Bravo", "Day one", "The fashion show", "The final night" are
   read off the file names the festival sent. Wild, Alma and Bravo are host venues, so the three
   that name a venue are safe; the other three are descriptions of a clip, not confirmed titles.
   The film's own caption was dropped, so nothing now claims a year for it.
0b. **Two clips carry burned-in marks that the site cannot remove.** The film has the festival's
   own seal across the lower third of every frame — harmless now that the caption is gone and the
   play mark sits centred, but it is burned in and cannot be moved. More important: **`relive-day-1` carries a
   photographer's credit, `By: @shotsbyarianne_`, burned into the picture.** That is someone
   else's footage. Confirm permission and whether the credit needs to be repeated in the caption
   before this ships publicly — it is the one item here with a rights question attached.
1. ~~Sagana has no Instagram handle.~~ **Settled 19 Aug 2026: `@saganasiargao`.** Its ₱2,000
   dinner now books with the venue rather than through the festival's own account, which is the
   whole booking model working as designed. Two venues are still unhandled: Siargao Corner Café,
   which is free and therefore walk-in, and **Lunares Café, which is not** — its price is `TBD`
   rather than confirmed free, so its bubble reads RESERVE and that reservation goes to the
   festival account. If that price lands as a real figure it needs a real handle with it.
2. **`@tropicalacademyiao`** is shorter than every other handle on the list and may be truncated at
   source. Shipped as given.
3. **Seven events have no confirmed price** and one (Paraluman) has neither line-up nor description.
   The UI states the absence rather than guessing — that copy is the design.
   Times are now all confirmed: Roots' wet market, the Kermit contest and the Mam-on chef's table
   came in on 19 Aug, so nothing on the page says "time to be confirmed" any more. The `TIME TBD`
   branch in `softTime` stays, with its test — the next schedule change may need it again.
4. **The place name in an open bubble's hint line is `#E9622D` on beige — 2.67:1.** Kept at the
   festival's request against §3's own rule. Nothing is only available there (the venue is in the
   collapsed kicker and the booking button too), but it should be settled rather than left drifting.
5. ~~Two addresses in play.~~ **Settled 19 Aug 2026: `info@siargaofoodfest.com` everywhere.**
   The design put `hello@siargaofoodandwinefestival.com` on every Press action — the nav
   button, the accreditation form and the sign-off. All three now write to the one address
   and the second appears nowhere in the product.
6. **`CLAUDE-CODE-2026-08-19-content-update.md` §5 asks for `Tropical Academy` to be set in type in
   the hosts row** now that Hiyas Farm is gone. It is not there: the festival asked for both names
   removed on the same day, and a type-set name is the only lettering in a row of fifteen marks.
   Reinstating it is one line in `HOST_LOGOS`' sibling list if they want it back.
7. **`CLAUDE-CODE-2026-08-19-content-update.md` §6 offers marks for Dayána, Hapag and Morris
   Danzen.** They are named in programme copy and absent from the hosts row, as the doc describes.
   No decision taken here.
8. ~~The handoff's `lokal-lab.png` is Loka's wordmark, not Lokal Lab's.~~ **Settled 21 Aug 2026.**
   The artwork lettered LOKA, and `public/partners/loka.svg` is the same mark traced at the same
   1.70 aspect — two different businesses under one filename, mislabelled at source in
   `design_handoff_2026_redesign/assets/` and byte-identical to what we shipped. So the hosts row
   credited Loka under Lokal Lab's name from the start. Loka is out of `HOST_LOGOS` and its file
   is renamed `venues/beige/loka.png`, kept but unreferenced. Lokal Lab is in, knocked out of the
   festival's own beige-on-violet original (`Logos/Venue/Lokal Lab/images.jpeg`). It is filed as
   **`lokal-lab-2026.png`, not `lokal-lab.png`** — correcting the artwork in place left the URL
   unchanged, so browsers kept serving Loka's bitmap from cache and the row looked unfixed. The
   old path is poisoned; nothing should point at it again. **Worth a look at the rest of that
   folder:** its third file is CEV's logo, so this is not the only misfiling.
9. ~~Sunlight Air was offered as a sponsor on 21 Aug 2026 and is not in `SPONSORS`.~~ **Settled
   the same day.** The only artwork available was white script and a yellow sun on flag blue, and
   the row is a flat beige knock-out, so it could not be used as supplied. The festival provided a
   single-colour vector trace already set in `#E9E7C2`, which is the convention the other eight
   sponsor SVGs follow. **It is a trace, not the original vector** — worth swapping for the real
   one if Sunlight Air ever sends it. Its width, 82, is the only number in `SPONSORS` measured
   rather than carried over from the 1040px column; the note there says why.

10. ~~Four resorts — Harana Surf, Jungle Nest, Sunyata and The Ronin Siargao — were offered as
   sponsors on 23 Aug 2026.~~ **Settled the same day.** All four arrived as single-colour vector
   traces already set in `#E9E7C2`, the convention the other sponsor SVGs follow, so they went in
   as supplied. **They are traces, not the original vectors** — worth swapping if any of the four
   sends the real artwork. Their widths were measured the way Sunlight Air's was, against the mark
   each is nearest in shape rather than the median alone; the note in `SPONSORS` says why equal ink
   on its own was wrong for them. **None of the four is credited as a host** — they were given as
   sponsors and none of them appears in the programme, but three of the four are resorts that could
   plausibly host, so worth confirming with the festival that the sponsors row is where they belong.
