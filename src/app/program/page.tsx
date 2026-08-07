import type { Metadata } from "next";
import { ProgramList } from "@/components/sections/program/ProgramList";
import { FESTIVAL_DATES } from "@/content/site";

export const metadata: Metadata = {
  title: "Program",
  description: `All sixteen events of the ${FESTIVAL_DATES.label} festival — galas, tasting dinners, masterclasses, crawls and the closing market, across Siargao Island.`,
  alternates: { canonical: "/program" },
};

export default function ProgramPage() {
  return (
    <>
      <header style={{ padding: "26px var(--gutter) 0" }}>
        <h1 style={{ margin: 0, font: "var(--display-2)", color: "var(--on-bg)", textShadow: "var(--text-shadow-on-dye-strong)" }}>
          Events at a Glance
        </h1>
        <p
          style={{
            margin: "10px 0 0",
            font: "var(--text-body-sm)",
            color: "var(--on-bg-soft)",
            maxWidth: "var(--prose)",
            textShadow: "var(--text-shadow-on-dye)",
          }}
        >
          Join us for a week of unforgettable culinary experiences across the island.
        </p>
      </header>
      <ProgramList />
    </>
  );
}
