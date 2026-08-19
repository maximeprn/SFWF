import { type RefObject, useEffect, useRef } from "react";

/**
 * Points a `<video>` at a Mux HLS stream once someone has asked for it.
 *
 * Safari and every browser on iOS play HLS natively, which is most of this audience — they
 * get the adaptive ladder with no JavaScript at all. `hls.js` is fetched only by the
 * browsers that cannot, and only after a press, so the strip costs nothing to a visitor who
 * never plays a clip.
 *
 * `capLevelToPlayerSize` keeps the ladder honest: these frames render at 208–268 CSS px, so
 * pulling the 1080x1920 rung into one would spend a viewer's data on pixels the box cannot
 * show.
 *
 * The hook owns the ref rather than taking one. It is the thing that drives the element, and
 * a ref passed in as an argument is a value the caller still believes it controls — which is
 * also what the compiler's immutability rule objects to.
 */
export function useHlsPlayback(active: boolean, src: string): RefObject<HTMLVideoElement | null> {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!active || !el) return;

    if (el.canPlayType("application/vnd.apple.mpegurl")) {
      el.src = src;
      void el.play();
      return;
    }

    let engine: { destroy: () => void } | undefined;
    let cancelled = false;
    void import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) {
        el.src = src;
        return;
      }
      const hls = new Hls({ capLevelToPlayerSize: true });
      engine = hls;
      hls.loadSource(src);
      hls.attachMedia(el);
      void el.play();
    });

    return () => {
      cancelled = true;
      engine?.destroy();
    };
  }, [active, src]);

  return video;
}
