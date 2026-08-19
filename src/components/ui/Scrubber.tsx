"use client";

import { type CSSProperties, type RefObject, useEffect, useState } from "react";
import { BUBBLE_RULE } from "@/components/ui/Wobble";
import { clock } from "@/lib/media/clock";

/** `seeking` is in the list so the line follows a drag immediately rather than a tick later. */
const EVENTS = [
  "timeupdate",
  "loadedmetadata",
  "durationchange",
  "seeking",
  "seeked",
  "ended",
] as const;

/**
 * Track and elapsed run are the same path at the same geometry, so they cannot drift out of
 * register. It is `BUBBLE_RULE` — the rule already drawn inside every open bubble, which is
 * the violet hairline this bar's ink is.
 */
const LINE: CSSProperties = {
  position: "absolute",
  left: 0,
  top: "calc(50% - 2.5px)",
  width: "100%",
  height: 5,
  overflow: "visible",
};

/**
 * Track and elapsed run are told apart by weight, not by a lighter tint — which is the rule
 * `tokens.css` states for beige grounds, and here it is also the accessible one. The bubble
 * hairline this path usually carries is `--hairline-violet`, and at .3 alpha over beige that
 * lands near 1.5:1: fine for a rule that decorates, short of the 3:1 a control has to clear.
 * Both inks are full-strength tokens, and the played run still leads on colour and on weight.
 */
function Rule({ ink, weight }: { readonly ink: string; readonly weight: number }) {
  return (
    <svg viewBox="0 0 400 6" preserveAspectRatio="none" aria-hidden="true" style={LINE}>
      <path
        d={BUBBLE_RULE}
        fill="none"
        stroke={ink}
        strokeWidth={weight}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The film's scrubber. The six strip clips carry none — 208px of frame is three controls wide
 * and no more, and a scrubber squeezed into what is left would be a target nobody can hit.
 *
 * The elapsed run is the track revealed with `clip-path: inset()`, not a second line scaled to
 * fit: `inset` uncovers rather than squashes, so the wobble stays the wobble at every position
 * and no width has to be measured. A gradient would be the usual way to do this and is exactly
 * what `tests/design.test.ts` refuses outside two files.
 *
 * Seeking goes back up to `VideoFrame`. The element is only read here — the compiler's
 * immutability rule keeps every mutation at the one place that owns the ref.
 */
export function Scrubber({
  video,
  onSeek,
}: {
  readonly video: RefObject<HTMLVideoElement | null>;
  readonly onSeek: (seconds: number) => void;
}) {
  const [{ current, duration }, setAt] = useState({ current: 0, duration: 0 });
  /* What the last press asked for, held until the element gets there.
   *
   * Without it a held arrow key mostly cancels itself out: each repeat sets `currentTime` and
   * queues a state update, and the update that lands is older than the press that follows it,
   * so React keeps resetting the slider under the key. Measured at ~5 presses to the second,
   * which is roughly a third of a key-repeat. `seeked` means the element has arrived, and
   * from then on its own time is the honest one again. */
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;

    const sync = (event: Event) => {
      if (event.type === "seeked") setPending(null);
      setAt({
        current: el.currentTime,
        duration: Number.isFinite(el.duration) ? el.duration : 0,
      });
    };
    for (const event of EVENTS) el.addEventListener(event, sync);
    return () => {
      for (const event of EVENTS) el.removeEventListener(event, sync);
    };
  }, [video]);

  const at = pending ?? current;
  const run = duration > 0 ? Math.min(1, at / duration) : 0;

  return (
    <div
      style={
        {
          position: "relative",
          flex: 1,
          minWidth: 0,
          height: 22,
          "--run": `${(run * 100).toFixed(2)}%`,
        } as CSSProperties
      }
    >
      <Rule ink="var(--ink-body)" weight={1.3} />
      <div style={{ ...LINE, clipPath: "inset(0 calc(100% - var(--run)) 0 0)" }}>
        <Rule ink="var(--orange-on-light)" weight={2.4} />
      </div>
      {/* The head, drawn like everything else — a short stroke that bows, not a dot. */}
      <svg
        viewBox="0 0 6 14"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "var(--run)",
          top: "calc(50% - 7px)",
          width: 6,
          height: 14,
          marginLeft: -3,
          overflow: "visible",
        }}
      >
        <path
          d="M 3.4 1.2 C 2.1 4.4 4.5 8.2 2.9 12.6"
          fill="none"
          stroke="var(--orange-on-light)"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Transparent, and the whole reason there is no hand-rolled slider here: arrow keys,
          Home/End, touch drag and the slider role all arrive with the native element. */}
      <input
        className="scrub on-beige"
        type="range"
        min={0}
        /* Whole seconds, not `step="any"`. Chrome's arrow keys move an `any` range by nothing
           at all, which would leave this focusable and inoperable — and a native range was
           chosen precisely so the keyboard came for free. A second per press is the
           granularity every other player uses, and the drawn line still runs off the real
           `currentTime`, so nothing about the picture snaps. */
        max={Math.round(duration)}
        step={1}
        value={pending ?? Math.round(current)}
        onChange={(e) => {
          const seconds = e.currentTarget.valueAsNumber;
          setPending(seconds);
          onSeek(seconds);
        }}
        aria-label="Seek"
        /* Elapsed floors, the way a clock does; the total is rounded, because that is
           what `Clip.seconds` is and the poster's own label already said "1:53". Flooring
           both would have this frame announce a 112.6s film as 1:52 next to a 1:53. */
        aria-valuetext={`${clock(at)} of ${clock(Math.round(duration))}`}
      />
    </div>
  );
}
