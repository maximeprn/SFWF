"use client";

import { useRef, useState } from "react";
import { PosterFace } from "@/components/ui/PosterFace";
import { VideoControls } from "@/components/ui/VideoControls";
import { mediaFrame } from "@/lib/design/shapes";
import { useFullscreen } from "@/lib/media/useFullscreen";
import { usePlayback } from "@/lib/media/usePlayback";
import { useWarmStream } from "@/lib/media/useWarmStream";
import { useIdleControls } from "@/lib/media/useIdleControls";
import { useVideoControls } from "@/lib/media/useVideoControls";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { type Clip, streamUrl } from "@/content/videos";

interface VideoFrameProps {
  readonly clip: Clip;
  /** CSS width of the frame. The design sets the film and the strip to different caps. */
  readonly width: string;
  /** Rendered width in px, doubled for the poster so Mux cuts it at 2x. */
  readonly posterWidth: number;
  readonly priority?: boolean;
  /** The film's name is already its section eyebrow; the strip captions each clip. */
  readonly showCaption?: boolean;
  /** Whether the bar carries a scrubber. Only the film is wide enough for one. */
  readonly scrub?: boolean;
}

/**
 * A 9:16 media frame: the poster, and the clip itself once someone asks for it.
 *
 * Nothing plays on its own. Motion is response, not ambience — an autoplaying loop behind
 * the copy is the one thing this brand does not do, and it would also spend a viewer's
 * mobile data before they have decided they want it.
 *
 * The browser's own controls are gone. They could not be styled, they were grey, and they
 * were the whole reason the frame's outline had to be cut shallow — see `MEDIA_BLOB_PATH`.
 * `VideoControls` replaces them with a drawn bar held `MEDIA_SAFE` inside that outline.
 *
 * Nothing here writes to the element. `usePlayback` constructs the ref, so it is also the
 * only thing allowed to change what it points at — the compiler's immutability rule draws
 * that line in both directions. Everything else on this frame reads and listens.
 */
export function VideoFrame({
  clip,
  width,
  posterWidth,
  priority,
  showCaption,
  scrub,
}: VideoFrameProps) {
  const frame = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [focused, setFocused] = useState(false);

  const src = streamUrl(clip.playbackId);
  const { video, toggle, toggleMute, seek } = usePlayback(playing, src);
  /* `priority` already means "this is the frame the page leads with" — the poster loads eagerly
     for it and lazily for the strip. The same line divides the warm-up: the film is worth
     opening a connection for before it is asked for, six clips further down the page are not. */
  useWarmStream(src, priority === true && !playing);
  const { paused, muted } = useVideoControls(video, playing);
  const fullscreen = useFullscreen(frame, video);
  const reduced = usePrefersReducedMotion();
  /* The bar only counts itself down while a clip is genuinely running unattended. Stopped,
     focused, or under a reduced-motion preference, it stays up. */
  const { awake, revive } = useIdleControls(playing && !paused && !focused && !reduced);

  return (
    <figure style={{ margin: 0, width, maxWidth: "100%" }}>
      <div
        ref={frame}
        onPointerMove={revive}
        onPointerDown={revive}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: "relative",
          /* One outline, paused and playing alike: a frame must not change shape when it
             is tapped. Fullscreen is the one release — the clip and the 9:16 box both come
             off, or the browser would paint a hand-cut letterbox across a whole screen. */
          aspectRatio: fullscreen.on ? undefined : "9 / 16",
          height: fullscreen.on ? "100%" : undefined,
          clipPath: fullscreen.on ? undefined : mediaFrame(),
          background: fullscreen.on ? "var(--ground)" : "var(--chip-well)",
        }}
      >
        {playing ? (
          <>
            <video
              ref={video}
              playsInline
              aria-label={clip.caption}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                /* A no-op in the frame, where box and footage are both 9:16, and the thing
                   that stops a vertical clip being stretched across a landscape screen. */
                objectFit: "contain",
              }}
            />
            <VideoControls
              shown={awake}
              paused={paused}
              muted={muted}
              scrub={scrub}
              video={video}
              fullscreen={fullscreen}
              onToggle={toggle}
              onToggleMute={toggleMute}
              onSeek={seek}
            />
          </>
        ) : (
          <PosterFace
            clip={clip}
            posterWidth={posterWidth}
            priority={priority}
            onPlay={() => setPlaying(true)}
          />
        )}
      </div>
      {showCaption ? (
        <figcaption
          style={{
            margin: "clamp(10px,2vw,14px) 0 0",
            font: "400 clamp(14.5px,.5vw + 13.1px,16px)/1.5 var(--font-body)",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          {clip.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
