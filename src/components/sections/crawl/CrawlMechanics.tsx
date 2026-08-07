import { MECHANICS } from "@/content/crawls";
import { nub } from "@/lib/design/shapes";

/**
 * The four passport steps. One ₱500 passport covers both crawls, so this is stated once
 * here rather than repeated per crawl the way the 2025 site did.
 *
 * A column on a phone, a four-up row once there's width — the steps are equal siblings,
 * so they read better side by side than stacked when there's room.
 */
export function CrawlMechanics() {
  return (
    <section style={{ marginTop: 28 }}>
      <p
        style={{
          margin: "0 0 14px",
          font: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--mark)",
          textShadow: "var(--text-shadow-on-dye)",
        }}
      >
        How it works
      </p>
      <ol className="flex flex-col gap-[22px] wide:grid wide:grid-cols-4 wide:gap-8 m-0 p-0 list-none">
        {MECHANICS.map((step, i) => (
          <li key={step.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span
              style={{
                flexShrink: 0,
                width: 30,
                height: 30,
                borderRadius: nub(i),
                background: "var(--mark)",
                color: "var(--ink-deep)",
                display: "grid",
                placeItems: "center",
                font: "var(--text-h3)",
              }}
            >
              {i + 1}
            </span>
            <div style={{ textShadow: "var(--text-shadow-on-dye)" }}>
              <p style={{ margin: 0, font: "var(--display-4)", color: "var(--on-bg)" }}>{step.title}</p>
              <p style={{ margin: "3px 0 0", font: "var(--text-body-sm)", color: "var(--on-bg-soft)" }}>
                {step.blurb}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
