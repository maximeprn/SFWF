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
| Partners row, then hosts row (§6.6 then §6.8) | Hosts, then partners | The programme has just named these venues sixteen times, so the logo wall reads as the same list at a glance; the money follows it. The two hand-drawn flourishes swapped with the sections, so the tilt down the page still alternates. Both rows now share the host row's 880px measure — at the full column the ten sponsor marks packed 8 + 2 and the last two read as stragglers. |
| Day filter changes which events are listed (§6 Program 2) | ...and opens them | Narrowing to one day is asking to read that day; making someone tap four more times to do it is the site arguing with them. The day arrives fully open, with no reveal — picking a day is a jump to another view, not a tap on a bubble, and the chips themselves swap instantly for the same reason. "All six days" closes everything again, because sixteen open bubbles is a wall of text and the closed chip is the scannable thing. |
| The §3 type scale as published | Every font size × 1.1 | A flat 10% lift across the whole page, applied to sizes only: line-heights, weights, tracking (all in `em`, so it follows), padding, gaps and every logo width are untouched, which is why the layout holds and only the type grew. Clamp ramps scaled with their ends — the `vw` coefficient too — so the mobile-to-desktop curve is the same shape, just higher. 20% was tried first and was too much. Checked for overflow at 390, 900 and 1440: none, the day filter still fits without scrolling, and the longest booking button ("Message Tropical Academy", 233px) still clears its 283px bubble interior on a phone. |
| Bubble description at a flat `11.5px/1.62` (§3 Type) | `clamp(12.5px, 0.14vw + 11.95px, 13.5px)` | The only body value in the system that did not scale, so it never grew on a 440px bubble — and at 11.5px it sat *below* the 12–13px line-up crediting it, which is the one thing in the bubble you read least. Prose now sits under the title and above its own credit list at every width. |
| Hint line at `900 8.5px` uppercase (§3 Type, §7) | `700 clamp(10.5px, 0.11vw + 10.07px, 11.5px)`, `.03em` | This line carries the price, and it was the least legible type in the product. Uppercase throws away the word shapes you read by and weight 900 closes the counters at exactly the size where they are already collapsing; the tracking is what a run that long needs once it is set in caps. **Colour unchanged and kept deliberately:** the place name stays `#E9622D`, which measures 2.67:1 on the beige bubble even though §3 states `#E9622D` must not go on light grounds and names `#8F3A12` (5.99:1) for it. The prototype draws it in the bright orange and the festival wants it that way. It is not the only route to the information — the venue is also in the collapsed kicker and in the booking button — but it is a known contrast failure and belongs on the list below. |
| In-bubble button `700 12px`, label "Message <host> to reserve" (§7) | `700 clamp(13.5px, 0.17vw + 12.84px, 15px)`, label "Message <host>" | The one thing in the bubble you are meant to press was set smaller than the prose above it. "To reserve" is already said twice on the way in — by the standfirst and by the access mark — so the button only has to name who you are writing to. |
| Hero CTA "View the Program" | Dropped | `PHASE-1-PROGRAM.md`: the programme starts immediately below, so there is nothing to link to. Returns with phase 2's Home. |
| Programme h1 *"the six-day journey"* | Dropped | It is the Program *page's* headline, and on one page it lands directly under "ani sang Siargao" — two script headlines in a row, and a second `h1` on a document that already has one. The standfirst carries the instruction alone. It stays in the `<title>` and meta description, which is where §"Content and code notes" asks for it. Returns with phase 2's Program route. |

## Not built yet, on purpose

The film frame, the island intro, the stats row, the acknowledgement, "why we do this", the
last-year strip, Press, the nav band, the mobile menu and the fade mask are all phase 2. The
bubble, the day filter, the dye mount, the tokens and the footer are built to carry over unchanged.

## Still open with the festival

These are §13 items that touch what shipped. None were invented around.

1. **Sagana has no Instagram handle on record** and its booking button therefore points at the
   festival's own account. It is a ₱2,000 dinner, so this one actually costs something. Siargao
   Corner Café and Lunares Café are also unhandled but are walk-in.
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
5. `info@siargaofoodfest.com` is the only address on the page. The Press page's
   `hello@siargaofoodandwinefestival.com` is a phase 2 question.
6. **`CLAUDE-CODE-2026-08-19-content-update.md` §5 asks for `Tropical Academy` to be set in type in
   the hosts row** now that Hiyas Farm is gone. It is not there: the festival asked for both names
   removed on the same day, and a type-set name is the only lettering in a row of fifteen marks.
   Reinstating it is one line in `HOST_LOGOS`' sibling list if they want it back.
7. **`CLAUDE-CODE-2026-08-19-content-update.md` §6 offers marks for Dayána, Hapag and Morris
   Danzen.** They are named in programme copy and absent from the hosts row, as the doc describes.
   No decision taken here.
