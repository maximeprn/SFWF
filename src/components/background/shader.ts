/**
 * The dye flow shader — a swipe stirs the cloth like a hand through liquid.
 *
 * Two passes per frame. The sim pass keeps a velocity field that self-advects, rolls shear
 * up into eddies and decays over a couple of seconds; the display pass samples the dye
 * artwork at an offset taken from that field. Momentum lives in the field rather than in an
 * input-bound envelope, which is why the motion keeps developing after a finger lifts.
 *
 * The motion constants are the shipped values from the festival's own prototype. They were
 * tuned interactively against the real artwork on a phone; moving `tau`, `visc` or `disp`
 * by more than ~20% visibly changes the character. Don't retune them.
 *
 * The COLOUR is a different matter, and the display pass below deliberately no longer has
 * any. The prototype's version overlaid a 64px noise tile, soft-light blended two copies of
 * the dye at different scales, and multiplied the result up to ~15% brighter — a film grain
 * and a contrast push on top of the palette. All three are gone: the ground now renders as
 * exactly the two hexes `dyeGround` mixes, moved around. The cloth is the only texture.
 */

/** Feel presets. Turbulent is the shipped default. All three are motion only. */
export const FEELS = {
  Calm: { push: 0.6, curl: 1.1, tau: 2.1, visc: 0.012, disp: 0.058 },
  Flowing: { push: 1.0, curl: 2.2, tau: 1.7, visc: 0.016, disp: 0.086 },
  Turbulent: { push: 1.55, curl: 3.7, tau: 1.4, visc: 0.02, disp: 0.12 },
} as const;

export type FeelName = keyof typeof FEELS;
export type Feel = (typeof FEELS)[FeelName];

export const DEFAULT_FEEL: FeelName = "Turbulent";

/**
 * Swirl strength — the swipe gain, and the idle pulse amplitude with it.
 *
 * Full over the loading seal, where the dye is the whole screen and the only thing there is
 * to play with. Eased back behind page content, where the same motion competes with copy
 * for attention rather than rewarding it.
 */
export const LOADER_STRENGTH = 1.45;
export const PAGE_STRENGTH = 0.85;

/**
 * Stir radius as a fraction of viewport width. A setting rather than a frozen constant —
 * the sanctioned range is 3–40%. At 5% the stir is tighter than the handoff's 10% default:
 * a narrower, more defined wake.
 */
export const DEFAULT_RADIUS = 0.05;

/* The resting pulse — the pre-flow ripple, kept as the state the dye relaxes back into. */
export const DISP = 5.4;
export const SPEED = 2.15;
export const RING = 9.0;
export const STR = 0.042;
export const BLOOM = 0.034;
export const IDLE_AMP = 0.18;
export const IDLE_PERIOD = 4.8;
export const IDLE_WAIT = 1.1;
export const IDLE_FADE = 2.2;

/** Power-of-two so REPEAT wrapping is legal in WebGL 1 — that wrap is the no-borders behaviour. */
export const FIELD_WIDTH = 128;
export const FIELD_HEIGHT = 256;

/** Velocity range packed into the field. The 8-bit fallback trades range for precision. */
export const VSC_HALF = 2.0;
export const VSC_BYTE = 0.6;

export const MAX_SPEED = 2.4; // stroke speed cap, screen widths / second
export const VELOCITY_SMOOTHING = 0.45; // per-frame lerp toward measured stroke velocity
export const WHEEL_DECAY = 0.82;
export const WHEEL_GAIN = 2.4;
export const WHEEL_CLAMP = 1.6;
export const DT_MIN = 1 / 240;
export const DT_MAX = 1 / 24;
export const DPR_CAP = 2;

export const VERTEX_SHADER =
  "attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}";

/**
 * Pass 1 — the velocity field. RG is velocity, B is "agitation": a scalar that trails the
 * stroke and outlives it. The display pass no longer reads it — it drove the grain — but the
 * sim keeps it, because it is what makes a wake persist rather than snap back.
 *
 * Self-advection carries motion across the frame; curl amplification rotates velocity by
 * local spin so shear rolls up into eddies instead of dissipating; viscosity smooths.
 * The splat is a Gaussian around the whole segment pa → pb, so the entire path of a fast
 * stroke stays stirred rather than only the point under the finger. Every term is
 * dt-scaled, so a 120 Hz phone behaves like a 60 Hz one.
 */
export const SIM_FRAGMENT_SHADER = `
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
 * Pass 2 — display. The field displacement and the resting pulse both feed `dp`, and `dp`
 * offsets exactly one sample of the dye. Where the cloth is stirred, the cloth moves; the
 * colour that comes back is the colour that went in.
 *
 * There is no second sample and no blend: the two-layer soft-light composite the prototype
 * used raised contrast and saturation off the palette, and the noise-tile overlay put film
 * grain over the whole page. Neither is a thing this design has. The final write is the
 * sampled texel unmodified — no brightness lift, no agitation tint.
 */
export const DISPLAY_FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D T,V; uniform float ar,amp,imgAr,dispK,vsc;
uniform vec2 pt,o1; uniform float s1,tt; varying vec2 v;
void main(){
  vec3 f=texture2D(V,v).rgb;
  vec2 fv=(f.xy*2.0-1.0)*vsc;
  vec2 dp=fv*dispK/vec2(ar,1.0);
  vec2 d=(v-pt)*vec2(ar,1.0); float r=length(d)+1e-4; vec2 dir=d/r;
  float ring=sin(r*${RING.toFixed(2)}-tt*${SPEED.toFixed(3)})*exp(-r*${DISP.toFixed(3)})*amp;
  float bl=exp(-r*r*${DISP.toFixed(3)}*2.2)*amp;
  dp+=dir*(ring*${STR.toFixed(4)}+bl*${BLOOM.toFixed(4)});
  vec2 sc=imgAr>ar?vec2(ar/imgAr,1.0):vec2(1.0,imgAr/ar);
  vec2 cov=(v-0.5)*sc+0.5;
  gl_FragColor=vec4(texture2D(T,clamp((cov-0.5)/s1+0.5+o1+dp,0.002,0.998)).rgb,1.0);
}`;

/** The ambient dye drift, on a slow cosine cycle. */
export function wave(period: number, t: number): number {
  return 0.5 - 0.5 * Math.cos(2 * Math.PI * ((t / period) % 1));
}
