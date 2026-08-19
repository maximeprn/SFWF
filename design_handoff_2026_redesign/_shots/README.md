# Screenshots

Full-page captures of the prototype, one PNG per screen per breakpoint. Rendered from
`SFWF prototype.dc.html` at the widths that matter: **390** (below the 860px breakpoint),
**900** (just above it), **1440** (above the 1100px hero step).

```
w390/   01-home.png   02-program.png   03-press.png     — mobile: burger nav, single column, date chips
w900/   01-home.png   02-program.png   03-press.png     — desktop nav appears, bubbles go 2-up
w1440/  01-home.png   02-program.png   03-press.png     — hero scales ×1.4, day filter spreads
states/ bubble-open-900.png                             — several event bubbles open at once
```

Reading them:

- The **dye ground** in these captures is the baked still (`assets/dye-hr/ground-rendered.png`,
  repeated vertically). Live it is one fixed, viewport-sized canvas — see README §4. The repeat
  seam is a capture artifact, not part of the design.
- The **nav fade mask** is switched off for capture, so copy that would dissolve under the nav band
  reads at full strength here. Its numbers are in README §5.
- **Media frames show their placeholders** ("Festival film — poster frame, 9:16", "2025 clip 1").
  That is the real content state: the film and last year's clips have not been shot yet.
- In `states/bubble-open-900.png` the open bubbles' titles and hint lines **overlap slightly**. That
  is the capture renderer ignoring the reveal's `overflow: hidden` mid-transition; on the page the
  reflow is clean. Open one in the prototype to see it properly.
- The **mobile menu** is not captured (the overlay is fixed-position and does not survive a
  full-page capture). It is fully specified in README §5 — hand-drawn ring, Beth Ellen 23px words,
  page copy faded to zero, no scrim.
- **Venues is gone.** These captures are from the current cut: three nav words, no `/venues`.
