/**
 * GL objects that live for as long as the canvas does: the two programs, their uniform
 * locations, the fullscreen quad, and the two sampled textures.
 *
 * Texture units are fixed — 0 the dye artwork, 2 the velocity field — because both programs
 * read them and rebinding per frame would be pointless churn. Unit 1 held a noise tile until
 * the grain overlay came out of the display pass; it is deliberately left empty rather than
 * renumbered, so the two shaders keep saying what they have always said.
 */
import {
  DISPLAY_FRAGMENT_SHADER,
  SIM_FRAGMENT_SHADER,
  VERTEX_SHADER,
} from "./shader";

const DISPLAY_UNIFORMS = [
  "ar", "amp", "imgAr", "pt", "o1", "s1", "tt", "dispK", "vsc",
] as const;

const SIM_UNIFORMS = [
  "texel", "ar", "dt", "damp", "agDamp", "curl", "rad", "push", "act", "pa", "pb",
  "pv", "vsc", "visc",
] as const;

type Locations<K extends string> = Record<K, WebGLUniformLocation | null>;
export type DisplayUniforms = Locations<(typeof DISPLAY_UNIFORMS)[number]>;
export type SimUniforms = Locations<(typeof SIM_UNIFORMS)[number]>;

export type Pipeline = {
  display: WebGLProgram;
  sim: WebGLProgram;
  u: DisplayUniforms;
  s: SimUniforms;
  dye: WebGLTexture;
  /** Bound to unit 2 until the field exists, and whenever the device has no field at all. */
  rest: WebGLTexture;
  quad: WebGLBuffer;
};

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error("BloomLayer: shader failed to compile —", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

/** Both programs share attribute location 0, so one bound quad feeds either pass. */
function link(gl: WebGLRenderingContext, fragment: string): WebGLProgram | null {
  const program = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
  if (!program || !vs || !fs) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "p");
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error("BloomLayer: program failed to link —", gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function locate<K extends string>(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  names: readonly K[],
): Locations<K> {
  const out = {} as Locations<K>;
  for (const name of names) out[name] = gl.getUniformLocation(program, name);
  return out;
}

/** A 1×1 stand-in so the first frames have something to sample before the real data lands. */
export function makeTexture(
  gl: WebGLRenderingContext,
  unit: number,
  pixel: number[],
  repeat: boolean,
): WebGLTexture | null {
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

export function createPipeline(gl: WebGLRenderingContext): Pipeline | null {
  const display = link(gl, DISPLAY_FRAGMENT_SHADER);
  const sim = link(gl, SIM_FRAGMENT_SHADER);
  const quad = gl.createBuffer();
  const dye = makeTexture(gl, 0, [158, 178, 199, 255], false);
  /* Half in RG is zero velocity once unpacked, and zero in B is no agitation. */
  const rest = makeTexture(gl, 2, [128, 128, 0, 255], true);
  if (!display || !sim || !quad || !dye || !rest) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(sim);
  gl.uniform1i(gl.getUniformLocation(sim, "V"), 2);
  gl.useProgram(display);
  gl.uniform1i(gl.getUniformLocation(display, "T"), 0);
  gl.uniform1i(gl.getUniformLocation(display, "V"), 2);

  const u = locate(gl, display, DISPLAY_UNIFORMS);
  gl.uniform1f(u.imgAr, 2);
  return { display, sim, u, s: locate(gl, sim, SIM_UNIFORMS), dye, rest, quad };
}

export function disposePipeline(gl: WebGLRenderingContext, p: Pipeline): void {
  gl.deleteTexture(p.dye);
  gl.deleteTexture(p.rest);
  gl.deleteBuffer(p.quad);
  gl.deleteProgram(p.display);
  gl.deleteProgram(p.sim);
}
