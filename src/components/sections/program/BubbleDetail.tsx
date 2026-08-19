import { WobbleRule } from "@/components/ui/Wobble";
import type { FestivalEvent } from "@/content/types";
import { bookNameOf, instagramUrl, placeOf } from "@/content/venues";
import { access, hintRest } from "@/lib/program/eventCopy";
import { soft } from "@/lib/design/shapes";

const ITALIC_NOTE = {
  margin: "11px 0 0",
  font: "italic 400 clamp(12px,0.11vw + 11.6px,13px)/1.5 var(--font-body)",
  color: "var(--ink-body)",
} as const;

/**
 * What an open bubble says. The venue has left the kicker and joined the time and price on
 * one hint line, so the time is stated once; the price is spoken here and only here, and
 * only when it is known.
 *
 * Missing copy is stated rather than hidden — "to be announced" is the design, not a gap.
 */
export function BubbleDetail({
  event,
  buttonShapeIndex,
}: {
  readonly event: FestivalEvent;
  readonly buttonShapeIndex: number;
}) {
  return (
    <>
      <p
        style={{
          margin: "6px 0 0",
          font: "900 8.5px/1.5 var(--font-body)",
          color: "var(--ink-body)",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "var(--orange)" }}>{placeOf(event.venue)}</span> ·{" "}
        {hintRest(event)}
      </p>

      {event.desc ? (
        <p
          style={{
            margin: "11px 0 0",
            maxWidth: "78ch",
            font: "400 11.5px/1.62 var(--font-body)",
            color: "var(--ink-title)",
            textWrap: "pretty",
          }}
        >
          {event.desc}
        </p>
      ) : (
        <p style={{ ...ITALIC_NOTE, fontSize: "clamp(12.8px,0.19vw + 12.1px,14.5px)", lineHeight: 1.62 }}>
          Program details to be announced.
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 13,
          marginTop: 14,
        }}
      >
        <WobbleRule tone="violet" />
        {event.who ? (
          <p
            style={{
              margin: 0,
              maxWidth: "52ch",
              font: "400 clamp(12px,0.11vw + 11.6px,13px)/1.5 var(--font-body)",
              color: "var(--ink-body)",
            }}
          >
            {event.who}
          </p>
        ) : (
          <p style={{ ...ITALIC_NOTE, margin: 0 }}>Line-up to be announced</p>
        )}

        {/* Only on bookable events, and it stops the tap short of the bubble so following
            the link never collapses what you were reading. */}
        {access(event).dot && (
          <a
            href={instagramUrl(event.venue)}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            className="cta-in-bubble on-beige"
            style={{
              alignSelf: "flex-start",
              clipPath: soft(buttonShapeIndex),
              padding: "10px 18px 11px",
              background: "var(--orange)",
              color: "var(--beige)",
              font: "700 12px/1.2 var(--font-body)",
              cursor: "pointer",
              transition: "background var(--hover)",
            }}
          >
            Message {bookNameOf(event.venue)} to reserve
          </a>
        )}
      </div>
    </>
  );
}
