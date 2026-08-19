import Image from "next/image";
import { PlayMark } from "@/components/ui/PlayMark";
import { clock } from "@/lib/media/clock";
import { type Clip, posterUrl } from "@/content/videos";

/**
 * The resting state: Mux's poster frame under a hand-drawn play triangle.
 *
 * The mark is the whole affordance — no caption over a scrim, and no duration printed on the
 * picture. The clip's length still reaches anyone who cannot see the mark, through the
 * button's accessible name.
 *
 * It unmounts on the first press and does not come back. Pausing keeps the picture where the
 * viewer left it and hands the affordance to the control bar, which is forced visible for
 * exactly as long as a clip is stopped.
 */
export function PosterFace({
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
