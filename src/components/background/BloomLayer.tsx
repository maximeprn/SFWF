"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { DYE_TEXTURE } from "@/content/photos";
import { createDyeFlow, type DyeFlow } from "./dyeFlow";
import { LOADER_STRENGTH, PAGE_STRENGTH } from "./shader";

/**
 * The live dye. Sits fixed behind every page — one per document, on the primary surface,
 * and the only ambient motion in the system.
 *
 * A swipe stirs it like a hand through liquid: the whole path of the stroke stays stirred,
 * and when the finger lifts the motion keeps developing for a couple of seconds rather than
 * stopping dead. Scrolling stirs it too, on a phone and with a wheel.
 *
 * Falls back to the static texture when WebGL is unavailable or the visitor has asked for
 * reduced motion — visually identical at rest.
 *
 * It stirs harder while the loading seal is up, where the dye is the whole screen, and eases
 * off once there is copy to read over it.
 */
export function BloomLayer({ loading = false }: { readonly loading?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);
  const live = !reduced && !failed;

  /* Retuning is a live setter, never a remount — rebuilding the flow would drop the field
     and with it every eddy currently unwinding. The ref seeds the first mount, since the
     retune effect below has not run yet at that point. */
  const flowRef = useRef<DyeFlow | null>(null);
  const strength = loading ? LOADER_STRENGTH : PAGE_STRENGTH;
  const strengthRef = useRef(strength);

  /* Whether this device can run the shader is only knowable after hydration, so setFailed
     is a genuine external-capability report, not derived state. It fires at most once, and
     only on hardware that can't run the effect at all. */
  useEffect(() => {
    if (reduced || failed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const flow = createDyeFlow(canvas, {
      image: DYE_TEXTURE,
      strength: strengthRef.current,
      onImageError: () => setFailed(true),
    });
    if (!flow) {
      setFailed(true);
      return;
    }
    flowRef.current = flow;
    return () => {
      flowRef.current = null;
      flow.destroy();
    };
  }, [reduced, failed]);

  useEffect(() => {
    strengthRef.current = strength;
    flowRef.current?.set({ strength });
  }, [strength]);

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: live ? "block" : "none",
        }}
      />
      {!live && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `url(${DYE_TEXTURE}) center/cover`,
          }}
        />
      )}
      {/* The veil is what lets white type hold over the dye. It stays on both paths. */}
      <div style={{ position: "absolute", inset: 0, background: "var(--veil)" }} />
    </div>
  );
}
