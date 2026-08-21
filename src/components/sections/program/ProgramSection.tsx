"use client";

import { useRef } from "react";
import { ALL_EVENTS, DAYS } from "@/content/events";
import { foldInner, foldStyle } from "@/lib/program/heroFold";
import { useBubbleReveal } from "@/lib/program/useBubbleReveal";
import { useDayHero } from "@/lib/program/useDayHero";
import { swapStyle, useDaySwap } from "@/lib/program/useDaySwap";
import { useProgramContentMask } from "@/lib/program/useProgramContentMask";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { DayFilter, DayFilterIllustration, type DayPick } from "./DayFilter";
import { DaySection } from "./DaySection";

const FRAME = {
  maxWidth: "var(--sw)",
  margin: "0 auto",
} as const;

/**
 * The programme. Six days, sixteen gatherings, a filter, and nothing for sale anywhere in
 * it — every action is an Instagram DM to the venue hosting that event.
 *
 * The filter sets what is open. Across the whole week every bubble is shut, because sixteen
 * open ones is a wall of text and the closed chip is the scannable thing. Narrow to a single
 * day and that day arrives already open — picking a day is asking to read it, and making
 * someone tap four more times to do that is the site arguing with them. Taps still work
 * either way; the next pick just takes the view back.
 *
 * Picking a day also folds the week's hero away and lands the pick directly under the chip
 * rail, which by then is pinned under the nav — see `useDayHero` and
 * `design_handoff_day_selector/README.md`. The content below the rail carries its own mask,
 * measured against the rail's real height rather than the sitewide nav-only band.
 */
export function ProgramSection() {
  const { pick, onPick: pickDay, heroOpen, anchorRef, railRef, heroRef } = useDayHero();
  const { phases, toggle, showOpen } = useBubbleReveal();
  const reduced = usePrefersReducedMotion();
  const heroMaskRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  /* Two regions, masked around the rail rather than across it — see `useProgramContentMask`.
     The hero clears the nav alone; the content below clears the nav plus the rail. */
  useProgramContentMask(heroMaskRef);
  useProgramContentMask(maskRef, railRef);

  /* Opening the arriving day's bubbles belongs to the swap, not to the click — it is a change
     of content, so it waits behind the fade with the rest of them. */
  const { showing, lit, swapTo } = useDaySwap(reduced, (day) =>
    showOpen(day === "all" ? [] : DAYS[day]!.events.map((event) => event.id)),
  );

  /* One click, two clocks. The rail is set to `pick` on the frame of the click and so is
     everything that answers it; the list below is showing `showing`, the same day one fade
     later — see `useDaySwap`. */
  const onPick = (day: DayPick) => {
    pickDay(day);
    swapTo(day);
  };

  const shown = showing === "all" ? DAYS : [DAYS[showing]!];
  /* On a single day the date says enough; the count is a summary of the whole week. */
  const count =
    showing === "all"
      ? `${ALL_EVENTS.length} GATHERINGS · SIX DAYS`
      : DAYS[showing]!.longWeekday.toUpperCase();

  return (
    <>
      {/* The headline is back. It was taken out when this was a one-pager, where it landed
          directly under "ani sang Siargao" — two script headlines in a row, and a second h1
          on a document that already had one. The reason it gave for going was that it is the
          Program *page's* h1, and this is now that page: without it the route had no heading
          element at all, only the six day names. */}
      <section ref={heroMaskRef} style={{ ...FRAME, padding: "var(--page-top) var(--gutter) 0", textAlign: "center" }}>
        {/* Everything in here collapses on a pick, and it is all above the anchor — so its
            height is exactly what the landing has to subtract to aim straight. */}
        <div ref={heroRef}>
          <div style={foldStyle(heroOpen, reduced)}>
            <div style={foldInner}>
              <h1
                style={{
                  margin: "0 auto",
                  maxWidth: "16em",
                  font: "400 clamp(30px,7vw,74px)/1.1 var(--font-display)",
                  color: "var(--orange)",
                  textWrap: "pretty",
                }}
              >
                the six-day journey
              </h1>
              <p
                style={{
                  /* Above the handoff's 16px ceiling on purpose: this is the only prose on the
                     page and the one instruction anybody has to read, and at 16px on a 1180px
                     frame it read as a caption. It keeps climbing to 20px at 1240px, where 32em
                     is 640px of line — still inside the 660px the design caps centred prose at.
                     The measure is per block now; there is no --tm, because a `ch` cap grew this
                     column every time the type did. */
                  /* The script's descenders reach a long way below its baseline — "journey" hangs
                     into whatever follows it — so this gap has to clear the letterform, not the
                     line box. */
                  margin: "clamp(22px,2.6vw,38px) auto 0",
                  maxWidth: "32em",
                  font: "400 clamp(15.5px,0.72vw + 11.1px,20px)/1.66 var(--font-body)",
                  color: "var(--beige)",
                  textWrap: "pretty",
                }}
              >
                Tap any gathering to see who is cooking and how to get in.{" "}
                {/* The emphasis is the shimmer: the sentence sits whiter than the copy around it
                    and a greyer band passes through it. It replaced a drawn underline, which is
                    also why this is not bold — the sentence needs one mark, and weight on top of
                    a moving one made it shout twice.
                    `<strong>` still carries the meaning for a screen reader, which is what the
                    element is for. Speed, band width and both colours are custom properties on
                    `.shimmer` in globals.css. */}
                <strong className="shimmer" style={{ fontWeight: 400 }}>
                  Every reservation is made with the venue itself.
                </strong>
              </p>
            </div>
          </div>
          <DayFilterIllustration heroOpen={heroOpen} />
        </div>
      </section>

      {/* The rail sits here, outside the hero section, because a sticky element stops being
          pinned the moment its own parent has scrolled past — see `DayFilter`. */}
      <DayFilter pick={pick} onPick={onPick} railRef={railRef} />

      {/* Everything below the rail carries its own mask — see `useProgramContentMask` — so
          it dissolves before it reaches the sticky rail rather than sliding behind it. */}
      <div ref={maskRef}>
        <section style={{ ...FRAME, padding: "clamp(30px,4vw,46px) var(--gutter) 0" }}>
          <div ref={anchorRef} aria-hidden="true" />
          <div style={foldStyle(heroOpen, reduced)}>
            <div style={foldInner}>
              <p
                className="mono"
                style={{
                  margin: "0 0 8px",
                  fontSize: 11.5,
                  letterSpacing: ".2em",
                  color: "var(--beige)",
                }}
              >
                {count}
              </p>
            </div>
          </div>
          {/* The one wrapper the swap needs: the days fade as a block, so the closing line
              below them — which never changes on a pick — is left alone. */}
          <div style={swapStyle(lit, reduced)}>
            {shown.map((day) => (
              <DaySection
                key={day.id}
                day={day}
                dayIndex={DAYS.indexOf(day)}
                phases={phases}
                onToggle={toggle}
              />
            ))}
          </div>
        </section>

        <section style={{ ...FRAME, padding: "clamp(44px,6vw,72px) var(--gutter) 0", textAlign: "center" }}>
          <p
            style={{
              margin: "0 auto",
              maxWidth: "24em",
              font: "400 clamp(24px,3.4vw,32px)/1.24 var(--font-display)",
              color: "var(--beige)",
              textWrap: "pretty",
            }}
          >
            The festival sells nothing. Every table is booked with the people cooking at it.
          </p>
        </section>
      </div>
    </>
  );
}
