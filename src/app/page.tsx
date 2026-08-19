import { Hero } from "@/components/sections/home/Hero";
import { SponsorRow } from "@/components/sections/partners/SponsorRow";
import { HostRow } from "@/components/sections/partners/HostRow";

/**
 * Home. The order is fixed by the festival's brief and every section is centre-spined
 * except "why we do this", which is the one left-aligned column of prose.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Hosts before sponsors: the programme has just named these venues sixteen times,
          so the logo wall reads as the same list at a glance, and the money follows. */}
      <HostRow />
      <SponsorRow />
    </>
  );
}
