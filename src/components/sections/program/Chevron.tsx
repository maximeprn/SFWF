/**
 * The open/closed mark, and the only thing in that corner once the bubble is open — the
 * access mark beside it is a closed-state signal, because an open bubble answers the same
 * question outright with its booking button.
 */
export function Chevron({ open }: { readonly open?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        flex: "none",
        marginTop: open ? 4 : undefined,
        /* No transition: the chevron flips because the state flipped. It is not travelling. */
        font: "700 13px/1 var(--font-body)",
        color: "var(--chevron)",
      }}
    >
      {open ? "▴" : "▾"}
    </span>
  );
}
