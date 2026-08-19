import { type RefObject, useEffect, useState } from "react";

export interface PlaybackState {
  readonly paused: boolean;
  readonly muted: boolean;
  readonly ended: boolean;
}

/**
 * The element's own resting state, which is also the honest one: a clip that has not started
 * is paused and unmuted. There is no initial read on attach — `usePlayback` fires `play()`
 * a tick later and the `play` event corrects this, and if the browser declines that press the
 * event never comes and "paused" was right all along.
 */
const REST: PlaybackState = { paused: true, muted: false, ended: false };

/** Rare events only. The scrubber owns `timeupdate` itself, so the six strip clips — which
 *  draw no scrubber — never re-render four times a second for a readout they do not have. */
const EVENTS = ["play", "pause", "ended", "volumechange"] as const;

/**
 * Playback state, read off the element rather than guessed at from what we asked it to do.
 *
 * It only subscribes: every mutation lives in `usePlayback`, which is where the ref is
 * constructed. That split is the compiler's immutability rule, and it is the same
 * distinction `usePlayback` draws in its own docstring — the thing that constructs the ref
 * is the only thing allowed to write through it.
 *
 * Reading the element is also what makes the UI honest when playback never starts:
 * `usePlayback` fires `play()` with no rejection handler, so a browser that declines used
 * to leave a "playing" frame over a still picture. The absent `play` event now says so.
 */
export function useVideoControls(
  video: RefObject<HTMLVideoElement | null>,
  active: boolean,
): PlaybackState {
  const [state, setState] = useState<PlaybackState>(REST);

  useEffect(() => {
    const el = video.current;
    if (!active || !el) return;

    const sync = () => setState({ paused: el.paused, muted: el.muted, ended: el.ended });
    for (const event of EVENTS) el.addEventListener(event, sync);
    return () => {
      for (const event of EVENTS) el.removeEventListener(event, sync);
    };
  }, [video, active]);

  return state;
}
