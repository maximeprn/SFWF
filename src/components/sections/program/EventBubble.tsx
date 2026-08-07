"use client";

import { Bubble } from "@/components/ui/Bubble";
import { Cta } from "@/components/ui/Cta";
import { TIER_LABEL } from "@/content/events";
import type { FestivalEvent } from "@/content/types";
import { TapHint } from "./TapHint";

const TIER_STYLE = {
  free: { background: "var(--chip-free)", color: "var(--chip-free-ink)" },
  paid: { background: "var(--chip-paid)", color: "var(--chip-paid-ink)" },
  allWeek: { background: "var(--chip-paid)", color: "var(--chip-paid-ink)" },
} as const;

/**
 * One event. Closed, it is a chip the width of its own title; open, it takes the full row
 * and grows its detail in. Bubbles open independently — tapping one never closes another,
 * because a visitor comparing two dinners should be able to hold both open.
 */
export function EventBubble({
  event,
  shape,
  isOpen,
  onToggle,
  showHint,
}: {
  readonly event: FestivalEvent;
  readonly shape: number;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly showHint: boolean;
}) {
  const tier = TIER_STYLE[event.tier];

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        minWidth: 0,
        flex: isOpen ? "1 1 100%" : "0 1 auto",
        maxWidth: "100%",
      }}
    >
      <Bubble
        i={shape}
        onClick={onToggle}
        style={{
          flex: "1 1 auto",
          maxWidth: "100%",
          minWidth: 0,
          padding: isOpen ? "26px 30px" : "14px 24px",
          transition: `padding var(--open) var(--ease)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "nowrap" }}>
          <span
            style={{
              font: isOpen ? "var(--display-4)" : "var(--text-h3)",
              fontWeight: isOpen ? 400 : undefined,
              color: "var(--bubble-ink)",
              flex: "1 1 auto",
              minWidth: 0,
            }}
          >
            {event.title}
          </span>
          <span
            style={{
              font: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              padding: "4px 9px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              flexShrink: 0,
              ...tier,
            }}
          >
            {TIER_LABEL[event.tier]}
          </span>
        </div>

        {isOpen && (
          <div style={{ marginTop: 11, animation: `bodyIn .22s var(--ease) .03s both` }}>
            <p
              style={{
                margin: 0,
                font: "var(--text-caption)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--bubble-soft)",
              }}
            >
              {event.venue}
            </p>
            <p style={{ margin: "8px 0 0", font: "var(--text-body-sm)", color: "var(--bubble-soft)" }}>
              {event.blurb}
            </p>
            {event.credit && (
              <p
                style={{
                  margin: "8px 0 0",
                  font: "var(--text-caption)",
                  fontWeight: 700,
                  fontSize: 10,
                  color: "var(--bubble-soft)",
                }}
              >
                {event.credit}
              </p>
            )}
            {event.crawl && (
              <Cta
                i={shape}
                variant="secondary"
                style={{ marginTop: 16 }}
                href={`/food-crawl/${event.crawl}`}
                label={`See the ${event.crawl === "coffee" ? "Coffee Crawl" : "Karinderya Crawl"}`}
              />
            )}
          </div>
        )}
      </Bubble>
      {showHint && <TapHint />}
    </div>
  );
}
