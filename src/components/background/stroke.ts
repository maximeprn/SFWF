/**
 * Pointer, touch and wheel input, reduced to the handful of numbers the sim pass wants.
 *
 * There is deliberately no pointerup / pointerleave / pointercancel handler. Lifting off is
 * not an event this effect cares about: the field simply stops being fed and coasts, and
 * adding a release handler is the single easiest way to reintroduce the old "stops dead on
 * release" behaviour.
 *
 * Listening on the window rather than the canvas is what lets a gesture anywhere on the
 * page — over copy, over the menu — stir the dye underneath it. `touchmove` is separate from
 * `pointermove` because it keeps firing through momentum scroll, where pointer events stop.
 */
import {
  MAX_SPEED,
  VELOCITY_SMOOTHING,
  WHEEL_CLAMP,
  WHEEL_DECAY,
  WHEEL_GAIN,
} from "./shader";

export type Stroke = {
  /** Segment start — where the pointer was at the previous frame, 0..1 of the canvas box. */
  ax: number;
  ay: number;
  /** Segment end — where it is now. The splat covers the whole path between the two. */
  px: number;
  py: number;
  /** Smoothed stroke velocity plus wheel injection, in screen widths per second. */
  vx: number;
  vy: number;
  /** 1 while input is feeding the field, 0 once it is only coasting. */
  act: number;
  /** Time of the last input in seconds, or -1 if there has never been one. */
  lastInput: number;
};

export type StrokeTracker = {
  /** Advance one frame. Call once per rAF, before the sim pass. */
  step(dt: number, t: number): Stroke;
  /** Re-read the canvas box. Call on resize, not per event — this forces layout. */
  measure(): void;
  destroy(): void;
};

export function createStrokeTracker(canvas: HTMLCanvasElement): StrokeTracker {
  let px = 0.5;
  let py = 0.5;
  let ax = 0.5;
  let ay = 0.5;
  let sx = 0; // smoothed stroke velocity
  let sy = 0;
  let ex = 0; // wheel-injected velocity, decaying
  let ey = 0;
  let moved = false;
  let lastInput = -1;
  let box = canvas.getBoundingClientRect();

  /* Reused rather than rebuilt each frame — the draw loop allocates nothing. */
  const frame: Stroke = { ax, ay, px, py, vx: 0, vy: 0, act: 0, lastInput };

  const at = (clientX: number, clientY: number) => {
    px = (clientX - box.left) / box.width;
    py = (clientY - box.top) / box.height;
    moved = true;
  };
  const onPointer = (e: PointerEvent) => at(e.clientX, e.clientY);
  const onTouch = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) at(touch.clientX, touch.clientY);
  };
  const onWheel = (e: WheelEvent) => {
    at(e.clientX, e.clientY);
    const gain = (-e.deltaY / box.height) * WHEEL_GAIN;
    ey += Math.max(-WHEEL_CLAMP, Math.min(WHEEL_CLAMP, gain));
  };

  const passive = { passive: true } as const;
  window.addEventListener("pointerdown", onPointer, passive);
  window.addEventListener("pointermove", onPointer, passive);
  window.addEventListener("touchmove", onTouch, passive);
  window.addEventListener("wheel", onWheel, passive);

  return {
    step(dt, t) {
      let tvx = 0;
      let tvy = 0;
      if (moved) {
        tvx = (px - ax) / dt;
        tvy = (py - ay) / dt;
        const speed = Math.hypot(tvx, tvy);
        if (speed > MAX_SPEED) {
          tvx *= MAX_SPEED / speed;
          tvy *= MAX_SPEED / speed;
        }
        lastInput = t;
      }
      sx += (tvx - sx) * VELOCITY_SMOOTHING;
      sy += (tvy - sy) * VELOCITY_SMOOTHING;
      ex *= WHEEL_DECAY;
      ey *= WHEEL_DECAY;

      frame.ax = ax;
      frame.ay = ay;
      frame.px = px;
      frame.py = py;
      frame.vx = sx + ex;
      frame.vy = sy + ey;
      frame.act = moved || Math.hypot(ex, ey) > 0.02 ? 1 : 0;
      frame.lastInput = lastInput;

      ax = px;
      ay = py;
      moved = false;
      return frame;
    },
    measure() {
      box = canvas.getBoundingClientRect();
    },
    destroy() {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("wheel", onWheel);
    },
  };
}
