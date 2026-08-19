# Nav Band — Reserved-Space Pinning & Content Fade

Companion spec to `README.md` (the dye-flow background). This covers the second half of the
screen chrome: the navigation band and the way page content dissolves underneath it.

The two systems are independent — you can implement this one without the background — but they are
designed together: **the fade is a mask, not a scrim, precisely so the animated dye behind it stays
untouched.**

## Fidelity

**High-fidelity.** Every number below is the shipped value, tuned against the real type at
phone width. The `-8` / `+34` ramp offsets in particular are the difference between "text
dissolves" and "text clips".

---

## 1. The effect in words

A centred logo mark sits at the top of every screen. It is **not** a bar: no background plate, no
border, no blur — just the mark floating over the live dye.

Because there is no plate, content scrolling up would collide with it. So the scrolling container is
**masked**: page content is fully transparent for the height of the band, ramps to fully opaque
over 42px, and is untouched below that. Text doesn't slide under the mark — it evaporates a few
pixels before reaching it, and the dye background continues through the gap at full strength.

The band itself is neither fixed nor freely-scrolling. It occupies **reserved space** — an empty
`NAVH`-tall gap at the top of the page and at the top of each major section. Reading down, it is
pushed out by the section it belongs to, 1:1 with the scroll. Once out, it stays out until the next
reserved gap arrives and brings it back. Reading up never yanks it back into view mid-paragraph.

The fade tracks the band 1:1. As the band slides out, the transparent zone shrinks with it, so
there is never a floating band of blank space with no mark in it.

## 2. Why a mask and not an overlay

The obvious implementation — a `linear-gradient(to bottom, bg, transparent)` div over the top of
the page — is wrong here, and visibly so:

- it would paint an opaque-to-transparent wash of a **flat colour** over the dye, flattening the
  animated background exactly where it is most visible;
- the dye is a photograph with a veil over it, not a solid — there is no single colour that could
  match it;
- the background is in motion, so any static scrim would separate from it.

`mask-image` removes the **content's own alpha** and composites nothing of its own. The dye passes
through at 100%. This is the core decision of the whole treatment; if you port one thing correctly,
port this.

## 3. Geometry

```
NAVH = 102          // total reserved band: 56px top inset + 46px mark
```

The mark is absolutely positioned at `top: 56`, `left: 0`, `right: 0`, `z-index: 59`, **outside**
the masked scroller — it must not be masked by its own mask.

The scroller's inner wrapper carries `padding-top: NAVH`, which is the reserved gap at the top of
the page. Each section that should bring the band back carries `data-nav-anchor` and its own
`padding-top: NAVH`.

## 4. The mask

Single source of truth: `nav.o`, the band's current vertical offset, ranging `0` (fully in) to
`-NAVH` (fully out).

```js
const band = NAVH + nav.o;              // visible height of the band right now, 102 → 0

const mask = band > 2
  ? `linear-gradient(to bottom,
       rgba(0,0,0,0) 0px,
       rgba(0,0,0,0) ${Math.max(0, band - 8)}px,
       #000 ${band + 34}px)`
  : 'none';
```

Applied to the scrolling element:

```js
style={{ WebkitMaskImage: mask, maskImage: mask }}
```

| Term | Value | Why |
|---|---|---|
| Transparent hold | `0 → band - 8` px | Fully cut for the band's height, less 8px |
| Ramp | 42px (`band - 8` → `band + 34`) | Long enough to read as a dissolve, short enough not to grey out live text |
| `-8` head start | 8px | Glyphs are *gone* before the mark's baseline zone, not clipping at it |
| `+34` tail | 34px | Ramp finishes below the band, so the first fully-legible line clears the mark |
| `Math.max(0, …)` | — | Guards the degenerate case where `band < 8`; gradient stops must not go negative |
| `band > 2` → `'none'` | — | Once the band is out, drop the mask entirely rather than paying for a no-op composite every frame |

Both `WebkitMaskImage` and `maskImage` are required — Safari (including current iOS) still needs
the prefix. Setting only the unprefixed property silently does nothing on iOS, which is the exact
platform this was designed for.

## 5. The offset state machine

`nav.o` is produced by a scroll handler on the scroller. **Nothing in this system ever writes
`scrollTop`** — it only reads it and translates the band. That is what keeps it feeling like the
page, rather than like a widget fighting the page.

### State

```js
st = { o: 0, y: 0, mode: 'in' }   // offset, last scrollTop, and which regime we're in
```

`mode: 'in'` — the band is glued to the top and moving with the reader.
`mode: 'out'` — the band is gone and stays gone until a reserved gap arrives.

### Reserved gaps

```js
const gaps = () => [0].concat(
  Array.from(inner.querySelectorAll('[data-nav-anchor]')).map(e => e.offsetTop)
);
```

Recomputed per scroll frame, so late-loading images and expanding sections stay correct. `0` is the
page's own top gap.

### Per-frame logic

Throttled with `requestAnimationFrame`; the listener is `{ passive: true }`.

```js
const s = st.current, y = el.scrollTop, yPrev = s.y, d = y - yPrev;
s.y = y;
if (!d) return;                                  // no movement, no work

const G = gaps();
let A = 0;
for (const g of G) if (g <= y) A = g;            // nearest gap at or above the viewport top
const glue = Math.max(-NAVH, Math.min(0, A - y)); // how much of that gap has scrolled past

if (s.mode === 'in') {
  // glued: rides out 1:1 reading on, rides back 1:1 on reversal, holds at 0. Never snaps.
  const o = Math.max(-NAVH, Math.min(0, s.o - d));
  if (o <= -NAVH) s.mode = 'out';
  return apply(o, false);
}

if (d > 0) {                                     // reading on
  if (s.o <= -NAVH) return;                      // out stays out
  return apply(Math.min(s.o, glue), false);      // a half-entered band rides back out 1:1
}

// Reading up: lock in only when a section's top edge crosses the viewport top.
// Tested against the PREVIOUS position, so a fast flick that jumps an entire gap
// between two frames still registers.
for (const g of G) if (y <= g && g < yPrev) { s.mode = 'in'; return apply(0, true); }

// Otherwise track the arriving gap pixel-for-pixel. Mid-section, glue is -NAVH: a no-op.
apply(glue, false);
```

`apply(o, snap)` early-returns when `o` is unchanged, then commits to state and notifies the parent.

### The `snap` flag

Exactly one transition in this system is animated: the lock-in when reading up past a section
boundary (`apply(0, true)`). Everything else is pixel-tracked and must have **no** transition, or
it will lag the finger.

Consumers of the offset apply:

```js
transform: `translateY(${off}px)`,
transition: snap ? 'transform .26s cubic-bezier(.4,0,.2,1)' : 'none',
```

The mask itself is never transitioned — it is recomputed each frame from the current offset.

## 6. Resetting between screens

The prototype uses one scroller for all screens. On screen change:

```js
useEffect(() => {
  scroller.current.scrollTop = 0;
  st.current = { o: 0, y: 0, mode: 'in' };
  setNav({ o: 0, snap: false });
}, [view]);
```

Without this a new screen opens at the previous screen's scroll position with a stale band offset.
In a router-based app, key this to the route.

## 7. Layer stack

Bottom to top, all `position: absolute; inset: 0` inside an `overflow: hidden` root:

1. **Dye background** — `<BloomLayer />` (see `README.md`), or `url(dye) center/cover` when the
   animation is off.
2. **Veil** — flat `rgba(11,20,32,.40)`, for text contrast. Static; not part of the fade.
3. **Scroller** — `overflow-y: auto`, carries the mask. Inner wrapper has `padding-top: NAVH`.
4. **Nav mark** — `top: 56`, `z-index: 59`, translated by `nav.o`. Outside the scroller.

Note the scroller also carries an independent `opacity` transition (`.34s ease`, plus
`pointer-events: none`) used when the full-screen menu opens — content fades out while the dye
stays. Don't conflate it with the mask; they compose.

## 8. Reference implementation

```jsx
function Chrome({ children, view, onNav, live }) {
  const scroller = useRef(null), inner = useRef(null);
  const [nav, setNav] = useState({ o: 0, snap: false });
  const st = useRef({ o: 0, y: 0, mode: 'in' });

  useEffect(() => {                                    // reset per screen
    if (scroller.current) scroller.current.scrollTop = 0;
    st.current = { o: 0, y: 0, mode: 'in' };
    setNav({ o: 0, snap: false });
    onNav?.({ o: 0, snap: false });
  }, [view]);

  useEffect(() => {                                    // scroll → offset
    const el = scroller.current; if (!el) return;
    let raf = 0;
    const apply = (o, snap) => {
      const s = st.current;
      if (o === s.o) return;
      s.o = o; setNav({ o, snap }); onNav?.({ o, snap });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; /* …section 5… */ });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const band = NAVH + nav.o;
  const mask = band > 2
    ? `linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${Math.max(0, band - 8)}px, #000 ${band + 34}px)`
    : 'none';

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <DyeBackground live={live} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,20,32,.40)' }} />
      <div ref={scroller} style={{ position: 'absolute', inset: 0, overflowY: 'auto',
        WebkitOverflowScrolling: 'touch', WebkitMaskImage: mask, maskImage: mask }}>
        <div ref={inner} style={{ paddingTop: NAVH }}>{children}</div>
      </div>
      <NavMark off={nav.o} snap={nav.snap} />
    </div>
  );
}
```

Sections that should bring the band back:

```jsx
<section data-nav-anchor style={{ paddingTop: NAVH }}> … </section>
```

## 9. Porting notes & gotchas

- **Scrollbar.** The mask applies to the whole scrolling box, so a visible scrollbar fades too. The
  prototype hides it (`.noscroll { scrollbar-width: none }` + `::-webkit-scrollbar { display: none }`).
  On desktop with a persistent scrollbar you may want the mask on an inner wrapper instead.
- **`will-change`.** Do not put `will-change: mask-image` on the scroller — it promotes a full-page
  layer and costs more than the mask does.
- **Sticky children.** `position: sticky` inside a masked scroller works, but sticky elements that
  park at the top will sit in the transparent zone and vanish. Either give them `top: NAVH` or keep
  them out of the masked subtree.
- **React state per frame.** `setNav` on every scroll frame is fine at this scale, but the offset
  only changes when it actually changes (`apply` early-returns). If your nav subtree is expensive,
  drive `transform` and the mask through a ref + direct style write and skip React entirely.
- **Non-web targets.** In React Native, `MaskedView` with a `LinearGradient` child is the
  equivalent; in SwiftUI, `.mask(LinearGradient(...))`. The offset state machine ports verbatim.
- **Reduced motion.** The `snap` easing is the only animation; it's a 260ms transform and is
  reasonable to keep. If you disable it, set the transition to `none` — do not disable the offset
  tracking itself, or content will run under the mark.
