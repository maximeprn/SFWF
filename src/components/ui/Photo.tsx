"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { soft } from "@/lib/design/shapes";
import { useLightbox } from "./lightbox-context";

interface PhotoProps {
  readonly src: string;
  readonly alt?: string;
  /** Which hand-cut outline frames it. */
  readonly i?: number;
  /** Fixed frame height, so the frame reveals the image rather than squashing it. */
  readonly h?: number;
  /**
   * Play the open animation: the frame unfurls top-down while the image pushes in out of a
   * soft blur. Used where a photo appears as the result of a tap — never on page load,
   * because the design has no scroll-triggered fade-ins.
   */
  readonly reveal?: boolean;
  readonly style?: CSSProperties;
  readonly sizes?: string;
}

export function Photo({
  src,
  alt = "",
  i = 0,
  h = 190,
  reveal = false,
  style,
  sizes = "(min-width: 1100px) 560px, (min-width: 768px) 50vw, 100vw",
}: PhotoProps) {
  const open = useLightbox();

  return (
    <div
      onClick={
        open
          ? (event) => {
              event.stopPropagation();
              open(src);
            }
          : undefined
      }
      style={{
        clipPath: soft(i),
        height: h,
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        cursor: open ? "zoom-in" : "default",
        ...(reveal
          ? ({
              "--ph": `${h}px`,
              animation: `openUnfurl .31s var(--ease) .05s both`,
            } as CSSProperties)
          : null),
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{
          objectFit: "cover",
          ...(reveal
            ? {
                animation: `photoSettle .52s var(--ease) .05s both`,
                willChange: "transform, filter",
              }
            : null),
        }}
      />
    </div>
  );
}
