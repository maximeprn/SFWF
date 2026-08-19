import { BLOB_PATHS, MEDIA_BLOB_PATH } from "@/lib/design/shapes";

/**
 * The six hand-cut outlines, as clip-paths every surface and button refers to by id, plus
 * the shallower one every media frame takes, so a playing video's controls are not cut away.
 * Mounted once per document in the root layout — a clip-path referenced from a `<defs>`
 * that isn't in the DOM silently clips the element to nothing.
 */
export function BlobDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {BLOB_PATHS.map((d, i) => (
          <clipPath key={i} id={`pb${i}`} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        ))}
        <clipPath id="pbMedia" clipPathUnits="objectBoundingBox">
          <path d={MEDIA_BLOB_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}
