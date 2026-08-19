"use client";

import Link from "next/link";
import { NAV_LINKS, type NavLink } from "@/content/nav";

/* One continuous hand-drawn ring. It is not a circle and not a card — the links sit inside
   a drawn shape the way everything else in this system does. */
const RING =
  "M152 9 C188 5 212 21 226 45 C240 69 233 91 246 111 C259 131 264 156 253 178 " +
  "C242 200 247 223 232 245 C217 267 191 281 165 289 C139 297 110 293 88 281 " +
  "C66 269 50 249 42 227 C34 205 39 182 31 160 C23 138 29 113 43 93 C57 73 55 51 73 33 " +
  "C91 15 119 13 152 9 Z";

/**
 * The menu is opacity only — no scrim and no slide. The page's own copy fades out beneath
 * it and the dye stays exactly as it was, which is the whole reason there is no plate: the
 * background never dims, so opening the menu never feels like leaving the page.
 */
export function MobileMenu({
  route,
  onClose,
}: {
  readonly route: NavLink["href"];
  readonly onClose: () => void;
}) {
  return (
    <div
      id="sfwf-menu"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 45,
        display: "grid",
        placeItems: "center",
        padding: "56px 16px 40px",
        animation: "menuIn .34s ease both",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(84vw,322px)",
          aspectRatio: "322/326",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          viewBox="0 0 300 320"
          fill="none"
          aria-hidden="true"
          style={{ position: "absolute", left: "-11%", top: "-5%", width: "121%", height: "118%", overflow: "visible" }}
        >
          <path d={RING} stroke="var(--beige)" strokeWidth={2.8} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <nav
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === route ? "page" : undefined}
              style={{
                font: `400 ${i === 0 ? 22 : 21}px/1 var(--font-display)`,
                color: link.href === route ? "var(--orange)" : "var(--beige)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
