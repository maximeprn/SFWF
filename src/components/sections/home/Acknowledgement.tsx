import { WobbleFlourish } from "@/components/ui/Wobble";
import { ACKNOWLEDGEMENT } from "@/content/home";

/**
 * It sits on the dye, with no beige band and no box around it. Putting this on a surface
 * would make it a callout — a thing the page is quoting — and it is the page speaking.
 *
 * The statement is Arimo 700 uppercase rather than the script: it is the one line here that
 * is a statement rather than a voice.
 */
export function Acknowledgement() {
  return (
    <section style={{ maxWidth: "var(--sw)", margin: "0 auto", padding: "0 var(--gutter)" }}>
      <WobbleFlourish variant={3} />
      <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
        <p
          className="mono"
          style={{ margin: "0 0 16px", fontSize: 11.5, letterSpacing: ".2em", color: "var(--beige)" }}
        >
          ACKNOWLEDGEMENT
        </p>
        <p
          style={{
            margin: 0,
            font: "700 clamp(16px,0.75vw + 13.6px,17.5px)/1.5 var(--font-body)",
            letterSpacing: ".01em",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          {ACKNOWLEDGEMENT.statement}
        </p>
        {ACKNOWLEDGEMENT.body.map((para) => (
          <p
            key={para.slice(0, 24)}
            style={{
              margin: "20px 0 0",
              font: "400 clamp(14.5px,0.5vw + 13.1px,16px)/1.72 var(--font-body)",
              color: "var(--beige)",
              textWrap: "pretty",
            }}
          >
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}
