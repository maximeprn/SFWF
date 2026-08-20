# Handoff: the sticky day-chip selector

## Scope
The programme page's day selector and the behaviour attached to it: the chip design, the sticky
header's masking of content passing underneath, and the hero collapse plus scroll landing when a day
is picked. Nothing else on the page is in scope — do not touch the bubbles, the dye background, the
nav links or any other route.

`day-selector-reference.html` is a functional **design reference** in plain HTML/CSS/JS, not
production code. Open it: click chips, scroll, and pull down at the top. Rebuild these behaviours in
the site's own patterns.

**Programme page only.** The prototype also runs its nav and mask on other routes; that is out of
scope here — implement nothing outside the programme page. Also deliberately NOT in this handoff:
the event-card (bubble) styling and animations, the button press system, and the home page. Those
are separate pieces; do not let this work touch them.

The live site currently has none of this: chips are unfilled text (desktop) or grey pills (mobile),
the hero never collapses, and content scrolls under the header without being masked at the chip row.

---

## 1 · Chip design

Two layouts, one behaviour. **Desktop** chips are two lines (date over the day's script name);
**mobile** chips are one line of dates only.

Every chip is a filled, hand-cut shape. **The picked day is orange with near-black ink; every other
day is cream with violet ink.** No bare-text state, no grey. Only unpicked chips have a hover (the
ink darkens); the picked chip has none.

| | picked | unpicked |
|---|---|---|
| fill | `#E9622D` | `#E9E7C2` |
| date line | `#191218` | `#4F3F79`, hover `#8F3A12` |
| name line (desktop) | `#191218` | `#3E3064`, hover `#191218` |
| hover transition | — | `color .15s ease` |

**Desktop chip** — `display:flex; flex-direction:column; justify-content:center; box-sizing:border-box;
width:100%`, padding `6px clamp(6px,1vw,13px) 8px` picked / `6px clamp(5px,0.8vw,10px) 8px`
unpicked. Date line: monospace, `font-size:clamp(7.4px,0.78vw,8.5px)`,
`letter-spacing:clamp(.06em,0.09vw,.14em)`, `white-space:nowrap`. Name line: the display script at
`clamp(11.5px,1.1vw,15px)/1.1`, `margin-top:1px`, `white-space:nowrap`.

**The summary chip** ("ALL SIX DAYS") carries no name line, so its date line is set larger —
`clamp(9.5px,1vw,12px)` — to fill the same box as the two-line chips.

**Mobile chip** — one monospace line, `font-size:clamp(7.5px,2.05vw,11px)` picked /
`clamp(7.5px,2vw,10.5px)` unpicked, `letter-spacing:clamp(.01em,0.16vw,.1em)`, padding
`clamp(8px,2.4vw,11px) clamp(5px,2vw,15px) clamp(9px,2.6vw,12px)`. Labels are the weekday cut to
**two letters** plus the date — `ALL`, `WE 26`, `TH 27`, `FR 28`, `SA 29`, `SU 30`, `MO 31`. That is
what makes seven chips fit a 320px phone; do not restore the three-letter form.

### Equal height, one row, no scrolling
- **All seven chips are always on one row and never scroll.** Every dimension that affects a chip's
  width is a `vw` clamp (font, padding, gap, letter-spacing), so the row shrinks to fit instead of
  overflowing. Rail: `flex-wrap:nowrap; justify-content:center; gap:clamp(3px,0.5vw,6px)` desktop,
  `gap:clamp(2px,0.9vw,7px)` mobile. No `overflow-x`, no swipe.
- **Equal height comes from the constraint, not a number**: the rail is `align-items:stretch`, each
  button is `display:flex`, and the chip is `width:100%` — so every chip matches the tallest at any
  viewport. A fixed or fluid `min-height` cannot track the two-line chips' content height and will
  drift; that was a real bug.
- On mobile the **button** carries `min-height:44px; display:flex; align-items:center` for the touch
  target, so the chip's own proportions stay put.

### The drawn edge
Each chip has a hand-cut clip shape and a black edge. Because `clip-path` clips an element's entire
rendering (shadows included), the edge is a **stroked path**, not a shadow:

```html
<svg aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none"
     style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
  <path d="<the chip's own shape path>" fill="none" stroke="#191218"
        vector-effect="non-scaling-stroke" style="stroke-width:var(--chip-edge)"></path>
</svg>
```

The clip keeps the stroke's inner half. The variable is the **same token the event cards use**
(currently `1.4px`), but the cards double it before stroking and the chips do not — so chips draw at
half the cards' visible weight. They are a third the height, and the same line reads much heavier on
them. Shapes are assigned deterministically by index so a chip never changes shape on re-render.

---

## 2 · Sticky header and the mask

```
header  position:sticky; top:0; z-index:60; pointer-events:none
├── click shield   position:absolute; inset:0; background:transparent; pointer-events:auto
│                  (only while the day bar is up)
├── nav row        the existing links
└── chip rail
```

**The background stays visible.** There is no plate, no fill, no blur behind the header — the page's
own background shows through the whole bar, chips included. The shield layer exists only so clicks
near the bar do not land on cards sliding underneath; it must stay transparent.

**Content is masked, not covered.** The scrolling container gets a CSS mask that is fully
transparent for the height of the header and then ramps to opaque over 26px, so content dissolves
*before* it reaches the chips rather than sliding behind them:

```js
function applyFade(main) {                       // the scrolling content element
  const top  = main.getBoundingClientRect().top; // negative once scrolled
  const band = Math.round(header.getBoundingClientRect().height);
  const g = 'linear-gradient(to bottom,' +
            ' rgba(0,0,0,0) ' + (-top) + 'px,' +
            ' rgba(0,0,0,0) ' + (-top + band) + 'px,' +
            ' #000 '          + (-top + band + 26) + 'px)';
  main.style.maskImage = g;
  main.style.webkitMaskImage = g;
}
```

Three things matter here and are exactly where the live site goes wrong:

1. **The band is measured, not assumed.** On the programme page the header is nav *plus* chip rail
   (~104px); elsewhere it is the nav alone (~64px). Hardcode the nav height and content shows
   through behind the chips.
2. **It is re-measured on scroll**, throttled with one `requestAnimationFrame` — this runs far too
   often for component state. Write it straight to the node.
3. **The offsets are relative to the container's own top**, which is why `-top` appears: the mask is
   positioned in the element's coordinate space, not the viewport's.

Call it on mount, after any update that changes the header (route change, day bar appearing), and on
every scroll frame.

---

## 3 · Hero collapse and where the pick lands

### Collapse
Picking any day folds the week's hero away — headline, intro line, illustration, and the
"16 GATHERINGS · SIX DAYS" count. Picking **ALL SIX DAYS** unfolds it. Both directions animate on the
same clock as the rest of the site: **340ms `cubic-bezier(.22,.75,.2,1)`**, opacity at 260ms.

Use a collapsing grid so real content height animates without measuring anything:

```
wrapper   display:grid; overflow:hidden;
          grid-template-rows: 1fr (open) → 0fr (folded);
          opacity: 1 → 0;
          transition: grid-template-rows .34s cubic-bezier(.22,.75,.2,1),
                      opacity .26s cubic-bezier(.22,.75,.2,1);
> child   min-height:0; min-width:0
```

Never unmount the hero to hide it — an unmount cannot animate, and the fold is the whole effect.

### The landing position
With the hero folded, the picked day's block sits directly under the chip rail; that is the target.
Scroll to the day block's own top, minus the measured header height, minus a 10px gap:

```js
function land(anchor, header) {                       // anchor = element just above the day list
  const band = header.getBoundingClientRect().height + 10;
  const target = Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - band);
  if (Math.abs(window.scrollY - target) > 2) window.scrollTo({ top: target, behavior: 'smooth' });
}
```

**Run it twice: once immediately, and again at 380ms** — the target moves while the hero collapses,
and the second pass is what makes a one-event day land in the same place as a four-event day.
Without it, short days end up wherever the shrinking document dropped them. Scroll both directions
(the old "only scroll down" guard is what left picks stranded).

### Pulling the week back
With the hero folded the page is already at its top, so there is no scroll-up gesture available —
the reveal must read the **pull**, not the scroll position:

- `wheel` with `deltaY < -10`, or a `touchmove` whose finger has travelled **more than 26px
  downward**, while `scrollY <= 2` → unfold the hero (same 340ms).
- Scrolling back down past **40px** folds it away again.
- Ignore both for **450ms** after a pick, while the programmatic scroll settles.

Position-based logic does not survive here: folding the hero shrinks the document, the browser
clamps the scroll, and that clamp is indistinguishable from "the user scrolled to the top" — it
re-triggers the reveal in a loop. Read the gesture.

### State
```
day       'all' | day index      which chip is picked
heroPeek  boolean                the week was pulled back into view on a picked day
```
`heroOpen = day === 'all' || heroPeek`. Reset `heroPeek` on every pick and on route change.

---

## 4 · Scope discipline

- **Non-destructive, additive only**: a mask on the scrolling container, a wrapper *around* the
  existing hero markup (do not rewrite or move the hero itself), chip styles, and three listeners
  (`scroll`, `wheel`, `touchstart`/`touchmove`). No changes to the event cards, the background, the
  nav links or any other route — if a diff touches a file outside the programme page's selector,
  hero wrapper or scroll wiring, it is out of scope.
- Removing the feature must be trivial: deleting the mask, the wrapper and the listeners restores
  today's page exactly.
- Keep listeners passive and remove them on unmount. The scroll work must not call `setState` per
  frame — only when a boolean actually flips.
- Do not introduce media queries for the chips; the whole point is the `vw` clamps.
- Verify: seven chips on one row at 320, 390, 860 and 1440 with no horizontal scroll; equal chip
  heights at every width; content invisible behind the chip row while scrolling; a one-event day and
  a four-event day landing at the same offset after a pick; pull-at-top revealing on both wheel and
  touch.

## Files
- `day-selector-reference.html` — standalone and functional: sticky header with both rails, the
  measured mask, the hero fold, the double-pass landing, and pull-to-reveal.
