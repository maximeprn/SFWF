import { WobbleFlourish } from "@/components/ui/Wobble";
import { ACKNOWLEDGEMENT } from "@/content/home";

/**
 * It sits on the dye, with no beige band and no box around it. Putting this on a surface
 * would make it a callout — a thing the page is quoting — and it is the page speaking.
 *
 * The statement is Arimo 700 uppercase rather than the script: it is the one line here that
 * is a statement rather than a voice. It carries no eyebrow — a mono label reading
 * ACKNOWLEDGEMENT over a sentence that is plainly an acknowledgement only announces the
 * genre of what follows.
 */
export function Acknowledgement() {
  return (
    <section style={{ maxWidth: "var(--sw)", margin: "0 auto", padding: "0 var(--gutter)" }}>
      <WobbleFlourish variant={3} />
      <div style={{ maxWidth: "80vw", margin: "0 auto", textAlign: "center" }}>
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
