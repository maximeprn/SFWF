import type { Pipeline } from "./pipeline";

/**
 * Getting the artwork onto the GPU. The artwork is never modified here — only where the
 * shader samples it moves.
 */
export function loadDye(
  gl: WebGLRenderingContext,
  pipeline: Pipeline,
  source: string | HTMLCanvasElement,
  onError?: () => void,
): () => void {
  const upload = (el: HTMLImageElement | HTMLCanvasElement) => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pipeline.dye);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, el);
    gl.useProgram(pipeline.display);
    const w = el instanceof HTMLImageElement ? el.naturalWidth : el.width;
    const h = el instanceof HTMLImageElement ? el.naturalHeight : el.height;
    gl.uniform1f(pipeline.u.imgAr, w / h);
  };
  /* An already-decoded canvas goes straight up: there is nothing to fetch and nothing that
     can fail, so there is no error path to wire either. */
  if (typeof source !== "string") {
    upload(source);
    return () => {};
  }
  const image = new Image();
  let dead = false;
  image.crossOrigin = "anonymous";
  image.onload = () => {
    if (dead) return;
    upload(image);
  };
  image.onerror = () => {
    console.error("BloomLayer: dye texture failed to load —", source);
    onError?.();
  };
  image.src = source;
  return () => {
    dead = true;
  };
}
