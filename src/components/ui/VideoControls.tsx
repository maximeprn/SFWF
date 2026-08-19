"use client";

import type { RefObject } from "react";
import { ControlMark, type ControlMarkKind } from "@/components/ui/ControlMarks";
import { Scrubber } from "@/components/ui/Scrubber";
import { MEDIA_SAFE, soft } from "@/lib/design/shapes";
import type { Fullscreen } from "@/lib/media/useFullscreen";

interface VideoControlsProps {
  readonly shown: boolean;
  readonly paused: boolean;
  readonly muted: boolean;
  /** The film scrubs. The strip's 208px frames are three controls wide and no more. */
  readonly scrub?: boolean;
  readonly video: RefObject<HTMLVideoElement | null>;
  readonly fullscreen: Fullscreen;
  readonly onToggle: () => void;
  readonly onToggleMute: () => void;
  readonly onSeek: (seconds: number) => void;
}

function Key({
  label,
  kind,
  pressed,
  size,
  onPress,
}: {
  readonly label: string;
  readonly kind: ControlMarkKind;
  readonly pressed?: boolean;
  readonly size: number;
  readonly onPress: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      aria-pressed={pressed}
      className="media-key on-beige"
      style={{
        flex: "none",
        display: "grid",
        placeItems: "center",
        width: size,
        height: size,
        padding: 0,
        border: 0,
        background: "none",
        color: "var(--ink-title)",
        cursor: "pointer",
        transition: "color var(--hover)",
      }}
    >
      <span style={{ display: "block", width: size * 0.53, height: size * 0.53 }}>
        <ControlMark kind={kind} />
      </span>
    </button>
  );
}

/**
 * The drawn control bar, in place of the browser's.
 *
 * It is one hand-cut beige plate carrying violet ink — the day filter's selected chip, laid on
 * footage. That is deliberately not a scrim: a wash under the controls would be a gradient, and
 * `tests/design.test.ts` allows those in two files, neither of them this one. A plate needs no
 * gradient to stay legible over a bright sky or a black frame, which is the same argument the
 * centred play mark settles with a beige fill and a violet edge.
 *
 * One outline for every bar, not a round-robin: a control must not change shape while it is
 * being used, which is the case `99a0f41` made for the frame itself.
 *
 * `MEDIA_SAFE` is what answers the original complaint. The frame's clip is authored in
 * objectBoundingBox units, so percentage insets are the only ones that stay correct at both
 * frame sizes and at every viewport in between — `tests/design.test.ts` holds them inside the
 * outline.
 */
export function VideoControls({
  shown,
  paused,
  muted,
  scrub,
  video,
  fullscreen,
  onToggle,
  onToggleMute,
  onSeek,
}: VideoControlsProps) {
  /* Fullscreen is a different box, and the bar is sized for it rather than stretched into
     it: capped and centred so the hand-cut outline reads as a surface instead of a sliver,
     and stepped up so a control built for a 208px clip is not a speck on a 27in screen. */
  const full = fullscreen.on;
  const key = full ? 40 : 30;

  return (
    <div
      className="video-controls"
      style={{
        position: "absolute",
        bottom: `${MEDIA_SAFE.bottom * 100}%`,
        /* In the frame the bar spans the safe width, which on a 208–268px clip is a plate a
           little wider than it is tall — the proportion the six outlines were cut for.
           Fullscreen is a different box: the same 8% insets across a 1920px screen stretch
           one of those outlines to fifty times its height, and a hand-cut edge at that ratio
           reads as a sliver with points on the ends rather than as a surface. So it is
           capped and centred there, and the outline goes back to being a shape. */
        ...(fullscreen.on
          ? { left: "50%", width: "min(520px, 68%)", transform: "translateX(-50%)" }
          : { left: `${MEDIA_SAFE.side * 100}%`, right: `${MEDIA_SAFE.side * 100}%` }),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: full ? 8 : 4,
        padding: full ? "6px 16px" : "3px 12px",
        clipPath: soft(3),
        background: "var(--beige)",
        opacity: shown ? 1 : 0,
        /* Out of reach while faded, so a press lands on the frame and brings it back instead
           of hitting a control nobody can see. Focus still returns it — tabbing in revives. */
        pointerEvents: shown ? undefined : "none",
        transition: "opacity var(--hover)",
      }}
    >
      <Key
        label={paused ? "Play" : "Pause"}
        kind={paused ? "play" : "pause"}
        size={key}
        onPress={onToggle}
      />
      {scrub ? <Scrubber video={video} onSeek={onSeek} /> : null}
      <Key
        label={muted ? "Unmute" : "Mute"}
        kind={muted ? "muted" : "sound"}
        pressed={muted}
        size={key}
        onPress={onToggleMute}
      />
      {fullscreen.supported ? (
        <Key
          label={fullscreen.on ? "Exit full screen" : "Full screen"}
          kind={fullscreen.on ? "contract" : "expand"}
          pressed={fullscreen.on}
          size={key}
          onPress={fullscreen.toggle}
        />
      ) : null}
    </div>
  );
}
