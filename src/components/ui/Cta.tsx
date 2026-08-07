"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { soft } from "@/lib/design/shapes";

export type CtaVariant = "primary" | "secondary";

interface CtaProps {
  readonly label: string;
  /** Picks the outline. Vary it against neighbouring shapes. */
  readonly i?: number;
  readonly variant?: CtaVariant;
  readonly href?: string;
  readonly onClick?: (event: React.MouseEvent) => void;
  readonly style?: CSSProperties;
}

/** How long the pressed state holds before the action fires. */
const HOLD_MS = 420;

const face = (variant: CtaVariant, held: boolean): CSSProperties =>
  variant === "secondary"
    ? held
      ? { background: "var(--mark)", color: "var(--bubble-ink)" }
      : { background: "var(--bubble-ink)", color: "var(--mark)" }
    : held
      ? { background: "var(--bubble-ink)", color: "var(--mark)" }
      : { background: "var(--cta)", color: "var(--cta-ink)" };

/**
 * Every action in the product renders through this, so changing the treatment is one edit
 * rather than four. Shapes reuse the existing bubble outlines — there is no second shape
 * language for buttons, and nothing is ever pill-shaped.
 *
 * Tap feedback runs on the same beat as the menu words: the press flips the button to its
 * ink negative and holds for 420ms before the action fires, so the click is felt rather
 * than swallowed by whatever happens next.
 */
export function Cta({
  label,
  i = 0,
  variant = "primary",
  href,
  onClick,
  style,
}: CtaProps) {
  const [held, setHeld] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  /* A plain <a> driven by router.push never enters next/link's viewport prefetcher, so
     the route payload was being fetched after the tap — on top of the deliberate 420ms
     hold. Every page is static, so warming it on mount is cheap and it stays warm. */
  useEffect(() => {
    if (href) router.prefetch(href);
  }, [href, router]);

  const press = useCallback(
    (event: React.MouseEvent) => {
      if (held) return;
      event.preventDefault();
      // The press belongs to the button, not the bubble underneath it.
      event.stopPropagation();
      setHeld(true);
      timer.current = setTimeout(() => {
        setHeld(false);
        onClick?.(event);
        if (href) router.push(href);
      }, HOLD_MS);
    },
    [held, onClick, href, router],
  );

  const padding = variant === "secondary" ? "16px 28px" : "19px 34px";
  const shape = variant === "secondary" ? i + 3 : i + 1;

  const inner: CSSProperties = {
    display: "inline-block",
    padding,
    clipPath: soft(shape),
    font: "var(--text-label)",
    letterSpacing: "var(--tracking-label)",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    transition: "background .14s ease, color .14s ease",
    ...face(variant, held),
  };

  const outer: CSSProperties = {
    display: "inline-block",
    border: 0,
    padding: 0,
    background: "none",
    cursor: "pointer",
    textDecoration: "none",
    // Press feedback is a scale, not a lift: the system has no shadows to bloom.
    transform: held ? "scale(.96)" : "none",
    transition: "transform .14s ease",
    ...style,
  };

  if (href) {
    return (
      <a href={href} onClick={press} style={outer}>
        <span style={inner}>{label}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={press} style={outer}>
      <span style={inner}>{label}</span>
    </button>
  );
}
