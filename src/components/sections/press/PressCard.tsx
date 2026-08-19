import { soft } from "@/lib/design/shapes";

const KICKER = {
  margin: "0 0 10px",
  fontSize: 11.5,
  letterSpacing: ".16em",
  color: "var(--ink-body)",
} as const;

export const CARD_PROSE =
  "clamp(14px,0.35vw + 13.1px,15px)/1.62 var(--font-body)";

/** The mono line under a card's copy: a deadline, a link that does not exist yet. */
export function CardNote({ children }: { readonly children: React.ReactNode }) {
  return (
    <p
      className="mono"
      style={{
        margin: "16px 0 0",
        fontSize: 11,
        lineHeight: 1.7,
        letterSpacing: ".1em",
        color: "var(--ink-body)",
      }}
    >
      {children}
    </p>
  );
}

/**
 * A beige hand-cut card. Same surface as an event bubble and the same rules — no shadow, no
 * pill, and the kicker's first span carries the only colour on it.
 */
export function PressCard({
  shape,
  kicker,
  title,
  children,
}: {
  readonly shape: number;
  readonly kicker: { readonly lead: string; readonly rest: string };
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--beige)",
        clipPath: soft(shape),
        padding: "26px 30px 30px",
        overflowWrap: "break-word",
      }}
    >
      <p className="mono" style={KICKER}>
        <span style={{ fontWeight: 700, color: "var(--venue-orange)" }}>{kicker.lead}</span> ·{" "}
        {kicker.rest}
      </p>
      <p
        style={{
          margin: 0,
          font: "700 clamp(16.5px,0.8vw + 13.9px,18.5px)/1.28 var(--font-body)",
          color: "var(--ink-title)",
          textWrap: "pretty",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}
