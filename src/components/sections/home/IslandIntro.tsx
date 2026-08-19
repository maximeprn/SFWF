import { ISLAND_INTRO, ISLAND_SIGN_OFF } from "@/content/home";

/**
 * Two paragraphs and a script line.
 *
 * The measure is 80vw rather than the design's per-block px cap, at the festival's request:
 * it gives the block real margins on a phone and lets it fill the column on a desktop. Note
 * that at the full column this runs to roughly 140 characters a line, about twice the 60–75
 * that reads comfortably — the caps it replaces were 620–680px for that reason.
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
      <div style={{ maxWidth: "80vw", textAlign: "center" }}>
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
