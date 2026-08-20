import type { CSSProperties, ReactNode } from "react";
import { soft } from "@/lib/design/shapes";

/**
 * The raised side a button stands on — the wrapper half of the press system. See
 * `design_handoff_button_press/README.md` and the `.press-btn` rules in `globals.css` for
 * the surface half.
 *
 * `margin-bottom: var(--raise)` reserves the room the side hangs into below the surface; a
 * clipped ancestor (a bubble, a card) would cut the side off without it. The side takes the
 * button's own shape, inset 1.6px on the left and right — an identical copy offset straight
 * down would poke out past the surface's hand-cut, asymmetric ends, and the join would read
 * as a step.
 *
 * `style` merges onto the wrapper, not the surface, so a caller can still own the outer
 * margin or a fixed position the way it owned the button's own before this existed.
 */
export function Slab({
  shapeIndex,
  className,
  style,
  children,
}: {
  readonly shapeIndex: number;
  readonly className?: string;
  /* `display` is deliberately the caller's to set, not a default here — a responsive
     `hidden`/`wide:block` pair on `className` sets it instead for `NavBand`'s CTA, and an
     inline value on this same element would always beat that class, whatever it were set
     to. Every other caller passes its own `inline-block` or `block` explicitly. */
  readonly style?: CSSProperties;
  readonly children: ReactNode;
}) {
  return (
    <span
      className={className}
      style={{
        position: "relative",
        maxWidth: "100%",
        marginBottom: "var(--raise)",
        ...style,
      }}
    >
      <span className="slab-side" aria-hidden="true" style={{ clipPath: soft(shapeIndex) }} />
      {children}
    </span>
  );
}
