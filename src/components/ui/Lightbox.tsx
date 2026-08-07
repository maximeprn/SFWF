"use client";

import type { CSSProperties } from "react";
import { blob } from "@/lib/design/shapes";
import type { Photo } from "@/content/photos";
import { useDragPager } from "./useDragPager";

/* The two round controls share the frosted treatment. This is the one place the design
   uses blur — the buttons float over arbitrary photography and need to stay readable. */
const control: CSSProperties = {
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  background: "rgba(255,255,255,.16)",
  border: "1px solid rgba(255,255,255,.3)",
  backdropFilter: "blur(6px)",
  color: "#fff",
  font: "400 20px var(--font-display)",
  userSelect: "none",
};

export function Lightbox({
  list,
  index,
  onClose,
}: {
  readonly list: readonly Photo[];
  readonly index: number;
  readonly onClose: () => void;
}) {
  const { trackRef, at, goTo, maybeClose, dragging, handlers } = useDragPager(
    list.length,
    index,
    onClose,
  );
  const current = list[at];

  const arrow: CSSProperties = {
    ...control,
    position: "absolute",
    top: "50%",
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 999,
    zIndex: 2,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(6,12,20,.97)",
        animation: "lbIn .22s ease-out both",
      }}
    >
      <div
        className="noscroll"
        ref={trackRef}
        {...handlers}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: dragging ? "none" : "x mandatory",
          touchAction: "pan-x pinch-zoom",
          WebkitOverflowScrolling: "touch",
          cursor: "grab",
        }}
      >
        {list.map((p, n) => (
          <div
            key={`${p.src}-${n}`}
            onClick={maybeClose}
            style={{
              flex: "0 0 100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0,
              scrollSnapAlign: "center",
              padding: "104px 14px 112px",
              boxSizing: "border-box",
            }}
          >
            {/* Intrinsic ratio: width and height both auto, capped by the frame. Plain
                <img> rather than next/image — the viewer wants the full-resolution file. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.caption}
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
                flex: "0 1 auto",
                display: "block",
                touchAction: "pinch-zoom",
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "0 26px 44px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 7,
          pointerEvents: "none",
        }}
      >
        <p style={{ margin: 0, font: "var(--text-body-sm)", color: "rgba(255,255,255,.94)", textAlign: "center", textWrap: "pretty" }}>
          {current?.caption}
        </p>
        <p style={{ margin: 0, font: "var(--text-caption)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "rgba(255,255,255,.55)" }}>
          {at + 1} / {list.length}
        </p>
      </div>

      {at > 0 && (
        <button type="button" aria-label="Previous photo" onClick={() => goTo(at - 1)} style={{ ...arrow, left: 12 }}>
          ‹
        </button>
      )}
      {at < list.length - 1 && (
        <button type="button" aria-label="Next photo" onClick={() => goTo(at + 1)} style={{ ...arrow, right: 12 }}>
          ›
        </button>
      )}
      <button
        type="button"
        aria-label="Close photo viewer"
        onClick={onClose}
        style={{ ...control, position: "absolute", top: 56, right: 18, width: 40, height: 40, borderRadius: blob(2), font: "400 17px var(--font-display)" }}
      >
        ✕
      </button>
    </div>
  );
}
