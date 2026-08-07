"use client";

import type { CSSProperties } from "react";
import { PASSPORT } from "@/content/crawls";
import { Bubble } from "./Bubble";
import { Cta } from "./Cta";

interface PassportCardProps {
  readonly i?: number;
  /** Present only in the toggling form: the label shown while the card is folded away. */
  readonly label?: string;
  readonly open?: boolean;
  readonly onToggle?: () => void;
  readonly style?: CSSProperties;
}

function PassportBody({ inset }: { readonly inset: boolean }) {
  return (
    <div style={{ minWidth: 0 }}>
      <p
        style={{
          margin: 0,
          paddingRight: inset ? 26 : 0,
          font: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "rgba(11,20,32,.66)",
        }}
      >
        {PASSPORT.eyebrow}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <span style={{ font: "var(--display-2)", color: "var(--ink-deep)" }}>
          {PASSPORT.price}
        </span>
      </div>
      <p style={{ margin: "6px 0 0", font: "var(--text-body-sm)", color: "rgba(11,20,32,.78)" }}>
        {PASSPORT.where}
      </p>
      <Cta i={2} label="Ask about passports" variant="secondary" href="/tickets" style={{ marginTop: 16 }} />
    </div>
  );
}

/**
 * One ticket, both crawls — the same card on Food Crawl and under the Home CTA.
 *
 * On Home it toggles: the button itself grows into the card, on the programme bubbles'
 * timing. The details are unmounted while closed, because their max-content width would
 * otherwise leak into the folded button's fit-content and stop it hugging its label.
 */
export function PassportCard({ i = 3, label, open = true, onToggle, style }: PassportCardProps) {
  const toggles = Boolean(onToggle);

  const toggleStyle: CSSProperties = toggles
    ? {
        display: "block",
        boxSizing: "border-box",
        maxWidth: "100%",
        width: open ? "100%" : "fit-content",
        padding: open ? "26px 30px" : "19px 34px",
        transition: `padding var(--open) var(--ease)`,
      }
    : {};

  return (
    <Bubble
      i={i}
      fill="var(--mark)"
      onClick={onToggle}
      style={{
        position: "relative",
        color: "var(--ink-deep)",
        cursor: toggles ? "pointer" : "default",
        ...toggleStyle,
        ...style,
      }}
    >
      {toggles && !open && (
        <div
          style={{
            font: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            color: "var(--cta-ink)",
          }}
        >
          {label}
        </div>
      )}
      {toggles && open && (
        /* The details are unmounted while closed — otherwise their max-content width leaks
           into the folded button's fit-content and it stops hugging its label. Mounting is
           therefore the trigger, so the unfurl is a keyframe rather than a state flip. */
        <div
          style={{
            display: "grid",
            overflow: "hidden",
            animation: `passportUnfurl var(--open) var(--ease) both`,
          }}
        >
          <div style={{ minHeight: 0, minWidth: 0 }}>
            <PassportBody inset />
          </div>
        </div>
      )}
      {!toggles && <PassportBody inset={false} />}
      {toggles && open && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            width: 26,
            height: 26,
            display: "grid",
            placeItems: "center",
            color: "rgba(11,20,32,.6)",
            font: "400 15px var(--font-display)",
          }}
        >
          ✕
        </span>
      )}
    </Bubble>
  );
}
