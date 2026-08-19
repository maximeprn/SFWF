"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayMark } from "@/components/ui/PlayMark";
import { soft } from "@/lib/design/shapes";
import { useHlsPlayback } from "@/lib/media/useHlsPlayback";
import { type Clip, posterUrl, streamUrl } from "@/content/videos";

interface VideoFrameProps {
  readonly clip: Clip;
  /** Which of the six hand-cut outlines this frame takes. */
  readonly shape: number;
  /** CSS width of the frame. The design sets the film and the strip to different caps. */
  readonly width: string;
  /** Rendered width in px, doubled for the poster so Mux cuts it at 2x. */
  readonly posterWidth: number;
  readonly priority?: boolean;
  /** The film's name is already its section eyebrow; the strip captions each clip. */
  readonly showCaption?: boolean;
}

/** `1:53`. Mono, so the colon lines up down a scrolling strip. */
const clock = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * The resting state: Mux's poster frame under a hand-drawn play triangle.
 *
 * The mark is the whole affordance — no caption over a scrim, and no duration printed on the
 * picture. The clip's length still reaches anyone who cannot see the mark, through the
 * button's accessible name.
 */
function PosterFace({
  clip,
  posterWidth,
  priority,
  onPlay,
}: {
  readonly clip: Clip;
  readonly posterWidth: number;
  readonly priority?: boolean;
  readonly onPlay: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${clip.caption}, ${clock(clip.seconds)}`}
      style={{
        display: "block",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 0,
        border: 0,
        background: "none",
        cursor: "pointer",
        font: "inherit",
        color: "inherit",
        textAlign: "left",
      }}
    >
      <Image
        src={posterUrl(clip, posterWidth * 2)}
        alt=""
        width={posterWidth}
        height={Math.round((posterWidth * 16) / 9)}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        /* Mux already cut this to the rendered width, in WebP. Sending it through the
           optimizer a second time re-encodes an encode and bills a transform for it. */
        unoptimized
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      <PlayMark />
    </button>
  );
}

/**
 * A 9:16 media frame: the poster, and the clip itself once someone asks for it.
 *
 * Nothing plays on its own. Motion is response, not ambience — an autoplaying loop behind
 * the copy is the one thing this brand does not do, and it would also spend a viewer's
 * mobile data before they have decided they want it.
 */
export function VideoFrame({
  clip,
  shape,
  width,
  posterWidth,
  priority,
  showCaption,
}: VideoFrameProps) {
  const [playing, setPlaying] = useState(false);
  const video = useHlsPlayback(playing, streamUrl(clip.playbackId));

  return (
    <figure style={{ margin: 0, width, maxWidth: "100%" }}>
      <div
        style={{
          position: "relative",
          aspectRatio: "9 / 16",
          clipPath: soft(shape),
          background: "var(--chip-well)",
        }}
      >
        {playing ? (
          <video
            ref={video}
            controls
            playsInline
            aria-label={clip.caption}
            style={{ display: "block", width: "100%", height: "100%" }}
          />
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
