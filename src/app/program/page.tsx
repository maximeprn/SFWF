import type { Metadata } from "next";
import { ProgramSection } from "@/components/sections/program/ProgramSection";
import { EventJsonLd } from "@/components/seo/EventJsonLd";
import { FESTIVAL_DATES, SITE } from "@/content/site";

const TITLE = `The programme — ${SITE.edition}, ${FESTIVAL_DATES.label}`;

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Sixteen gatherings over six named days, with times, prices and who is cooking at each. " +
    "Every reservation is made with the venue itself.",
  alternates: { canonical: "/program" },
  openGraph: { title: TITLE, url: "/program" },
};

/** Six days, sixteen gatherings, and nothing for sale anywhere on it. */
export default function ProgramPage() {
  return (
    <>
      <EventJsonLd />
      <ProgramSection />
    </>
  );
}
