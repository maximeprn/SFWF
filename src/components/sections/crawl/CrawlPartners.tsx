import { Bubble } from "@/components/ui/Bubble";
import type { Crawl } from "@/content/types";

/**
 * The partner list, in one of two registers.
 *
 * Karinderyas carry a one-liner each about the family behind them — the richest content the
 * festival has — so they get bubbles. Cafés are represented by their own logos, knocked out
 * to white so ten different brand marks read as one row. Neither is reduced to a bare list.
 */
export function CrawlPartners({ crawl }: { readonly crawl: Crawl }) {
  const hasNotes = Boolean(crawl.venues[0]?.note);

  return (
    <section style={{ marginTop: 38 }}>
      <p
        style={{
          margin: "0 0 18px",
          font: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--mark)",
          textShadow: "var(--text-shadow-on-dye)",
        }}
      >
        {crawl.partnersLabel}
      </p>

      {hasNotes ? (
        <div className="flex flex-col gap-[10px] wide:grid wide:grid-cols-2 wide:gap-4">
          {crawl.venues.map((venue, i) => (
            <Bubble key={venue.name} i={i} style={{ padding: "18px 24px" }}>
              <p style={{ margin: 0, font: "var(--text-h3)", color: "var(--bubble-ink)" }}>{venue.name}</p>
              <p style={{ margin: "5px 0 0", font: "var(--text-body-sm)", color: "var(--bubble-soft)" }}>
                {venue.note}
              </p>
            </Bubble>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 26px", alignItems: "center" }}>
          {crawl.venues.map((venue) => (
            /* Plain <img>: these are large traced SVGs, which next/image would not optimise
               anyway, and the knockout filter needs the raw mark. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={venue.name}
              src={`/partners/${venue.logo}.svg`}
              alt={venue.name}
              style={{
                height: 34,
                maxWidth: 110,
                objectFit: "contain",
                display: "block",
                filter: "brightness(0) invert(1)",
                opacity: 0.92,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
