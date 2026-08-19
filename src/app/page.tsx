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
 * The two logo rows sit together, hosts first: the programme has just named those venues
 * sixteen times, so the wall reads as the same list at a glance and the money follows. That
 * puts "why we do this" ahead of both, where the README has it ahead of the host row.
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
      <SponsorRow />
      <LastYear />
    </>
  );
}
