import { type RefObject, useEffect, useRef } from "react";

export interface Playback {
  readonly video: RefObject<HTMLVideoElement | null>;
  /** Play, pause, or start a finished clip over. */
  readonly toggle: () => void;
  readonly toggleMute: () => void;
  readonly seek: (seconds: number) => void;
}

/**
 * Points a `<video>` at a Mux HLS stream once someone has asked for it, and is the only thing
 * that changes it afterwards.
 *
 * Safari and every browser on iOS play HLS natively, which is most of this audience — they
 * get the adaptive ladder with no JavaScript at all. `hls.js` is fetched only by the
 * browsers that cannot, and only after a press, so the strip costs nothing to a visitor who
 * never plays a clip.
 *
 * `capLevelToPlayerSize` keeps the ladder honest: these frames render at 208–268 CSS px, so
 * pulling the 1080x1920 rung into one would spend a viewer's data on pixels the box cannot
 * show. It is recomputed off the element's own size, so fullscreen lifts the cap on its own.
 *
 * The hook owns the ref rather than taking one, and the drawn control bar is why it now hands
 * back actions as well. A ref passed in as an argument is a value the caller still believes it
 * controls — which is also what the compiler's immutability rule objects to, in both
 * directions: it will not let a caller write through a ref a hook constructed. So the element
 * is read anywhere and written only here.
 */
/** Attaches the stream and starts it. Returns the teardown the effect hands back. */
const attach = (el: HTMLVideoElement, src: string): (() => void) => {
  if (el.canPlayType("application/vnd.apple.mpegurl")) {
    el.src = src;
    void el.play();
    return () => undefined;
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
};

export function usePlayback(active: boolean, src: string): Playback {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!active || !el) return;
    return attach(el, src);
  }, [active, src]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    // Pressing play on a finished clip starts it again rather than doing nothing.
    if (el.ended) el.currentTime = 0;
    if (!el.paused) {
      el.pause();
      return;
    }
    /* A rejected play() is not an error to report: the browser declined — an interrupted
       gesture, a backgrounded tab — and the `pause` state the UI already shows says so. */
    void el.play().catch(() => undefined);
  };

  const toggleMute = () => {
    const el = video.current;
    if (el) el.muted = !el.muted;
  };

  const seek = (seconds: number) => {
    const el = video.current;
    if (el) el.currentTime = seconds;
  };

  return { video, toggle, toggleMute, seek };
}
