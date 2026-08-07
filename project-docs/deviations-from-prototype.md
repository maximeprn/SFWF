# Deviations from the mobile prototype

The site is a faithful port of `ui_kits/mobile/prototype.html` from the Claude Design project
*Website redesign information architecture*. Everything below is a place where it deliberately
differs, so each one is a decision on the record rather than drift.

## Scaffolding removed

| Prototype | Here | Why |
|---|---|---|
| iPhone device frame | — | It was a review shell, not part of the design. |
| Tweaks panel | — | Every tweakable is pinned to its locked value (below). |
| In-browser Babel from a `<script type="text/plain">` | Build-time TypeScript | Obvious. |
| Sound toggle | — | `soundButton: "hidden"` in the locked defaults, and no audio exists. Shipping an inert speaker icon would be worse than not shipping it. |

Locked tweak values, taken from `TWEAK_DEFAULTS`: `GAP 36 · veil 40 · BTN "Bubble cut" ·
nav "per section" · crawl block shown · story "always open" · loading screen shown ·
bloom strength 100%`.

## Behavioural changes

**The nav mechanic runs on window scroll, not an inner scroller.** The prototype ran the whole
app inside one `overflow-y: auto` div and drove the nav from its `scrollTop`. On a real site an
inner scroller breaks iOS URL-bar collapse, anchor links and browser scroll restoration, so
`useNavReveal` reimplements the same state machine against `window.scrollY`. The logic is 1:1 —
glue in, ride out 1:1, lock back in when a section edge crosses the viewport top.

**The fade-under-the-band mask is carried over, re-anchored for window scroll.** `NAV-BAND.md`
specifies it as a `mask-image` on the scroller — a mask and not a scrim, so the dye behind
carries through at full strength rather than being flattened by a wash of some flat colour
picked to stand in for a moving photograph. The spec's scroller has the viewport for a box, and
ours is the window, so `main`'s box starts at the top of the document instead: every gradient
stop carries the scroll position to compensate, and the mask is dropped outright once the band
is out. That last part is what keeps the cost off the scrolling readers actually do — the band
is only on screen for NAV_H of travel around a reserved gap. This replaces an earlier note
saying the mask could not be done on a window-scrolled page.

**The loading seal shows once per session**, not on every navigation, via `sessionStorage` plus a
blocking script in `<head>` that hides content before paint. A two-second pour on every page load
would be hostile. Content is still fully server-rendered — only its opacity changes — so SEO and
reader modes are unaffected.

**Reduced motion covers more.** The prototype honoured it in the purpose story and the loader
count. Here it also disables the bloom shader (static dye texture instead) and the seal's pour.

**The dye is a flow field, not a radial ripple.** The mobile prototype animated a ripple only
while a finger was pressed and stopped it dead on release. `design_handoff_dye_flow_background`
supersedes that with a two-pass simulation: a 128×256 wrapped velocity field that self-advects,
rolls shear into eddies and decays over ~2–3s, and a display pass that samples the dye at an
offset taken from it. Momentum lives in the field, so a stroke coasts after the finger lifts,
the whole path of a swipe stays stirred, and flow leaving one edge re-enters the other. The old
ripple survives as the resting pulse — same `RING/SPEED/DISP/STR/BLOOM` constants, now fading
back in 1.1s after the last input rather than on release. Two things follow that are easy to
undo by accident: there is deliberately **no** `pointerup`/`pointerleave` handler (adding one
reintroduces the stop-dead bug), and `touchmove` and `wheel` are bound separately from
`pointermove` so momentum scroll and a desktop wheel stir the dye too.

**Swirl strength differs by screen.** The handoff ships one value, 145%. Here the loading seal
keeps it — the dye is the whole screen there, and stirring it is the only thing to do while the
count fills — and the site behind it runs at 85%, where the same motion competes with copy
instead of rewarding a swipe. Stir radius is 5% rather than the shipped 10%, for a narrower,
more defined wake. Both are user-facing settings in the handoff, not frozen constants, and both
live in `shader.ts` as `LOADER_STRENGTH` / `PAGE_STRENGTH` / `DEFAULT_RADIUS`. The switch is a
live `flow.set()` — never a remount, which would drop the field and every eddy still unwinding
in it.

**The tap hint's label sits under its arrow, not beside it.** Anchored at the target bubble's
right edge with the label hanging off to the side, the mark was ~150px wide and ran off a 375px
screen. Sliding it back inside only moved the problem — it then collided with the day heading
above. Tucking the label under the arrow's tail narrows the whole mark to ~78px, which fits in
the margin beside the bubble without moving at all. A viewport clamp remains as a safety net for
narrower screens.

**Body copy sits on the dye, not in bubbles.** Worth stating because it is easy to get backwards:
the prototype mounts its phone with `bare`, so `Prose` renders as plain copy on the dye with the
scrim. The *only* boxed paragraph in the whole product is the Media Center intro, which passes
`bare={false}` explicitly. Here that inverts the prop — `Prose` is bare by default and takes
`boxed` for that one case — so the default can't drift back to a page of stacked cards.

**The crawl switch is two routes, not local state.** `/food-crawl/coffee` and
`/food-crawl/karinderya` are separately indexable, which the tabbed single screen wasn't.

## Content changes

**Café count: 10, not 14.** The festival's own crawl copy says "Visit all 10 participating cafés"
and lists exactly ten; one programme blurb said fourteen. Ten matches the actual partner list.
`tests/content.test.ts` asserts the stated number and the list length can't drift apart again.
**Worth confirming with the festival.**

**The two August 31 blocks carry stable ids.** The prototype distinguished them with a trailing
space in the date string (`'August 31 '`) — a hazard waiting to be trimmed away by a formatter.
They are separate blocks at different venues and are keyed by `id` now.

**Dates are 26–31 August 2026**, from the prototype's own hero and its eight-block programme.
`readme.md` in the design project says 14–21 August, taken from an older motion prototype, and
flags itself as provisional. Everything reads from `FESTIVAL_DATES` in `src/content/site.ts`, so
a correction is a one-line edit. **Still unconfirmed by the festival.**

## Actions that were inert in the prototype

The prototype's buttons were intentionally dead. They now go somewhere:

- **Tickets / "Get your tickets" / "Buy online"** → `/tickets`, an enquiry form that emails the
  festival and offers the same message as a WhatsApp deep link. Nothing is sold online, because
  nothing is sold online in reality — the ₱500 passport is sold at Sayak Airport and partner
  venues, and the page says so.
- **"Apply here"** (media accreditation) → `/tickets?topic=media`, which preselects the topic.
- **"Download images"** → renamed **"Request images"**, a `mailto:` to the press address. No
  public media-folder URL exists, so linking to one would be a lie.

## Where the prototype overrides the design system's `readme.md`

Both of these are cases where the readme is simply older:

- **Fonts.** The readme describes Instrument Serif + Hanken Grotesk as Google Fonts substitutes.
  `fonts/fonts.css` supersedes it: the festival supplied Wigglye (display) and Satoshi (body) in
  August 2026. Those are what ship.
- **Blur.** The readme says blur is never used. The prototype's nav controls and the lightbox
  buttons use `backdrop-filter: blur(6px)`. The prototype wins, scoped to those controls only —
  they float over arbitrary photography and need it. No frosted panels anywhere else.
