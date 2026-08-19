# Handoff: Suspended-Particle Dye Background ("dye flow")

## Overview

The full-bleed background used behind every screen of the SFWF 2026 mobile prototype. A single
indigo shibori photograph is rendered through a WebGL flow field so that swiping feels like moving
a hand through a liquid full of suspended glitter: the stroke pushes the medium, eddies curl off it,
and the motion keeps developing for a couple of seconds after the finger lifts.

It replaces an earlier behaviour where a radial ripple only animated *while* the finger was pressed
and stopped dead on release.

**The background image is never modified.** Only *where* the shader samples it moves. Any artwork
can be dropped in.

## About the Design Files

The files in this bundle are **design references created in HTML** — a working prototype of the
intended look and behaviour, not production code to paste in. The task is to **recreate this effect
in the target codebase's own environment** (React Native + GL view, Three.js/react-three-fiber, a
plain WebGL canvas in a Next.js app, SwiftUI + Metal, etc.) using its established patterns.

That said, this effect is almost entirely GLSL plus ~200 lines of state machine, and both are
framework-agnostic. `dye-flow.js` is a clean, dependency-free extraction with the exact shader
source and constants — **port it rather than re-deriving it**. The two fragment shaders should be
copied verbatim; only the host plumbing (canvas creation, event binding, lifecycle) needs rewriting.

## Fidelity

**High-fidelity.** Every constant in this document is the shipped, user-approved value. The feel was
tuned interactively against the real artwork on a phone-sized viewport; changing `tau`, `visc`, or
`disp` by more than ~20% visibly changes the character. Match the numbers exactly, then tune only if
the target device profile demands it.

---

## What the user should experience

1. **Drag** — the medium is pushed along the direction of travel. The *whole path* of the stroke
   stays stirred, not just the point under the finger; you can draw through the dye.
2. **Release** — nothing special happens. There is deliberately no touch-up handler. Momentum lives
   in the field, so it simply coasts: eddies keep curling and unwinding, decaying over ~2–3s.
3. **Edges** — flow leaving one side of the screen re-enters the other. No bouncing, no ripples
   reflecting off the borders.
4. **Scrolling** — a touch-scroll gesture stirs the dye exactly like a drag (a `touchmove` listener
   keeps firing during momentum scroll). On desktop, the wheel injects vertical momentum at the
   cursor, and simply moving the cursor stirs without any button held.
5. **Idle** — ~1.1s after the last input, a very faint breathing pulse fades back in over 2.2s. This
   is the resting state; the dye is never completely static.

---

## How it works

Two shader passes per animation frame, ping-ponged between framebuffers.

### Pass 1 — the velocity field (`SIM_FS`)

A **128 × 256 RGBA** texture. `RG` = velocity (`v/vsc * 0.5 + 0.5`), `B` = "agitation" (a scalar
that trails the stroke and drives extra grain). Both field textures use `gl.REPEAT` wrapping — this
is the whole no-borders behaviour, and it is why the field must be power-of-two in WebGL 1.

Order of operations, all of it dt-scaled so a 120 Hz phone behaves like a 60 Hz one:

| Step | What it does |
|---|---|
| **Self-advection** | Semi-Lagrangian: sample the field at `uv - vel*dt*0.9/aspect`. This is what makes motion travel and persist. |
| **Curl amplification** | `w = (r.y-l.y) - (u.x-d.x)`; then `nv += curl*dt*w*perp(nv)`. Rotates velocity by local spin, so shear rolls up into eddies instead of dissipating. |
| **Viscosity** | `mix(nv, 4-neighbour average, clamp(visc*dt*60, 0, 1))`. Keeps the field smooth. **This term dominates settle time** — it was originally a flat `0.055` per frame, which cut the effective decay to ~0.4s regardless of `tau`. |
| **Stroke splat** | Gaussian around the *segment* `pa → pb` (previous frame's pointer → this frame's), not around a point. Aspect-corrected so the stir is circular on screen. `nv += pv * g * push * dt * act * 6.0`. |
| **Decay** | `nv *= exp(-dt/tau)`; agitation uses `exp(-dt/(tau*2.1))` so the grain trail outlives the motion. |

Velocity is clamped to `±vsc`. `vsc` is `2.0` on half-float fields, `0.60` on the 8-bit fallback
(the smaller range buys back quantisation precision when only `RGBA8` render targets exist).

### Pass 2 — display (`FS`)

```
dp  = fieldVelocity * dispK / vec2(aspect, 1.0)     // flow displacement
dp += idleRingTerm                                   // the faint resting pulse
```
`dp` then offsets **three** samples:

- two copies of the dye image at slightly different scales/offsets (`s1/o1`, `s2/o2`, each on its
  own 30 s and 44 s cosine cycle), soft-light blended 70% — this is the pre-existing ambient drift
  and is unchanged;
- a 64 px random-noise tile, overlay-blended at `0.42 * (1 + agitation * grain)` — so disturbed dye
  picks up extra sparkle. This is what sells "glitter" without drawing a single particle.

Output is brightened marginally by `bl*0.10 + agitation*0.05`.

---

> **Shipped configuration: `feel: 'Turbulent'`, `strength: 1.45`, `radius: 0.10`.** These are the
> user-approved values — build these, not the middle preset.

## Design tokens (the numbers that matter)

### Feel presets — shipped default is **Turbulent**

| | push | curl | tau (s) | visc | disp | grain |
|---|---|---|---|---|---|---|
| Calm | 0.60 | 1.10 | 2.10 | 0.012 | 0.058 | 0.9 |
| Flowing | 1.00 | 2.20 | 1.70 | 0.016 | 0.086 | 1.3 |
| **Turbulent** | **1.55** | **3.70** | **1.40** | **0.020** | **0.120** | **1.9** |

- `push` — how hard a stroke injects momentum
- `curl` — eddy formation rate; the difference between "smear" and "swirl"
- `tau` — velocity e-fold time in seconds
- `visc` — smoothing per 1/60 s (see caution above)
- `disp` — max sampling displacement in UV units; `0.120` ≈ 12% of the frame
- `grain` — extra noise-overlay gain in the agitated wake

### User-facing settings (shipped defaults)

| Setting | Value | Range | Maps to |
|---|---|---|---|
| Swirl feel | `Turbulent` | Calm / Flowing / Turbulent | preset table above |
| Swirl strength | `145%` | 0–250% | multiplies `push` and the idle amplitude |
| Stir radius | `10%` | 3–40% of viewport **width** | `rad` in the splat Gaussian |
| Dye animation | `on` | on / off | `off` renders a plain `background-image` |

### Fixed constants

```
FIELD          128 × 256, RGBA, REPEAT wrap on both axes
MAX_SPEED      2.4          stroke speed cap, screen-widths/sec
velocity smoothing  0.45     per-frame lerp toward measured stroke velocity
wheel decay         0.82     per frame
wheel gain          -deltaY / height * 2.4, clamped ±1.6
dt clamp       [1/240, 1/24] seconds
DPR cap        2
IDLE_WAIT      1.1 s        silence before the resting pulse returns
IDLE_FADE      2.2 s        fade-in of the resting pulse
IDLE_AMP       0.18         resting pulse amplitude (× strength)
IDLE_PERIOD    4.8 s
ring/bloom     RING 9.0, SPEED 2.15, DISP 5.40, STR 0.042, BLOOM 0.034
noise tile     64 px, grey 96–192 random, REPEAT, scale = cssSize / 128,
               drifting (-t/26, -t/26)
dye layers     s1 = 1.05 + 0.07·k(30s), o1 = (-0.026, 0.018)·k(30s)
               s2 = 1.13 − 0.10·k(44s), o2 = (0.034, −0.022)·k(44s)
               k(p,t) = 0.5 − 0.5·cos(2π·((t/p) mod 1))
               blend: soft-light 70%; second layer takes dp × 0.72
```

## State

Per-instance, all frame-local — **no React/Vue state, nothing that triggers a re-render**. Keep it
in a ref/instance, never in reactive state, or the effect will thrash.

```
px, py        pointer position now, 0..1 of the canvas box
ax, ay        pointer position at the previous frame (segment start)
sx, sy        smoothed stroke velocity, screen-widths/sec
ex, ey        wheel-injected velocity, decaying
moved         did any input arrive this frame
lastT         timestamp of last input (drives the idle ramp)
cur           which of the two field textures is current
```

## Events

| Event | Target | Purpose |
|---|---|---|
| `pointerdown`, `pointermove` | screen wrapper (an ancestor of the canvas, so gestures over content still count) | position, passive |
| `touchmove` | same | keeps firing during momentum scroll, where `pointermove` stops |
| `wheel` | same | desktop scroll momentum at the cursor, passive |

There is intentionally **no** `pointerup` / `pointerleave` / `pointercancel` handler. Adding one is
the single easiest way to reintroduce the "stops dead on release" bug.

## Capability handling

1. No WebGL context → render the image as a plain CSS `background: url(...) center/cover`. Visually
   identical at rest.
2. `OES_texture_half_float` + `OES_texture_half_float_linear` present and the FBO is complete →
   half-float field, `vsc = 2.0`. This is the good path on modern iOS/Android.
3. Otherwise → `RGBA8` field, `vsc = 0.60`.
4. FBO incomplete even at 8-bit → `SW = 0`, `dispK = 0`: the ambient dye drift and idle pulse still
   run, only the interaction is dropped.

## Performance

Sim pass is 32 768 pixels with ~7 texture fetches — negligible. The display pass is 3 fetches at
device resolution, DPR-capped at 2. One `requestAnimationFrame` loop, no allocation in the loop.
On a 2020-era phone this sat comfortably in frame budget.

Two things worth doing in production that the prototype does not:
- pause the rAF loop when the page/tab is hidden (`visibilitychange`) or the canvas scrolls out of view;
- respect `prefers-reduced-motion: reduce` — recommend dropping to the static image, or at minimum
  to `Calm` with the idle pulse disabled.

## Assets

- `assets/indigo-shibori.png` — the dye artwork, sampled as `TEXTURE0`. Any large, soft, high-contrast
  organic texture works; the effect reads best on imagery with mid-frequency detail.
- The 64 px noise tile is **generated at runtime** (`Math.random()` greys 96–192). No asset needed.
  If deterministic rendering matters, bake it to a file and load it instead.

## Files in this bundle

| File | What it is |
|---|---|
| `NAV-BAND.md` | Companion spec: the nav band's reserved-space pinning and the mask that fades page content under it. Independent of the background, but designed with it. |
| `dye-flow.js` | **Start here.** Dependency-free ES module, `createDyeFlow(canvas, opts)` → `{ set, destroy, usingHalfFloat }`. Shader source is verbatim from the prototype. |
| `demo.html` | Runnable reference: the effect plus live feel/strength/radius controls and a scrollable panel over it. Serve the folder over HTTP (ES modules + texture loading need it). |
| `assets/indigo-shibori.png` | The dye artwork. |
| `reference/prototype.html` | The full SFWF prototype the effect was built in — see the `BloomLayer` component. Needs the sibling `reference/` assets to run; read it for context, not as a build target. |

## Integration sketch (React)

```jsx
function DyeBackground({ feel = 'Turbulent', strength = 1.45, radius = 0.10 }) {
  const canvas = useRef(null), flow = useRef(null);
  useEffect(() => {
    flow.current = createDyeFlow(canvas.current, {
      image: dyeUrl,
      target: canvas.current.parentElement,   // gestures over page content still stir it
    });
    return () => flow.current?.destroy();
  }, []);                                      // mount once — never re-create on prop change
  useEffect(() => { flow.current?.set({ feel, strength, radius }); }, [feel, strength, radius]);
  return <canvas ref={canvas} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}
```

The canvas sits at `position: absolute; inset: 0` beneath the scroller, with a
`rgba(11,20,32,.40)` veil between it and the content for text contrast.

## Known constraints

- Field is fixed at 128 × 256 regardless of viewport aspect. At a very different aspect ratio
  (tablet landscape) the eddy scale skews slightly; if that matters, keep the field power-of-two
  (`REPEAT` requires it in WebGL 1) and pick the nearest POT to the real aspect.
- The 8-bit fallback quantises velocity at ~1/425 of full scale, so the last ~15% of the decay is
  slightly steppier. Invisible at these amplitudes in practice.
- `crossOrigin = 'anonymous'` is set on the image; the texture must be same-origin or CORS-enabled.
