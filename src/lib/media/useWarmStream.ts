"use client";

import { useEffect } from "react";

interface DataSaver {
  readonly saveData?: boolean;
  readonly effectiveType?: string;
}

/**
 * Opens the road to the clip without driving down it.
 *
 * Pressing play on a cold page cost 1748ms before a frame appeared, and only the last 350 of
 * those were video: the rest was three manifest round-trips in series, across two hosts the
 * browser had never met. `stream.mux.com` hands back a master playlist that points at a
 * regional `manifest-*.fastly.mux.com`, so the DNS, TCP and TLS bill is paid twice, in
 * sequence, after the press.
 *
 * This pays it during idle time instead. It fetches the master playlist and the first
 * rendition it names — together about 5KB of text — which resolves the redirect and leaves
 * both connections open. Measured on production, the same press then reached its first frame
 * in 1042ms, and the media segments that had taken 130ms each arrived in 2 to 39.
 *
 * It does not touch a byte of video. The rule this product keeps — that motion is response,
 * and that nobody's data is spent before they ask — is about the footage, and the footage is
 * still untouched until a press. What is spent here is a couple of text files, and only on a
 * connection that has not asked to be spared: Save Data and 2G both opt out, and so does
 * every clip that is not the one the page leads with.
 *
 * The module is warmed too. Browsers without native HLS have to fetch `hls.js` before they
 * can begin, which is a serial step in front of everything above; Safari and iOS need none of
 * it and are not asked to.
 */
export function useWarmStream(src: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    /* A reader who has asked their browser to spend less is not a reader to spend ahead for. */
    const conn = (navigator as Navigator & { connection?: DataSaver }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType !== undefined && conn.effectiveType.endsWith("2g")) return;

    const abort = new AbortController();
    let idleHandle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const warm = () => {
      const probe = document.createElement("video");
      if (!probe.canPlayType("application/vnd.apple.mpegurl")) {
        void import("hls.js").catch(() => undefined);
      }

      void fetch(src, { signal: abort.signal })
        .then((r) => r.text())
        .then((text) => {
          /* The first line that is not a comment is the first rendition's URL — that is the
             second host, and reaching it here is the whole point. */
          const variant = text.split("\n").find((line) => line.trim() && !line.startsWith("#"));
          if (variant === undefined) return undefined;
          return fetch(new URL(variant.trim(), src).href, { signal: abort.signal }).then(
            () => undefined,
          );
        })
        /* A warm-up that fails has cost nothing and changed nothing: the press still works,
           it is just as slow as it was before. There is no error here worth showing anyone. */
        .catch(() => undefined);
    };

    const idle = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (handle: number) => void;
      }
    ).requestIdleCallback;

    /* Behind the page's own work either way — `requestIdleCallback` where it exists, and a
       plain delay in the browsers that lack it, which is Safari. */
    if (idle) idleHandle = idle(warm, { timeout: 2500 });
    else timer = setTimeout(warm, 1200);

    return () => {
      abort.abort();
      const cancelIdle = (window as Window & { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback;
      if (idleHandle !== undefined && cancelIdle) cancelIdle(idleHandle);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [src, enabled]);
}
