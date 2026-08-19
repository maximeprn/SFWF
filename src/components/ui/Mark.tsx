import Image from "next/image";
import type { CSSProperties } from "react";

interface MarkProps {
  readonly src: string;
  readonly alt: string;
  readonly intrinsic: readonly [number, number];
  readonly style?: CSSProperties;
  readonly priority?: boolean;
}

/**
 * A beige knockout mark on the dye — a logo, a wordmark, a doodle. Never boxed, never on a
 * white plate. The intrinsic size only reserves the box; the rendered size is CSS, because
 * every mark in the row is hand-tuned for optical weight rather than to a common height.
 *
 * SVG marks skip the optimizer: it refuses to touch SVG without `dangerouslyAllowSVG`, and
 * these are the festival's own vectors, already as small as they get.
 */
export function Mark({ src, alt, intrinsic, style, priority }: MarkProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={intrinsic[0]}
      height={intrinsic[1]}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      unoptimized={src.endsWith(".svg")}
      style={{ display: "block", ...style }}
    />
  );
}
