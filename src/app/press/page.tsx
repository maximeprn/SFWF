import type { Metadata } from "next";
import { PressSection } from "@/components/sections/press/PressSection";
import { SITE } from "@/content/site";

const TITLE = `Media centre — ${SITE.name}`;

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Accreditation, media kit and contacts for outlets, journalists and food content " +
    "creators covering the 2026 festival.",
  alternates: { canonical: "/press" },
  openGraph: { title: TITLE, url: "/press" },
};

export default function PressPage() {
  return <PressSection />;
}
