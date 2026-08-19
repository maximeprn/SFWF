import type { FestivalEvent } from "@/content/types";
import { access } from "@/lib/program/eventCopy";

/**
 * The mark is the booking, not a price tag: an orange dot and `RESERVE` where you have to
 * ask, a bare `WALK IN` where you don't. No price is shown while the bubble is closed.
 */
export function AccessMark({
  event,
  chevron,
}: {
  readonly event: FestivalEvent;
  readonly chevron: "▾" | "▴";
}) {
  const { dot, word } = access(event);
  return (
    <div
      style={{
        flex: "none",
        display: "flex",
        alignItems: "center",
        gap: 13,
        marginTop: chevron === "▴" ? 4 : undefined,
      }}
    >
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 7 }}>
        {dot && (
          <span
            aria-hidden="true"
            style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--orange)" }}
          />
        )}
        <span
          className="mono"
          style={{ fontSize: 11.5, letterSpacing: ".14em", color: "var(--ink-body)" }}
        >
          {word}
        </span>
      </div>
      {/* The chevron flips with no transition — it is a state, not a movement. */}
      <span
        aria-hidden="true"
        style={{ flex: "none", font: "700 13px/1 var(--font-body)", color: "var(--chevron)" }}
      >
        {chevron}
      </span>
    </div>
  );
}
