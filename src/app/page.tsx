import { Hero } from "@/components/sections/home/Hero";
import { TheFilm } from "@/components/sections/home/TheFilm";
import { IslandIntro } from "@/components/sections/home/IslandIntro";
import { WhatItIs } from "@/components/sections/home/WhatItIs";
import { Acknowledgement } from "@/components/sections/home/Acknowledgement";
import { Purpose } from "@/components/sections/home/Purpose";
import { LastYear } from "@/components/sections/home/LastYear";
import { SponsorRow } from "@/components/sections/partners/SponsorRow";
import { HostRow } from "@/components/sections/partners/HostRow";

/**
 * Home. The order is fixed by the festival's brief and every section is centre-spined
 * except "why we do this", which is the one left-aligned column of prose.
 *
 * Both logo rows are near the end, hosts first, with last year's clips between them: the
 * two walls read as one long list of marks when they are adjacent, and the strip breaks
 * them apart with the only thing on the page that moves. That puts "why we do this" ahead
 * of all three, where the README has it ahead of the host row.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TheFilm />
      <IslandIntro />
      <WhatItIs />
      <Acknowledgement />
      <Purpose />
      <HostRow />
      <LastYear />
      <SponsorRow />
    </>
  );
}
