"use client";

import { Fragment } from "react";

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
        <div>
          {/* The title grows rather than being replaced — 15.5–17 up to 18–21. It has the
              header to itself: nothing marks the open state in this corner, because the
              bubble being open is the thing you can already see. */}
          <p
            style={{
              margin: 0,
              maxWidth: "26em",
              font: "700 clamp(18px,1.05vw + 14.6px,21px)/1.22 var(--font-body)",
              color: "var(--ink-title)",
              textWrap: "pretty",
            }}
          >
            {event.title}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              className="mono"
              style={{
                margin: "0 0 7px",
                fontSize: 11.5,
                lineHeight: 1.5,
                letterSpacing: ".16em",
                color: "var(--ink-body)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--venue-orange)" }}>{event.venue}</span>
              {/* A clock time never breaks, but a two-seating string is two of them and may.
                  Held together as one span, "1ST SEATING 5PM · 2ND 8PM" is 219px of text in
                  a 163px box on a phone, and it ran straight under the access mark. Each
                  part is unbreakable; the separators between them are not. */}
              {event.time.split(" · ").map((part) => (
                <Fragment key={part}>
                  {" · "}
                  <span style={{ whiteSpace: "nowrap" }}>{part}</span>
                </Fragment>
              ))}
            </p>
            <p
              style={{
                margin: 0,
                font: "700 clamp(15.5px,0.7vw + 13.3px,17px)/1.35 var(--font-body)",
                color: "var(--ink-title)",
                textWrap: "pretty",
              }}
            >
              {event.title}
            </p>
          </div>
          <AccessMark event={event} />
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
