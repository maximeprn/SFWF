import { ISLAND_INTRO, ISLAND_SIGN_OFF } from "@/content/home";

/**
 * Two paragraphs and a script line.
 *
 * The measure is `min(80vw, 820px)`, and every prose block on Home shares it. The vw half
 * gives the copy real margins on a phone; the px half stops it stretching on a desktop,
 * where 80vw of a 1440 screen was running to about 140 characters a line. 820px is still a
 * long measure — around 100 characters — but it is the festival's, chosen over the design's
 * 620–680px caps, and it holds the same width for all four blocks.
 *
 * No flourish above it: it reads as the film's caption more than as a new section, and the
 * boundary the film already carries is the one the eye needs there.
 */
export function IslandIntro() {
  return (
    <section
      style={{
        maxWidth: "var(--sw)",
        margin: "0 auto",
        padding: "var(--sec) var(--gutter) 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "min(80vw,820px)", textAlign: "center" }}>
        {ISLAND_INTRO.map((para, i) => (
          <p
            key={para.slice(0, 24)}
            style={{
              margin: i === 0 ? 0 : "20px 0 0",
              font: "400 clamp(15px,0.6vw + 13.3px,16.5px)/1.72 var(--font-body)",
              color: "var(--beige)",
              textWrap: "pretty",
            }}
          >
            {para}
          </p>
        ))}
        <p
          style={{
            margin: "24px 0 0",
            font: "400 clamp(26px,4.4vw,38px)/1.2 var(--font-display)",
            color: "var(--orange)",
            textWrap: "pretty",
          }}
        >
          {ISLAND_SIGN_OFF}
        </p>
      </div>
    </section>
  );
}
