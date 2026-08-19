"use client";

import { useState } from "react";
import { ALL_EVENTS, DAYS } from "@/content/events";
import { useBubbleReveal } from "@/lib/program/useBubbleReveal";
import { DayFilter, type DayPick } from "./DayFilter";
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
 */
export function ProgramSection() {
  const [pick, setPick] = useState<DayPick>("all");
  const { phases, toggle, showOpen } = useBubbleReveal();

  const onPick = (day: DayPick) => {
    setPick(day);
    showOpen(day === "all" ? [] : DAYS[day]!.events.map((event) => event.id));
  };

  const shown = pick === "all" ? DAYS : [DAYS[pick]!];
  /* On a single day the date says enough; the count is a summary of the whole week. */
  const count =
    pick === "all"
      ? `${ALL_EVENTS.length} GATHERINGS · SIX DAYS`
      : DAYS[pick]!.longWeekday.toUpperCase();

  return (
    <>
      {/* The headline is back. It was taken out when this was a one-pager, where it landed
          directly under "ani sang Siargao" — two script headlines in a row, and a second h1
          on a document that already had one. The reason it gave for going was that it is the
          Program *page's* h1, and this is now that page: without it the route had no heading
          element at all, only the six day names. */}
      <section style={{ ...FRAME, padding: "var(--page-top) var(--gutter) 0", textAlign: "center" }}>
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
          {/* Orange, at the festival's request. It is 2.73:1 on the violet where the beige
              around it is 7.28:1 — the same trade already made knowingly for the big script
              headline and for the place name in an open bubble. The sentence is not the only
              place this is said: the closing line repeats it, and every booking button names
              its venue. */}
          <strong style={{ fontWeight: 700, color: "var(--orange)" }}>
            Every reservation is made with the venue itself.
          </strong>
        </p>
        <DayFilter pick={pick} onPick={onPick} />
      </section>

      <section style={{ ...FRAME, padding: "clamp(30px,4vw,46px) var(--gutter) 0" }}>
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
    </>
  );
}
