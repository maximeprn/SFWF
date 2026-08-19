import { Hero } from "@/components/sections/home/Hero";
import { ProgramSection } from "@/components/sections/program/ProgramSection";
import { SponsorRow } from "@/components/sections/partners/SponsorRow";
import { HostRow } from "@/components/sections/partners/HostRow";
import { EventJsonLd } from "@/components/seo/EventJsonLd";

/**
 * The whole site, for now. The festival needed the programme published, so this release is
 * one route: the hero, the six-day journey, who is paying for it and who is hosting it.
 *
 * Phase 2 splits this back into Home · Program · Press and adds the nav band, the menu and
 * the fade mask. Everything below is built to carry over unchanged.
 */
export default function HomePage() {
  return (
    <>
      <EventJsonLd />
      <Hero />
      <ProgramSection />
      {/* Hosts before sponsors: the programme has just named these venues sixteen times,
          so the logo wall reads as the same list at a glance, and the money follows. */}
      <HostRow />
      <SponsorRow />
    </>
  );
}
