import { VideoFrame } from "@/components/ui/VideoFrame";
import { FILM } from "@/content/videos";

/**
 * The festival's film, directly under the hero. One 9:16 frame on the dye, centre-spined
 * like everything else on Home except "why we do this".
 *
 * It carries no heading. The design of record sets `THE FILM · 2026` over the frame's own
 * scrim, but a poster frame under the festival's name does not need to be told it is the
 * film — and the line inside the frame already says the only thing a still cannot: that
 * this is a video, and how long it runs.
 *
 * It takes no padding of its own. The boundary above it belongs to the hero's dateline,
 * which carries equal air on both sides — see `Hero`. Adding padding here would put the
 * space below the dateline back under a second owner, which is the bug that rule exists to
 * prevent.
 */
export function TheFilm() {
  return (
    <section
      style={{
        maxWidth: "var(--sw)",
        margin: "0 auto",
        padding: "0 var(--gutter)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <VideoFrame clip={FILM} shape={0} width="min(72vw,268px)" posterWidth={268} priority />
    </section>
  );
}
