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
        gap: 10,
        marginTop: chevron === "▴" ? 3 : undefined,
      }}
    >
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
        {dot && (
          <span
            aria-hidden="true"
            style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange)" }}
          />
        )}
        <span
          className="mono"
          style={{ fontSize: 11, letterSpacing: ".12em", color: "var(--ink-body)" }}
        >
          {word}
        </span>
      </div>
      {/* The chevron flips with no transition — it is a state, not a movement. */}
      <span
        aria-hidden="true"
        style={{ flex: "none", font: "700 12.1px/1 var(--font-body)", color: "var(--chevron)" }}
      >
        {chevron}
      </span>
    </div>
  );
}
