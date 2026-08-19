import { Mark } from "@/components/ui/Mark";
import { WobbleTick } from "@/components/ui/Wobble";
import { FESTIVAL_DATES, SITE } from "@/content/site";

/**
 * The top of the page: the wordmark with "2nd edition" pinned to its corner, the script
 * line, and the dateline between two mirrored wobble rules.
 *
 * There is no CTA button here. In this release the programme starts immediately below, so
 * there is nothing for one to link to — the phase 2 Home gets it back when the page grows
 * a film and an island intro between the two.
 *
 * Everything scales off `--hs`, which is 1 until 1100px and 1.4 above it. That is the
 * design's second step and the only place the hero and the rest of the page disagree.
 */
export function Hero() {
  return (
    <section
      style={{
        maxWidth: "var(--sw)",
        margin: "0 auto",
        padding: "calc(clamp(34px,5vw,58px) * var(--hs) * var(--hs)) var(--gutter) 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: "100%",
          paddingTop: "calc(22px * var(--hs))",
        }}
      >
        <Mark
          src="/logo/sfwf-beige.png"
          alt={SITE.name}
          intrinsic={[780, 321]}
          priority
          style={{ width: "calc(min(46vw, 300px) * var(--hs))", height: "auto" }}
        />
        <p
          style={{
            position: "absolute",
            bottom: "calc(100% + 2px)",
            right: 0,
            margin: 0,
            font: "400 calc(clamp(15px,2vw,20px) * var(--hs))/1 var(--font-display)",
            color: "var(--beige)",
            whiteSpace: "nowrap",
            transform: "rotate(-4deg)",
            transformOrigin: "right bottom",
          }}
        >
          {SITE.editionLabel}
        </p>
      </div>

      {/* Lowercase is the voice, not a text-transform — the festival writes it this way. */}
      <h1
        style={{
          margin: "calc(14px * var(--hs)) auto calc(clamp(26px,4vw,40px) * var(--hs))",
          maxWidth: "14em",
          font: "400 calc(clamp(32px,5.4vw,56px) * var(--hs))/1.1 var(--font-display)",
          color: "var(--orange)",
          textWrap: "pretty",
        }}
      >
        {SITE.edition}
      </h1>

      <div
        style={{
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(10px,2vw,18px)",
        }}
      >
        <WobbleTick />
        <p
          className="mono"
          style={{
            margin: 0,
            fontSize: "calc(clamp(10px,1.4vw,11.5px) * var(--hs))",
            letterSpacing: ".22em",
            color: "var(--beige)",
            whiteSpace: "nowrap",
          }}
        >
          {FESTIVAL_DATES.display}
        </p>
        <WobbleTick flip />
      </div>
    </section>
  );
}
