"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NAV } from "@/content/site";
import { MENU_RING } from "@/lib/design/shapes";

const HOLD_MS = 420;

/**
 * The mobile menu: five words inside one hand-drawn wobbly ring, on the dye.
 *
 * Tap feedback matches the buttons — the word goes gold and holds for a beat before the
 * screen changes, so the press is felt rather than swallowed by the transition.
 */
export function Menu({ onClose }: { readonly onClose: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const pick = (href: string) => {
    if (picked) return;
    setPicked(href);
    timer.current = setTimeout(() => {
      router.push(href);
      onClose();
    }, HOLD_MS);
  };

  return (
    <div
      id="sfwf-menu"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        animation: "menuIn .34s ease both",
      }}
    >
      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "0 16px 64px" }}>
        <div style={{ position: "relative", width: 322, height: 326, display: "grid", placeItems: "center" }}>
          <svg
            viewBox="0 0 300 320"
            aria-hidden="true"
            style={{ position: "absolute", left: -32, top: -15, width: 387, height: 382, overflow: "visible" }}
          >
            <path
              d={MENU_RING}
              fill="none"
              stroke="var(--on-bg)"
              strokeWidth="2.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <nav style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const lit = picked === item.href || (!picked && active);
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => pick(item.href)}
                  style={{
                    border: 0,
                    background: "none",
                    padding: 0,
                    font: "var(--display-3)",
                    fontSize: active ? 36 : 28,
                    color: lit ? "var(--mark)" : "var(--on-bg)",
                    cursor: "pointer",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    opacity: picked ? (picked === item.href ? 1 : 0.34) : active ? 1 : 0.74,
                    transition: "color .14s ease, opacity .22s ease",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
