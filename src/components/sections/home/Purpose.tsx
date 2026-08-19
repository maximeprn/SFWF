import Link from "next/link";
import { WobbleFlourish } from "@/components/ui/Wobble";
import { PURPOSE } from "@/content/home";
import { soft } from "@/lib/design/shapes";

const PROSE = "400 clamp(14.5px,0.5vw + 13.1px,16px)/1.7 var(--font-body)";

/**
 * The argument for the festival, and the one left-aligned block on a centre-spined page.
 * That is the point of it: everything else here is an announcement, and this is reading.
 *
 * The live site drew a root system under it and revealed it on scroll. Both are gone — the
 * chapters are copy, not linework, and nothing on this page moves that is not answering a
 * tap, a hover or a scroll.
 *
 * `id="purpose"` is the target of the programme page's own primary button.
 */
export function Purpose() {
  return (
    <section id="purpose" style={{ maxWidth: "var(--sw)", margin: "0 auto", padding: "0 var(--gutter)" }}>
      <WobbleFlourish variant={4} />
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "left" }}>
        <p className="mono" style={{ margin: 0, fontSize: 11.5, letterSpacing: ".2em", color: "var(--beige)" }}>
          WHY WE DO THIS
        </p>
        <h2
          style={{
            margin: "16px 0 0",
            font: "400 clamp(30px,5vw,46px)/1.14 var(--font-display)",
            color: "var(--orange)",
            textWrap: "pretty",
          }}
        >
          {PURPOSE.heading}
        </h2>

        {PURPOSE.chapters.map((chapter) => (
          <div key={chapter.number} style={{ marginTop: "clamp(38px,5vw,52px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <span style={{ font: "400 clamp(26px,3.4vw,32px)/1 var(--font-display)", color: "var(--beige)" }}>
                {chapter.number}
              </span>
              <span
                className="mono"
                style={{ fontSize: 11.5, letterSpacing: ".2em", color: "var(--beige)", whiteSpace: "nowrap" }}
              >
                {chapter.label}
              </span>
              {/* A drawn hairline running to the right margin, never a border. */}
              <svg
                viewBox="0 0 100 4"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
                style={{ flex: 1, height: 4, overflow: "visible" }}
              >
                <path
                  d="M1 2.4 C 22 1 44 3.2 66 1.8 C 80 1 90 2.8 99 2"
                  stroke="var(--hairline-beige)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <h3
              style={{
                margin: "18px 0 0",
                font: "400 clamp(25px,3.6vw,34px)/1.2 var(--font-display)",
                color: "var(--orange)",
                textWrap: "pretty",
              }}
            >
              {chapter.statement}
            </h3>
            <p style={{ margin: "14px 0 0", font: PROSE, color: "var(--beige)", textWrap: "pretty" }}>
              {chapter.body}
              {chapter.emphasis ? <strong style={{ fontWeight: 700 }}>{chapter.emphasis}</strong> : null}
            </p>
          </div>
        ))}

        <p
          style={{
            margin: "clamp(34px,4.6vw,48px) 0 0",
            maxWidth: "24em",
            font: "400 clamp(24px,3.4vw,32px)/1.24 var(--font-display)",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          {PURPOSE.payoff}
        </p>
        <p style={{ margin: "24px 0 0", font: PROSE, color: "var(--beige)", textWrap: "pretty" }}>
          {PURPOSE.closing}
        </p>
        <Link
          href="/program"
          className="cta"
          style={{
            display: "inline-block",
            marginTop: 22,
            clipPath: soft(5),
            padding: "16px 32px 19px",
            background: "var(--orange)",
            color: "var(--button-ink)",
            font: "700 15px/1 var(--font-button)",
            letterSpacing: ".02em",
            transition: "background var(--hover)",
          }}
        >
          {PURPOSE.cta}
        </Link>
      </div>
    </section>
  );
}
