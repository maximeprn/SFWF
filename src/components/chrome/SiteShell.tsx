"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BloomLayer } from "@/components/background/BloomLayer";
import { LightboxProvider } from "@/components/ui/LightboxProvider";
import { NAV_H, useNavReveal } from "@/lib/useNavReveal";
import { Footer } from "./Footer";
import { ENTER_TOTAL_MS, Loader } from "./Loader";
import { Menu } from "./Menu";
import { NavBand } from "./NavBand";

/** Matches the key used by the blocking script in layout.tsx. */
export const ENTERED_KEY = "sfwf-entered";

export function SiteShell({ children }: { readonly children: ReactNode }) {
  const nav = useNavReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);

  /* The blocking script in <head> has already hidden the content if this is a first visit,
     so reading the flag here only decides whether to mount the seal — it never causes the
     flash it is preventing. sessionStorage is unreadable during SSR, so this genuinely
     cannot be derived during render without a hydration mismatch. */
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!sessionStorage.getItem(ENTERED_KEY)) setLoading(true);
      else document.documentElement.classList.remove("sfwf-loading");
    } catch {
      // Private-mode Safari throws on sessionStorage; entering without the seal is fine.
      document.documentElement.classList.remove("sfwf-loading");
    }
  }, []);

  const enter = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    try {
      sessionStorage.setItem(ENTERED_KEY, "1");
    } catch {
      // Nothing to do — the seal simply shows again next navigation.
    }
    /* The seal owns its own timing — it holds for the underline, then fades. Unmounting
       on any shorter clock would cut one or the other off. */
    setTimeout(() => {
      setLoading(false);
      setLeaving(false);
      document.documentElement.classList.remove("sfwf-loading");
    }, ENTER_TOTAL_MS);
  }, [leaving]);

  return (
    <LightboxProvider>
      <BloomLayer loading={loading} />

      {/* The dye stays put; only the page content fades when the menu opens. */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          paddingTop: NAV_H,
          opacity: menuOpen ? 0 : 1,
          transition: "opacity .34s ease",
          pointerEvents: menuOpen ? "none" : "auto",
        }}
      >
        <div style={{ maxWidth: "var(--column)", margin: "0 auto" }}>{children}</div>
        <Footer />
      </main>

      {menuOpen && <Menu onClose={() => setMenuOpen(false)} />}

      <NavBand nav={nav} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />

      {loading && <Loader onEnter={enter} exiting={leaving} />}
    </LightboxProvider>
  );
}
