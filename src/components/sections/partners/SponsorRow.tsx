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
      <WobbleFlourish variant={0} />
      <p
        className="mono"
        style={{
          margin: "0 0 16px",
          fontSize: 10.5,
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
          margin: "clamp(4px,1vw,10px) 0 0",
        }}
      >
        {SPONSORS.map((sponsor) => (
          <Mark
            key={sponsor.src}
            src={sponsor.src}
            alt={sponsor.name}
            intrinsic={sponsor.intrinsic}
            /* Taller than the handoff's 24–32px, which was set for four landscape
               wordmarks. Four of the ten marks are square badges, and at 32px those read as
               dots next to a mark like Destileria that is nearly five times as wide.
               The max-width stays a safety net rather than a second cap: at every width the
               tallest mark still comes out narrower than it, so nothing is ever squashed —
               and `contain` means a mark that somehow did hit it would letterbox, not
               distort. The row wraps to two lines above ~1100px, which is the point. */
            style={{
              height: "clamp(34px,4.2vw,46px)",
              width: "auto",
              maxWidth: "min(44vw,240px)",
              objectFit: "contain",
            }}
          />
        ))}
      </div>
    </section>
  );
}
