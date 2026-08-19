"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { createDyeFlow, type DyeFlow } from "./dyeFlow";
import { buildDyeGround, paintStill } from "./dyeGround";

/**
 * The dye. One fixed, viewport-sized canvas behind the page — the only ambient motion in
 * the system, and the only background in the product.
 *
 * A swipe stirs it like a hand through liquid: the whole path of the stroke stays stirred,
 * and when the finger lifts the motion keeps developing for a couple of seconds rather than
 * stopping dead. Scrolling stirs it too. There is deliberately no `pointerup` handler —
 * lifting off is not an event the field cares about; it simply stops being fed and coasts.
 *
 * The ground itself is the two-colour remap in `dyeGround`, handed over as a texture, so
 * nothing here knows anything about colour. Under `prefers-reduced-motion`, without WebGL,
 * or after the GPU takes the context back, `paintStill` draws the identical ground flat.
 */
export function BloomLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  /* Whether this device can run the shader is only knowable after hydration, so this is a
     genuine external-capability report rather than derived state. */
  const [lost, setLost] = useState(false);
  const still = reduced || lost;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let flow: DyeFlow | null = null;
    let dead = false;

    void buildDyeGround()
      .then((ground) => {
        if (dead) return;
        if (still) return paintStill(canvas, ground);
        /* No `onImageError`: the texture is a canvas just built here, so there is no fetch
           left to fail. Losing the context is the only way this stops painting. */
        flow = createDyeFlow(canvas, { image: ground, onContextLost: () => setLost(true) });
        if (!flow) paintStill(canvas, ground);
      })
      .catch((error: unknown) => {
        console.error("BloomLayer: dye ground failed —", error);
      });

    return () => {
      dead = true;
      flow?.destroy();
    };
  }, [still]);

  return (
    <div aria-hidden="true" className="dye-layer">
      {/* A canvas holds one context type for life, so the still path needs an element that
          has never been handed to WebGL. Keying on the mode gives it one. */}
      <canvas
        key={still ? "still" : "flow"}
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
