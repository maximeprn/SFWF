import Image from "next/image";
import { COVERING, MEDIA_KIT } from "@/content/press";
import { PHOTOS } from "@/content/photos";
import { CONTACT_EMAIL } from "@/content/site";
import { soft } from "@/lib/design/shapes";

const FRAME = {
  maxWidth: "var(--sw)",
  margin: "0 auto",
  padding: "var(--sec) var(--gutter) 0",
} as const;

const HEADING = "400 clamp(24px,3.4vw,32px)/1.2 var(--font-display)";
const PROSE = "400 clamp(14.5px,0.5vw + 13.1px,16px)/1.7 var(--font-body)";

/* The two the prototype places here: the long table at dusk, and the lights in the palms. */
const SPREAD = [
  { photo: PHOTOS[2]!, alt: "The long communal table at dusk", shape: 0 },
  { photo: PHOTOS[3]!, alt: "String lights strung between the palms", shape: 1 },
];

/**
 * The media centre: the kit, two photographs, and a way to reach a person.
 *
 * Left-aligned, unlike Home. This is the one page a reader arrives at with a job to do
 * rather than a festival to be told about, and centred prose is for announcements.
 *
 * There is no accreditation card and there are no stat blobs. README §6 describes both, and
 * they were built once from `SFWF Press.dc.html` — but that file is a brainstorming sheet,
 * and the canonical prototype draws this page as the two sections below.
 */
export function PressSection() {
  return (
    <>
      <section style={FRAME}>
        <h1 style={{ margin: 0, font: HEADING, color: "var(--beige)", textWrap: "pretty" }}>
          {MEDIA_KIT.heading}
        </h1>
        <p style={{ margin: "10px 0 0", maxWidth: "42em", font: PROSE, color: "var(--beige)", textWrap: "pretty" }}>
          {MEDIA_KIT.body}
        </p>

        {/* The button is drawn even though it has nowhere to go yet, and the line under it
            says why. Hiding it until the folder exists would leave the page claiming a media
            kit it never offers. */}
        <span
          className="cta-in-bubble"
          aria-disabled="true"
          style={{
            display: "inline-block",
            marginTop: 16,
            clipPath: soft(2),
            padding: "12px 22px 14px",
            background: "var(--orange)",
            color: "var(--beige)",
            font: "700 clamp(13px,0.3vw + 12.1px,14.5px)/1.2 var(--font-body)",
          }}
        >
          {MEDIA_KIT.cta}
        </span>
        <p
          className="mono"
          style={{ margin: "9px 0 0", fontSize: 11, letterSpacing: ".14em", color: "var(--beige)" }}
        >
          {MEDIA_KIT.note}
        </p>

        <div
          style={{
            margin: "clamp(24px,3.4vw,38px) 0 0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
            gap: "clamp(14px,2.2vw,24px)",
          }}
        >
          {SPREAD.map(({ photo, alt, shape }) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                aspectRatio: "2 / 1",
                objectFit: "cover",
                clipPath: soft(shape),
              }}
            />
          ))}
        </div>
      </section>

      <section style={FRAME}>
        <h2 style={{ margin: 0, font: HEADING, color: "var(--beige)", textWrap: "pretty" }}>
          {COVERING.heading}
        </h2>
        <p style={{ margin: "10px 0 0", maxWidth: "36em", font: PROSE, color: "var(--beige)", textWrap: "pretty" }}>
          {COVERING.body}
        </p>
        {/* Set, not boxed: this is an invitation, and the page already has a button on it. */}
        <p style={{ margin: "14px 0 0" }}>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              font: "400 clamp(20px,1.4vw + 15.6px,24px)/1 var(--font-display)",
              color: "var(--beige)",
              transition: "color var(--hover)",
            }}
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </>
  );
}
