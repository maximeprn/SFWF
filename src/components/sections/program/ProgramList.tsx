"use client";

import { Fragment, useMemo, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { DAYS } from "@/content/events";
import { PHOTOS } from "@/content/photos";
import { EventBubble } from "./EventBubble";

/** The opening gala starts open, so the screen shows what an opened bubble looks like. */
const INITIAL_OPEN = "opening-gala";

/** A photo only earns its space on ticketed events, galas, and the closing. */
const deservesPhoto = (tier: string, title: string, hasCrawl: boolean) =>
  !hasCrawl && (tier === "paid" || /closing/i.test(title));

export function ProgramList() {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set([INITIAL_OPEN]));
  // The coach mark is a one-time thing: it retires the moment the gesture is used.
  const [hinted, setHinted] = useState(false);

  const toggle = (id: string) => {
    setHinted(true);
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** The first still-closed bubble is what the arrow points at. */
  const hintId = useMemo(() => {
    for (const day of DAYS) {
      for (const event of day.events) {
        if (!open.has(event.id)) return event.id;
      }
    }
    return null;
  }, [open]);

  return (
    <div
      style={{
        padding: "var(--gap) var(--gutter) 44px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sec-program)",
      }}
    >
      {DAYS.map((day, di) => (
        <section key={day.id}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <h2
              style={{
                margin: 0,
                font: "var(--display-3)",
                color: "var(--mark)",
                whiteSpace: "nowrap",
                textShadow: "var(--text-shadow-on-dye)",
              }}
            >
              {day.date}
            </h2>
            <span
              style={{
                font: "var(--text-eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--on-bg-soft)",
                whiteSpace: "nowrap",
                textShadow: "var(--text-shadow-on-dye)",
              }}
            >
              {day.venue}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, position: "relative" }}>
            {day.events.map((event, ei) => {
              const isOpen = open.has(event.id);
              return (
                <Fragment key={event.id}>
                  <EventBubble
                    event={event}
                    shape={di + ei}
                    isOpen={isOpen}
                    onToggle={() => toggle(event.id)}
                    showHint={!hinted && event.id === hintId}
                  />
                  {isOpen && deservesPhoto(event.tier, event.title, Boolean(event.crawl)) && (
                    <Photo
                      i={ei + 1}
                      src={PHOTOS[(di + ei) % PHOTOS.length]!.src}
                      alt={PHOTOS[(di + ei) % PHOTOS.length]!.caption}
                      h={196}
                      reveal
                      style={{ flex: "1 1 100%" }}
                      sizes="(min-width: 900px) 1100px, 100vw"
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
      ))}

      <p style={{ margin: 0, textAlign: "center", font: "var(--display-4)", color: "var(--on-bg-soft)", textShadow: "var(--text-shadow-on-dye)" }}>
        More to be announced…
      </p>
    </div>
  );
}
