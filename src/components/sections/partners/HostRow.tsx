import { Mark } from "@/components/ui/Mark";
import { WobbleFlourish } from "@/components/ui/Wobble";
import { HOST_LOGOS } from "@/content/site";

/**
 * Everyone hosting a gathering. The prototype wrapped this row in a link to a Venues page
 * that was explored and cut — it is a credit, not a control, and does not link anywhere.
 *
 * Widths are per-logo and hand-tuned: a common height leaves the wide wordmarks shouting
 * and the round marks lost.
 */
export function HostRow() {
  return (
    <section
      style={{ maxWidth: "var(--sw)", margin: "0 auto", padding: "var(--sec) var(--gutter) 0" }}
    >
      <WobbleFlourish variant={1} />
      <p
        className="mono"
        style={{
          margin: "0 0 18px",
          fontSize: 10.5,
          letterSpacing: ".2em",
          color: "var(--beige)",
          textAlign: "center",
        }}
      >
        HOSTED ACROSS THE ISLAND BY
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(16px,2.6vw,30px)",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        {HOST_LOGOS.map((host) => (
          <Mark
            key={host.src}
            src={host.src}
            alt={host.name}
            intrinsic={host.intrinsic}
            style={{ width: host.width, height: "auto" }}
          />
        ))}
      </div>
    </section>
  );
}
