"use client";

import { Ring } from "@/components/ui/Ring";
import { Slab } from "@/components/ui/Slab";
import { DAYS } from "@/content/events";
import { soft } from "@/lib/design/shapes";

export type DayPick = "all" | number;

export interface Tab {
  readonly key: DayPick;
  readonly date: string;
  readonly weekday: string;
  readonly short: string;
}

/* The mobile chip carries the weekday whole — `WED 26`, not `WE 26`. The two-letter cut was
   how seven chips used to fit a 320px phone; the room now comes from the padding and tracking
   clamps instead, which buys back more than the extra glyph costs and leaves every chip wider
   than it was. `short` differs from `date` on the summary chip alone.

   The desktop chip stacks the same two facts mono instead of pairing a kicker date with a
   script name: `date` on top, the weekday spelled out in full below. `longWeekday` already
   exists for the sticky day header and carries the month too (`Thursday 27 August`); only its
   first word is wanted here. The summary chip has no second fact to stack, so `weekday` is
   empty there and the chip stays one line. */
export const TABS: readonly Tab[] = [
  { key: "all", date: "ALL SIX DAYS", weekday: "", short: "ALL" },
  ...DAYS.map((day, i) => ({
    key: i as DayPick,
    date: day.date,
    weekday: day.longWeekday.split(" ")[0]!.toUpperCase(),
    short: day.weekday,
  })),
];

/**
 * The press rules the two chips share. Scoped here rather than in `globals.css` because
 * nothing else on the site needs them: every other button travels as itself, and this is the
 * one control where the surface that moves is not the element the press system is bound to.
 */
export function DayChipStyles() {
  return (
      <style>{`
        @media (hover: hover) {
          .day-chip:hover .day-chip-d { color: var(--orange-on-light); }
          .day-chip:hover .day-chip-n { color: var(--button-ink); }
          .day-chip-m:hover { color: var(--orange-on-light); }
        }

        /* Every chip stands on its own drawn side, the same construction as every other button
           on the site — and the picked one is that button held down. It travels the side's exact
           height, so the side is spent and the bottom edge does not move: which day is chosen
           reads as a key pressed in, not as a colour swap alone, and the other six stand up.

           The face travels, not the button. On a phone the button is a 44px touch target around
           a smaller chip, so moving the button would carry invisible padding down and leave the
           side behind — \`.press-btn\`'s own travel is cancelled here for that reason. Everything
           else the shared press system does, for pointer, touch and keyboard alike, is untouched.

           The two timings are the shared system's own: 70ms down so it feels immediate under a
           finger, 160ms up so it rises rather than snaps. A chip released into the picked state
           simply stays where the press already put it. */
        button.day-chip-btn.pressed { transform: none; }
        .day-chip-face {
          transition: transform 0.16s cubic-bezier(0.2, 0.8, 0.3, 1), color var(--hover);
        }
        .day-chip-btn.pressed .day-chip-face {
          transition: transform 0.07s cubic-bezier(0.3, 0.9, 0.4, 1), color var(--hover);
        }
        .day-chip-face[data-on="true"],
        .day-chip-btn.pressed .day-chip-face { transform: translateY(var(--raise)); }

        @media (prefers-reduced-motion: reduce) {
          .day-chip-face { transition: none; }
        }
      `}</style>
  );
}

interface ChipProps {
  readonly tab: Tab;
  /** Position in the rail, which is also the chip's shape — see `soft`. */
  readonly i: number;
  readonly on: boolean;
  readonly onPick: (day: DayPick) => void;
}

/** Desktop: two mono lines, the date over the weekday spelled out. */
export function DesktopDayChip({ tab, i, on, onPick }: ChipProps) {
  return (
        <button
          key={String(tab.key)}
          type="button"
          onClick={() => onPick(tab.key)}
          aria-pressed={on}
          className={"press-btn day-chip-btn" + (on ? "" : " day-chip")}
          style={{ flex: "none", display: "flex", padding: 0, background: "transparent", border: 0, cursor: "pointer", textAlign: "center" }}
        >
          <Slab shapeIndex={i} style={{ display: "flex", width: "100%" }}>
            <span
              className="day-chip-face"
              data-on={on}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxSizing: "border-box",
                width: "100%",
                background: on ? "var(--orange)" : "var(--beige)",
                padding: on ? "6px clamp(11px,1.8vw,22px) 8px" : "6px clamp(10px,1.6vw,19px) 8px",
                clipPath: soft(i),
              }}
            >
              {tab.weekday && (
                <span
                  className="mono day-chip-n"
                  style={{
                    fontSize: "clamp(7.4px,0.9vw,10.5px)",
                    letterSpacing: "clamp(.06em,0.09vw,.14em)",
                    whiteSpace: "nowrap",
                    color: on ? "var(--button-ink)" : "var(--ink-body)",
                    transition: "color var(--hover)",
                  }}
                >
                  {tab.weekday}
                </span>
              )}
              <span
                className="mono day-chip-d"
                style={{
                  marginTop: tab.weekday ? 1 : 0,
                  fontSize: "clamp(11px,1.3vw,15px)",
                  fontWeight: 700,
                  letterSpacing: "clamp(.02em,0.05vw,.06em)",
                  whiteSpace: "nowrap",
                  color: on ? "var(--button-ink)" : "var(--ink-title)",
                  transition: "color var(--hover)",
                }}
              >
                {tab.date}
              </span>
              <Ring shapeIndex={i} weight="calc(var(--bubble-edge) / 2)" />
            </span>
          </Slab>
        </button>
  );
}

/** Mobile: one line, dates only, inside a 44px touch target. */
export function MobileDayChip({ tab, i, on, onPick }: ChipProps) {
  return (
        <button
          key={String(tab.key)}
          type="button"
          onClick={() => onPick(tab.key)}
          aria-pressed={on}
          className="press-btn day-chip-btn"
          /* Grows to fill the column rather than sitting centred with slack either side.
             Spreading the *gaps* instead would leave seven small chips adrift at the top
             of this range, where the column is 811px wide; growing the chips puts that
             width into the tap target, which is where it is worth something. */
          style={{ flex: "1 1 auto", minWidth: 0, display: "flex", alignItems: "center", minHeight: 44, padding: 0, background: "transparent", border: 0, cursor: "pointer" }}
        >
          <Slab shapeIndex={i} style={{ display: "block", width: "100%" }}>
            <span
              className={"mono day-chip-face" + (on ? "" : " day-chip-m")}
              data-on={on}
              style={{
                position: "relative",
                display: "block",
                width: "100%",
                textAlign: "center",
                boxSizing: "border-box",
                background: on ? "var(--orange)" : "var(--beige)",
                color: on ? "var(--button-ink)" : "var(--ink-body)",
                /* The extra glyph is paid for at the narrow end and only there: the vw
                   terms on tracking and side padding are cut back, which frees more width
                   at 320px than `WED` costs over `WE`. The ceilings go *up* in exchange,
                   so anything above ~430px draws a larger chip than the two-letter version
                   ever did.

                   Readability is the floor that does not move. Seven six-character chips
                   inside a 272px column at 320px is a hard budget, and the type is the last
                   thing to give — so the width is bought from the two things that are not
                   type. Side padding goes first, then the space between weekday and number:
                   a monospace space takes a full advance, the same width as `W`, to separate
                   letters from digits that are already unmistakable, which makes it the
                   cheapest width on the row.

                   Vertical padding is deliberately *not* part of that trade. It buys no
                   width at all, and the 44px target lives on the button rather than on the
                   chip, so trimming it would cost proportion and return nothing.

                   An offset ramp, not a bare vw term. A bare `2vw` sits pinned on its 9px
                   floor until ~450px, which is most of the phone range — so every width
                   between 320 and 450 was reading at the minimum size while its spare room
                   grew to 66px and went unused. This starts at 9px where the row is
                   genuinely tight and reaches the cap by the breakpoint. */
                fontSize: on
                  ? "clamp(9px,calc(0.58vw + 7.3px),12.5px)"
                  : "clamp(9px,calc(0.56vw + 7.2px),12px)",
                /* The one legibility gain that costs no width: a monospace face holds the
                   same advance at every weight, so this is free against the budget above.
                   Meta lines elsewhere in the product are 400 — this is heavier because it
                   is a control set near its own size floor, not a line of copy. */
                fontWeight: 600,
                letterSpacing: "clamp(.01em,0.06vw,.1em)",
                wordSpacing: "-0.22em",
                whiteSpace: "nowrap",
                padding: on
                  ? "clamp(8px,2.4vw,13px) clamp(4.5px,calc(2vw - 1.7px),16px) clamp(9px,2.6vw,14px)"
                  : "clamp(8px,2.4vw,13px) clamp(4px,calc(1.9vw - 1.6px),15px) clamp(9px,2.6vw,14px)",
                clipPath: soft(i),
              }}
            >
              {tab.short}
              <Ring shapeIndex={i} weight="calc(var(--bubble-edge) / 2)" />
            </span>
          </Slab>
        </button>
  );
}
