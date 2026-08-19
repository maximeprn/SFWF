/**
 * The three routes, and the one primary button that sits beside them.
 *
 * There is exactly one button and it says the same thing everywhere — README §1: "Nav order:
 * Home · Program · Press, with View Program pinned right as the one primary button." An
 * earlier build gave each page its own CTA; that came from the per-section prototypes, which
 * are brainstorming sheets rather than the design.
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

export const NAV_CTA = { href: "/program", label: "View Program", shape: 2 } as const;
