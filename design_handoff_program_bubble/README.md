# Handoff: programme bubble — collapse animation + hand-cut edge

## Scope
Two things only: **how the bubble animates between closed and open**, and **how the black edge is
drawn on a clipped shape**. Everything else about the bubble — type sizes, colours, spacing, copy —
is already settled in the design and is deliberately NOT specified here. Read those values off the
existing implementation; don't re-derive them from this document.

`bubble-reference.html` in this folder is a functional **design reference** in plain HTML/CSS/JS,
not production code. Open it, click the bubbles, then rebuild the two mechanisms below in the target
codebase's own environment and patterns.

---

## 1 · The collapse animation

### The problem it solves
The bubble originally rendered its closed and open headers as two separate subtrees, swapped on
toggle. Opening looked fine; closing did not — the detail area collapsed first, and only when it
finished did the header snap back (title size, kicker position). One gesture read as two events.

### The rule
**Nothing that changes between states may unmount, and everything that changes must interpolate on
one clock.** The header is a single markup whose properties transition; only the open-only detail
subtree mounts and unmounts, and its unmount is deferred until the animation has finished.

### Two flags, not one

| Flag | Meaning |
|---|---|
| `open` | the detail subtree is mounted |
| `grown` | the bubble is at full size — this is what every transition reads |

**Opening**
1. `open = true`. The detail mounts collapsed.
2. On the **second** `requestAnimationFrame`, `grown = true`. Two frames, not one: the browser must
   lay the subtree out at its collapsed size before the target values change, or there is nothing to
   interpolate from and it appears instantly.

**Closing**
1. `grown = false`. Everything moves at once, in the same 340ms: the detail collapses and fades, the
   kicker row expands back and fades in, the title's font-size shrinks, the caret rotates back, the
   container's padding eases down.
2. After **360ms** (340 plus a frame of slack), `open = false` and the detail unmounts.

Never bind the header — or the container's padding — to `open`. That is precisely the original bug.

### What carries the movement

- **Collapsing rows.** Both the closed-only kicker and the open-only detail are wrapped in
  `display:grid; overflow:hidden` with `grid-template-rows` going `1fr ⇄ 0fr`, plus an opacity
  transition. The immediate child needs `min-height:0; min-width:0`. This animates real content
  height without measuring anything in JS — no max-height guesses, no ResizeObserver.
- **The kicker is never removed**, only collapsed to `0fr`. That is what makes the venue/time line
  slide back to the top *during* the collapse instead of appearing after it.
- **The title interpolates its `font-size`** between the closed and open values (whatever they are
  in the design — keep the existing `clamp()`s). Font-size is animatable; a class swap is not.
- **The caret rotates** (`transform: rotate(180deg)`) rather than swapping glyph, so it too has
  something to animate.
- **The container's padding** transitions, driven by `grown`.

### Timing
One duration and one curve for the whole component: **340ms**, `cubic-bezier(.22,.75,.2,1)`.
The kicker's opacity is the single exception at **260ms**, same curve, so the text is gone before the
row finishes closing. Detail unmount at **360ms**.

### Interaction
The whole bubble is the control: `role="button"`, `tabIndex="0"`, click plus Enter/Space (both
`preventDefault`). Several bubbles may be open at once. The booking link inside calls
`stopPropagation`, so reserving never collapses the card.

---

## 2 · The hand-cut edge

### Why the obvious approach fails
The bubbles and buttons are clipped to hand-cut blob shapes with
`clip-path: url(#…)`, `clipPathUnits="objectBoundingBox"`. **`clip-path` clips an element's entire
rendering**, including `box-shadow` and `filter: drop-shadow()`. Any outline drawn that way is cut
away exactly at the curve it was meant to trace. Inset rings and edge-hugging gradients fail the
same way: the clip removes them at the corners, so the line dies precisely where it is most visible.

Stacking offset drop-shadow copies to fake an outline fails for a second reason: each copy is an
antialiased edge, and on a small or stretched shape the copies do not line up — the line comes out
visibly ragged.

### The technique
Draw the edge as a **stroked path** on the same geometry as the clip, as a child of the clipped
element:

```html
<svg aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none"
     style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
  <path d="<the element's own blob path>" fill="none" stroke="#191218"
        vector-effect="non-scaling-stroke"
        style="stroke-width:calc(var(--bubble-edge) * 2)"></path>
</svg>
```

Four details make it work:

1. **`viewBox="0 0 1 1"` + `preserveAspectRatio="none"`** maps the path to the element's box exactly
   as `objectBoundingBox` does for the clip, so stroke and clip share one outline at any size.
2. **`vector-effect="non-scaling-stroke"`** keeps the stroke a constant CSS width. Without it the
   non-uniform scale makes the line fat on one axis and thin on the other.
3. **The clip keeps the stroke's inner half**, so `stroke-width` is doubled and the *visible* weight
   equals the variable. Uniform at every width, and crisp because it is vector, not stacked shadows.
4. **The element needs `position: relative`**; the ring is `pointer-events: none` so it never eats
   clicks.

The parent must carry the same path as its clip — keep them from one source. Shapes are assigned
deterministically (index arithmetic), never randomly, or a bubble changes shape on re-render.

### Weights
Exposed as CSS custom properties so they can be tuned in one place: `--bubble-edge` on bubbles,
`--button-edge` on the booking button. **Small elements take half the bubble's weight** — the
day-chip rail on the live page runs at `--bubble-edge / 2`, since a chip is a third the height of a
bubble and the same line reads much heavier on it.

### The raised button, in the same idiom
The booking button's thickness cannot be a shadow either. It is a second copy of the blob behind the
surface, `translateY` by the raise, filled with the edge ink; pressing moves the surface down by
exactly that amount, so the side is spent rather than squashed and the bottom edge never moves. Two
non-obvious constraints:

- The side copy is **inset ~1.6px horizontally**. The blob's ends are hand-cut and asymmetric, so an
  identical shape offset downwards pokes out past the surface at the ends and the join reads as a
  step. Holding it in keeps it tucked behind.
- The wrapper needs **bottom margin equal to the raise**, or a clipped ancestor (the bubble) cuts the
  side off.

Press timing, for consistency with the rest of the site: press-down 70ms, release 160ms, a 160ms
minimum hold so a fast tap still shows, and a 240ms delay before following the link — skipped for
`target="_blank"` and modified clicks, where a deferred navigation reads as a popup.

---

## Files
- `bubble-reference.html` — standalone and functional: three bubbles (bookable with description,
  walk-in, bookable with no line-up), both mechanisms above, tunables at the top of the stylesheet.
