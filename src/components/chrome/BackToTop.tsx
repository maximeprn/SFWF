"use client";

import { useEffect, useState } from "react";
import { soft } from "@/lib/design/shapes";

/** Far enough down that the day filter is out of reach and scrolling back is a chore. */
const THRESHOLD = 640;

/**
 * Appears past 640px of scroll with no entrance animation — it is a control arriving, not
 * a thing being revealed — and smooth-scrolls to the top.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    /* Set only when it flips: this runs on every scroll frame, and re-rendering the whole
       page on each one to change nothing is the expensive way to do nothing. */
    const onScroll = () => {
      setShown((was) => {
        const past = window.scrollY > THRESHOLD;
        return past === was ? was : past;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!shown) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="cta"
      style={{
        position: "fixed",
        right: "clamp(14px,3vw,26px)",
        bottom: "clamp(14px,3vw,26px)",
        zIndex: 50,
        width: 44,
        height: 44,
        border: 0,
        clipPath: soft(4),
        background: "var(--orange)",
        color: "var(--button-ink)",
        font: "700 14.3px/1 var(--font-body)",
        cursor: "pointer",
        transition: "background var(--hover)",
      }}
    >
      ↑
    </button>
  );
}
