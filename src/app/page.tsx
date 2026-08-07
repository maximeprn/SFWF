import type { Metadata } from "next";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeOutro } from "@/components/sections/home/HomeOutro";
import { PhotoReel } from "@/components/sections/home/PhotoReel";
import { PurposeSection } from "@/components/sections/purpose/PurposeSection";
import { EventJsonLd } from "@/components/seo/EventJsonLd";
import { FESTIVAL_DATES, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.name} — ${FESTIVAL_DATES.label}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <EventJsonLd />
      <HomeHero />
      <PhotoReel />
      <PurposeSection />
      <HomeOutro />
    </>
  );
}
