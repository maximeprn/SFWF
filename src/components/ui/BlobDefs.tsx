import { BLOB_PATHS } from "@/lib/design/shapes";

/**
 * The hand-cut outlines, registered once per document as clipPaths. Everything that uses
 * `soft(i)` resolves against these, so this must be mounted in the root layout.
 *
 * clipPathUnits="objectBoundingBox" is what lets five fixed paths clip boxes of any size —
 * a bubble, a button and a photo frame all reuse the same silhouettes.
 */
export function BlobDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        {BLOB_PATHS.map((d, i) => (
          <clipPath key={i} id={`blob${i}`} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        ))}
      </defs>
    </svg>
  );
}
