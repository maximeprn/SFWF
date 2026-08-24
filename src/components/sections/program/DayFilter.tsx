"use client";

import Image from "next/image";
import { useLayoutEffect, useState, type RefObject } from "react";
import {
  DayChipStyles,
  DesktopDayChip,
  MobileDayChip,
  TABS,
  type DayPick,
} from "./DayChip";
import { foldInner, foldStyle } from "@/lib/program/heroFold";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/* The rail's own type, re-exported from here because this is the module the rest of the
   programme has always imported it from. */
export type { DayPick };

/**
 * The farmer illustration above the desktop rail — the hero's own decorative flourish, folded
 * away with the headline and intro line. Kept separate from `DayFilter` below because the two
 * pieces need different DOM homes: this stays inside the hero section's normal flow, while the
 * rail has to sit *outside* it — see `DayFilter`'s own note.
 */
export function DayFilterIllustration({ heroOpen }: { readonly heroOpen: boolean }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="hidden wide:block" style={foldStyle(heroOpen, reduced)}>
      <div style={foldInner}>
        <Image
          src="/doodles/orange/farmer.png"
          alt=""
          width={2548}
          height={1453}
          style={{
            width: "min(56%,300px)",
            height: "auto",
            margin: "clamp(34px,4.4vw,54px) auto clamp(10px,1.6vw,18px)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * The day rail: seven filled, hand-cut chips that never wrap and never scroll. It sticks
 * directly under the nav band once the page scrolls past the hero — its own height is
 * measured live (`navHeight`) rather than assumed, since the nav's rendered height changes
 * across the site's one breakpoint. `useProgramContentMask` measures this same element to
 * know how much content to hide passing underneath it.
 *
 * Rendered as a sibling of the page's sections, not nested inside the (short) hero one: a
 * sticky element can only stay pinned for as long as its own parent still has height left to
 * scroll through, and the hero section alone is nowhere near tall enough to hold the rail
 * stuck for the rest of the page. This is also how the reference prototype is built — its
 * header sits outside `<main>`, a sibling to all the scrolling content, not inside the hero.
 *
 * Two layouts, one behaviour: desktop chips carry the date over the day's script name;
 * mobile chips carry the date alone. The switch is the site's one breakpoint, not a resize
 * listener — every dimension that affects a chip's *width* (font, padding, gap) is a vw
 * clamp instead, so the row shrinks to fit rather than wrapping or scrolling.
 *
 * The picked chip is orange with near-black ink and stands pressed into the rail; every other
 * chip is cream, raised on its drawn side, and only those darken their ink on hover. Both
 * chips live in `DayChip`.
 */
export function DayFilter({
  pick,
  onPick,
  railRef,
}: {
  readonly pick: DayPick;
  readonly onPick: (day: DayPick) => void;
  readonly railRef: RefObject<HTMLDivElement | null>;
}) {
  const [navHeight, setNavHeight] = useState(0);

  useLayoutEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const measure = () => setNavHeight(header.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <DayChipStyles />

      {/* The sticky rail. `pointer-events:none` on the wrapper plus a transparent shield
          covering it keeps a click near the bar off a card sliding underneath once the rail
          is pinned; the rail's own buttons re-enable pointer events for themselves. The
          column framing (`--sw`/`--gutter`) is reapplied here on an inner wrapper, matching
          the nav band's own pattern, since this no longer inherits it from a parent section. */}
      <div ref={railRef} style={{ position: "sticky", top: navHeight, zIndex: 60, pointerEvents: "none" }}>
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, background: "transparent", pointerEvents: "auto" }}
        />

        {/* Desktop: two-line chips. Framed exactly like the nav band's own content column,
            so the rail lines up with it at every width. */}
        <div className="hidden wide:block" style={{ position: "relative", pointerEvents: "auto", maxWidth: "var(--sw)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "stretch",
              justifyContent: "center",
              gap: "clamp(3px,0.5vw,6px)",
              padding: "16px 0 11px",
            }}
          >
            {TABS.map((tab, i) => (
              <DesktopDayChip key={String(tab.key)} tab={tab} i={i} on={pick === tab.key} onPick={onPick} />
            ))}
          </div>
        </div>

        {/* Mobile: one line, dates only, whole three-letter weekdays, 44px touch targets.
            The row is framed by the same `--gutter` every section uses, so the chips can never
            run wider than the content column beside them — and `nowrap` with no `overflow-x`
            means a chip that did not fit would be visibly clipped rather than quietly
            scrollable. That is deliberate: it makes an overflow impossible to miss. The clamps
            in `DayChip` are sized so it cannot happen down to 320px. */}
        <div
          className="flex wide:hidden"
          style={{
            position: "relative",
            pointerEvents: "auto",
            flexWrap: "nowrap",
            justifyContent: "center",
            gap: "clamp(2px,0.6vw,7px)",
            maxWidth: "var(--sw)",
            margin: "0 auto",
            /* A tighter gutter than the sections use, and the one place on the page that takes
               one. A control bar is not a column of prose: at 320px the section gutter left
               seven six-character chips about 3.9px of side padding each, which is the whole
               row reading as cramped. Pulling 24px back to 10px buys 28px of budget and spends
               all of it inside the chips. It resolves back to the section gutter by 800px, so
               the two only differ where the difference pays for something. */
            padding: "16px clamp(10px,3vw,24px) 11px",
          }}
        >
          {TABS.map((tab, i) => (
            <MobileDayChip key={String(tab.key)} tab={tab} i={i} on={pick === tab.key} onPick={onPick} />
          ))}
        </div>
      </div>
    </>
  );
}
