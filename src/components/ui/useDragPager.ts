"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Full-bleed pager on native scroll snapping, so a real finger swipe drives it — the same
 * rhythm as the phone's own photo app. Adds click-drag panning on top, so a desktop
 * without a trackpad can swipe too, and arrow keys for review.
 *
 * `moved` is tracked so a real drag never reads as a tap: closing on click would otherwise
 * fire at the end of every swipe.
 */
export function useDragPager(count: number, index: number, onClose: () => void) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: 0 });
  const [at, setAt] = useState(index);
  /* Mirrored into state as well as the ref: snap has to be switched off *during* the drag,
     which means the render needs to see it. The ref stays because pointermove reads it at
     event rate, where a re-render per frame would be wasteful. */
  const [dragging, setDragging] = useState(false);

  // Land on the tapped photo without animating in from the first one.
  useEffect(() => {
    const el = trackRef.current;
    if (el) el.scrollLeft = index * el.clientWidth;
  }, [index]);

  const goTo = useCallback(
    (n: number) => {
      const el = trackRef.current;
      if (!el) return;
      const i = Math.max(0, Math.min(count - 1, n));
      el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
      setAt(i);
    },
    [count],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(at + 1);
      else if (e.key === "ArrowLeft") goTo(at - 1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [at, goTo, onClose]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return; // native snapping already handles touch
    const el = trackRef.current;
    if (!el) return;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: 0 };
    setDragging(true);
    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.on || !el) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    el.scrollLeft = d.left - dx;
  };

  const onPointerUp = () => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.on || !el) return;
    d.on = false;
    setDragging(false);
    if (d.moved > 10) goTo(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    setTimeout(() => { drag.current.moved = 0; }, 0);
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (drag.current.on) return;
    const el = e.currentTarget;
    setAt(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
  };

  /** Close on the surround only — a tap on the photo itself stays put. */
  const maybeClose = (e: React.MouseEvent) => {
    if (drag.current.moved > 10) return;
    if (e.target === e.currentTarget) onClose();
  };

  return {
    trackRef,
    at,
    goTo,
    maybeClose,
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onScroll },
  };
}
