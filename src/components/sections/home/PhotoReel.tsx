import { Photo } from "@/components/ui/Photo";
import { PHOTOS } from "@/content/photos";

/**
 * Last year's reel. It reads as images, not as a list — captions live in the lightbox, on
 * tap. A horizontal scroller on a phone, a four-up row once there's a column to fill.
 */
export function PhotoReel() {
  return (
    <section style={{ paddingTop: 68 }}>
      <p
        style={{
          margin: "0 var(--gutter) 12px",
          font: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--on-bg-soft)",
          textShadow: "var(--text-shadow-on-dye)",
        }}
      >
        Relive last year&rsquo;s unforgettable moments
      </p>
      <div
        className="noscroll flex gap-[10px] overflow-x-auto wide:grid wide:grid-cols-4 wide:overflow-visible"
        style={{ padding: "0 var(--gutter) 2px" }}
      >
        {PHOTOS.map((p, i) => (
          <div key={p.src} className="shrink-0 basis-[158px] wide:basis-auto">
            <Photo
              i={i}
              src={p.src}
              alt={p.caption}
              h={198}
              sizes="(min-width: 900px) 280px, 158px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
