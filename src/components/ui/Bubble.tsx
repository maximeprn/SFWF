import type { CSSProperties, ReactNode } from "react";
import { soft } from "@/lib/design/shapes";

interface BubbleProps {
  /** Picks which hand-cut outline to use. Vary it between neighbours so no two match. */
  readonly i: number;
  readonly children: ReactNode;
  readonly style?: CSSProperties;
  readonly onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Solid fill instead of the paper-white default — used for the gold passport card. */
  readonly fill?: string;
  /** Escape hatch for chips, where a clip-path would cut the text at small sizes. */
  readonly radius?: string;
  readonly className?: string;
}

/**
 * The paper-white surface everything sits on. Flat and printed-feeling, like a festival
 * programme: there is no elevation system here and no shadow tokens — if a surface needs
 * separating, it gets a border, never a shadow.
 */
export function Bubble({
  i,
  children,
  style,
  onClick,
  fill,
  radius,
  className,
}: BubbleProps) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        ...(radius ? { borderRadius: radius } : { clipPath: soft(i) }),
        background: fill ?? "var(--bubble)",
        color: "var(--bubble-ink)",
        padding: "26px 30px",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Body copy. It sits **straight on the dye by default** — that is how the prototype ships,
 * and boxing every paragraph turns the page into a stack of cards and loses the dye.
 *
 * On the dye it needs the scrim, because Satoshi's lighter weights were tuned for ink on
 * white and go thin over texture.
 *
 * Pass `boxed` for the one place a paragraph earns a bubble: the Media Center intro, which
 * has no photo beside it on a phone and would otherwise float unanchored.
 */
export function Prose({
  i,
  boxed = false,
  children,
  style,
}: {
  readonly i: number;
  readonly boxed?: boolean;
  readonly children: ReactNode;
  readonly style?: CSSProperties;
}) {
  if (boxed) {
    return (
      <Bubble i={i} style={style}>
        {children}
      </Bubble>
    );
  }
  return (
    <div
      style={{
        color: "var(--on-bg)",
        textShadow: "var(--text-shadow-on-dye)",
        padding: "0 4px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
