/**
 * The dye flow — the festival's signature background, as one drop-in module.
 *
 * A swipe stirs a liquid full of suspended glitter: the whole path of the stroke stays
 * stirred, and when the finger lifts the motion keeps developing for a couple of seconds
 * rather than stopping dead. Scrolling stirs it too, on a phone and with a wheel.
 *
 * Two passes per frame. The sim pass keeps a velocity field that self-advects, rolls shear
 * up into eddies and decays over a couple of seconds; the display pass samples the dye
 * artwork at an offset taken from that field. Momentum lives in the field rather than in
 * an input-bound envelope, which is why the motion keeps developing after a finger lifts.
 *
 * Framework-agnostic on purpose — DyeLayer.jsx is only a host for it. Nothing here belongs
 * in component state: every value is frame-local and mutated in place, so the loop
 * allocates nothing and no frame can trigger a re-render.
 *
 *   const flow = createDyeFlow(canvas, { image: '/textures/indigo-shibori.webp' });
 *   flow.set({ strength: 1.45 });
 *   flow.destroy();
 *
 * Returns null when WebGL is unavailable; the caller should fall back to the static image.
 *
 * ⚠ Every constant below is the shipped, user-approved value, tuned interactively against
 * the real artwork on a phone. Moving `tau`, `visc` or `disp` by more than ~20% visibly
 * changes the character. Don't retune them.
 */

/** Feel presets. Turbulent is the shipped default. */
export const FEELS = {
  Calm: { push: 0.6, curl: 1.1, tau: 2.1, visc: 0.012, disp: 0.058, grain: 0.9 },
  Flowing: { push: 1.0, curl: 2.2, tau: 1.7, visc: 0.016, disp: 0.086, grain: 1.3 },
  Turbulent: { push: 1.55, curl: 3.7, tau: 1.4, visc: 0.02, disp: 0.12, grain: 1.9 },
};

export const DEFAULT_FEEL = 'Turbulent';

/**
 * Swirl strength — the swipe gain, and the idle pulse amplitude with it.
 *
 * Full over the loading seal, where the dye is the whole screen and the only thing there
 * is to play with. Eased back behind page content, where the same motion competes with
 * copy for attention rather than rewarding it.
 */
export const LOADER_STRENGTH = 1.45;
export const PAGE_STRENGTH = 0.85;

/** Stir radius as a fraction of viewport width. Sanctioned range 3–40%. */
export const DEFAULT_RADIUS = 0.05;

/* The resting pulse — the pre-flow ripple, kept as the state the dye relaxes back into. */
const DISP = 5.4;
const SPEED = 2.15;
const RING = 9.0;
const STR = 0.042;
const BLOOM = 0.034;
const IDLE_AMP = 0.18;
const IDLE_PERIOD = 4.8;
const IDLE_WAIT = 1.1;
const IDLE_FADE = 2.2;

/** Power-of-two so REPEAT wrapping is legal in WebGL 1 — that wrap is the no-borders behaviour. */
const FIELD_WIDTH = 128;
const FIELD_HEIGHT = 256;

/** Velocity range packed into the field. The 8-bit fallback trades range for precision. */
const VSC_HALF = 2.0;
const VSC_BYTE = 0.6;

const MAX_SPEED = 2.4; // stroke speed cap, screen widths / second
const VELOCITY_SMOOTHING = 0.45;
const WHEEL_DECAY = 0.82;
const WHEEL_GAIN = 2.4;
const WHEEL_CLAMP = 1.6;
const DT_MIN = 1 / 240;
const DT_MAX = 1 / 24;
const DPR_CAP = 2;
const GRAIN_TILE = 64;

/** The noise tile is 64px but sampled over a 128px box, so the grain reads soft, not sharp. */
const NOISE_SCALE = 128;

/**
 * How long the box must hold still before the drawing buffer is rebuilt to match it.
 *
 * A rebuild clears the buffer to black, and iOS scrolls on the compositor: it will happily
 * present frames while the main thread is still waiting for its next rAF, so between the
 * clear and the repaint the screen really is black. That gap only exists during a drag,
 * which is why the flash never showed on a tap.
 */
const RESIZE_SETTLE_MS = 250;

/** The two ambient dye layers and the noise drift, all on slow cosine cycles. */
const wave = (period, t) => 0.5 - 0.5 * Math.cos(2 * Math.PI * ((t / period) % 1));

const VERTEX_SHADER =
  'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}';

/**
 * Pass 1 — the velocity field. RG is velocity, B is "agitation": a scalar that trails the
 * stroke and outlives it, driving the extra grain in a disturbed wake.
 */
const SIM_FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D V; uniform vec2 texel,pa,pb,pv;
uniform float ar,dt,damp,agDamp,curl,rad,push,act,vsc,visc;
vec3 rd(vec2 u){ return texture2D(V,fract(u)).xyz; }
vec2 vel(vec2 u){ return (rd(u).xy*2.0-1.0)*vsc; }
void main(){
  vec2 uv=gl_FragCoord.xy*texel, asp=vec2(ar,1.0);
  vec2 back=uv-vel(uv)*dt*0.9/asp;
  vec3 sb=rd(back); vec2 nv=(sb.xy*2.0-1.0)*vsc; float ag=sb.z;
  vec2 tx=vec2(texel.x,0.0), ty=vec2(0.0,texel.y);
  vec2 l=vel(uv-tx), r=vel(uv+tx), d=vel(uv-ty), u=vel(uv+ty);
  float w=(r.y-l.y)-(u.x-d.x);
  nv+=curl*dt*w*vec2(-nv.y,nv.x);
  nv=mix(nv,(l+r+d+u)*0.25,clamp(visc*dt*60.0,0.0,1.0));
  vec2 A=pa*asp,B=pb*asp,P=uv*asp,AB=B-A;
  float hh=clamp(dot(P-A,AB)/max(dot(AB,AB),1e-6),0.0,1.0);
  float dd=length(P-(A+AB*hh));
  float g=exp(-dd*dd/(rad*rad));
  nv+=pv*g*push*dt*act*6.0;
  ag=min(1.0,ag*agDamp+g*act*dt*2.2);
  nv*=damp;
  nv=clamp(nv,-vsc,vsc);
  gl_FragColor=vec4(nv/vsc*0.5+0.5,ag,1.0);
}`;

/**
 * Pass 2 — display. The field displacement and the resting pulse both feed `dp`, which
 * offsets three samples: two copies of the dye at slightly different scales, soft-light
 * blended, and a 64px noise tile overlaid harder where the dye is agitated. That last
 * term is what sells "suspended glitter" without drawing a single particle.
 */
const DISPLAY_FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D T,G,V; uniform float ar,amp,imgAr,gmx,dispK,vsc,grain,blend;
uniform vec2 pt,o1,o2,gd,gs; uniform float s1,s2,tt; varying vec2 v;
float sl(float b,float s){ if(s<=0.5)return b-(1.0-2.0*s)*b*(1.0-b);
  float d=(b<=0.25)?((16.0*b-12.0)*b+4.0)*b:sqrt(b); return b+(2.0*s-1.0)*(d-b); }
float ov(float b,float s){return b<0.5?2.0*b*s:1.0-2.0*(1.0-b)*(1.0-s);}
void main(){
  vec3 f=texture2D(V,v).rgb;
  vec2 fv=(f.xy*2.0-1.0)*vsc; float ag=f.z;
  vec2 dp=fv*dispK/vec2(ar,1.0);
  vec2 d=(v-pt)*vec2(ar,1.0); float r=length(d)+1e-4; vec2 dir=d/r;
  float ring=sin(r*${RING.toFixed(2)}-tt*${SPEED.toFixed(3)})*exp(-r*${DISP.toFixed(3)})*amp;
  float bl=exp(-r*r*${DISP.toFixed(3)}*2.2)*amp;
  dp+=dir*(ring*${STR.toFixed(4)}+bl*${BLOOM.toFixed(4)});
  vec2 sc=imgAr>ar?vec2(ar/imgAr,1.0):vec2(1.0,imgAr/ar);
  vec2 cov=(v-0.5)*sc+0.5;
  vec3 c1=texture2D(T,clamp((cov-0.5)/s1+0.5+o1+dp,0.002,0.998)).rgb;
  vec3 c2=texture2D(T,clamp((cov-0.5)/s2+0.5+o2+dp*0.72,0.002,0.998)).rgb;
  /* blend is 0 on a two-colour ground: soft-light between two offset copies invents
     in-between violets, and the brightness gain lifts the ground hex. The ground must
     stay exactly the two palette colours, so only layer 1 is shown, drifting on its own
     30s cycle and displaced by the flow. Raise the blend uniform for photographic art. */
  vec3 c=mix(c1,vec3(sl(c1.r,c2.r),sl(c1.g,c2.g),sl(c1.b,c2.b)),blend);
  vec3 g=texture2D(G,v*gs+gd+dp*0.45).rgb;
  c=mix(c,vec3(ov(c.r,g.r),ov(c.g,g.g),ov(c.b,g.b)),0.42*gmx*(1.0+ag*grain));
  gl_FragColor=vec4(c,1.0);
}`;

const DISPLAY_UNIFORMS = ['ar','amp','imgAr','gmx','pt','o1','o2','gd','gs','s1','s2','tt','dispK','vsc','grain','blend'];
const SIM_UNIFORMS = ['texel','ar','dt','damp','agDamp','curl','rad','push','act','pa','pb','pv','vsc','visc'];

/* ── the velocity field ──────────────────────────────────────────────────────
   Two 128×256 textures ping-ponged through framebuffers, one sim step per frame. Both
   wrap on both axes, which is the entire no-borders behaviour — flow that leaves one edge
   re-enters the other instead of reflecting back.

   Three device tiers, in order of preference: half-float, 8-bit, and none at all. On the
   last one the ambient drift and resting pulse still run; only the stirring is dropped. */

function fieldTexture(gl, type) {
  const texture = gl.createTexture();
  if (!texture) return null;
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, FIELD_WIDTH, FIELD_HEIGHT, 0, gl.RGBA, type, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

function disposeField(gl, field) {
  for (const fb of field.framebuffers) gl.deleteFramebuffer(fb);
  for (const tx of field.textures) gl.deleteTexture(tx);
  field.framebuffers.length = 0;
  field.textures.length = 0;
  return null;
}

function buildField(gl, type, vsc, halfFloat) {
  const field = { textures: [], framebuffers: [], vsc, halfFloat };
  for (let i = 0; i < 2; i++) {
    const texture = fieldTexture(gl, type);
    const framebuffer = gl.createFramebuffer();
    if (!texture || !framebuffer) {
      if (texture) gl.deleteTexture(texture);
      if (framebuffer) gl.deleteFramebuffer(framebuffer);
      return disposeField(gl, field);
    }
    field.textures.push(texture);
    field.framebuffers.push(framebuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return disposeField(gl, field);
    }
    /* Clear to packed zero velocity so the first frames start from rest, not from noise. */
    gl.viewport(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
    gl.clearColor(0.5, 0.5, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return field;
}

function createField(gl) {
  const half = gl.getExtension('OES_texture_half_float');
  const linear = gl.getExtension('OES_texture_half_float_linear');
  gl.getExtension('EXT_color_buffer_half_float');
  if (half && linear) {
    const field = buildField(gl, half.HALF_FLOAT_OES, VSC_HALF, true);
    if (field) return field;
  }
  return buildField(gl, gl.UNSIGNED_BYTE, VSC_BYTE, false);
}

/* ── the pipeline ────────────────────────────────────────────────────────────
   GL objects that live as long as the canvas: the two programs, their uniform locations,
   the fullscreen quad, and the three sampled textures. Texture units are fixed —
   0 the dye artwork, 1 the noise tile, 2 the velocity field. */

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error('dyeFlow: shader failed to compile —', gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

/** Both programs share attribute location 0, so one bound quad feeds either pass. */
function link(gl, fragment) {
  const program = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  if (!program || !vs || !fs) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, 'p');
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error('dyeFlow: program failed to link —', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function locate(gl, program, names) {
  const out = {};
  for (const name of names) out[name] = gl.getUniformLocation(program, name);
  return out;
}

function makeTexture(gl, unit, pixel, repeat) {
  const texture = gl.createTexture();
  if (!texture) return null;
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(pixel));
  const wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

/** Monochrome noise, generated rather than shipped as an asset. */
function grainCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = GRAIN_TILE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const img = ctx.createImageData(GRAIN_TILE, GRAIN_TILE);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = 96 + Math.floor(Math.random() * 96);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = n;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function createPipeline(gl) {
  const display = link(gl, DISPLAY_FRAGMENT_SHADER);
  const sim = link(gl, SIM_FRAGMENT_SHADER);
  const quad = gl.createBuffer();
  const dye = makeTexture(gl, 0, [158, 178, 199, 255], false);
  const grain = makeTexture(gl, 1, [128, 128, 128, 255], true);
  /* Half in RG is zero velocity once unpacked, and zero in B is no agitation. */
  const rest = makeTexture(gl, 2, [128, 128, 0, 255], true);
  if (!display || !sim || !quad || !dye || !grain || !rest) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, grain);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grainCanvas());

  gl.useProgram(sim);
  gl.uniform1i(gl.getUniformLocation(sim, 'V'), 2);
  gl.useProgram(display);
  gl.uniform1i(gl.getUniformLocation(display, 'T'), 0);
  gl.uniform1i(gl.getUniformLocation(display, 'G'), 1);
  gl.uniform1i(gl.getUniformLocation(display, 'V'), 2);

  const u = locate(gl, display, DISPLAY_UNIFORMS);
  gl.uniform1f(u.imgAr, 2);
  /* Noise-overlay mix. 0 leaves the dye clean — the flow, the drift and the resting pulse
   * all still run; only the grain sparkle is dropped. */
  gl.uniform1f(u.gmx, 0);
  /* Second-layer soft-light mix. 0 keeps the palette exact (see the display shader). */
  gl.uniform1f(u.blend, 0);
  return { display, sim, u, s: locate(gl, sim, SIM_UNIFORMS), dye, grain, rest, quad };
}

function disposePipeline(gl, p) {
  gl.deleteTexture(p.dye);
  gl.deleteTexture(p.grain);
  gl.deleteTexture(p.rest);
  gl.deleteBuffer(p.quad);
  gl.deleteProgram(p.display);
  gl.deleteProgram(p.sim);
}

/* ── input ───────────────────────────────────────────────────────────────────
   Pointer, touch and wheel, reduced to the handful of numbers the sim pass wants.

   There is deliberately no pointerup / pointerleave / pointercancel handler. Lifting off
   is not an event this effect cares about: the field simply stops being fed and coasts,
   and adding a release handler is the single easiest way to reintroduce the old "stops
   dead on release" behaviour.

   Listening on the window rather than the canvas is what lets a gesture anywhere on the
   page — over copy, over the menu — stir the dye underneath it. `touchmove` is separate
   from `pointermove` because it keeps firing through momentum scroll. */

function createStrokeTracker(canvas) {
  let px = 0.5, py = 0.5, ax = 0.5, ay = 0.5;
  let sx = 0, sy = 0; // smoothed stroke velocity
  let ex = 0, ey = 0; // wheel-injected velocity, decaying
  let moved = false;
  let lastInput = -1;
  let box = canvas.getBoundingClientRect();

  /* Reused rather than rebuilt each frame — the draw loop allocates nothing. */
  const frame = { ax, ay, px, py, vx: 0, vy: 0, act: 0, lastInput };

  const at = (clientX, clientY) => {
    px = (clientX - box.left) / box.width;
    py = (clientY - box.top) / box.height;
    moved = true;
  };
  const onPointer = (e) => at(e.clientX, e.clientY);
  const onTouch = (e) => {
    const touch = e.touches[0];
    if (touch) at(touch.clientX, touch.clientY);
  };
  const onWheel = (e) => {
    at(e.clientX, e.clientY);
    const gain = (-e.deltaY / box.height) * WHEEL_GAIN;
    ey += Math.max(-WHEEL_CLAMP, Math.min(WHEEL_CLAMP, gain));
  };

  const passive = { passive: true };
  window.addEventListener('pointerdown', onPointer, passive);
  window.addEventListener('pointermove', onPointer, passive);
  window.addEventListener('touchmove', onTouch, passive);
  window.addEventListener('wheel', onWheel, passive);

  return {
    step(dt, t) {
      let tvx = 0, tvy = 0;
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

      frame.ax = ax; frame.ay = ay;
      frame.px = px; frame.py = py;
      frame.vx = sx + ex; frame.vy = sy + ey;
      frame.act = moved || Math.hypot(ex, ey) > 0.02 ? 1 : 0;
      frame.lastInput = lastInput;

      ax = px; ay = py;
      moved = false;
      return frame;
    },
    /** Re-read the canvas box. Call on resize, not per event — this forces layout. */
    measure() {
      box = canvas.getBoundingClientRect();
    },
    destroy() {
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('wheel', onWheel);
    },
  };
}

/* ── the frame ───────────────────────────────────────────────────────────── */

function simPass(ctx, stroke, dt) {
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

function displayPass(ctx, stroke, t) {
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
 */
function resize(ctx, tracker) {
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
function loadDye(ctx, source, onError) {
  const { gl, pipeline } = ctx;
  const upload = el => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pipeline.dye);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, el);
    gl.useProgram(pipeline.display);
    gl.uniform1f(pipeline.u.imgAr, (el.naturalWidth || el.width) / (el.naturalHeight || el.height));
  };
  /* A canvas or a decoded image is uploaded as it stands: the host may have remapped the
   * artwork to the page's own palette before handing it over. The artwork itself is still
   * never modified here — only where the shader samples it moves. */
  if (typeof source !== 'string') { upload(source); return () => {}; }
  const image = new Image();
  let dead = false;
  image.crossOrigin = 'anonymous';
  image.onload = () => { if (!dead) upload(image); };
  image.onerror = () => {
    console.error('dyeFlow: texture failed to load —', source);
    onError?.();
  };
  image.src = source;
  return () => { dead = true; };
}

function startLoop(ctx, tracker) {
  const t0 = performance.now();
  let prev = t0;
  let raf = 0;
  const draw = () => {
    raf = requestAnimationFrame(draw);
    const now = performance.now();
    /* Every tick of a gesture collapses into the single rebuild that follows it, and the
       frame doing that rebuild repaints immediately — so nothing composites a cleared
       buffer. Waiting for the box to settle is what keeps that out of the drag itself. */
    if (ctx.resizedAt && now - ctx.resizedAt > RESIZE_SETTLE_MS) {
      ctx.resizedAt = 0;
      resize(ctx, tracker);
    }
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
  document.addEventListener('visibilitychange', onVisibility);
  draw();
  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

export function createDyeFlow(canvas, options) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const pipeline = createPipeline(gl);
  if (!pipeline) return null;

  const ctx = {
    gl,
    canvas,
    pipeline,
    field: createField(gl),
    cur: 0,
    resizedAt: 0,
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
  /* The observer only stamps the time — the loop does the work, once the box holds still. */
  const observer = new ResizeObserver(() => { ctx.resizedAt = performance.now(); });
  observer.observe(canvas);
  resize(ctx, tracker);
  const stopLoop = startLoop(ctx, tracker);

  /* iOS hands WebGL contexts back under memory pressure. Left alone the canvas simply
     stays black, which on an opaque context is a black screen — so stand down and let
     the host put the still dye up instead. */
  const onContextLost = (event) => {
    event.preventDefault();
    stopLoop();
    options.onContextLost?.();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

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
      canvas.removeEventListener('webglcontextlost', onContextLost);
      observer.disconnect();
      tracker.destroy();
      if (ctx.field) ctx.field = disposeField(gl, ctx.field);
      disposePipeline(gl, pipeline);
    },
  };
}
