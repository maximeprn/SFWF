import type { CSSProperties, ReactNode } from "react";
import { SOCIALS } from "@/content/site";

/**
 * The festival ships no social icon assets, so the marks are drawn here in the same yellow
 * line-weight as the food icons — single weight, round caps, slightly loose. Each sits at
 * its own angle so the row reads hand-placed rather than aligned.
 */
const ART: Record<string, ReactNode> = {
  Instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M17.1 7h.01" strokeWidth="2.6" />
    </>
  ),
  Facebook: (
    <>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M14.5 7.9h-1.3c-1.1 0-1.9.8-1.9 1.9v6.9M9.7 12.2h4.4" />
    </>
  ),
  TikTok: (
    <>
      <path d="M14.3 4.1v9.9a3.7 3.7 0 1 1-3.3-3.7" />
      <path d="M14.3 4.1c.4 2.3 2 3.7 4.2 3.9" />
    </>
  ),
};

export function Footer() {
  return (
    <footer style={{ padding: "44px 20px 46px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <p style={{ margin: 0, font: '400 20px var(--font-display)', color: "var(--mark)", letterSpacing: ".01em" }}>
        Follow us
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        {SOCIALS.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.name}
            className="social-mark"
            /* --tilt is the mark's resting angle; the hover rule in globals.css returns
               to it, so the two can never drift apart. */
            style={
              {
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                color: "var(--mark)",
                textDecoration: "none",
                WebkitTapHighlightColor: "transparent",
                "--tilt": `${s.tilt}deg`,
              } as CSSProperties
            }
          >
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: "block" }}
            >
              {ART[s.name]}
            </svg>
          </a>
        ))}
      </div>
    </footer>
  );
}
