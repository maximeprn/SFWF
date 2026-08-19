# Phase 1 — deviations from the 2026 handoff

The one-pager is a faithful build of `design_handoff_2026_redesign/` (README + `PHASE-1-PROGRAM.md`,
against `SFWF prototype.dc.html`). Everything below is a place where it deliberately differs, or
where the handoff contradicts itself, so each one is a decision on the record rather than drift.

Geometry was verified by measuring the running prototype and this build side by side at 390, 900
and 1440. At 900 and 1440 every bubble, heading, chip and footer element lands on the same pixel.

`project-docs/deviations-from-prototype.md` covers the 2025 site and is superseded wherever the two
disagree; it is kept because the food-crawl and purpose decisions it records may come back.

## Where the handoff contradicts itself

| Handoff says | Built | Why |
|---|---|---|
| §2.4: "the live repo enforces [no clock times / no peso figures] with tests" | Nothing to relax | No such test exists. The 2025 repo enforced it *structurally* — `FestivalEvent` simply had no `time` or `price` field. Both are now on the type. The karinderya and no-emoji tests are unchanged and still pass against the new calendar. |
| §13.6: "five events carry `TBD`" | Seven | §10, the confirmed calendar and the stated source of truth, lists seven. `tests/program.test.ts` pins the number so it moves only when the festival confirms a price. |
| §2.3: "the dye no longer reacts to the pointer" | It does | §3 "Motion", which `PHASE-1-PROGRAM.md` names as authoritative, specifies the live flow engine — swipe stirs, motion develops for 2–3s after release. §2.3 is describing the *removal of the press-and-hold ripple*, which is separately listed as gone. |
| §3 Shape: `bubble: BLOBS[(n * 5 + dayIndex) % 6]` | `n` is the event index | In the prototype `n` is declared and never incremented, so every bubble in a day shares one silhouette. The README states the intent one line earlier — "assigned round-robin so neighbouring bubbles never share a silhouette" — and that needs `n` to vary. A test asserts neighbours differ. |

## Deliberate departures

| Design | Built | Why |
|---|---|---|
| Grain overlay in the display shader (64px noise tile, overlay-blended at 0.42, boosted to 1.9× in a stirred wake) | Removed | Instructed: no grain, noise or film over anything. The dye cloth is the only texture. |
| Two dye samples at different scales, soft-light blended at 70%; result multiplied up to ~15% brighter | One sample, written unmodified | Instructed: no colour push. Every rendered pixel now lies on the line between `#4F3F79` and `#E9622D` — measured across 4096 live canvas pixels, max deviation 1.16/255, which is 8-bit rounding. This overrides CLAUDE.md's "shader constants are frozen" for colour only; the motion constants (`tau`, `visc`, `disp`, `curl`, `push`) are untouched. |
| Viewport width tracked in React state to derive `mobile` and `hero` (§9) | Both are CSS | `--hs` is a media query at 1100px; the day filter renders both chip rows and hides one at 860px. Same result, correct on the first painted frame, and no resize listener. `display: none` also takes the hidden row out of the accessibility tree. |
| Tailwind's preflight (inherited from the 2025 stack) | `box-sizing: content-box` and `line-height: normal` restored | Every measurement in the handoff was taken against a page with neither. Under border-box the widest bubble renders 54px narrow and the content column 152px narrow at desktop widths. Documented at the top of `globals.css`. |
| `assets/dye-hr/violet-orange-hr.jpg` as a CSS background under the canvas | Not shipped | It is 160KB for a case the canvas already covers: `paintStill()` draws the same ground for reduced motion, no WebGL, and a lost context. Flat `--ground` shows for the few hundred ms before the remap finishes, and that is the exact same hex. |
| Four sponsor marks at a common `height: clamp(24px,2.8vw,32px)` | Ten marks at hand-tuned per-logo widths | The festival supplied six more (Coconut Cruisers, Greenhouse, Masterplan Global, Ripple, The Henry, Tropika), four of which are square badges rather than landscape wordmarks. A common height cannot serve both: at 32px a badge rendered 25×25 beside a 122px Destileria and read as a dot. The row now works the way `HOST_LOGOS` already did. Widths started from a damped equal-ink baseline and were then nudged per mark against the rendered row — Destileria and Modulus down, they carry the heaviest ink; Greenhouse, The Henry and Tropika up, they are hairline drawings. **These are our numbers, not the festival's.** |
| Host widths copied from the prototype (§6.8) | Nine kept exactly, six nudged | Measured against the same baseline the prototype's numbers held up well — thirteen of fifteen within ±10px, and its one big divergence (Lamari, held narrow) is the designer correctly downweighting solid bold caps, so it stays narrow. Six read off against the rendered row: `wild`, `bravo` and `cev` up (line-art marks with small type beneath, which a bounding box flatters), `lokal-lab`, `roots` and `lamari` down (the heaviest ink in the set). |
| Host row ends with Hiyas Farm and Tropical Academy set in Beth Ellen 20px (§6.8) | Removed | Marks only; nothing lettered among the logos. Tropical Academy still hosts "Island meets the Outback" in the programme, with its own booking link — this drops the *credit*, not the venue. |
| Partners row, then hosts row (§6.6 then §6.8) | Hosts, then partners | The programme has just named these venues sixteen times, so the logo wall reads as the same list at a glance; the money follows it. The two hand-drawn flourishes swapped with the sections, so the tilt down the page still alternates. Both rows now share the host row's 880px measure — at the full column the ten sponsor marks packed 8 + 2 and the last two read as stragglers. |
| Day filter changes which events are listed (§6 Program 2) | ...and opens them | Narrowing to one day is asking to read that day; making someone tap four more times to do it is the site arguing with them. The day arrives fully open, with no reveal — picking a day is a jump to another view, not a tap on a bubble, and the chips themselves swap instantly for the same reason. "All six days" closes everything again, because sixteen open bubbles is a wall of text and the closed chip is the scannable thing. |
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
