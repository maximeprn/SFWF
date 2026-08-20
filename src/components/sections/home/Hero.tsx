import Link from "next/link";
import { Mark } from "@/components/ui/Mark";
import { Ring } from "@/components/ui/Ring";
import { Slab } from "@/components/ui/Slab";
import type { StyleWithVars } from "@/lib/ui/cssVars";
import { WobbleTick } from "@/components/ui/Wobble";
import { FESTIVAL_DATES, SITE } from "@/content/site";
import { soft } from "@/lib/design/shapes";

/**
 * The top of the page: the wordmark with "2nd edition" pinned to its corner, the script
 * line, and the dateline between two mirrored wobble rules.
 *
 * The dateline and the button are one group, and the group owns the air on both sides of
 * itself as a two-value margin — the same rule the flourishes follow. Written any other way
 * the space above would belong to the group and the space below to the film, and the two
 * would drift apart the moment either changed.
 *
 * Every size is the design of record's own clamp, applied directly. The earlier build
 * multiplied a smaller set by --hs above 1100px, which is the same ramp expressed twice:
 * the vw term already carries it, and it landed the dateline 30% over.
 */
export function Hero() {
  return (
    <section
      style={{
        maxWidth: "var(--sw)",
        margin: "0 auto",
        padding: "clamp(44px,7vw,86px) var(--gutter) 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: "100%",
          paddingTop: "clamp(26px,3.6vw,40px)",
        }}
      >
        <Mark
          src="/logo/sfwf-beige.png"
          alt={SITE.name}
          intrinsic={[780, 321]}
          priority
          style={{ width: "min(50vw,490px)", height: "auto" }}
        />
        <p
          style={{
            position: "absolute",
            bottom: "calc(100% + 3px)",
            right: 0,
            margin: 0,
            font: "400 clamp(19px,2.5vw,29px)/1 var(--font-display)",
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
          margin: "clamp(14px,2.4vw,22px) auto 0",
          maxWidth: "15em",
          font: "400 clamp(46px,8.4vw,88px)/1.06 var(--font-display)",
          color: "var(--orange)",
          textWrap: "pretty",
        }}
      >
        {SITE.edition}
      </h1>

      {/* The dateline owns the air on both sides of itself, as a two-value margin, for the
          reason the flourishes do: when the space above belonged to the headline's margin and
          the space below to the hero's padding plus the film's, the two could not agree and it
          sat 80px under "ani sang Siargao" and 126px over the film. There is no third value
          here to set them apart. `tests/design.test.ts` holds it. */}
      {/* Still one owner per boundary, written as one shorthand — but no longer symmetric.
          Once the button joined the group the two ends stopped being the same kind of gap:
          above is the headline meeting its dateline, below is the hero meeting the film. */}
      <div style={{ margin: "calc(var(--sec) - 10px) auto calc(var(--sec) - 45px)" }}>
        <div
          style={{
            margin: "0 auto",
            width: "fit-content",
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(12px,2vw,20px)",
          }}
        >
          <WobbleTick />
          <p
            className="mono"
            style={{
              margin: 0,
              fontSize: "clamp(11.5px,1.6vw,13.5px)",
              letterSpacing: ".24em",
              color: "var(--beige)",
              whiteSpace: "nowrap",
            }}
          >
            {FESTIVAL_DATES.display}
          </p>
          <WobbleTick flip />
        </div>

        {/* Beige, where every other primary button on the site is orange. It is the first
            thing under the festival's own name and the orange is already spoken for by the
            headline directly above it — two oranges that close together read as one block
            of colour rather than as a headline and a control. */}
        {/* Beige at rest and inverts to orange under press — the "light fill" case, since
            the orange is already spoken for by the headline directly above it. See
            `design_handoff_button_press/README.md`. */}
        <Slab shapeIndex={1} style={{ display: "inline-block", marginTop: "clamp(42px,4.7vw,60px)" }}>
          <Link
            href="/program"
            className="press-btn"
            data-press="orange"
            style={{
              clipPath: soft(1),
              padding: "17px 36px 20px",
              "--btn-fill": "var(--beige)",
              color: "var(--button-ink)",
              font: "700 16px/1 var(--font-button)",
              letterSpacing: ".02em",
            } as StyleWithVars}
          >
            View the Program
            <Ring shapeIndex={1} weight="var(--button-edge)" />
          </Link>
        </Slab>
      </div>
    </section>
  );
}
