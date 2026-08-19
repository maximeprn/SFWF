import { Mark } from "@/components/ui/Mark";
import { WobbleFlourish } from "@/components/ui/Wobble";
import { SPONSORS } from "@/content/site";

/** The four sponsor marks, beige on the dye. Never boxed, never on a white plate. */
export function SponsorRow() {
  return (
    <section
      style={{
        maxWidth: "var(--sw)",
        margin: "0 auto",
        padding: "var(--sec) var(--gutter) 0",
        textAlign: "center",
      }}
    >
      <WobbleFlourish variant={1} />
      <p
        className="mono"
        style={{
          /* The row below is a set of marks at ten different widths, so the label needs
             more air under it than a paragraph would to read as a label rather than as the
             first thing in the row. */
          margin: "0 0 clamp(26px,3.2vw,36px)",
          fontSize: 11.55,
          letterSpacing: ".2em",
          color: "var(--beige)",
        }}
      >
        OFFICIAL PARTNERS AND SPONSORS
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(22px,3.6vw,38px)",
          /* Same measure as the host row directly above. Left at the full column the ten
             marks pack 8 + 2 at desktop and the last two read as stragglers. */
          maxWidth: 880,
          margin: "clamp(4px,1vw,10px) auto 0",
        }}
      >
        {SPONSORS.map((sponsor) => (
          <Mark
            key={sponsor.src}
            src={sponsor.src}
            alt={sponsor.name}
            intrinsic={sponsor.intrinsic}
            /* Per-mark width, height derived — the host row's rule, for the host row's
               reason. The handoff's common height was set for four landscape wordmarks;
               it cannot also serve four square badges. Widths live in `SPONSORS`. */
            style={{ width: sponsor.width, height: "auto", maxWidth: "100%" }}
          />
        ))}
      </div>
    </section>
  );
}
