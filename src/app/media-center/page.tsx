import type { Metadata } from "next";
import { Bubble, Prose } from "@/components/ui/Bubble";
import { Cta } from "@/components/ui/Cta";
import { Doodle } from "@/components/ui/Doodle";
import { Photo } from "@/components/ui/Photo";
import { MEDIA, MEDIA_BENEFITS } from "@/content/media";
import { PHOTOS } from "@/content/photos";

export const metadata: Metadata = {
  title: "Media Center",
  description: MEDIA.intro,
  alternates: { canonical: "/media-center" },
};

export default function MediaCenterPage() {
  return (
    <div
      style={{
        padding: "var(--gap) var(--gutter) 44px",
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
        {MEDIA.eyebrow}
      </p>
      {/* Pulled tight to its eyebrow: the two read as one title stack, not two sections. */}
      <h1 style={{ marginTop: "calc(var(--sec-media) * -1)", marginBottom: 0, font: "var(--display-2)", color: "var(--on-bg)", textShadow: "var(--text-shadow-on-dye-strong)" }}>
        {MEDIA.title}
      </h1>

      {/* Prose and its photo read as one unit, so they sit closer than the section rhythm.
          The gap lives on the wrapper — the prototype got it from a negative margin against
          its parent's gap, which stops working the moment they're wrapped for the grid. */}
      <div className="flex flex-col gap-7 wide:grid wide:grid-cols-2 wide:gap-10 wide:items-center">
        <Prose i={1} boxed style={{ maxWidth: "var(--prose)" }}>
          <p style={{ margin: 0, font: "var(--text-body)", color: "var(--bubble-soft)" }}>{MEDIA.intro}</p>
        </Prose>
        <Photo
          i={3}
          src={PHOTOS[1]!.src}
          alt={PHOTOS[1]!.caption}
          h={196}
          sizes="(min-width: 900px) 540px, 100vw"
        />
      </div>

      <section style={{ textShadow: "var(--text-shadow-on-dye)", maxWidth: "var(--prose)" }}>
        <h2 style={{ margin: 0, font: "var(--display-4)", color: "var(--on-bg)" }}>
          {MEDIA.accreditationTitle}
        </h2>
        <p style={{ margin: "10px 0 0", font: "var(--text-body-sm)", color: "var(--on-bg-soft)" }}>
          {MEDIA.accreditationBlurb}
        </p>
        <ul style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12, padding: 0, listStyle: "none" }}>
          {MEDIA_BENEFITS.map((benefit) => (
            <li key={benefit} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: "var(--mark)", marginTop: 7 }} />
              <p style={{ margin: 0, font: "var(--text-body-sm)", color: "var(--on-bg-soft)" }}>{benefit}</p>
            </li>
          ))}
        </ul>
        <p style={{ margin: "18px 0 0", font: "var(--text-caption)", fontWeight: 700, letterSpacing: ".02em", color: "var(--on-bg)" }}>
          {MEDIA.deadline}
        </p>
        <Cta i={1} label="Apply here" href="/tickets?topic=media" style={{ marginTop: 16 }} />
      </section>

      <Bubble i={0} style={{ maxWidth: "var(--prose)" }}>
        <h2 style={{ margin: 0, font: "var(--display-4)", color: "var(--bubble-ink)" }}>{MEDIA.kitTitle}</h2>
        <p style={{ margin: "10px 0 0", font: "var(--text-body-sm)", color: "var(--bubble-soft)" }}>
          {MEDIA.kitBlurb}
        </p>
        {/* No public media-folder URL exists yet, so this asks for it rather than
            pretending to link to one. */}
        <Cta
          i={0}
          variant="secondary"
          label="Request images"
          href={`mailto:${MEDIA.contactEmail}?subject=${encodeURIComponent("Media kit request — SFWF 2026")}`}
          style={{ marginTop: 16 }}
        />
      </Bubble>

      <div style={{ position: "relative", display: "flex", gap: 10 }}>
        <Photo i={2} src={PHOTOS[2]!.src} alt={PHOTOS[2]!.caption} h={116} style={{ flex: 1 }} sizes="(min-width: 900px) 540px, 50vw" />
        <Photo i={4} src={PHOTOS[3]!.src} alt={PHOTOS[3]!.caption} h={116} style={{ flex: 1 }} sizes="(min-width: 900px) 540px, 50vw" />
        <span className="wide:hidden">
          <Doodle icon="bananas" size={46} rot={16} op={0.75} left={-8} bottom={-54} />
        </span>
      </div>

      <Prose i={4} style={{ textAlign: "center" }}>
        <p style={{ margin: 0, font: "var(--display-4)", color: "var(--on-bg)" }}>{MEDIA.contactTitle}</p>
        <p style={{ margin: "8px 0 0", font: "var(--text-body-sm)", color: "var(--on-bg-soft)" }}>
          <a href={`mailto:${MEDIA.contactEmail}`} style={{ color: "inherit" }}>
            {MEDIA.contactEmail}
          </a>
        </p>
      </Prose>
    </div>
  );
}
