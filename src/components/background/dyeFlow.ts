/**
 * The dye flow itself: one sim step and one display draw per animation frame, ported from
 * the festival's motion prototype. Framework-agnostic on purpose — `BloomLayer` is only a
 * host for it.
 *
 * Nothing here belongs in React state. Every value is frame-local and mutated in place, so
 * the loop allocates nothing and no frame can trigger a re-render.
 */
import { createField, disposeField, type Field } from "./field";
import { createPipeline, disposePipeline, type Pipeline } from "./pipeline";
import { createStrokeTracker, type Stroke, type StrokeTracker } from "./stroke";
import {
  DEFAULT_FEEL,
  DEFAULT_RADIUS,
  DPR_CAP,
  DT_MAX,
  DT_MIN,
  FEELS,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  IDLE_AMP,
  IDLE_FADE,
  IDLE_PERIOD,
  IDLE_WAIT,
  PAGE_STRENGTH,
  wave,
  type FeelName,
} from "./shader";

/** The noise tile is 64px but sampled over a 128px box, so the grain reads soft, not sharp. */
const NOISE_SCALE = 128;

export type FlowSettings = { feel: FeelName; strength: number; radius: number };

export type FlowOptions = Partial<FlowSettings> & {
  image: string;
  onImageError?: () => void;
  /** The GPU took the context back. Nothing will paint again — show the still dye. */
  onContextLost?: () => void;
};

export type DyeFlow = {
  set(next: Partial<FlowSettings>): void;
  destroy(): void;
  readonly usingHalfFloat: boolean;
};

type Ctx = FlowSettings & {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  pipeline: Pipeline;
  /** Null when the device can't render to a field at all — ambient drift only. */
  field: Field | null;
  cur: number;
  /** The box moved; the loop picks it up on its next frame rather than mid-scroll. */
  resized: boolean;
};

function simPass(ctx: Ctx, stroke: Stroke, dt: number): void {
  const { gl, pipeline: p, field, canvas } = ctx;
  if (!field) return;
  const feel = FEELS[ctx.feel];
  gl.bindFramebuffer(gl.FRAMEBUFFER, field.framebuffers[1 - ctx.cur]);
  gl.viewport(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
  gl.useProgram(p.sim);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, field.textures[ctx.cur]);
  gl.uniform2f(p.s.texel, 1 / FIELD_WIDTH, 1 / FIELD_HEIGHT);
  gl.uniform1f(p.s.ar, canvas.width / canvas.height);
  gl.uniform1f(p.s.dt, dt);
  /* Decay expressed against dt, so 60 Hz and 120 Hz settle over the same wall-clock time. */
  gl.uniform1f(p.s.damp, Math.exp(-dt / feel.tau));
  gl.uniform1f(p.s.agDamp, Math.exp(-dt / (feel.tau * 2.1)));
  gl.uniform1f(p.s.curl, feel.curl);
  gl.uniform1f(p.s.visc, feel.visc);
  gl.uniform1f(p.s.rad, ctx.radius);
  gl.uniform1f(p.s.push, feel.push * ctx.strength);
  gl.uniform1f(p.s.act, stroke.act);
  gl.uniform1f(p.s.vsc, field.vsc);
  gl.uniform2f(p.s.pa, stroke.ax, stroke.ay);
  gl.uniform2f(p.s.pb, stroke.px, stroke.py);
  gl.uniform2f(p.s.pv, stroke.vx, stroke.vy);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  ctx.cur = 1 - ctx.cur;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.bindTexture(gl.TEXTURE_2D, field.textures[ctx.cur]);
}

function displayPass(ctx: Ctx, stroke: Stroke, t: number): void {
  const { gl, pipeline: p, field } = ctx;
  const feel = FEELS[ctx.feel];
  gl.useProgram(p.display);

  /* The resting pulse: silent for IDLE_WAIT after the last input, then back over IDLE_FADE. */
  const quiet = stroke.lastInput < 0 ? 1 : (t - stroke.lastInput - IDLE_WAIT) / IDLE_FADE;
  const rest = Math.min(1, Math.max(0, quiet));
  gl.uniform1f(p.u.amp, IDLE_AMP * rest * (0.28 + 0.72 * wave(IDLE_PERIOD, t)) * ctx.strength);

  /* The two dye layers drift on their own 30s and 44s cycles — ambient, unrelated to input. */
  const k1 = wave(30, t);
  const k2 = wave(44, t);
  gl.uniform2f(p.u.o1, -0.026 * k1, 0.018 * k1);
  gl.uniform1f(p.u.s1, 1.05 + 0.07 * k1);
  gl.uniform2f(p.u.o2, 0.034 * k2, -0.022 * k2);
  gl.uniform1f(p.u.s2, 1.13 - 0.1 * k2);
  const drift = (t / 26) % 1;
  gl.uniform2f(p.u.gd, -drift, -drift);

  gl.uniform2f(p.u.pt, stroke.px, stroke.py);
  gl.uniform1f(p.u.dispK, field ? feel.disp : 0);
  gl.uniform1f(p.u.vsc, field ? field.vsc : 1);
  gl.uniform1f(p.u.grain, feel.grain);
  gl.uniform1f(p.u.tt, t);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/**
 * Assigning to `canvas.width`/`height` reallocates the drawing buffer and clears it to
 * black, whether or not the value actually changed. So this only assigns when the pixel
 * size really moved, and the loop only calls it immediately before painting a frame.
 *
 * Both halves matter on iOS, where the URL bar resizes the viewport continuously through
 * a scroll: an unguarded resize blanks the canvas between frames, and on an opaque context
 * that reads as the whole page flashing black.
 */
function resize(ctx: Ctx, tracker: StrokeTracker): void {
  const { gl, canvas, pipeline } = ctx;
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  const width = Math.max(1, (box.width * dpr) | 0);
  const height = Math.max(1, (box.height * dpr) | 0);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  gl.useProgram(pipeline.display);
  gl.uniform1f(pipeline.u.ar, width / height);
  gl.uniform2f(pipeline.u.gs, box.width / NOISE_SCALE, box.height / NOISE_SCALE);
  gl.viewport(0, 0, width, height);
  tracker.measure();
}

/** The artwork is never modified — only where the shader samples it moves. */
function loadDye(ctx: Ctx, url: string, onError?: () => void): () => void {
  const { gl, pipeline } = ctx;
  const image = new Image();
  let dead = false;
  image.crossOrigin = "anonymous";
  image.onload = () => {
    if (dead) return;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pipeline.dye);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.useProgram(pipeline.display);
    gl.uniform1f(pipeline.u.imgAr, image.naturalWidth / image.naturalHeight);
  };
  image.onerror = () => {
    console.error("BloomLayer: dye texture failed to load —", url);
    onError?.();
  };
  image.src = url;
  return () => {
    dead = true;
  };
}

function startLoop(ctx: Ctx, tracker: StrokeTracker): () => void {
  const t0 = performance.now();
  let prev = t0;
  let raf = 0;
  const draw = () => {
    raf = requestAnimationFrame(draw);
    /* Many observer ticks collapse into one resize here, and the frame that follows
       repaints the buffer the resize just cleared before anything is composited. */
    if (ctx.resized) {
      ctx.resized = false;
      resize(ctx, tracker);
    }
    const now = performance.now();
    const dt = Math.max(DT_MIN, Math.min(DT_MAX, (now - prev) / 1000));
    prev = now;
    const stroke = tracker.step(dt, (now - t0) / 1000);
    simPass(ctx, stroke, dt);
    displayPass(ctx, stroke, (now - t0) / 1000);
  };
  /* Nothing to look at in a hidden tab, and a paused loop must not bill the gap as one dt. */
  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (document.hidden) return;
    prev = performance.now();
    draw();
  };
  document.addEventListener("visibilitychange", onVisibility);
  draw();
  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

/** Returns null when WebGL is unavailable; the caller should fall back to the static image. */
export function createDyeFlow(canvas: HTMLCanvasElement, options: FlowOptions): DyeFlow | null {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const pipeline = createPipeline(gl);
  if (!pipeline) return null;

  const ctx: Ctx = {
    gl,
    canvas,
    pipeline,
    field: createField(gl),
    cur: 0,
    resized: false,
    feel: options.feel ?? DEFAULT_FEEL,
    strength: options.strength ?? PAGE_STRENGTH,
    radius: options.radius ?? DEFAULT_RADIUS,
  };

  /* Without a field, unit 2 still has to sample as "at rest" — the display pass reads it. */
  if (!ctx.field) {
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, pipeline.rest);
  }

  const tracker = createStrokeTracker(canvas);
  const cancelLoad = loadDye(ctx, options.image, options.onImageError);
  /* The observer only raises a flag — the loop does the work, in a frame it then paints. */
  const observer = new ResizeObserver(() => {
    ctx.resized = true;
  });
  observer.observe(canvas);
  resize(ctx, tracker);
  const stopLoop = startLoop(ctx, tracker);

  /* iOS hands WebGL contexts back under memory pressure. Left alone the canvas simply
     stays black, which on an opaque context is a black screen — so stand down and let
     the host put the still dye up instead. */
  const onContextLost = (event: Event) => {
    event.preventDefault();
    stopLoop();
    options.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    set(next) {
      Object.assign(ctx, next);
    },
    get usingHalfFloat() {
      return ctx.field?.halfFloat ?? false;
    },
    destroy() {
      stopLoop();
      cancelLoad();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      observer.disconnect();
      tracker.destroy();
      if (ctx.field) ctx.field = disposeField(gl, ctx.field);
      disposePipeline(gl, pipeline);
    },
  };
}
