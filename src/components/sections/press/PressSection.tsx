import { ACCREDITATION, ACCREDITATION_EMAIL, MEDIA_KIT, PRESS_STATS } from "@/content/press";
import { soft } from "@/lib/design/shapes";
import { CARD_PROSE, CardNote, PressCard } from "./PressCard";

const FRAME = { maxWidth: "var(--sw)", margin: "0 auto" } as const;
const GRID = { maxWidth: 1000, margin: "0 auto", display: "grid", alignItems: "start" } as const;

/**
 * The media centre. Two cards, four figures, and a way to reach a person.
 *
 * There are no photographs on it. The design of record drops the pair the README sketched,
 * and it is right to: the festival has four images in total, none of them is a press image,
 * and a page that promises a media folder should not illustrate itself with the only four
 * pictures the site already uses elsewhere.
 */
export function PressSection() {
  return (
    <>
      <section style={{ ...FRAME, padding: "clamp(30px,5vw,60px) var(--gutter) 0", textAlign: "center" }}>
        <p className="mono" style={{ margin: "0 0 14px", fontSize: 11.5, letterSpacing: ".2em", color: "var(--beige)" }}>
          PRESS
        </p>
        <h1
          style={{
            margin: "0 auto",
            maxWidth: "16em",
            font: "400 clamp(38px,7vw,74px)/1.1 var(--font-display)",
            color: "var(--orange)",
            textWrap: "pretty",
          }}
        >
          media centre
        </h1>
        <p
          style={{
            margin: "20px auto 0",
            maxWidth: "38em",
            font: "400 clamp(15px,0.6vw + 13.3px,16.5px)/1.7 var(--font-body)",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          We’re available to assist media outlets, journalists and food content creators
          needing information, images, video and interviews for coverage of the festival.
        </p>
      </section>

      <section style={{ ...FRAME, padding: "clamp(44px,6vw,72px) var(--gutter) 0" }}>
        <div style={{ ...GRID, gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14 }}>
          <PressCard shape={0} kicker={ACCREDITATION.kicker} title={ACCREDITATION.title}>
            <p style={{ margin: "12px 0 0", font: `400 ${CARD_PROSE}`, color: "var(--ink-body)", textWrap: "pretty" }}>
              {ACCREDITATION.intro}
            </p>
            <ul style={{ margin: "16px 0 0", paddingLeft: 20, font: `400 ${CARD_PROSE}`, color: "var(--ink-body)" }}>
              {ACCREDITATION.benefits.map((benefit, i) => (
                <li key={benefit} style={{ marginBottom: i < ACCREDITATION.benefits.length - 1 ? 8 : 0 }}>
                  {benefit}
                </li>
              ))}
            </ul>
            {/* Written as unset, not omitted. A page with no deadline on it reads as a page
                with no deadline. */}
            <CardNote>{ACCREDITATION.deadline}</CardNote>
            <a
              href={`mailto:${ACCREDITATION_EMAIL}?subject=${encodeURIComponent("Media accreditation 2026")}`}
              className="cta-in-bubble on-beige"
              style={{
                display: "inline-block",
                marginTop: 18,
                clipPath: soft(1),
                padding: "15px 26px 17px",
                background: "var(--ink-body)",
                color: "var(--cream)",
                font: "700 14.5px/1.2 var(--font-body)",
                transition: "background var(--hover)",
              }}
            >
              {ACCREDITATION.cta}
            </a>
          </PressCard>

          <PressCard shape={1} kicker={MEDIA_KIT.kicker} title={MEDIA_KIT.title}>
            <p style={{ margin: "12px 0 0", font: `400 ${CARD_PROSE}`, color: "var(--ink-body)", textWrap: "pretty" }}>
              {MEDIA_KIT.intro}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 18 }}>
              {MEDIA_KIT.tiles.map((tile) => (
                <div key={tile} className="kit-tile">
                  <p className="mono" style={{ margin: 0, fontSize: 11, letterSpacing: ".12em", color: "var(--ink-body)" }}>
                    {tile}
                  </p>
                </div>
              ))}
            </div>
            <CardNote>{MEDIA_KIT.link}</CardNote>
          </PressCard>
        </div>
      </section>

      <section style={{ ...FRAME, padding: "clamp(44px,6vw,72px) var(--gutter) 0" }}>
        <div style={{ ...GRID, gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 12 }}>
          {PRESS_STATS.map((stat, i) => (
            <div key={stat.label} style={{ background: "var(--beige)", clipPath: soft(i), padding: "22px 26px 26px" }}>
              {/* `--orange-on-light`, not the bright orange: these sit on beige, where
                  #E9622D is 2.67:1 and this is 5.99:1. */}
              <p style={{ margin: 0, font: "400 34px/1 var(--font-display)", color: "var(--orange-on-light)" }}>
                {stat.figure}
              </p>
              <p className="mono" style={{ margin: "8px 0 0", fontSize: 11, letterSpacing: ".16em", color: "var(--ink-body)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...FRAME, padding: "clamp(50px,6.4vw,76px) var(--gutter) 0", textAlign: "center" }}>
        <p
          style={{
            margin: "0 auto",
            maxWidth: "22em",
            font: "400 clamp(24px,3.4vw,32px)/1.24 var(--font-display)",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          Covering the festival?
        </p>
        <p
          style={{
            margin: "16px auto 0",
            maxWidth: "32em",
            font: "400 clamp(14.5px,0.5vw + 13.1px,16px)/1.7 var(--font-body)",
            color: "var(--beige)",
            textWrap: "pretty",
          }}
        >
          Tell us what you’re working on and we’ll put you with the right people on the island.
        </p>
        <a
          href={`mailto:${ACCREDITATION_EMAIL}`}
          className="cta"
          style={{
            display: "inline-block",
            marginTop: 20,
            clipPath: soft(1),
            padding: "16px 32px 19px",
            background: "var(--orange)",
            color: "var(--button-ink)",
            font: "700 15px/1 var(--font-button)",
            letterSpacing: ".02em",
            transition: "background var(--hover)",
          }}
        >
          {ACCREDITATION_EMAIL}
        </a>
      </section>
    </>
  );
}
