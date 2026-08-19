import type { Metadata, Viewport } from "next";
import { Arimo, Baloo_2, Beth_Ellen } from "next/font/google";
import { BlobDefs } from "@/components/ui/BlobDefs";
import { BloomLayer } from "@/components/background/BloomLayer";
import { Footer } from "@/components/chrome/Footer";
import { BackToTop } from "@/components/chrome/BackToTop";
import { DYE_TEXTURE } from "@/content/photos";
import { FESTIVAL_DATES, SITE, SITE_URL } from "@/content/site";
import "./globals.css";

/* Three Google faces, all free for commercial use — which is what retired the festival's
   unlicensed display face. Beth Ellen is the script; Arimo carries prose and everything
   inside a bubble; Baloo 2 is primary buttons only. Meta lines use the system mono stack
   and load nothing. */
const bethEllen = Beth_Ellen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-beth-ellen-src",
  display: "swap",
});

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-arimo-src",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-baloo-src",
  display: "swap",
});

const TITLE = `${SITE.name} — Ani sang Siargao, the six-day journey, ${FESTIVAL_DATES.label}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: SITE.description,
    type: "website",
    locale: "en_PH",
    siteName: SITE.name,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#4F3F79",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bethEllen.variable} ${arimo.variable} ${baloo.variable}`}
    >
      <head>
        {/* The dye is the first thing on screen and nothing in the markup reveals it — it
            is fetched from JS, remapped on a canvas, and handed to WebGL as a texture.
            Without this the browser can't discover it until the bundle has parsed.
            `crossOrigin` has to match the request dyeGround makes, or the preload lands in
            a separate cache entry and the image is fetched twice. */}
        <link
          rel="preload"
          as="image"
          href={DYE_TEXTURE}
          crossOrigin="anonymous"
          fetchPriority="high"
        />
      </head>
      <body>
        <BlobDefs />
        <BloomLayer />
        {/* The page sits on z-index 1; the dye is fixed at 0 underneath. There is no nav
            band in this release, so the page opens straight on the hero and there is no
            fade mask — both return with phase 2. */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <main className="page-in" style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
        <BackToTop />
      </body>
    </html>
  );
}
