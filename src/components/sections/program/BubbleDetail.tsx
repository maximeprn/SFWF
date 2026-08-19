import { WobbleRule } from "@/components/ui/Wobble";
import type { FestivalEvent } from "@/content/types";
import { bookNameOf, instagramUrl, placeOf } from "@/content/venues";
import { access, hintRest } from "@/lib/program/eventCopy";
import { soft } from "@/lib/design/shapes";

/* Size and face only — every use below prefixes its own weight and style. */
const META = "clamp(13.5px,0.3vw + 12.8px,14.5px)/1.45 var(--font-body)";
const PROSE = "clamp(14.5px,0.5vw + 13.1px,16px)/1.6 var(--font-body)";

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
      {/* Sentence case, regular weight. This line was set uppercase in 900 at 8.5px, which
          is the worst treatment available for the one place a price appears: uppercase
          throws away the word shapes you read by, and 900 closes the counters at exactly the
          size where they are already collapsing. Uppercase belongs to the mono roles — the
          eyebrows, dates and access marks — and to nothing else. */}
      <p
        style={{
          margin: "7px 0 0",
          font: `400 ${META}`,
          color: "var(--ink-body)",
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
            margin: "14px 0 0",
            /* A cap that never binds at this width — the bubble stops at 440px long before
               900 does. It is here so the block keeps its own measure when phase 2 gives
               the programme a page to itself. */
            maxWidth: 900,
            font: `400 ${PROSE}`,
            color: "var(--ink-title)",
            textWrap: "pretty",
          }}
        >
          {event.desc}
        </p>
      ) : (
        <p style={{ margin: "14px 0 0", font: `italic 400 ${PROSE}`, color: "var(--ink-body)" }}>
          Program details to be announced.
        </p>
      )}

      <div style={{ marginTop: 14 }}>
        <WobbleRule tone="violet" />
      </div>

      {/* Line-up and booking on one line, wrapping to two when the bubble is too narrow to
          hold both — which at 440px is most of them. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 18,
          marginTop: 14,
        }}
      >
        <p
          style={{
            margin: 0,
            flex: 1,
            minWidth: 150,
            font: event.who ? `400 ${META}` : `italic 400 ${META}`,
            color: "var(--ink-body)",
          }}
        >
          {event.who ?? "Line-up to be announced"}
        </p>

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
              flex: "none",
              clipPath: soft(buttonShapeIndex),
              padding: "16px 28px",
              /* Orange, with the near-black every other orange button in the product uses.
                 README §3's colour table is explicit — "Button label #191218, on orange and
                 beige buttons" — and it is the reading that survives contrast: the canonical
                 prototype draws a beige label here, which is 1.9:1 and puts the one thing you
                 are meant to press below the prose above it. */
              background: "var(--orange)",
              color: "var(--button-ink)",
              font: "700 14.5px/1.2 var(--font-body)",
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
