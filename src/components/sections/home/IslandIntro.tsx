import { ISLAND_INTRO, ISLAND_SIGN_OFF } from "@/content/home";

/**
 * Two paragraphs and a script line, centred at the design's 620px cap.
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
      <div style={{ maxWidth: 620, textAlign: "center" }}>
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
