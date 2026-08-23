import { Ring } from "@/components/ui/Ring";
import { Slab } from "@/components/ui/Slab";
import { WobbleRule } from "@/components/ui/Wobble";
import type { FestivalEvent } from "@/content/types";
import { bookNameOf, instagramUrl, placeOf } from "@/content/venues";
import { access, hintRest } from "@/lib/program/eventCopy";
import { trackBookingClick } from "@/lib/analytics";
import { soft } from "@/lib/design/shapes";
import type { StyleWithVars } from "@/lib/ui/cssVars";

/* The one meta size the bubble's small lines share. Kept apart from the face below because
   two faces now set it. */
const META_SIZE = "clamp(13.5px,0.3vw + 12.8px,14.5px)";
/* Size and face only — every use below prefixes its own weight and style. */
const META = `${META_SIZE}/1.45 var(--font-body)`;
/* The hint line's mono, complete with its weight, for the line-up. `.92` is the same optical
   correction the venue makes a few lines down and for the same reason — Menlo's x-height runs
   large, so mono set at the shared size outweighs the Arimo around it. It bottoms out at
   12.4px, well clear of the scale's 11px floor. Leading is a touch looser than the rest of
   the meta because mono at 700 sets a denser line. */
const META_MONO = `700 calc(${META_SIZE} * 0.92)/1.5 var(--font-mono)`;
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
      {/* The venue is uppercase and bold; the time and price after it are sentence case in
          regular weight. The whole line was once set uppercase in 900 at 8.5px, which is the
          worst treatment available for the one place a price appears — uppercase throws away
          the word shapes you read by, and 900 closes the counters at the size where they are
          already collapsing. That argument holds for the time and the price, which you read.
          It does not hold for the venue, which you find: it is the same label the closed
          kicker sets uppercase and bold, and opening a bubble should not restyle it. */}
      <p
        style={{
          margin: "7px 0 0",
          font: `400 ${META}`,
          color: "var(--ink-body)",
        }}
      >
        {/* Mono, uppercase, 700, `.16em` — the closed kicker's venue exactly, so the label
            does not change face when the bubble opens. Uppercase in mono is also the one
            place the type scale allows it (§8): kickers are a mono role, and this is the
            same kicker.

            Sized off the line's own `em` so it tracks its clamp across the breakpoints, less
            2px. `.92` is the optical match — Menlo's x-height runs large, and set at the
            line's full size the venue outweighed the time beside it — and the 2px comes off
            that. The `max()` is the type scale's hard floor: nothing on this page goes under
            11px, and at the line's mobile minimum the subtraction alone would land on 10.4.
            In practice the two bounds meet, so this resolves to 11.1px wide and 11px narrow.

            The string is the place name, not the venue key — open is the informative state,
            so "General Luna public market" stays rather than collapsing to "GL PUBLIC
            MARKET".

            The bright orange, as the prototype draws it — and knowingly: it is 2.67:1 on
            beige, and §3 says `--orange-on-light` belongs on light grounds. Overruled on
            purpose. The place name is repeated in the kicker and in the booking button, so
            nothing here is only available in this colour. Raise it with the festival, not
            in this file. */}
        <span
          className="mono"
          style={{
            color: "var(--orange)",
            fontSize: "max(11px, calc(0.92em - 2px))",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".16em",
          }}
        >
          {placeOf(event.venue)}
        </span>{" "}
        · {hintRest(event)}
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
          hold both — which at 440px is most of them.

          Held 20px in from the prose above it on both sides. This is the last row in the
          bubble, and the bubble is a hand-cut blob: its bottom corners bow inward, so a row
          set flush to the column's edge — the button's raised slab especially — runs at the
          part of the outline that is closing in on it. The inset is the shape's, not the
          grid's, which is why it is a flat 20 rather than a share of the padding clamp. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 18,
          margin: "14px 0 0",
          padding: "0 8px",
        }}
      >
        <p
          style={{
            margin: 0,
            flex: 1,
            minWidth: 150,
            /* The line-up takes the hint line's mono at 700 — the names of the people
               cooking are what most readers came into the bubble for, and set in the same
               regular Arimo as everything else they sank into the paragraph above them.
               Mono and bold pull them out without adding a colour or a rule.

               Sentence case, unlike the venue: these are names, and you read a name by its
               word shape. Uppercasing "Chef Jarrod · Chef Marc" would throw that away.

               The absent-copy line stays italic Arimo at 400 — italic is how this file
               already says a thing is missing, and mono 700 would announce the absence
               louder than the line-ups it stands in for. */
            font: event.who ? META_MONO : `italic 400 ${META}`,
            color: "var(--ink-body)",
            letterSpacing: event.who ? ".01em" : undefined,
          }}
        >
          {event.who ?? "Line-up to be announced"}
        </p>

        {/* Only on bookable events. */}
        {access(event).dot && (
          <Slab shapeIndex={buttonShapeIndex} style={{ display: "inline-block", flex: "none" }}>
            <a
              href={instagramUrl(event.venue)}
              target="_blank"
              rel="noopener"
              /* Two things at once, and the order matters: stop the tap short of the bubble
                 so following the link never collapses what you were reading, then send the
                 one event this site measures. The link opens in a new tab, so the page is
                 still here when the beacon goes — no `sendBeacon` dance needed. Untagged
                 builds (local, previews) drop it on the floor. */
              onClick={(e) => {
                e.stopPropagation();
                trackBookingClick(placeOf(event.venue), event.title);
              }}
              className="press-btn on-beige"
              /* On a light card, orange+beige inverts to the page ground, not the card's
                 own colour — inverting to the card would erase the ink standing on it. */
              data-press="ground"
              style={{
                clipPath: soft(buttonShapeIndex),
                padding: "16px 28px",
                /* Beige on orange. The prototype splits its buttons by face: a Baloo primary
                   CTA takes #191218, an Arimo in-content button takes beige, and this is the
                   second kind. It is 1.9:1 and that is a real cost — raise it with the
                   festival rather than in this file, as with the hint line's orange. */
                "--btn-fill": "var(--orange)",
                color: "var(--beige)",
                font: "700 14.5px/1.2 var(--font-body)",
                cursor: "pointer",
              } as StyleWithVars}
            >
              Message {bookNameOf(event.venue)}
              {/* Half a bubble's weight would be too light here and the full weight too
                  heavy: the button is its own element, not a small one, so it carries its
                  own. */}
              <Ring shapeIndex={buttonShapeIndex} weight="var(--button-edge)" />
            </a>
          </Slab>
        )}
      </div>
    </>
  );
}
