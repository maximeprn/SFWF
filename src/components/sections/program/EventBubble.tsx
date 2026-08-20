"use client";

import { Fragment } from "react";

import { Ring } from "@/components/ui/Ring";
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
 *
 * **Nothing that changes between the two states unmounts, and everything that changes
 * interpolates on one clock.** This used to render the closed and open headers as two
 * subtrees and swap them. Opening looked right; closing did not — the detail collapsed
 * first, and only when it had finished did the header snap back. One gesture, read as two
 * events. The kicker and the access mark now collapse to nothing instead of leaving, and the
 * title interpolates its size rather than being replaced by a larger one.
 *
 * Two flags, and they are not interchangeable:
 *
 *   · `open`  — the detail subtree is mounted. Nothing else may read this.
 *   · `grown` — the bubble is at full size. *Every* transition reads this.
 *
 * Binding the header or the container's padding to `open` is precisely the original bug:
 * `open` goes false only after the animation has finished, so anything tied to it jumps.
 * `useBubbleReveal` owns the sequencing — two frames up, 360ms down.
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
        /* The ring is absolutely positioned against this box. */
        position: "relative",
        maxWidth: 440,
        background: "var(--beige)",
        clipPath: soft(shapeIndex),
        /* `grown`, never `open` — see the note above. */
        padding: grown
          ? "36px clamp(26px,3vw,38px) 28px"
          : "22px clamp(26px,3vw,38px) 26px",
        cursor: "pointer",
        overflowWrap: "break-word",
      }}
    >
      <Ring shapeIndex={shapeIndex} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* The flexible half. `min-width: 0` alone let it shrink; it also has to be told to
            *take* the free space, or the two grids beside and inside it size from content and
            the title has no width to wrap into. */}
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          {/* Collapsed, never removed. This is what slides the venue and time back up
              *during* the close rather than after it. */}
          <div
            className="kicker-row"
            style={{ gridTemplateRows: grown ? "0fr" : "1fr", opacity: grown ? 0 : 1 }}
          >
            <div>
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
                <span style={{ fontWeight: 700, color: "var(--venue-orange)" }}>
                  {event.venue}
                </span>
                {/* A clock time never breaks, but a two-seating string is two of them and
                    may. Held together as one span, "1ST SEATING 5PM · 2ND 8PM" is 219px of
                    text in a 163px box on a phone, and it ran straight under the access
                    mark. Each part is unbreakable; the separators between them are not. */}
                {event.time.split(" · ").map((part) => (
                  <Fragment key={part}>
                    {" · "}
                    <span style={{ whiteSpace: "nowrap" }}>{part}</span>
                  </Fragment>
                ))}
              </p>
            </div>
          </div>

          {/* One title, two sizes — 15.5–17 closed, 18–21 open — interpolated. Both clamps
              are the design's own; only the swap between them is gone. */}
          <p
            className="bubble-title"
            style={{
              margin: 0,
              maxWidth: "26em",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: grown
                ? "clamp(18px,1.05vw + 14.6px,21px)"
                : "clamp(15.5px,0.7vw + 13.3px,17px)",
              lineHeight: grown ? 1.22 : 1.35,
              color: "var(--ink-title)",
              textWrap: "pretty",
            }}
          >
            {event.title}
          </p>
        </div>

        {/* The mark is a closed-state signal: open, the bubble answers the same question
            outright, since a gathering you have to ask about carries a booking button. It
            collapses sideways instead of unmounting, and the 16px that separates it from
            the title travels inside the track so no dead gap is left behind. */}
        <div
          className="mark-slot"
          style={{
            flex: "none",
            gridTemplateColumns: grown ? "0fr" : "1fr",
            opacity: grown ? 0 : 1,
          }}
        >
          <div style={{ paddingLeft: 16 }}>
            <AccessMark event={event} />
          </div>
        </div>
      </div>

      {/* The one subtree that does mount and unmount — and its unmount is deferred past the
          end of the animation, so it is still there to be collapsed. */}
      {open && (
        <div
          className="reveal"
          style={{ gridTemplateRows: grown ? "1fr" : "0fr", opacity: grown ? 1 : 0 }}
        >
          <div>
            <BubbleDetail event={event} buttonShapeIndex={buttonShapeIndex} />
          </div>
        </div>
      )}
    </div>
  );
}
