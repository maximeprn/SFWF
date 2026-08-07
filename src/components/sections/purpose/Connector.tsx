import type { CSSProperties } from "react";
import { BUD_PATH, type Connector as ConnectorData } from "./story";

const GHOST = "rgba(255,255,255,.42)";

/** `--l` is the dash length the CSS uses to draw the stroke on. */
const len = (l: number): CSSProperties => ({ "--l": l }) as CSSProperties;

/**
 * One hand-drawn stem between two story bubbles. Every stroke is doubled: a translucent
 * white ghost offset by (3,2) sits under the gold, which is what gives the line its
 * slightly-off, drawn-twice quality rather than looking like a clean vector.
 */
export function Connector({ c }: { readonly c: ConnectorData }) {
  return (
    <div className="rv" style={{ lineHeight: 0, margin: c.margin }}>
      <svg
        className="cr"
        width={c.w}
        height={c.h}
        viewBox={c.vb}
        fill="none"
        aria-hidden="true"
      >
        <g stroke={GHOST} strokeLinecap="round" style={len(c.len)} transform="translate(3,2)">
          <path d={c.main.d} strokeWidth={1.8} />
        </g>
        <g stroke="var(--mark)" strokeLinecap="round" style={len(c.len)}>
          <path d={c.main.d} strokeWidth={c.main.sw} />
        </g>

        {c.branches && (
          <g className="br" stroke="var(--mark)" strokeLinecap="round" style={len(60)}>
            {c.branches.map((b) => (
              <path key={b.d} d={b.d} strokeWidth={b.sw} />
            ))}
          </g>
        )}

        {c.ends && (
          <g stroke="rgba(255,255,255,.5)" strokeLinecap="round" style={len(40)}>
            {c.ends.map((e) => (
              <path key={e.d} d={e.d} strokeWidth={e.sw} />
            ))}
          </g>
        )}

        {c.buds?.map((bud) =>
          bud.dot ? (
            <circle key={`${bud.x}-${bud.y}`} className="bud" cx={bud.x} cy={bud.y} r={2.6} fill="var(--mark)" />
          ) : (
            <g key={`${bud.x}-${bud.y}`} transform={`translate(${bud.x},${bud.y}) rotate(${bud.rot ?? 0})`}>
              <g className="bud">
                <path d={BUD_PATH} fill="var(--mark)" />
              </g>
            </g>
          ),
        )}
      </svg>
    </div>
  );
}
