import { Mark } from "@/components/ui/Mark";
import { APP_PARTNER } from "@/content/site";

/**
 * The app partner, credited on its own line under the sponsor row.
 *
 * It takes the row's structure exactly — mono label, then the mark — because it reads as the
 * next tier of the same list rather than as a new section: no flourish of its own, no heading,
 * just more air above it than the row uses between its own lines.
 *
 * The one mark in the product that keeps its own colours. It carries no wordmark, so a beige
 * knockout would cost it the only thing that identifies it, and the label is what states the
 * relationship. See `project-docs/phase-1-deviations.md`.
 */
export function AppPartner() {
  return (
    <section
      style={{
        maxWidth: "var(--sw)",
        margin: "clamp(34px,4.4vw,52px) auto 0",
        padding: "0 var(--gutter)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(14px,1.8vw,18px)",
        textAlign: "center",
      }}
    >
      <p
        className="mono"
        style={{
          margin: 0,
          fontSize: 11.5,
          letterSpacing: ".2em",
          color: "var(--beige)",
        }}
      >
        {APP_PARTNER.label}
      </p>
      {/* The alt text is the accessible name, so the anchor adds no label of its own to
          repeat it. `lineHeight: 0` keeps the anchor the height of the mark and not of a
          line box the mark happens to sit in. */}
      <a
        href={APP_PARTNER.href}
        target="_blank"
        rel="noopener"
        className="partner-mark"
        style={{ display: "block", lineHeight: 0 }}
      >
        <Mark
          src={APP_PARTNER.src}
          alt={APP_PARTNER.name}
          intrinsic={APP_PARTNER.intrinsic}
          style={{ width: `calc(${APP_PARTNER.width}px * var(--mark-scale))`, height: "auto" }}
        />
      </a>
    </section>
  );
}
