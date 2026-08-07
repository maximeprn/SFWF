import { Cta } from "@/components/ui/Cta";
import { Doodle } from "@/components/ui/Doodle";
import { DATELINE, SITE } from "@/content/site";

/**
 * The one hero on the site. The bloom background is already behind it — there is no second
 * treatment layered on top, and no photo: the dye is the hero medium.
 */
export function HomeHero() {
  return (
    <section
      style={{
        position: "relative",
        padding: "34px var(--gutter) 0",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          font: "var(--text-eyebrow)",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "var(--tracking-eyebrow)",
          lineHeight: "18px",
          textTransform: "uppercase",
          color: "var(--on-bg-soft)",
          paddingBottom: 16,
          textShadow: "var(--text-shadow-on-dye)",
        }}
      >
        {DATELINE}
      </p>
      <h1
        className="mx-auto"
        style={{
          margin: "18px auto 0",
          maxWidth: "16ch",
          font: "var(--display-1)",
          color: "var(--on-bg)",
          textWrap: "pretty",
          textShadow: "var(--text-shadow-on-dye-strong)",
        }}
      >
        {SITE.tagline}
      </h1>
      <Cta i={0} label="View Schedule" href="/program" style={{ marginTop: 36 }} />

      {/* Decorative, out of flow. Hidden on wide screens, where the column is roomy enough
          that they would drift far from the copy they punctuate. */}
      <span className="wide:hidden">
        <Doodle icon="tray" size={46} rot={-10} op={0.72} left={24} top={71} />
        <Doodle icon="wine-glass" size={44} rot={14} op={0.7} right={14} top={248} />
      </span>
    </section>
  );
}
