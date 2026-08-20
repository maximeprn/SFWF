"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, type NavLink } from "@/content/nav";
import { useFadeMask } from "@/lib/chrome/useFadeMask";
import { MobileMenu } from "./MobileMenu";
import { NavBand } from "./NavBand";

/** The one breakpoint the whole layout turns on. */
const WIDE = "(min-width: 860px)";

const routeOf = (pathname: string): NavLink["href"] =>
  NAV_LINKS.find((link) => link.href !== "/" && pathname.startsWith(link.href))?.href ?? "/";

/**
 * The band, the menu and the masked scroller. All three share one piece of state — whether
 * the menu is open — so they live together rather than being wired through context.
 */
export function Chrome({ children }: { readonly children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const main = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const route = routeOf(pathname);

  /* Every route arrives at its own top, whatever the last one was scrolled to.
   *
   * The router restores a position rather than resetting one, and `html` carries
   * `scroll-behavior: smooth`, so a link taken from halfway down a long page could hand the
   * next route a scroll it never asked for and then ease into it. The sheet's own property is
   * turned off for the one call rather than asking `scrollTo` for `behavior: 'instant'`: that
   * is an enum member WebKit only learned late, and an unknown member does not degrade — it
   * throws, out of an effect, with no boundary above it, which takes the whole tree down and
   * leaves a blank page. The two-argument call and a property that has always existed cannot
   * fail that way.
   *
   * A hash is the one case that means the opposite: `/#purpose` is a request for a position,
   * and the browser is already on its way there. */
  useEffect(() => {
    if (window.location.hash) return;
    const html = document.documentElement;
    const eased = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = eased;
  }, [pathname]);
  /* Every route but one takes the nav-height mask. The programme's day rail is sticky chrome
     that lives inside <main>, so this mask's ramp would fall across the top of its own chips —
     that page measures its own band around the rail instead. See `useFadeMask`. */
  useFadeMask(main, route !== "/program");

  const close = useCallback(() => setMenuOpen(false), []);

  /* The menu closes itself on Escape, and on crossing to a width where the burger that
     opened it no longer exists — otherwise it would be stuck open with no control to shut
     it. Scroll is locked while it is up so the page behind cannot drift. */
  useEffect(() => {
    if (!menuOpen) return;
    const wide = window.matchMedia(WIDE);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", close);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", close);
    };
  }, [menuOpen, close]);

  /* Nothing closes the menu on a route change, because nothing needs to: the overlay's own
     click handler fires first as the tap on a link bubbles out through it. Doing it in an
     effect instead would set state during a render Next has already committed. */

  return (
    <>
      <NavBand route={route} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((was) => !was)} />
      {menuOpen && <MobileMenu route={route} onClose={close} />}
      <main
        ref={main}
        style={{
          flex: 1,
          transition: "opacity .3s ease",
          opacity: menuOpen ? 0 : 1,
          pointerEvents: menuOpen ? "none" : undefined,
        }}
      >
        {/* Keyed on the route so the incoming screen actually replays `pageIn`: <main> is
            persistent across navigations, so an animation on it runs once, at boot, and
            never again. Keeping it off <main> also frees that element's opacity for the
            menu fade — `animation-fill-mode: both` holds its own end state and would
            otherwise pin the page opaque behind an open menu. */}
        <div key={route} className="page-in">
          {children}
        </div>
      </main>
    </>
  );
}
