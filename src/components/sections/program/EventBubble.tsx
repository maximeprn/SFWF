"use client";

import type { FestivalEvent } from "@/content/types";
import { soft } from "@/lib/design/shapes";
import type { Phase } from "@/lib/program/useBubbleReveal";
import { AccessMark } from "./AccessMark";
import { BubbleDetail } from "./BubbleDetail";

/**
 * One gathering. Closed it is a scannable chip — venue, time, title, how you get in. Open
 * it reflows rather than merely disclosing: the title grows into the space the kicker
 * leaves, and the venue joins the time and price on a single hint line below.
 *
 * Opening adds height and never width. The bubble keeps its grid column and its 440px cap
 * either way, so a day of one gathering reads the same as a day of four.
 */
export function EventBubble({
  event,
  phase,
  shapeIndex,
  buttonShapeIndex,
  onToggle,
}: {
  readonly event: FestivalEvent;
  readonly phase: Phase | undefined;
  readonly shapeIndex: number;
  readonly buttonShapeIndex: number;
  readonly onToggle: () => void;
}) {
  const open = phase !== undefined;
  const grown = phase === "open";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        /* Space would scroll the page and Enter would submit anything wrapping this. */
        e.preventDefault();
        onToggle();
      }}
      className="bubble on-beige"
      style={{
        maxWidth: 440,
        background: "var(--beige)",
        clipPath: soft(shapeIndex),
        padding: open
          ? "24px clamp(26px,3vw,38px) 28px"
          : "22px clamp(26px,3vw,38px) 26px",
        cursor: "pointer",
        overflowWrap: "break-word",
      }}
    >
      {open ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 20,
            paddingRight: 6,
          }}
        >
          {/* The title grows rather than being replaced — 13.2–14.5 up to 15–16.5. */}
          <p
            style={{
              margin: 0,
              maxWidth: "22em",
              font: "700 clamp(16.5px,0.22vw + 15.675px,18.15px)/1.3 var(--font-body)",
              color: "var(--ink-title)",
              textWrap: "pretty",
            }}
          >
            {event.title}
          </p>
          <AccessMark event={event} chevron="▴" />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              className="mono"
              style={{
                margin: "0 0 7px",
                fontSize: 11,
                lineHeight: 1.5,
                letterSpacing: ".14em",
                color: "var(--ink-body)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--venue-orange)" }}>{event.venue}</span>{" "}
              ·<span style={{ whiteSpace: "nowrap" }}> {event.time}</span>
            </p>
            <p
              style={{
                margin: 0,
                font: "700 clamp(14.52px,0.154vw + 13.97px,15.95px)/1.35 var(--font-body)",
                color: "var(--ink-title)",
                textWrap: "pretty",
              }}
            >
              {event.title}
            </p>
          </div>
          <AccessMark event={event} chevron="▾" />
        </div>
      )}

      {open && (
        <div className="reveal" style={{ gridTemplateRows: grown ? "1fr" : "0fr", opacity: grown ? 1 : 0 }}>
          <div>
            <BubbleDetail event={event} buttonShapeIndex={buttonShapeIndex} />
          </div>
        </div>
      )}
    </div>
  );
}
