import type { CSSProperties } from "react";

/**
 * A `style` object that also carries CSS custom properties. React's `CSSProperties` has no
 * room for them; this names the one cast a button's `style` prop needs instead of leaving
 * `any` at every call site.
 *
 * `--btn-fill` is why it exists: a button's rest fill has to be overridable by the
 * `.press-btn[data-press]` rules in `globals.css`, and a custom property is the only value
 * that can sit in an inline `style` without out-ranking those rules — see the comment above
 * `.press-btn` there.
 */
export type StyleWithVars = CSSProperties & Record<`--${string}`, string>;
