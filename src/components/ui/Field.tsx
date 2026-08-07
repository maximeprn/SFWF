"use client";

import { useId, type CSSProperties, type ReactNode } from "react";

/* Fields sit inside a paper-white bubble, so they're ink on white. Hairline border, 3px
   radius — the one place the system uses a plain small radius rather than a cut corner,
   because a wobbly input edge reads as a rendering bug. */
const control: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 3,
  border: "1px solid rgba(16,27,39,.18)",
  background: "#fff",
  color: "var(--bubble-ink)",
  font: "var(--text-body-sm)",
  outline: "none",
  transition: "border-color .18s ease",
};

export function Field({
  label,
  error,
  children,
}: {
  readonly label: string;
  readonly error?: string;
  readonly children: (props: {
    id: string;
    style: CSSProperties;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          font: "var(--text-caption)",
          letterSpacing: "var(--tracking-label)",
          textTransform: "uppercase",
          color: "var(--bubble-soft)",
        }}
      >
        {label}
      </label>
      {children({
        id,
        style: error ? { ...control, borderColor: "#C1512C" } : control,
        "aria-invalid": Boolean(error),
        ...(error ? { "aria-describedby": errorId } : {}),
      })}
      {error && (
        <p id={errorId} role="alert" style={{ margin: 0, font: "var(--text-caption)", color: "#9C3F21" }}>
          {error}
        </p>
      )}
    </div>
  );
}
