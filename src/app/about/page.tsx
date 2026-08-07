import type { Metadata } from "next";
import { Bubble, Prose } from "@/components/ui/Bubble";
import { Doodle } from "@/components/ui/Doodle";
import { Photo } from "@/components/ui/Photo";
import { ABOUT } from "@/content/media";
import { PHOTOS } from "@/content/photos";
import { blob } from "@/lib/design/shapes";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT.paragraphs[0],
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div
      style={{
        position: "relative",
        padding: "var(--gap) var(--gutter) 60px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sec)",
      }}
    >
      <p
        style={{
          margin: 0,
          font: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--mark)",
          textShadow: "var(--text-shadow-on-dye)",
        }}
      >
        {ABOUT.eyebrow}
      </p>
      <h1 style={{ margin: 0, font: "var(--display-2)", color: "var(--on-bg)", maxWidth: "20ch", textWrap: "pretty", textShadow: "var(--text-shadow-on-dye-strong)" }}>
        {ABOUT.title}
      </h1>

      <Photo i={2} src={PHOTOS[0]!.src} alt={PHOTOS[0]!.caption} h={200} sizes="(min-width: 900px) 1100px, 100vw" />

      <div className="flex flex-col gap-[var(--sec)] wide:grid wide:grid-cols-2 wide:gap-10">
        {ABOUT.paragraphs.map((text, i) => (
          <Prose key={i} i={i * 2} style={{ maxWidth: "var(--prose)" }}>
            <p style={{ margin: 0, font: "var(--text-body)", color: "var(--on-bg)" }}>{text}</p>
          </Prose>
        ))}
      </div>

      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {ABOUT.chips.map((chip, i) => (
          <Bubble
            key={chip}
            i={i}
            fill={i % 3 === 0 ? "var(--mark)" : undefined}
            radius={blob(i)}
            style={{
              padding: "10px 18px",
              font: "var(--text-h3)",
              whiteSpace: "nowrap",
              color: i % 3 === 0 ? "var(--ink-deep)" : "var(--bubble-ink)",
            }}
          >
            {chip}
          </Bubble>
        ))}
        <span className="wide:hidden">
          <Doodle icon="grilled-fish" size={50} rot={12} op={0.78} right={-8} bottom={-56} />
        </span>
      </div>

      <Prose i={4} style={{ textAlign: "center" }}>
        <p style={{ margin: 0, font: "var(--display-4)", color: "var(--on-bg)" }}>{ABOUT.closing}</p>
        <p style={{ margin: "8px 0 0", font: "var(--text-body-sm)", color: "var(--on-bg-soft)" }}>
          <a href={`mailto:${ABOUT.contactEmail}`} style={{ color: "inherit" }}>
            {ABOUT.contactEmail}
          </a>
        </p>
      </Prose>

      <span className="wide:hidden">
        <Doodle icon="fish-leaf" size={46} rot={-12} op={0.72} left={8} bottom={6} />
      </span>
    </div>
  );
}
