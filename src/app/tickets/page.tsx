import type { Metadata } from "next";
import { Suspense } from "react";
import { TicketsForm } from "@/components/sections/tickets/TicketsForm";
import { PassportCard } from "@/components/ui/PassportCard";
import { PASSPORT } from "@/content/crawls";
import { FESTIVAL_DATES } from "@/content/site";

export const metadata: Metadata = {
  title: "Tickets",
  description: `Ask about tickets, the ${PASSPORT.price} Crawl Passport and group bookings for the Siargao Food & Wine Festival, ${FESTIVAL_DATES.label}.`,
  alternates: { canonical: "/tickets" },
};

export default function TicketsPage() {
  return (
    <div
      style={{
        padding: "var(--gap) var(--gutter) 60px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sec)",
      }}
    >
      <header style={{ maxWidth: "var(--prose)" }}>
        <h1 style={{ margin: 0, font: "var(--display-2)", color: "var(--on-bg)", textShadow: "var(--text-shadow-on-dye-strong)" }}>
          Tickets
        </h1>
        <p style={{ margin: "12px 0 0", font: "var(--text-body)", color: "var(--on-bg-soft)", textShadow: "var(--text-shadow-on-dye)" }}>
          Individual events are ticketed at the door by their venues, and the Crawl Passport is
          sold in person across the island. For anything else — a specific dinner, a group, or
          press — send us a note and we&rsquo;ll come back to you.
        </p>
      </header>

      {/* The passport's own card, so the in-person answer sits above the form rather than
          being buried in a reply. The card already states where it's sold. */}
      <section style={{ maxWidth: 560 }}>
        <PassportCard i={3} />
      </section>

      {/* useSearchParams needs a boundary so the rest of the page still prerenders. */}
      <Suspense fallback={null}>
        <TicketsForm />
      </Suspense>
    </div>
  );
}
