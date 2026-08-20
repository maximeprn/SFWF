"use client";

import Image from "next/image";
import { WobbleRule } from "@/components/ui/Wobble";
import type { FestivalDay } from "@/content/types";
import { bubbleShape, buttonShape } from "@/lib/design/shapes";
import type { Phase } from "@/lib/program/useBubbleReveal";
import { EventBubble } from "./EventBubble";

/** Every doodle's own pixel size, so next/image can reserve the box before it loads. */
const DOODLE_SIZE: Record<string, readonly [number, number]> = {
  wine: [420, 315],
  fish: [420, 207],
  coconut: [420, 405],
  dish: [420, 406],
  ukulele: [420, 688],
  flower: [420, 812],
};

/**
 * One day: a drawn rule, the date, then the day name beside its doodle marker, then the grid.
 *
 * The date sits on its own line above the name rather than beside it. Set inline, a 12px
 * mono date and a 30px script name are two different registers sharing one baseline, and
 * the eye reads them as one run of text; stacked, the date is a label and the name is the
 * heading it labels.
 *
 * The rule is a hand-drawn path, never a `border-top` — that is the tell that a section was
 * built wrong. The doodles are day markers now, punctuating a heading rather than drifting
 * beside prose, which is why they are shown at every width.
 */
export function DaySection({
  day,
  dayIndex,
  phases,
  onToggle,
}: {
  readonly day: FestivalDay;
  readonly dayIndex: number;
  readonly phases: Readonly<Record<string, Phase>>;
  readonly onToggle: (key: string) => void;
}) {
  const [w, h] = DOODLE_SIZE[day.icon]!;

  return (
    <div style={{ padding: "clamp(22px,3vw,32px) 0 clamp(14px,2vw,20px)" }}>
      <WobbleRule style={{ margin: "0 0 clamp(22px,3vw,32px)" }} />

      <div style={{ margin: "0 0 clamp(32px,4.4vw,44px)" }}>
        <p
          className="mono"
          style={{ margin: "0 0 6px", fontSize: 12, letterSpacing: ".2em", color: "var(--beige)" }}
        >
          {day.date}
        </p>
        {/* The marker stays on the name's own line — it punctuates the heading, and dropped
            to a third line it would read as an illustration sitting under one.

            It is positioned rather than laid out beside the name, so the row measures the
            script line and nothing else. The doodles are portrait and their widths are the
            festival's own: at 20px wide the flower stands 39px tall against a 30px line, and
            in flow it grew the row and pushed the name down with it. That put the gap under
            the date at 6px on `ocean day` and 10px on `closing celebration` — six headings
            on six different rhythms. Out of flow, every one of them is 6px. */}
        <div style={{ position: "relative", width: "fit-content" }}>
          <h2
            style={{
              margin: 0,
              font: "400 clamp(26px,3.4vw,30px)/1.15 var(--font-display)",
              color: "var(--beige)",
            }}
          >
            {day.name}
          </h2>
          <Image
            src={`/doodles/beige/${day.icon}.png`}
            alt=""
            width={w}
            height={h}
            style={{
              position: "absolute",
              left: "100%",
              top: "50%",
              transform: "translateY(-50%)",
              marginLeft: 16,
              width: day.iconWidth,
              height: "auto",
              maxWidth: "none",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          /* Two up at the full frame, and no cap on the grid itself: the 440px cap on each
             bubble is what holds the row, so every gathering draws the same width whether
             its day has one or four. A grid narrow enough to make the tracks land on 440
             would only reintroduce the difference, because a collapsed auto-fit track hands
             a lone bubble the whole row.
             At the old 280px minimum this drew four columns of 249px, and the type below
             was rebuilt at sizes that column cannot hold — a 21px open title wants the
             380px this one gives it. */
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))",
          gap: 12,
          alignItems: "start",
        }}
      >
        {day.events.map((event, eventIndex) => (
          <EventBubble
            key={event.id}
            event={event}
            phase={phases[event.id]}
            shapeIndex={bubbleShape(eventIndex, dayIndex)}
            buttonShapeIndex={buttonShape(dayIndex, eventIndex)}
            onToggle={() => onToggle(event.id)}
          />
        ))}
      </div>
    </div>
  );
}
