"use client";

import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { WobbleUnderline } from "@/components/ui/Wobble";
import { NAV_CTA, NAV_LINKS, type NavLink } from "@/content/nav";
import { SITE } from "@/content/site";
import { soft } from "@/lib/design/shapes";

/**
 * Fixed chrome, sitting straight on the dye: no plate, no blur, no border. The band itself
 * takes no pointer events so the dye keeps receiving them; each control re-enables its own.
 *
 * The current page is marked twice — orange, and a hand-drawn underline. Colour alone would
 * be the only signal, and orange on violet is 2.73:1.
 */
export function NavBand({
  route,
  menuOpen,
  onToggleMenu,
}: {
  readonly route: NavLink["href"];
  readonly menuOpen: boolean;
  readonly onToggleMenu: () => void;
}) {
  const cta = NAV_CTA[route];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 60, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: "var(--sw)",
          margin: "0 auto",
          padding: "16px var(--gutter)",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Link href="/" style={{ display: "block", pointerEvents: "auto", justifySelf: "start" }}>
          <Mark src="/logo/sfwf-beige.png" alt={SITE.name} intrinsic={[780, 321]} priority style={{ height: 26, width: "auto" }} />
        </Link>

        <nav
          className="hidden wide:flex"
          style={{ alignItems: "center", justifySelf: "center", gap: 26, pointerEvents: "auto" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === route ? "page" : undefined}
              style={{
                position: "relative",
                display: "block",
                paddingBottom: 6,
                font: "400 17px/1 var(--font-display)",
                color: link.href === route ? "var(--orange)" : "var(--beige)",
                transition: "color var(--hover)",
              }}
            >
              {link.label}
              {link.href === route && <WobbleUnderline />}
            </Link>
          ))}
        </nav>

        <Link
          href={cta.href}
          className="cta hidden wide:block"
          style={{
            justifySelf: "end",
            pointerEvents: "auto",
            clipPath: soft(cta.shape),
            padding: "12px 24px 15px",
            background: "var(--orange)",
            color: "var(--button-ink)",
            font: "700 14px/1 var(--font-button)",
            letterSpacing: ".02em",
            transition: "background var(--hover)",
          }}
        >
          {cta.label}
        </Link>

        {/* The one organic border-radius in the product, and the only surface that carries
            a blur — it has to read as a control on top of a moving photograph. */}
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="sfwf-menu"
          /* `display` has to come from the class, not from here — an inline display beats
             the breakpoint utility and the burger stays up at every width. */
          className="grid place-items-center wide:hidden"
          style={{
            gridColumn: 3,
            justifySelf: "end",
            pointerEvents: "auto",
            width: 42,
            height: 42,
            padding: 0,
            background: "rgba(233,231,194,.16)",
            border: "1px solid rgba(233,231,194,.34)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            borderRadius: "52% 48% 56% 44% / 60% 42% 58% 40%",
            color: "var(--beige)",
            font: "400 15px/1 var(--font-body)",
            cursor: "pointer",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
