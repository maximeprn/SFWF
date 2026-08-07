"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { Squiggle, useSquiggle } from "@/components/ui/Squiggle";
import { LOGO } from "@/content/photos";
import { NAV } from "@/content/site";
import { blob } from "@/lib/design/shapes";
import { NAV_H, type NavReveal } from "@/lib/useNavReveal";

/** Not a button: gold label with a hand-drawn underline, so it reads as a link on the dye. */
function TicketsLink() {
  const squiggle = useSquiggle();
  return (
    <Link
      href="/tickets"
      onPointerDown={squiggle.onPointerDown}
      style={{
        color: "var(--mark)",
        font: "400 19px/1 var(--font-display)",
        letterSpacing: ".01em",
        whiteSpace: "nowrap",
        textDecoration: "none",
        textShadow: "0 1px 12px rgba(10,18,28,.55)",
        lineHeight: "40px",
      }}
    >
      {/* The rule is absolute so it can't widen the box — it spans exactly the word. */}
      <span style={{ position: "relative", display: "inline-block" }}>
        Tickets
        <Squiggle draw={squiggle.draw} />
      </span>
    </Link>
  );
}

const burger: CSSProperties = {
  width: 40,
  height: 40,
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  background: "rgba(255,255,255,.18)",
  border: "1px solid rgba(255,255,255,.34)",
  backdropFilter: "blur(6px)",
  color: "var(--on-bg)",
  font: "400 15px var(--font-display)",
};

export function NavBand({
  nav,
  menuOpen,
  onToggleMenu,
}: {
  readonly nav: NavReveal;
  readonly menuOpen: boolean;
  readonly onToggleMenu: () => void;
}) {
  const pathname = usePathname();
  // While the menu is open the chrome sits still — it is the menu's own header.
  const offset = menuOpen ? 0 : nav.offset;
  const reachable = offset > -60;

  return (
    <div
      data-chrome
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: NAV_H,
        zIndex: 60,
        pointerEvents: "none",
        transform: `translateY(${offset}px)`,
        transition: nav.snap ? "transform .36s cubic-bezier(.2,.7,.2,1)" : "none",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-[18px] wide:px-[var(--gutter)]"
        style={{ maxWidth: "var(--column)", paddingTop: 56 }}
      >
        {/* Mobile: Tickets left, mark centred, burger right. Wide: mark left, words centred. */}
        <div className="wide:hidden" style={{ pointerEvents: reachable ? "auto" : "none" }}>
          <TicketsLink />
        </div>

        <Link
          href="/"
          aria-label="Siargao Food and Wine Festival — home"
          className="absolute left-1/2 -translate-x-1/2 wide:static wide:translate-x-0"
          style={{ pointerEvents: reachable ? "auto" : "none", lineHeight: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Siargao Food and Wine Festival" style={{ height: 46, width: "auto" }} />
        </Link>

        <nav className="hidden wide:flex items-center gap-8" style={{ pointerEvents: "auto" }}>
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  font: "var(--display-3)",
                  fontSize: 20,
                  color: active ? "var(--mark)" : "var(--on-bg)",
                  opacity: active ? 1 : 0.78,
                  textDecoration: "none",
                  textShadow: "var(--text-shadow-on-dye)",
                  whiteSpace: "nowrap",
                  transition: "color .18s ease, opacity .18s ease",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-[10px]" style={{ pointerEvents: reachable ? "auto" : "none" }}>
          <div className="hidden wide:block">
            <TicketsLink />
          </div>
          {/* Wrapped rather than classed directly: the button carries an inline
              `display: grid`, which would win over Tailwind's `hidden`. */}
          <span className="wide:hidden">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="sfwf-menu"
              onClick={onToggleMenu}
              style={{ ...burger, borderRadius: blob(3), font: menuOpen ? "400 17px var(--font-display)" : "400 15px var(--font-display)" }}
            >
              {menuOpen ? "✕" : "≡"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
