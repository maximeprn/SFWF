import { soft } from "@/lib/design/shapes";
import type { StoryStep } from "./story";

/**
 * One step of the story. Unfolds rather than fading — the `.grow` class animates the row
 * from 0fr to 1fr, so the bubble reads as being built rather than appearing.
 *
 * The class names here (`rv`, `grow`, `nd`, `det`) are the hooks the reveal CSS in
 * globals.css keys off; the reveal itself is driven by useStoryReveal adding `.on`.
 */
export function StoryBubble({ step }: { readonly step: StoryStep }) {
  const align =
    step.side === "center"
      ? { margin: "0 auto" }
      : step.side === "right"
        ? { marginLeft: "auto" }
        : { marginRight: "auto" };

  return (
    <div className="grow rv" style={{ width: step.width, position: "relative", ...align }}>
      <div
        className="nd"
        style={{
          position: "relative",
          clipPath: soft(step.blob),
          background: "var(--bubble)",
          color: "var(--bubble-ink)",
          padding: "22px 24px 24px",
        }}
      >
        <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
          <span style={{ flex: "none", font: "400 22px/1.1 var(--font-display)", opacity: 0.34 }}>
            {step.n}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "var(--display-4)" }}>{step.title}</div>
          </div>
        </div>
        <div className="det">
          <div>
            <p style={{ margin: "14px 0 0", font: "var(--text-body-sm)", color: "var(--bubble-soft)" }}>
              {step.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
