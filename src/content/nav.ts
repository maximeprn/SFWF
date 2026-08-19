import { CONTACT_EMAIL } from "./site";

/**
 * The three routes, and the one primary button that sits beside them.
 *
 * The CTA is per page and is always the thing you have not seen yet: Home sends you to the
 * programme, the programme sends you to the argument for the festival, and Press sends you
 * to a person. There is never more than one, and none of them sells anything.
 */
export interface NavLink {
  readonly href: "/" | "/program" | "/press";
  readonly label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/program", label: "Program" },
  { href: "/press", label: "Press" },
];

export interface NavCta {
  readonly href: string;
  readonly label: string;
  /** Blob index, so no two pages draw the button in the same silhouette. */
  readonly shape: number;
}

export const NAV_CTA: Record<NavLink["href"], NavCta> = {
  "/": { href: "/program", label: "View the Program", shape: 2 },
  "/program": { href: "/#purpose", label: "Why we do this", shape: 3 },
  /* Press asks for a person rather than a page. */
  "/press": { href: `mailto:${CONTACT_EMAIL}`, label: "Apply for a pass", shape: 1 },
};
