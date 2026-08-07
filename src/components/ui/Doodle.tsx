import type { CSSProperties } from "react";
import { iconSrc, type IconName } from "@/content/photos";

interface DoodleProps {
  readonly icon: IconName;
  readonly size?: number;
  readonly rot?: number;
  readonly op?: number;
  readonly left?: number | string;
  readonly right?: number | string;
  readonly top?: number | string;
  readonly bottom?: number | string;
}

/**
 * A single one of the festival's hand-drawn icons parked in dead space — decorative, out
 * of flow, never tappable. Its nearest positioned ancestor decides where it lands.
 *
 * The art is light, so these only read on the dye or another mid-tone ground; they wash
 * out entirely on paper.
 */
export function Doodle({
  icon,
  size = 48,
  rot = 0,
  op = 0.8,
  ...pos
}: DoodleProps) {
  const style: CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    objectFit: "contain",
    transform: `rotate(${rot}deg)`,
    opacity: op,
    pointerEvents: "none",
    ...pos,
  };
  /* Plain <img>: these are tiny, decorative, and positioned absolutely, so next/image's
     layout machinery buys nothing here. */
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={iconSrc(icon)} alt="" aria-hidden="true" style={style} />;
}
