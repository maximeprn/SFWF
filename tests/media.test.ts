import { describe, expect, it } from "vitest";
import { __attach } from "@/lib/media/usePlayback";

const SRC = "https://stream.mux.com/abc123.m3u8";

/**
 * The bits of `HTMLVideoElement` that `attach` actually touches. A stub rather than jsdom: the
 * suite runs in node, and the behaviour under test is a decision, not a rendering.
 */
const stubVideo = (canPlay: string) => {
  const el = {
    src: "",
    canPlayTypeCalls: [] as string[],
    playCalls: 0,
    loadCalls: 0,
    removedSrc: false,
    error: null as { code: number } | null,
    listeners: {} as Record<string, Array<() => void>>,
    canPlayType(type: string) {
      el.canPlayTypeCalls.push(type);
      return canPlay;
    },
    play: () => {
      el.playCalls += 1;
      return Promise.reject(new Error("NotSupportedError"));
    },
    load: () => {
      el.loadCalls += 1;
    },
    removeAttribute: (name: string) => {
      if (name === "src") {
        el.removedSrc = true;
        el.src = "";
      }
    },
    addEventListener: (type: string, fn: () => void) => {
      (el.listeners[type] ??= []).push(fn);
    },
    removeEventListener: (type: string, fn: () => void) => {
      el.listeners[type] = (el.listeners[type] ?? []).filter((f) => f !== fn);
    },
    /** Fire the element's `error` event, the way a browser does when a load fails. */
    fail(code: number) {
      el.error = { code };
      for (const fn of [...(el.listeners["error"] ?? [])]) fn();
    },
  };
  return el;
};

const attachTo = (el: ReturnType<typeof stubVideo>) =>
  __attach(el as unknown as HTMLVideoElement, SRC);

describe("attach", () => {
  it("uses the element's own HLS support when it reports some", () => {
    const el = stubVideo("maybe");
    attachTo(el);

    expect(el.canPlayTypeCalls).toEqual(["application/vnd.apple.mpegurl"]);
    expect(el.src).toBe(SRC);
    expect(el.playCalls).toBe(1);
  });

  it("never touches src itself when the element reports no HLS support", () => {
    const el = stubVideo("");
    attachTo(el);

    // hls.js loads asynchronously and drives the element from there; nothing is set inline.
    expect(el.src).toBe("");
    expect(el.playCalls).toBe(0);
  });

  /* The reported bug: Android WebView answers "maybe" for HLS, then fails the load. Before the
     fix this left a dead frame and an uncaught NotSupportedError. */
  it("hands the clip to hls.js when a browser that claimed HLS fails the load", () => {
    const el = stubVideo("maybe");
    attachTo(el);
    el.fail(4);

    expect(el.removedSrc).toBe(true);
    expect(el.loadCalls).toBe(1);
    expect(el.listeners["error"] ?? []).toHaveLength(0);
  });

  it("leaves a stalled network to the element, and does not restart it", () => {
    const el = stubVideo("maybe");
    attachTo(el);
    el.fail(2); // MEDIA_ERR_NETWORK

    expect(el.removedSrc).toBe(false);
    expect(el.loadCalls).toBe(0);
  });

  it("stops listening once the effect is torn down", () => {
    const el = stubVideo("maybe");
    const teardown = attachTo(el);
    teardown();
    el.fail(4);

    expect(el.removedSrc).toBe(false);
    expect(el.listeners["error"] ?? []).toHaveLength(0);
  });
});
