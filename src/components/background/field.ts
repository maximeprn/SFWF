/**
 * The velocity field: two 128×256 textures ping-ponged through framebuffers, one sim step
 * per frame. Both wrap on both axes, which is the entire no-borders behaviour — flow that
 * leaves one edge re-enters the other instead of reflecting back.
 *
 * Three device tiers, in order of preference: half-float (the good path on modern phones),
 * 8-bit, and none at all. On the last one the ambient drift and resting pulse still run;
 * only the stirring is dropped.
 */
import { FIELD_HEIGHT, FIELD_WIDTH, VSC_BYTE, VSC_HALF } from "./shader";

export type Field = {
  textures: WebGLTexture[];
  framebuffers: WebGLFramebuffer[];
  /** Velocity range packed into the texture. Smaller on 8-bit to buy back precision. */
  vsc: number;
  halfFloat: boolean;
};

function fieldTexture(gl: WebGLRenderingContext, type: number): WebGLTexture | null {
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

/** Returns null if this texture type can't be rendered to, so the caller can step down. */
function buildField(
  gl: WebGLRenderingContext,
  type: number,
  vsc: number,
  halfFloat: boolean,
): Field | null {
  const field: Field = { textures: [], framebuffers: [], vsc, halfFloat };
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

export function createField(gl: WebGLRenderingContext): Field | null {
  const half = gl.getExtension("OES_texture_half_float");
  const linear = gl.getExtension("OES_texture_half_float_linear");
  gl.getExtension("EXT_color_buffer_half_float");
  if (half && linear) {
    const field = buildField(gl, half.HALF_FLOAT_OES, VSC_HALF, true);
    if (field) return field;
  }
  return buildField(gl, gl.UNSIGNED_BYTE, VSC_BYTE, false);
}

export function disposeField(gl: WebGLRenderingContext, field: Field): null {
  for (const framebuffer of field.framebuffers) gl.deleteFramebuffer(framebuffer);
  for (const texture of field.textures) gl.deleteTexture(texture);
  field.framebuffers.length = 0;
  field.textures.length = 0;
  return null;
}
