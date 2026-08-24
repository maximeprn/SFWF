import { type RefObject, useEffect, useRef } from "react";

export interface Playback {
  readonly video: RefObject<HTMLVideoElement | null>;
  /** Play, pause, or start a finished clip over. */
  readonly toggle: () => void;
  readonly toggleMute: () => void;
  readonly seek: (seconds: number) => void;
}

const HLS_MIME = "application/vnd.apple.mpegurl";

/**
 * `MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED`, spelled out rather than read off the global so the
 * module stays importable where `MediaError` is not defined.
 */
const SRC_NOT_SUPPORTED = 4;

/* A rejected play() is not an error to report: the browser declined — an interrupted gesture,
   a backgrounded tab, a source it turned out not to support — and either the `pause` state the
   UI already shows or the `error` handler below says so. */
const start = (el: HTMLVideoElement): void => {
  void el.play().catch(() => undefined);
};

/** Plays the clip through `hls.js`. Returns the teardown the caller hands back. */
const attachViaHls = (el: HTMLVideoElement, src: string): (() => void) => {
  let engine: { destroy: () => void } | undefined;
  let cancelled = false;

  void import("hls.js")
    .then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) {
        /* No native HLS and no Media Source Extensions. There is nothing left to try, so the
           element is pointed at the stream and allowed to report its own failure. */
        el.src = src;
        return;
      }
      const hls = new Hls({ capLevelToPlayerSize: true });
      engine = hls;
      hls.loadSource(src);
      hls.attachMedia(el);
      start(el);
    })
    /* The chunk did not arrive. Nothing is playing, and there is no second fallback to reach
       for — the frame stays as it was rather than throwing past every handler on the page. */
    .catch(() => undefined);

  return () => {
    cancelled = true;
    engine?.destroy();
  };
};

/** Attaches the stream and starts it. Returns the teardown the effect hands back. */
const attach = (el: HTMLVideoElement, src: string): (() => void) => {
  if (!el.canPlayType(HLS_MIME)) return attachViaHls(el, src);

  let fallback: (() => void) | undefined;
  let cancelled = false;

  const onError = () => {
    /* Only the browser saying it cannot use this source at all is worth a second attempt. A
       network stall is the element's own to recover from. */
    if (cancelled || el.error?.code !== SRC_NOT_SUPPORTED) return;
    el.removeEventListener("error", onError);
    /* Reset the element before handing it over: `hls.js` attaches a MediaSource, and it cannot
       do that over a failed load still sitting in `error`. */
    el.removeAttribute("src");
    el.load();
    fallback = attachViaHls(el, src);
  };

  el.addEventListener("error", onError);
  el.src = src;
  start(el);

  return () => {
    cancelled = true;
    el.removeEventListener("error", onError);
    fallback?.();
  };
};

/**
 * Points a `<video>` at a Mux HLS stream once someone has asked for it, and is the only thing
 * that changes it afterwards.
 *
 * Safari and every browser on iOS play HLS natively, which is most of this audience — they
 * get the adaptive ladder with no JavaScript at all. `hls.js` is fetched only by the
 * browsers that cannot, and only after a press, so the strip costs nothing to a visitor who
 * never plays a clip.
 *
 * `canPlayType` is a hint, not a promise, and some browsers answer "maybe" for HLS and then
 * fail to load a byte of it — Android WebView, which is what a link opened from inside
 * Instagram or Facebook runs in, is the one this audience actually arrives through. Trusting
 * that answer left those readers a dead frame and an uncaught `NotSupportedError`. So the
 * native attempt is checked rather than trusted: if the element reports it could not use the
 * source, the clip is handed to `hls.js` and starts again.
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
    start(el);
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

/** Exported for the recovery test in `tests/media.test.ts`; not part of the module's surface. */
export const __attach = attach;
