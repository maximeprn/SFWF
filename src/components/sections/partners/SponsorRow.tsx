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
            style={{
              height: "clamp(24px,2.8vw,32px)",
              width: "auto",
              maxWidth: "min(40vw,150px)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
