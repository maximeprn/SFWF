import type { SocialName } from "@/content/site";

/**
 * The three marks, drawn at the same weight as the festival's own linework — 22px strokes
 * at 1.6, in `currentColor` so the whole mark turns orange with its link.
 */
const PATHS: Record<SocialName, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M17.1 7h.01" strokeWidth={2.6} />
    </>
  ),
  Facebook: (
    <>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M14.5 7.9h-1.3c-1.1 0-1.9.8-1.9 1.9v6.9M9.7 12.2h4.4" />
    </>
  ),
  TikTok: (
    <>
      <path d="M14.3 4.1v9.9a3.7 3.7 0 1 1-3.3-3.7" />
      <path d="M14.3 4.1c.4 2.3 2 3.7 4.2 3.9" />
    </>
  ),
};

export function SocialMark({ name }: { readonly name: SocialName }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {PATHS[name]}
    </svg>
  );
}
