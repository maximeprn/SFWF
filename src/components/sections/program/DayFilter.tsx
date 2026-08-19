"use client";

import Image from "next/image";
import { DAYS } from "@/content/events";
import { soft } from "@/lib/design/shapes";

export type DayPick = "all" | number;

interface Tab {
  readonly key: DayPick;
  readonly date: string;
  readonly short: string;
  readonly name: string;
}

const TABS: readonly Tab[] = [
  { key: "all", date: "ALL SIX DAYS", short: "ALL", name: "the whole week" },
  ...DAYS.map((day, i) => ({
    key: i as DayPick,
    date: day.weekday,
    /* THUR reads as a weekday at a glance where THU reads as a typo. */
    short: day.weekday.replace("THU ", "THUR "),
    name: day.name,
  })),
];

/**
 * Seven controls above the programme. Nothing about them moves: the active chip swaps
 * instantly and an unselected one only eases its opacity on hover. A filter that animates
 * is a filter you have to wait for.
 *
 * The two rows are the same seven buttons in two shapes, switched in CSS rather than off a
 * measured viewport width — so the first paint is already right and there is no resize
 * listener holding layout hostage. `display: none` takes the hidden row out of the
 * accessibility tree with it.
 */
export function DayFilter({
  pick,
  onPick,
}: {
  readonly pick: DayPick;
  readonly onPick: (day: DayPick) => void;
}) {
  return (
    <>
      <Image
        src="/doodles/orange/farmer.png"
        alt=""
        width={2548}
        height={1453}
        className="hidden wide:block"
        style={{
          width: "min(56%,300px)",
          height: "auto",
          margin: "25px auto clamp(10px,1.6vw,18px)",
        }}
      />

      {/* Seven chips on one line that never wraps. The rail is what stops them overflowing
          the section on a narrow desktop — it scrolls instead, with no visible bar. Its
          −6px margin is cancelled by the row's own 6px padding, so the first chip still
          lines up with the day headings below while its hand-cut edge can overhang. */}
      <div className="rail hidden wide:block" style={{ margin: "0 -6px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "flex-end",
            gap: 4,
            padding: "44px 6px",
            justifyContent: "space-between",
          }}
        >
          {TABS.map((tab, i) => (
            <button
              key={String(tab.key)}
              type="button"
              onClick={() => onPick(tab.key)}
              aria-pressed={pick === tab.key}
              style={{ flex: "none", padding: 0, background: "transparent", border: 0, cursor: "pointer", textAlign: "center" }}
            >
              {pick === tab.key ? (
                <span style={{ display: "block", background: "var(--beige)", clipPath: soft(i), padding: "7px 13px 9px" }}>
                  <span className="mono" style={{ display: "block", fontSize: 8.5, letterSpacing: ".14em", color: "var(--orange-on-light)" }}>
                    {tab.date}
                  </span>
                  <span style={{ display: "block", marginTop: 1, font: "400 16px/1.1 var(--font-display)", color: "var(--ink-title)", whiteSpace: "nowrap" }}>
                    {tab.name}
                  </span>
                </span>
              ) : (
                <span className="day-chip-off" style={{ display: "block", padding: "7px 9px 9px", opacity: 0.7, transition: "opacity var(--hover)" }}>
                  <span className="mono" style={{ display: "block", fontSize: 8.5, letterSpacing: ".14em", color: "var(--beige)" }}>
                    {tab.date}
                  </span>
                  <span style={{ display: "block", marginTop: 1, font: "400 clamp(12px,0.5vw + 8.4px,14.5px)/1.1 var(--font-display)", color: "var(--beige)", whiteSpace: "nowrap" }}>
                    {tab.name}
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Below 860px the chips carry dates only — one line, no script, so the row reads as
          a control rather than a second block of headline. */}
      <div className="flex wide:hidden" style={{ flexWrap: "wrap", gap: 6 }}>
        {TABS.map((tab, i) => (
          <button
            key={String(tab.key)}
            type="button"
            onClick={() => onPick(tab.key)}
            aria-pressed={pick === tab.key}
            style={{ flex: "none", padding: 0, background: "transparent", border: 0, cursor: "pointer" }}
          >
            {pick === tab.key ? (
              <span className="mono" style={{ display: "block", padding: "8px 13px 9px", clipPath: soft(i), background: "var(--orange)", fontSize: 11, letterSpacing: ".1em", color: "var(--beige)" }}>
                {tab.short}
              </span>
            ) : (
              <span className="mono day-chip-off" style={{ display: "block", margin: "1px 0", padding: "6px 11px 7px", clipPath: soft(i), background: "var(--chip-well)", fontSize: 10, letterSpacing: ".1em", color: "var(--beige)", opacity: 0.72, transition: "opacity var(--hover)" }}>
                {tab.short}
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}
