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
      {/* The price lives here, so this was the worst line in the product to have set at
          8.5px in weight 900: uppercase throws away the word shapes you read by, and 900
          closes the counters at exactly the size where they are already collapsing. Bigger,
          lighter, and tracked — uppercase runs this long need the air. */}
      <p
        style={{
          margin: "6px 0 0",
          font: "700 clamp(10.5px, 0.11vw + 10.07px, 11.5px)/1.5 var(--font-body)",
          letterSpacing: ".03em",
          color: "var(--ink-body)",
          textTransform: "uppercase",
        }}
      >
        {/* The bright orange, as the prototype draws it — and knowingly: it is 2.67:1 on
            beige, and §3 says `--orange-on-light` belongs on light grounds. Overruled on
            purpose. The place name is repeated in the kicker and in the booking button, so
            nothing here is only available in this colour. Raise it with the festival, not
            in this file. */}
        <span style={{ color: "var(--orange)" }}>{placeOf(event.venue)}</span> ·{" "}
        {hintRest(event)}
      </p>

      {event.desc ? (
        <p
          style={{
            margin: "11px 0 0",
            maxWidth: "78ch",
            /* Clamped, where the handoff had a flat 11.5px. Every other body value in the
               system scales, so a fixed one never grew on a 440px bubble and — worse — left
               the description smaller than the line-up crediting it. Prose now sits above
               its own credit list at every width, under the title, where it belongs. */
            font: "400 clamp(12.5px, 0.14vw + 11.95px, 13.5px)/1.62 var(--font-body)",
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
              padding: "11px 20px 12px",
              background: "var(--orange)",
              color: "var(--beige)",
              /* Above the description, below the title. At the handoff's flat 12px the one
                 thing in the bubble you are meant to press was set smaller than the prose
                 you had just finished reading. */
              font: "700 clamp(13.5px, 0.17vw + 12.84px, 15px)/1.2 var(--font-body)",
              cursor: "pointer",
              transition: "background var(--hover)",
            }}
          >
            Message {bookNameOf(event.venue)}
          </a>
        )}
      </div>
    </>
  );
}
