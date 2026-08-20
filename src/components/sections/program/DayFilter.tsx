"use client";

import Image from "next/image";
import { useLayoutEffect, useState, type RefObject } from "react";
import { Ring } from "@/components/ui/Ring";
import { DAYS } from "@/content/events";
import { foldInner, foldStyle } from "@/lib/program/heroFold";
import { soft } from "@/lib/design/shapes";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export type DayPick = "all" | number;

interface Tab {
  readonly key: DayPick;
  readonly date: string;
  readonly short: string;
  readonly name: string;
}

/** `WED 26` → `WE 26` — the weekday cut to two letters, which is what makes seven chips fit
 * a 320px phone. */
const shortDate = (weekday: string): string => weekday.replace(/^(\w{2})\w/, "$1");

const TABS: readonly Tab[] = [
  { key: "all", date: "ALL SIX DAYS", short: "ALL", name: "" },
  ...DAYS.map((day, i) => ({
    key: i as DayPick,
    date: day.weekday,
    short: shortDate(day.weekday),
    name: day.name,
  })),
];

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
 * The picked chip is orange with near-black ink; every other chip is cream, and only those
 * darken their ink on hover — done here with a scoped `<style>` rather than a shared class,
 * since nothing else on the site needs this exact rule.
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
      <style>{`
        @media (hover: hover) {
          .day-chip:hover .day-chip-d { color: var(--orange-on-light); }
          .day-chip:hover .day-chip-n { color: var(--button-ink); }
          .day-chip-m:hover { color: var(--orange-on-light); }
        }
      `}</style>

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
            {TABS.map((tab, i) => {
              const on = pick === tab.key;
              return (
                <button
                  key={String(tab.key)}
                  type="button"
                  onClick={() => onPick(tab.key)}
                  aria-pressed={on}
                  className={on ? undefined : "day-chip"}
                  style={{ flex: "none", display: "flex", padding: 0, background: "transparent", border: 0, cursor: "pointer", textAlign: "center" }}
                >
                  <span
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      boxSizing: "border-box",
                      width: "100%",
                      background: on ? "var(--orange)" : "var(--beige)",
                      padding: on ? "6px clamp(6px,1vw,13px) 8px" : "6px clamp(5px,0.8vw,10px) 8px",
                      clipPath: soft(i),
                    }}
                  >
                    <span
                      className="mono day-chip-d"
                      style={{
                        fontSize: tab.key === "all" ? "clamp(9.5px,1vw,12px)" : "clamp(7.4px,0.78vw,8.5px)",
                        letterSpacing: "clamp(.06em,0.09vw,.14em)",
                        whiteSpace: "nowrap",
                        color: on ? "var(--button-ink)" : "var(--ink-body)",
                        transition: "color var(--hover)",
                      }}
                    >
                      {tab.date}
                    </span>
                    {tab.name && (
                      <span
                        className="day-chip-n"
                        style={{
                          marginTop: 1,
                          font: "400 clamp(11.5px,1.1vw,15px)/1.1 var(--font-display)",
                          whiteSpace: "nowrap",
                          color: on ? "var(--button-ink)" : "var(--ink-title)",
                          transition: "color var(--hover)",
                        }}
                      >
                        {tab.name}
                      </span>
                    )}
                    <Ring shapeIndex={i} weight="calc(var(--bubble-edge) / 2)" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: one line, dates only, two-letter weekdays, 44px touch targets. */}
        <div
          className="flex wide:hidden"
          style={{
            position: "relative",
            pointerEvents: "auto",
            flexWrap: "nowrap",
            justifyContent: "center",
            gap: "clamp(2px,0.9vw,7px)",
            maxWidth: "var(--sw)",
            margin: "0 auto",
            padding: "16px var(--gutter) 11px",
          }}
        >
          {TABS.map((tab, i) => {
            const on = pick === tab.key;
            return (
              <button
                key={String(tab.key)}
                type="button"
                onClick={() => onPick(tab.key)}
                aria-pressed={on}
                style={{ flex: "none", display: "flex", alignItems: "center", minHeight: 44, padding: 0, background: "transparent", border: 0, cursor: "pointer" }}
              >
                <span
                  className={"mono" + (on ? "" : " day-chip-m")}
                  style={{
                    position: "relative",
                    display: "block",
                    boxSizing: "border-box",
                    background: on ? "var(--orange)" : "var(--beige)",
                    color: on ? "var(--button-ink)" : "var(--ink-body)",
                    fontSize: on ? "clamp(7.5px,2.05vw,11px)" : "clamp(7.5px,2vw,10.5px)",
                    letterSpacing: "clamp(.01em,0.16vw,.1em)",
                    whiteSpace: "nowrap",
                    padding: on
                      ? "clamp(8px,2.4vw,11px) clamp(5px,2vw,15px) clamp(9px,2.6vw,12px)"
                      : "clamp(8px,2.4vw,11px) clamp(4px,1.9vw,14px) clamp(9px,2.6vw,12px)",
                    clipPath: soft(i),
                    transition: "color var(--hover)",
                  }}
                >
                  {tab.short}
                  <Ring shapeIndex={i} weight="calc(var(--bubble-edge) / 2)" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
