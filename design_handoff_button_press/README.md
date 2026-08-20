# Handoff: the button press system

## Scope
How a button behaves when it is pressed, and the drawn construction that makes the press readable.
Everything below is what the prototype ships **by default** — no variants, no options, nothing
aspirational. Type, colour and copy are settled in the design and deliberately not specified here.

`button-reference.html` in this folder is a functional **design reference** in plain HTML/CSS/JS,
not production code. Open it, press the buttons (mouse, finger and keyboard behave identically),
then rebuild the mechanism in the target codebase's own patterns.

---

## 1 · What a press has to do

The buttons used to answer only the cursor: a hover colour change, nothing on click. On touch there
was no feedback at all, and navigation fired instantly, so the press was never seen. Three
requirements:

- **The press is the primary state**, not hover. It must be obvious the button was hit.
- **Identical on desktop and mobile** — one code path for mouse, touch and keyboard.
- **Navigation waits for the animation.** The press is pointless if the page turns first.

## 2 · The construction: a raised surface that lands flush

A button is a surface standing on a drawn side. Pressing puts it down — the side is *spent*, not
squashed:

```
wrapper                position:relative; display:inline-block;
                       margin-bottom: var(--raise);      ← the side hangs below the box; without
                                                            this a clipped ancestor cuts it off
├ side (aria-hidden)   position:absolute; top:0; bottom:0; left:1.6px; right:1.6px;
                       transform: translateY(var(--raise));
                       clip-path: <the button's own shape>; background: <edge ink>;
└ surface (a/button)   position:relative; display:block; clip-path: <same shape>;
                       + the drawn edge (see §4)
```

**On press** the surface gets `transform: translateY(var(--raise))` — exactly the side's height. Two
consequences make it read as a physical key rather than a CSS effect: the side disappears completely
(the surface covers it), and **the bottom edge never moves**. No scaling — shrinking reads soft and
web-like; pure travel reads drawn.

The side is **inset 1.6px horizontally**: the shapes are hand-cut and asymmetric, so an identical
copy offset downwards pokes out past the surface at the ends and the join reads as a step.

## 3 · The press itself

| Property | Value | Why |
|---|---|---|
| travel | `translateY(var(--raise))` | the side's exact height |
| press-in transition | `70ms cubic-bezier(.3,.9,.4,1)` | must feel immediate |
| release transition | `160ms cubic-bezier(.2,.8,.3,1)` | rises rather than snaps |
| minimum hold | **160ms** | a fast tap still shows the press |
| navigation delay | **240ms** from press-down | the press is seen before the page turns |
| colour | fill and ink **invert** | see below |

**Driven by pointer events**, not mouse events, and bound once on the window in the capture phase:
`pointerdown` → press on; `pointerup` / `pointercancel` → press off; `keydown`/`keyup` on
Enter/Space → the same path. That is what makes desktop and mobile identical, and it survives
re-renders because nothing is bound per element.

**The wait lives in the click handler**: press on, `preventDefault()`, then navigate after
`max(60, 240 − elapsed)` ms, so an already-slow press isn't punished twice. Release with the minimum
hold so the down state is never shorter than 160ms.

**Never defer** `target="_blank"` or cmd/ctrl/shift/alt clicks — a delayed `window.open` reads as a
popup and gets blocked. Let those through untouched.

**Restore by rewriting the element's own style**, not by unsetting individual properties: stash the
original `style` attribute on press and put it back on release. The press then cannot leak into the
design, and a re-render mid-press is harmless.

Also required, or the platform's own highlight fights the press:
`-webkit-tap-highlight-color: transparent; touch-action: manipulation`.

### Colour inversion
The press inverts fill and ink rather than dimming them — a lighter tint of the fill reads as
"disabled", the opposite of the intent. Hover uses the same inversion at 180ms, so hover and press
agree. Three cases, by the ground the button stands on:

| Where | At rest | Pressed |
|---|---|---|
| brand fill on the page ground | brand fill, dark ink | inverts to the light fill |
| light fill on the page ground | light fill, dark ink | inverts to the brand fill |
| brand fill on a light card | brand fill, light ink | inverts to the **page ground** colour, light ink — inverting to the card's own colour would erase the button |

## 4 · The edge, on clipped shapes

The buttons are clipped to hand-cut shapes (`clip-path: url(#…)`,
`clipPathUnits="objectBoundingBox"`). **`clip-path` clips an element's entire rendering**, including
`box-shadow` and `filter: drop-shadow()` — an outline drawn on the button itself is cut away exactly
at the curve it was meant to trace, and inset rings or edge gradients die at the corners for the
same reason.

The prototype solves this two ways, and it is worth knowing why there are two.

### a. Stacked drop-shadows on a wrapper — six of the seven buttons
The outline lives on an unclipped wrapper one level up, which prints ink around the clipped
silhouette:

```css
/* on the wrapper, not the button */
filter:
  drop-shadow(var(--button-edge) 0 0 <ink>)
  drop-shadow(calc(var(--button-edge) * -1) 0 0 <ink>)
  drop-shadow(0 calc(var(--button-edge) * -1) 0 <ink>)
  drop-shadow(0 var(--button-edge) 0 <ink>);
```

Cheap, no per-button geometry needed. Its limit: each copy is an antialiased edge, so on a small or
stretched shape the copies do not line up and the line comes out visibly ragged.

### b. A stroked path — the button on the card
Where (a) went ragged, the edge is stroked on the same geometry as the clip, as a child of the
clipped element:

```html
<svg aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none"
     style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
  <path d="<the element's own shape path>" fill="none" stroke="<ink>"
        vector-effect="non-scaling-stroke"
        style="stroke-width:calc(var(--button-edge) * 2)"></path>
</svg>
```

1. `viewBox="0 0 1 1"` + `preserveAspectRatio="none"` maps the path to the box exactly as
   `objectBoundingBox` does for the clip, so stroke and clip share one outline at any size.
2. `vector-effect="non-scaling-stroke"` keeps the width constant — without it the non-uniform scale
   makes the line fat on one axis and thin on the other, and at a 0..1 viewBox a plain width floods
   the whole shape.
3. The clip keeps the stroke's **inner half**, so the width is doubled and the *visible* weight
   equals the variable.
4. The element needs `position: relative`; the ring is `pointer-events: none`. Being a child of the
   surface, it travels with the press for free.

**If you implement one, implement (b)** — it is crisp at every size, and the same value produces the
same visible weight in both. It costs one thing: the element must know its own shape path, so keep
the clip and the ring reading from a single source, and assign shapes deterministically (index
arithmetic), never randomly, or a button changes shape on re-render. The reference file uses (b)
throughout for that reason.

## 5 · Values

| Property | Meaning | Default |
|---|---|---|
| `--raise` | how far the button stands off the page, and therefore its travel | **2.5px** |
| `--button-edge` | visible weight of the drawn edge | **1.3px** |

Both are CSS custom properties so the whole set moves together.

## Files
- `button-reference.html` — standalone and functional: the three inversion cases, keyboard support,
  and the two values above as live sliders.
