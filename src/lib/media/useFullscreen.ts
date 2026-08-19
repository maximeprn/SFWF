import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";

/** The two prefixed routes still worth carrying: Safari before 16.4, and every iPhone. */
type WebkitElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
type WebkitDocument = Document & { webkitExitFullscreen?: () => Promise<void> | void };

export interface Fullscreen {
  /** False where there is no route at all — the control is then simply not drawn. */
  readonly supported: boolean;
  readonly on: boolean;
  readonly toggle: () => void;
}

/**
 * Tested on the prototypes rather than on an element, so the answer needs no ref and never
 * changes for the life of the document — which is what lets it be read as a snapshot with a
 * server value of `false`, the same shape `usePrefersReducedMotion` uses.
 */
const canFullscreen = (): boolean =>
  (document.fullscreenEnabled && typeof Element.prototype.requestFullscreen === "function") ||
  typeof (Element.prototype as WebkitElement).webkitRequestFullscreen === "function" ||
  "webkitEnterFullscreen" in HTMLVideoElement.prototype;

const stable = () => () => undefined;

const enter = (frame: HTMLElement | null, video: HTMLVideoElement | null): void => {
  const el = frame as WebkitElement | null;
  /* The frame, not the video: fullscreening the element the bar lives inside is what keeps
     these controls on screen instead of handing the picture back to the browser's. */
  if (el?.requestFullscreen) {
    void el.requestFullscreen().catch(() => undefined);
    return;
  }
  if (el?.webkitRequestFullscreen) {
    void el.webkitRequestFullscreen();
    return;
  }
  /* iPhone Safari has no element fullscreen at all, only this. The native player takes the
     screen there, which is what an iPhone does with every other video on the web. */
  (video as WebkitVideo | null)?.webkitEnterFullscreen?.();
};

const leave = (): void => {
  const doc = document as WebkitDocument;
  if (doc.exitFullscreen) {
    void doc.exitFullscreen().catch(() => undefined);
    return;
  }
  void doc.webkitExitFullscreen?.();
};

/** Fullscreen for one media frame, feature-detected rather than assumed. */
export function useFullscreen(
  frame: RefObject<HTMLElement | null>,
  video: RefObject<HTMLVideoElement | null>,
): Fullscreen {
  const supported = useSyncExternalStore(stable, canFullscreen, () => false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    // Esc and the browser's own exit both arrive here, so the label never goes stale.
    const sync = () => setOn(document.fullscreenElement === frame.current);
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [frame]);

  const toggle = () => {
    if (document.fullscreenElement) leave();
    else enter(frame.current, video.current);
  };

  return { supported, on, toggle };
}
