"use client";

import { useState } from "react";
import { ALL_EVENTS, DAYS } from "@/content/events";
import { useBubbleReveal } from "@/lib/program/useBubbleReveal";
import { DayFilter, type DayPick } from "./DayFilter";
import { DaySection } from "./DaySection";

const FRAME = {
  maxWidth: "calc(var(--sw) - 60px)",
  margin: "0 auto",
} as const;

/**
 * The programme. Six days, sixteen gatherings, a filter, and nothing for sale anywhere in
 * it — every action is an Instagram DM to the venue hosting that event.
 *
 * Filtering does not reset which bubbles are open: the state is keyed by event id, so a
 * gathering you opened is still open when you come back to its day.
 */
export function ProgramSection() {
  const [pick, setPick] = useState<DayPick>("all");
  const { phases, toggle } = useBubbleReveal();

  const shown = pick === "all" ? DAYS : [DAYS[pick]!];
  /* On a single day the date says enough; the count is a summary of the whole week. */
  const count =
    pick === "all"
      ? `${ALL_EVENTS.length} GATHERINGS · SIX DAYS`
      : DAYS[pick]!.longWeekday.toUpperCase();

  return (
    <>
      {/* No "the six-day journey" headline here. It is the Program *page's* h1, and on a
          single page it lands directly under "ani sang Siargao" — two script headlines in a
          row, and a second h1 on a document that already has one. The standfirst carries the
          instruction on its own; the dateline above already says how long the week is. */}
      <section style={{ ...FRAME, padding: "clamp(28px,4vw,46px) var(--gutter-program) 0", textAlign: "center" }}>
        <p
          style={{
            margin: "0 auto",
            maxWidth: "calc(var(--tm) - 8ch)",
            font: "400 clamp(12.8px,0.19vw + 12.1px,14.5px)/1.66 var(--font-body)",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          Tap any gathering to see who is cooking and how to get in. Every reservation is
          made with the venue itself.
        </p>
      </section>

      <section style={{ ...FRAME, padding: "clamp(22px,3.2vw,34px) var(--gutter-program) 0" }}>
        <DayFilter pick={pick} onPick={setPick} />
        <p
          className="mono"
          style={{
            margin: "clamp(26px,3.4vw,38px) 0 0",
            fontSize: 10,
            letterSpacing: ".2em",
            color: "var(--beige)",
          }}
        >
          {count}
        </p>
      </section>

      <section style={{ ...FRAME, padding: "clamp(14px,2vw,20px) var(--gutter-program) 0" }}>
        {shown.map((day) => (
          <DaySection
            key={day.id}
            day={day}
            dayIndex={DAYS.indexOf(day)}
            phases={phases}
            onToggle={toggle}
          />
        ))}
      </section>

      <section style={{ ...FRAME, padding: "clamp(30px,4vw,46px) var(--gutter-program) 0", textAlign: "center" }}>
        <p
          style={{
            margin: "0 auto",
            maxWidth: "24em",
            font: "400 clamp(19px,2.4vw,25px)/1.28 var(--font-display)",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          The festival sells nothing. Every table is booked with the people cooking at it.
        </p>
      </section>
    </>
  );
}
