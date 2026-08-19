import Link from "next/link";
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
 * No eyebrow. The headline says what the section is; a mono label above it only names the
 * genre, and this block already carries two numbered labels of its own.
 *
 * `id="purpose"` is the target of the in-page link from the programme.
 */
export function Purpose() {
  return (
    <section id="purpose" style={{ maxWidth: "var(--sw)", margin: "0 auto", padding: "0 var(--gutter)" }}>
      {/* This boundary is a button rather than a wave. It carries the air on both sides of
          itself exactly as a flourish does — `<air> auto`, two values, so the halves cannot
          drift — which is why the section still takes no top padding of its own. */}
      <Link
        href="/program"
        className="cta"
        style={{
          display: "block",
          width: "fit-content",
          margin: "var(--flourish-air) auto",
          clipPath: soft(4),
          padding: "16px 32px 19px",
          background: "var(--orange)",
          color: "var(--button-ink)",
          font: "700 15px/1 var(--font-button)",
          letterSpacing: ".02em",
          transition: "background var(--hover)",
        }}
      >
        Celebrate with Us
      </Link>
      <div style={{ maxWidth: "80vw", margin: "0 auto", textAlign: "left" }}>
        {/* Beige, not orange — README §3's section-h2 row and the canonical prototype both.
            The orange script belongs to the hero and the sign-offs; here it would compete
            with the two chapter statements directly below it, which are the orange. */}
        <h2
          style={{
            margin: 0,
            font: "400 clamp(30px,5vw,46px)/1.14 var(--font-display)",
            color: "var(--beige)",
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
            {/* Arimo 700 uppercase, not the script. README §3 calls this the "chapter
                statement" and §6 spells it out again; `SFWF prototype.dc.html`, the canonical
                artifact, draws it that way. Only `SFWF Home.dc.html` sets it in Beth Ellen,
                and that file is the outlier — it is also the one still carrying Wigglye and
                Satoshi in its footer.

                This is the second uppercase-Arimo statement on the page, after the
                acknowledgement. Both are the page stating something rather than speaking. */}
            <h3
              style={{
                margin: "18px 0 0",
                font: "700 clamp(15px,0.5vw + 13.1px,17.5px)/1.34 var(--font-body)",
                letterSpacing: ".005em",
                textTransform: "uppercase",
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
          /* The one centred thing in a left-aligned block. The column is prose and reads
             from the left edge; the button is a control and belongs to the whole column
             rather than to the last line of it. */
          style={{
            display: "block",
            width: "fit-content",
            margin: "clamp(26px,3.4vw,34px) auto 0",
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
