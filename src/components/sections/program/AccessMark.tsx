import type { FestivalEvent } from "@/content/types";
import { access } from "@/lib/program/eventCopy";

/**
 * The mark is the booking, not a price tag: an orange dot and `RESERVE` where you have to
 * ask, a bare `WALK IN` where you don't. No price is shown while the bubble is closed.
 *
 * Closed state only. Open, the bubble answers the same question outright — a gathering you
 * have to ask about has a booking button in it — and the mark would be saying it twice, in
 * the corner where the title has just grown into the space it used to occupy.
 */
export function AccessMark({ event }: { readonly event: FestivalEvent }) {
  const { dot, word } = access(event);
  return (
    <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 7 }}>
      {dot && (
        <span
          aria-hidden="true"
          style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange)" }}
        />
      )}
      <span
        className="mono"
        style={{ fontSize: 11.5, letterSpacing: ".14em", color: "var(--ink-body)" }}
      >
        {word}
      </span>
    </div>
  );
}
