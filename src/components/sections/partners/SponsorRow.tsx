import { Mark } from "@/components/ui/Mark";
import { WobbleFlourish } from "@/components/ui/Wobble";
import { SPONSORS } from "@/content/site";

/** The sponsor marks, beige on the dye. Never boxed, never on a white plate. */
export function SponsorRow() {
  return (
    <section
      style={{
        maxWidth: "var(--sw)",
        margin: "0 auto",
        /* No top padding of its own: the flourish it opens with carries this boundary, and
           carries it on both sides. */
        padding: "0 var(--gutter)",
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
          fontSize: 11.5,
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
          gap: "clamp(22px,3.6vw,40px)",
          /* The full column, unlike the host row above it, which is held at 980. That cap
             was this row's too while it carried eleven marks: at the full column those
             eleven packed 8 + 2 and the last two read as stragglers. Fifteen marks invert
             it — 980 now packs 6 + 7 + 2 and strands the same two, where the full column
             packs 7 + 8, two filled rows answering the host row's 8 + 7. The measures no
             longer match; the shape of the two blocks does, which is what was being
             protected. */
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
            style={{ width: `calc(${sponsor.width}px * var(--mark-scale))`, height: "auto", maxWidth: "100%" }}
          />
        ))}
      </div>
    </section>
  );
}
