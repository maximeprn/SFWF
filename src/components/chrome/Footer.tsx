import { WobbleRule } from "@/components/ui/Wobble";
import { CONTACT_EMAIL, DATELINE, SOCIALS } from "@/content/site";
import { SocialMark } from "./SocialMark";

/**
 * A drawn hairline, then one centred column: the three marks, the address, the dateline.
 *
 * The marks rest at −5°, +4° and −3° so the row reads hand-placed rather than aligned, and
 * a hover stands one upright and steps it forward — the single deliberate overshoot in a
 * system where the only other moving thing is the dye.
 */
export function Footer() {
  return (
    <footer style={{ marginTop: "clamp(50px,6.4vw,80px)" }}>
      <div
        style={{
          maxWidth: "calc(var(--sw) + 60px)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
        }}
      >
        <WobbleRule tone="beige-strong" />
      </div>
      <div
        style={{
          maxWidth: "var(--sw)",
          margin: "0 auto",
          padding: "clamp(28px,4vw,40px) var(--gutter)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(16px,2vw,22px)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener"
                aria-label={social.name}
                className="social-mark"
                style={
                  {
                    width: 40,
                    height: 40,
                    display: "grid",
                    placeItems: "center",
                    color: "var(--beige)",
                    "--tilt": `${social.tilt}deg`,
                  } as React.CSSProperties
                }
              >
                <SocialMark name={social.name} />
              </a>
            ))}
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              font: "400 20px/1 var(--font-display)",
              color: "var(--beige)",
              transition: "color var(--hover)",
            }}
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <p
          className="mono"
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.9,
            letterSpacing: ".14em",
            color: "var(--dateline)",
          }}
        >
          {DATELINE}
        </p>
      </div>
    </footer>
  );
}
