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
 * One day: a drawn rule, the date, the day name beside its doodle marker, then the grid.
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 5,
          margin: "0 0 clamp(16px,2.2vw,22px)",
        }}
      >
        <p
          className="mono"
          style={{ margin: 0, fontSize: 10, letterSpacing: ".2em", color: "var(--beige)" }}
        >
          {day.date}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2
            style={{
              margin: 0,
              font: "400 clamp(18px,2.2vw,22px)/1.16 var(--font-display)",
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
            style={{ width: day.iconWidth, height: "auto", flex: "none" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
          gap: 12,
          alignItems: "start",
          maxWidth: "calc(var(--sw) - 148px)",
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
